import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Shield, Users, Award } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">About Kapkivoc Tracer</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                An AI-powered tool designed to assist medical professionals in lung cancer detection through advanced
                deep learning models.
              </p>
            </div>

            <div className="prose prose-lg max-w-none mb-12">
              <Card className="border-border mb-8">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Kapkivoc Tracer was developed to support medical professionals in the early detection of lung
                    cancer. By leveraging state-of-the-art deep learning architectures, our tool provides rapid analysis
                    of lung imaging to help identify potential areas of concern. Our goal is to make advanced AI
                    technology accessible for educational and practice purposes, empowering healthcare providers with
                    additional insights.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border mb-8">
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-foreground mb-4">The Technology</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Our system utilizes two powerful deep learning models:
                  </p>
                  <ul className="space-y-4 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">MobileNet:</strong> A lightweight convolutional neural
                        network optimized for mobile and embedded applications. It provides fast inference while
                        maintaining high accuracy, making it ideal for quick screenings.
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-foreground">Inception:</strong> A more complex architecture known for
                        its accuracy in image classification tasks. It uses multiple parallel convolutional operations
                        to capture features at different scales.
                      </div>
                    </li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    Both models incorporate Grad-CAM (Gradient-weighted Class Activation Mapping) visualization, which
                    highlights the regions of the image that most influenced the models prediction, providing
                    interpretable insights for medical professionals.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <Card className="border-border">
                <CardHeader>
                  <Shield className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Your data is protected</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We prioritize the security and privacy of medical data. Images are processed locally and are not
                    stored on our servers after analysis. All communications are encrypted to ensure data protection.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>For Medical Professionals</CardTitle>
                  <CardDescription>Designed for healthcare providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    This tool is exclusively designed for medical professionals seeking to enhance their diagnostic
                    workflow. It serves as a supplementary aid and should always be used in conjunction with
                    professional medical judgment.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Award className="h-8 w-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground mb-2">Important Disclaimer</h3>
                    <p className="text-muted-foreground">
                      Kapkivoc Tracer is an educational and practice tool only. It is not intended to replace
                      professional medical diagnosis or advice. The results provided by this application should not be
                      used as the sole basis for medical decisions. Always consult qualified healthcare professionals
                      for accurate diagnosis and treatment recommendations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
