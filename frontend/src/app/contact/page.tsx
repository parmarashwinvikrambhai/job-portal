"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle2,
  Building2,
  Users,
  HelpCircle,
  Send
} from "lucide-react"

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime",
    contact: "support@jobhub.com",
    action: "mailto:support@jobhub.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri from 8am to 6pm",
    contact: "+1 (555) 123-4567",
    action: "tel:+15551234567",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come say hello at our office",
    contact: "123 Market St, San Francisco, CA 94105",
    action: "https://maps.google.com",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    contact: "Available 24/7",
    action: "#",
  },
]

const inquiryTypes = [
  { value: "general", label: "General Inquiry" },
  { value: "support", label: "Technical Support" },
  { value: "sales", label: "Sales & Pricing" },
  { value: "partnership", label: "Partnership Opportunities" },
  { value: "press", label: "Press & Media" },
  { value: "careers", label: "Careers at JobHub" },
]

const offices = [
  {
    city: "San Francisco",
    country: "United States",
    address: "123 Market Street, Suite 400",
    phone: "+1 (555) 123-4567",
    email: "sf@jobhub.com",
    isHQ: true,
  },
  {
    city: "New York",
    country: "United States",
    address: "456 Broadway, Floor 10",
    phone: "+1 (555) 234-5678",
    email: "nyc@jobhub.com",
    isHQ: false,
  },
  {
    city: "London",
    country: "United Kingdom",
    address: "78 Old Street, EC1V 9AZ",
    phone: "+44 20 1234 5678",
    email: "london@jobhub.com",
    isHQ: false,
  },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center py-16">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mx-auto mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
              <Button onClick={() => setIsSubmitted(false)}>
                Send Another Message
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-balance">
                Have a question or need help? Our team is here to assist you. 
                Choose the best way to reach us below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {contactMethods.map((method) => {
                const Icon = method.icon
                return (
                  <a
                    key={method.title}
                    href={method.action}
                    className="block"
                  >
                    <Card className="h-full hover:shadow-md transition-shadow hover:border-primary/50">
                      <CardContent className="pt-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-1">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-primary">
                          {method.contact}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-semibold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-6">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={(e) => handleChange("company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inquiry">Inquiry Type *</Label>
                      <Select
                        value={formData.inquiryType}
                        onValueChange={(value) => handleChange("inquiryType", value)}
                        required
                      >
                        <SelectTrigger id="inquiry">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {inquiryTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us how we can help you..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Additional Info */}
              <div className="space-y-8">
                {/* Quick Links */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Quick Help
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <a href="/career-advice" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-primary" />
                        <span>Career Advice & Resources</span>
                      </div>
                      <span className="text-muted-foreground">→</span>
                    </a>
                    <a href="/pricing" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span>Pricing & Plans</span>
                      </div>
                      <span className="text-muted-foreground">→</span>
                    </a>
                    <a href="/about" className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>About JobHub</span>
                      </div>
                      <span className="text-muted-foreground">→</span>
                    </a>
                  </CardContent>
                </Card>

                {/* Response Time */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Response Time</h3>
                        <p className="text-sm text-muted-foreground">
                          We typically respond within 24 hours during business days. 
                          For urgent matters, please call our support line.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center mb-8">Our Offices</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {offices.map((office) => (
                <Card key={office.city} className={office.isHQ ? "border-primary" : ""}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{office.city}</h3>
                        <p className="text-sm text-muted-foreground">{office.country}</p>
                      </div>
                      {office.isHQ && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          HQ
                        </span>
                      )}
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{office.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{office.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-muted-foreground">{office.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
