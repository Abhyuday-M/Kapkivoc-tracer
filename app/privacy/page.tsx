import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

            <Card className="border-border">
              <CardContent className="pt-6 prose prose-sm max-w-none">
                <p className="text-muted-foreground mb-6">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Information We Collect</h2>
                <p className="text-muted-foreground mb-4">
                  Kapkivoc Tracer collects minimal information necessary to provide our lung cancer detection service.
                  This includes:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
                  <li>Account information (name, email) for authentication purposes</li>
                  <li>Uploaded medical images for analysis (not stored after processing)</li>
                  <li>Usage data to improve our service</li>
                </ul>

                <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Image Processing</h2>
                <p className="text-muted-foreground mb-4">
                  Medical images uploaded to Kapkivoc Tracer are processed in real-time and are NOT stored on our
                  servers after analysis is complete. We do not retain, share, or use your medical images for any
                  purpose other than providing immediate analysis results.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Data Security</h2>
                <p className="text-muted-foreground mb-4">
                  We implement industry-standard security measures to protect your information. All data transmission is
                  encrypted using SSL/TLS protocols. However, no method of transmission over the internet is 100%
                  secure.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">4. Educational Use Only</h2>
                <p className="text-muted-foreground mb-4">
                  This application is designed for educational and practice purposes only. It should not be used for
                  actual medical diagnosis. Users acknowledge that results are not medical advice and should not replace
                  professional medical consultation.
                </p>

                <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Contact Us</h2>
                <p className="text-muted-foreground mb-4">
                  If you have questions about this Privacy Policy, please contact us at support@kapkivoctracer.com.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
