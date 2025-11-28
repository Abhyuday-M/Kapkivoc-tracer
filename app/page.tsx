import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Activity, Upload, Brain, Download, Shield, Clock, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Activity className="h-4 w-4" />
                AI-Powered Lung Cancer Detection
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
                Advanced Lung Cancer Detection for Medical Professionals
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed text-pretty">
                Kapkivoc Tracer uses state-of-the-art deep learning models to assist in the detection of lung cancer
                from medical imaging. Upload lung scans and receive instant AI-powered analysis with Grad-CAM
                visualization.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/trace">
                  <Button size="lg" className="gap-2">
                    <Upload className="h-5 w-5" />
                    Start Analysis
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI-powered system provides quick and reliable analysis to support your diagnostic decisions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="border-border bg-background">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>1. Upload Image</CardTitle>
                  <CardDescription>
                    Upload a lung scan image (X-ray or CT) in common formats like PNG, JPG, or DICOM.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-background">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Brain className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>2. AI Analysis</CardTitle>
                  <CardDescription>
                    Our deep learning models (MobileNet & Inception) analyze the image for potential cancer indicators.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-border bg-background">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>3. Get Results</CardTitle>
                  <CardDescription>
                    Receive detailed results with Grad-CAM visualization and download a comprehensive report.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Benefits of Early Detection</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Early detection of lung cancer significantly improves treatment outcomes and survival rates. Our
                  AI-assisted tool helps medical professionals identify potential cases faster and with greater
                  confidence.
                </p>
                <ul className="space-y-4">
                  {[
                    "95%+ accuracy in detection with trained models",
                    "Grad-CAM visualization highlights areas of concern",
                    "Supports multiple image formats",
                    "Instant results with downloadable reports",
                    "Non-invasive screening support",
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <Shield className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Secure & Private</h3>
                    <p className="text-sm text-muted-foreground">
                      All images are processed securely and not stored after analysis.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border">
                  <CardContent className="pt-6">
                    <Clock className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Fast Results</h3>
                    <p className="text-sm text-muted-foreground">Get analysis results in seconds, not hours.</p>
                  </CardContent>
                </Card>
                <Card className="border-border col-span-2">
                  <CardContent className="pt-6">
                    <Brain className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-foreground mb-2">Advanced AI Models</h3>
                    <p className="text-sm text-muted-foreground">
                      Powered by MobileNet and Inception architectures trained on extensive medical imaging datasets.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Sign up now to access our AI-powered lung cancer detection tool. Available exclusively for medical
              professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Create Account
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-8 bg-muted/50">
          <div className="container mx-auto px-4">
            <p className="text-sm text-muted-foreground text-center max-w-3xl mx-auto">
              <strong>Disclaimer:</strong> Kapkivoc Tracer is designed for educational and practice purposes only. It
              should not be used as a substitute for professional medical diagnosis. Always consult qualified healthcare
              providers for medical decisions.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
