"""
Kapkivoc Tracer - Model Server
FastAPI server that loads your trained MobileNet and Inception models
for lung cancer detection with Grad-CAM visualization.
"""

import os
import io
import base64
import numpy as np
from PIL import Image
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# TensorFlow/Keras imports
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array

app = FastAPI(title="Kapkivoc Tracer API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# IMPORTANT: UPDATE THESE PATHS TO YOUR MODELS
# ============================================
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

# Option 1: If your models are .h5 files
MOBILENET_PATH = os.path.join(MODELS_DIR, "lung_cancer_mobilenetv2_model.h5")
INCEPTION_PATH = os.path.join(MODELS_DIR, "inception_lung_cancer_model.h5")

# Option 2: If your models are SavedModel format (folders)
# MOBILENET_PATH = os.path.join(MODELS_DIR, "mobilenet")
# INCEPTION_PATH = os.path.join(MODELS_DIR, "inception")

# Model cache
models = {}


def load_models():
    """Load trained models into memory"""
    global models
    
    # Create models directory if it doesn't exist
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    # Load MobileNet
    if os.path.exists(MOBILENET_PATH):
        try:
            print(f"Loading MobileNet from: {MOBILENET_PATH}")
            models["mobilenet"] = load_model(MOBILENET_PATH, compile=False)
            print("MobileNet loaded successfully!")
            print(f"  Input shape: {models['mobilenet'].input_shape}")
            print(f"  Output shape: {models['mobilenet'].output_shape}")
        except Exception as e:
            print(f"Error loading MobileNet: {e}")
    else:
        print(f"MobileNet not found at: {MOBILENET_PATH}")
    
    # Load Inception
    if os.path.exists(INCEPTION_PATH):
        try:
            print(f"Loading Inception from: {INCEPTION_PATH}")
            models["inception"] = load_model(INCEPTION_PATH, compile=False)
            print("Inception loaded successfully!")
            print(f"  Input shape: {models['inception'].input_shape}")
            print(f"  Output shape: {models['inception'].output_shape}")
        except Exception as e:
            print(f"Error loading Inception: {e}")
    else:
        print(f"Inception not found at: {INCEPTION_PATH}")
    
    print(f"\nModels loaded: {list(models.keys())}")


def preprocess_image(image: Image.Image, model_name: str) -> np.ndarray:
    """Preprocess image for model input"""
    model = models.get(model_name)
    if not model:
        raise ValueError(f"Model {model_name} not loaded")
    
    # Get input size from model
    input_shape = model.input_shape
    height = input_shape[1] if input_shape[1] else 224
    width = input_shape[2] if input_shape[2] else 224
    
    # Resize image
    image = image.resize((width, height))
    
    # Convert to RGB if needed
    if image.mode != "RGB":
        image = image.convert("RGB")
    
    # Convert to array
    img_array = img_to_array(image)
    
    # Normalize (adjust based on how you trained your model)
    img_array = img_array / 255.0
    
    # Add batch dimension
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def generate_gradcam(model, img_array: np.ndarray, pred_index: int) -> np.ndarray:
    """Generate Grad-CAM heatmap"""
    try:
        # Find the last convolutional layer
        last_conv_layer = None
        for layer in reversed(model.layers):
            if len(layer.output_shape) == 4:  # Conv layer has 4D output
                last_conv_layer = layer
                break
        
        if last_conv_layer is None:
            return None
        
        # Create gradient model
        grad_model = tf.keras.models.Model(
            inputs=model.input,
            outputs=[last_conv_layer.output, model.output]
        )
        
        # Compute gradients
        with tf.GradientTape() as tape:
            conv_output, predictions = grad_model(img_array)
            if predictions.shape[-1] == 1:
                loss = predictions[0, 0]
            else:
                loss = predictions[0, pred_index]
        
        # Get gradients
        grads = tape.gradient(loss, conv_output)
        
        # Global average pooling
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        
        # Weight feature maps
        conv_output = conv_output[0]
        heatmap = conv_output @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        
        # Normalize
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        
        return heatmap.numpy()
    except Exception as e:
        print(f"Grad-CAM error: {e}")
        return None


def create_gradcam_overlay(original_image: Image.Image, heatmap: np.ndarray) -> str:
    """Create Grad-CAM overlay and return as base64"""
    if heatmap is None:
        return None
    
    try:
        # Resize heatmap to match image
        heatmap_img = Image.fromarray(np.uint8(heatmap * 255))
        heatmap_resized = heatmap_img.resize(original_image.size, Image.BILINEAR)
        heatmap_array = np.array(heatmap_resized) / 255.0
        
        # Apply colormap (jet-like)
        colored_heatmap = np.zeros((*heatmap_array.shape, 3), dtype=np.float32)
        colored_heatmap[..., 0] = np.clip(1.5 - np.abs(heatmap_array - 0.75) * 4, 0, 1)  # Red
        colored_heatmap[..., 1] = np.clip(1.5 - np.abs(heatmap_array - 0.5) * 4, 0, 1)   # Green
        colored_heatmap[..., 2] = np.clip(1.5 - np.abs(heatmap_array - 0.25) * 4, 0, 1)  # Blue
        
        # Convert to uint8
        colored_heatmap = np.uint8(colored_heatmap * 255)
        
        # Overlay on original
        original_array = np.array(original_image.convert("RGB"))
        overlay = (0.6 * original_array + 0.4 * colored_heatmap).astype(np.uint8)
        
        # Convert to base64
        overlay_image = Image.fromarray(overlay)
        buffer = io.BytesIO()
        overlay_image.save(buffer, format="PNG")
        buffer.seek(0)
        
        return f"data:image/png;base64,{base64.b64encode(buffer.read()).decode()}"
    except Exception as e:
        print(f"Overlay error: {e}")
        return None


@app.on_event("startup")
async def startup_event():
    """Load models when server starts"""
    print("\n" + "="*50)
    print("KAPKIVOC TRACER - MODEL SERVER")
    print("="*50 + "\n")
    load_models()
    print("\n" + "="*50)
    print("Server ready at http://localhost:8000")
    print("="*50 + "\n")


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": list(models.keys()),
        "timestamp": datetime.now().isoformat()
    }


@app.post("/analyze")
async def analyze_image(
    file: UploadFile = File(...),
    model_type: str = Form(default="mobilenet")
):
    """Analyze lung scan image for cancer detection"""
    try:
        # Validate model
        if model_type not in models:
            return JSONResponse(
                status_code=400,
                content={
                    "error": f"Model '{model_type}' not loaded. Available: {list(models.keys())}"
                }
            )
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Preprocess
        img_array = preprocess_image(image, model_type)
        
        # Get model and predict
        model = models[model_type]
        prediction = model.predict(img_array, verbose=0)
        
        # Interpret results
        if prediction.shape[-1] == 1:
            # Binary classification with sigmoid
            confidence = float(prediction[0][0])
            is_positive = confidence > 0.5
            pred_confidence = confidence if is_positive else 1 - confidence
            pred_index = 0
        else:
            # Multi-class with softmax
            pred_index = int(np.argmax(prediction[0]))
            pred_confidence = float(prediction[0][pred_index])
            is_positive = pred_index == 1
        
        # Generate Grad-CAM
        heatmap = generate_gradcam(model, img_array, pred_index)
        gradcam_url = create_gradcam_overlay(image, heatmap)
        
        return {
            "prediction": "positive" if is_positive else "negative",
            "confidence": pred_confidence,
            "model": model_type,
            "gradcam_url": gradcam_url,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Analysis error: {e}")
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
