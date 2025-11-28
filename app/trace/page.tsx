"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { Upload, X, Loader2, AlertCircle, FileImage, Server } from "lucide-react"
import { AnalysisResults } from "@/components/analysis-results"

type ModelType = "mobilenet" | "inception"

interface AnalysisResult {
  prediction: "positive" | "negative"
  confidence: number
  model: ModelType
  gradCamUrl: string
  timestamp: string
}

const MODEL_API_URL = process.env.NEXT_PUBLIC_MODEL_API_URL || "http://localhost:8000"

export default function TracePage() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [selectedModel, setSelectedModel] = useState<ModelType>("mobilenet")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const [isCheckingApi, setIsCheckingApi] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const checkApiHealth = async () => {
      setIsCheckingApi(true)
      try {
        const response = await fetch(`${MODEL_API_URL}/health`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        if (response.ok) {
          const data = await response.json()
          setApiAvailable(true)
          setAvailableModels(data.models_loaded || [])
        } else {
          setApiAvailable(false)
          setAvailableModels([])
        }
      } catch {
        setApiAvailable(false)
        setAvailableModels([])
      } finally {
        setIsCheckingApi(false)
      }
    }
    checkApiHealth()
  }, [])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    setError("")
    setResult(null)

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (PNG, JPG, or WebP)")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setUploadedFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setUploadedImage(null)
    setUploadedFile(null)
    setResult(null)
    setError("")
  }

  const analyzeImage = async () => {
    if (!uploadedImage || !uploadedFile) return

    if (!apiAvailable) {
      setError("Model server is not running. Please start the server first.")
      return
    }

    if (!availableModels.includes(selectedModel)) {
      setError(`${selectedModel} model is not loaded on the server. Please check your model files.`)
      return
    }

    setIsAnalyzing(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("model_type", selectedModel)

      const response = await fetch(`${MODEL_API_URL}/analyze`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Analysis failed")
      }

      const data = await response.json()

      setResult({
        prediction: data.prediction,
        confidence: data.confidence,
        model: data.model as ModelType,
        gradCamUrl: data.gradcam_url,
        timestamp: data.timestamp,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const retryConnection = async () => {
    setIsCheckingApi(true)
    try {
      const response = await fetch(`${MODEL_API_URL}/health`)
      if (response.ok) {
        const data = await response.json()
        setApiAvailable(true)
        setAvailableModels(data.models_loaded || [])
        setError("")
      } else {
        setApiAvailable(false)
      }
    } catch {
      setApiAvailable(false)
    } finally {
      setIsCheckingApi(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Lung Cancer Detection</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Upload a lung scan image to analyze for potential cancer indicators. Select your preferred AI model and
                get instant results with Grad-CAM visualization.
              </p>
            </div>

            <Card className={`mb-6 ${apiAvailable ? "border-green-500/30" : "border-destructive/30"}`}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${apiAvailable ? "bg-green-500/10" : "bg-destructive/10"}`}>
                      <Server className={`h-5 w-5 ${apiAvailable ? "text-green-600" : "text-destructive"}`} />
                    </div>
                    <div>
                      <p className={`font-medium ${apiAvailable ? "text-green-600" : "text-destructive"}`}>
                        {isCheckingApi ? "Checking server..." : apiAvailable ? "Server Connected" : "Server Offline"}
                      </p>
                      {apiAvailable && availableModels.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Models loaded: {availableModels.map((m) => m.charAt(0).toUpperCase() + m.slice(1)).join(", ")}
                        </p>
                      )}
                      {apiAvailable && availableModels.length === 0 && (
                        <p className="text-sm text-amber-600">No models loaded. Check your model files.</p>
                      )}
                    </div>
                  </div>
                  {!apiAvailable && !isCheckingApi && (
                    <Button variant="outline" size="sm" onClick={retryConnection}>
                      Retry Connection
                    </Button>
                  )}
                  {isCheckingApi && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upload Section */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Upload Image</CardTitle>
                  <CardDescription>Supported formats: PNG, JPG, WebP (max 10MB)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!uploadedImage ? (
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-foreground font-medium mb-2">Drop your image here or click to browse</p>
                      <p className="text-sm text-muted-foreground">Upload a lung X-ray or CT scan image</p>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Uploaded lung scan"
                        className="w-full rounded-lg border border-border"
                      />
                      <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearImage}>
                        <X className="h-4 w-4" />
                      </Button>
                      {uploadedFile && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Select AI Model</label>
                    <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as ModelType)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mobilenet" disabled={!availableModels.includes("mobilenet")}>
                          MobileNet {availableModels.includes("mobilenet") ? "(Ready)" : "(Not Loaded)"}
                        </SelectItem>
                        <SelectItem value="inception" disabled={!availableModels.includes("inception")}>
                          Inception {availableModels.includes("inception") ? "(Ready)" : "(Not Loaded)"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {selectedModel === "mobilenet" && "Lightweight model optimized for speed"}
                      {selectedModel === "inception" && "High-accuracy model for detailed analysis"}
                    </p>
                  </div>

                  <Button
                    className="w-full gap-2"
                    disabled={
                      !uploadedImage || isAnalyzing || !apiAvailable || !availableModels.includes(selectedModel)
                    }
                    onClick={analyzeImage}
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Analyze Image
                      </>
                    )}
                  </Button>

                  {!apiAvailable && (
                    <p className="text-xs text-center text-destructive">Start the model server to enable analysis</p>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              <AnalysisResults result={result} isAnalyzing={isAnalyzing} originalImage={uploadedImage} />
            </div>

            {/* Disclaimer */}
            <Alert className="mt-8 border-primary/20 bg-primary/5">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-muted-foreground">
                <strong>Important:</strong> This tool is for educational and practice purposes only. Results should not
                be used for actual medical diagnosis. Always consult qualified healthcare professionals for medical
                decisions.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
