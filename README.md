# Kapkivoc Tracer - Lung Cancer Detection Application

A Next.js application for lung cancer detection using trained MobileNet and Inception models with Grad-CAM visualization.

---

## Step-by-Step Setup Instructions

### Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.9 or higher) - [Download](https://python.org/)

---

## Step 1: Download the Project

1. Click the **three dots menu** (⋮) in the top right corner of the v0 interface
2. Select **"Download ZIP"**
3. Extract the ZIP file to a folder (e.g., `C:\Projects\kapkivoc-tracer` or `~/Projects/kapkivoc-tracer`)

---

## Step 2: Set Up the Next.js Frontend

Open a terminal/command prompt and navigate to the project folder:

\`\`\`bash
# Windows
cd C:\Projects\kapkivoc-tracer

# Mac/Linux
cd ~/Projects/kapkivoc-tracer
\`\`\`

Install dependencies and start the development server:

\`\`\`bash
npm install
npm run dev
\`\`\`

The frontend will be available at: **http://localhost:3000**

---

## Step 3: Set Up the Python Model Server

Open a **new terminal window** (keep the first one running):

\`\`\`bash
# Navigate to scripts folder
cd kapkivoc-tracer/scripts
(if you want the model try contacting the dev)
# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
\`\`\`

---

## Step 4: Add Your Trained Models

Create a `models` folder and copy your model files:

\`\`\`bash
mkdir models
\`\`\`

Your folder structure should look like:

\`\`\`
scripts/
├── models/
│   ├── mobilenet.h5      <-- Your MobileNet model
│   └── inception.h5      <-- Your Inception model
├── model_server.py
└── requirements.txt
\`\`\`

**If your model files have different names**, update `model_server.py` lines 27-28:

\`\`\`python
MOBILENET_PATH = os.path.join(MODELS_DIR, "your_mobilenet_name.h5")
INCEPTION_PATH = os.path.join(MODELS_DIR, "your_inception_name.h5")
\`\`\`

---

## Step 5: Start the Model Server

\`\`\`bash
python model_server.py
\`\`\`

You should see:

\`\`\`
==================================================
KAPKIVOC TRACER - MODEL SERVER
==================================================

Loading MobileNet from: .../models/mobilenet.h5
MobileNet loaded successfully!

Loading Inception from: .../models/inception.h5
Inception loaded successfully!

Models loaded: ['mobilenet', 'inception']

==================================================
Server ready at http://localhost:8000
==================================================
\`\`\`

---

## Step 6: Use the Application

1. Open **http://localhost:3000** in your browser
2. **Sign Up** with email and password (check the terms box)
3. **Log In** with your credentials
4. Go to **Trace** page
5. Verify "Server Connected" status shows your models
6. **Upload** a lung scan image
7. **Select** MobileNet or Inception
8. Click **Analyze Image**
9. View results with Grad-CAM visualization
10. **Download Report** if needed

---

## Quick Commands Summary

**Terminal 1 (Frontend):**
\`\`\`bash
cd kapkivoc-tracer
npm install
npm run dev
\`\`\`

**Terminal 2 (Backend):**
\`\`\`bash
cd kapkivoc-tracer/scripts
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python model_server.py
\`\`\`

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Server Offline" | Ensure `python model_server.py` is running |
| "Model Not Loaded" | Check model files are in `scripts/models/` |
| TensorFlow errors | Run `pip install tensorflow==2.15.0` |
| Port in use | Frontend: `npm run dev -- -p 3001` |

---

## Project Structure

\`\`\`
kapkivoc-tracer/
├── app/                    # Next.js pages
│   ├── page.tsx           # Homepage
│   ├── login/page.tsx     # Login
│   ├── signup/page.tsx    # Signup
│   ├── trace/page.tsx     # Analysis page
│   ├── about/page.tsx     # About
│   └── contact/page.tsx   # Contact
├── components/            # React components
├── scripts/               # Python backend
│   ├── models/           # YOUR MODELS HERE
│   ├── model_server.py
│   └── requirements.txt
└── README.md

## Output
<img width="1366" height="2454" alt="screencapture-localhost-3000-2025-11-28-17_54_25" src="https://github.com/user-attachments/assets/e21f760d-5cab-449e-a6d6-158487820bbf" />
<img width="1366" height="1694" alt="screencapture-localhost-3000-about-2025-11-28-17_55_02" src="https://github.com/user-attachments/assets/38249d71-32d2-491d-a836-a461f48ce3b6" />
<img width="1366" height="936" alt="screencapture-localhost-3000-contact-2025-11-28-17_55_19" src="https://github.com/user-attachments/assets/9daa2674-86aa-44c7-95dc-6fee65916f16" />
<img width="1366" height="613" alt="screencapture-localhost-3000-login-2025-11-28-17_55_33" src="https://github.com/user-attachments/assets/480d3b8f-89df-49af-85dd-fd12aa67f2de" />
<img width="1366" height="761" alt="screencapture-localhost-3000-signup-2025-11-28-17_55_41" src="https://github.com/user-attachments/assets/2afc43f8-f304-47b2-ac6a-8e4d24c5bf1e" />
<img width="1366" height="1112" alt="screencapture-localhost-3000-trace-2025-11-28-17_56_03" src="https://github.com/user-attachments/assets/88ed9c59-45de-4d87-8e01-e98f0e634809" />
<img width="1366" height="1368" alt="screencapture-localhost-3000-trace-2025-11-28-17_56_31" src="https://github.com/user-attachments/assets/1b518008-7ad0-490b-b2fb-4017592ae411" />
