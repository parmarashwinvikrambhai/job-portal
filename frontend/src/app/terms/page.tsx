import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground mb-8">Last updated: March 1, 2026</p>
            
            <Card>
              <CardContent className="prose prose-sm max-w-none p-8">
                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing or using JobHub's services, you agree to be bound by these Terms of Service 
                    and all applicable laws and regulations. If you do not agree with any of these terms, 
                    you are prohibited from using our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">2. Use of Services</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    You agree to use our services only for lawful purposes. You may not:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Post false, misleading, or fraudulent job listings</li>
                    <li>Impersonate another person or entity</li>
                    <li>Harass, abuse, or harm other users</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use automated tools to scrape or collect data</li>
                    <li>Violate any applicable laws or regulations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You are responsible for maintaining the confidentiality of your account credentials 
                    and for all activities that occur under your account. You must immediately notify us 
                    of any unauthorized use of your account.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">4. Content and Submissions</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    You retain ownership of content you submit to JobHub. By submitting content, you grant 
                    us a non-exclusive, worldwide license to use, display, and distribute your content in 
                    connection with our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    JobHub and its content, features, and functionality are owned by JobHub and are protected 
                    by copyright, trademark, and other intellectual property laws.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">6. Disclaimer of Warranties</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our services are provided "as is" without warranties of any kind. We do not guarantee 
                    that you will find employment or suitable candidates through our platform.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    JobHub shall not be liable for any indirect, incidental, special, or consequential 
                    damages arising from your use of our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">8. Termination</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to terminate or suspend your account at any time for violations 
                    of these terms or for any other reason at our sole discretion.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">9. Changes to Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We may update these terms from time to time. We will notify you of any material changes 
                    by posting the new terms on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">10. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    For questions about these Terms of Service, please contact us at:
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Email: legal@jobhub.com<br />
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
