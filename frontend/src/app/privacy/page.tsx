import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: March 1, 2026</p>
            
            <Card>
              <CardContent className="prose prose-sm max-w-none p-8">
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    JobHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                    explains how we collect, use, disclose, and safeguard your information when you use our 
                    website and services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We collect information you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Account information (name, email, password)</li>
                    <li>Profile information (resume, work history, skills)</li>
                    <li>Job application data</li>
                    <li>Communication preferences</li>
                    <li>Payment information for premium services</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide and maintain our services</li>
                    <li>Match you with relevant job opportunities</li>
                    <li>Process job applications</li>
                    <li>Send you relevant notifications and updates</li>
                    <li>Improve our services and user experience</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">4. Information Sharing</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may share your information with employers when you apply for jobs, service providers 
                    who assist in our operations, and as required by law. We never sell your personal 
                    information to third parties.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">5. Data Security</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal 
                    information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate data</li>
                    <li>Delete your account and data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Export your data</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar tracking technologies to improve your browsing experience, 
                    analyze site traffic, and understand where our visitors come from. You can control 
                    cookies through your browser settings.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">8. Contact Us</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: privacy@jobhub.com<br />
                    Address: 123 Market Street, San Francisco, CA 94105
                  </p>
                </section>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
