import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Users,
  Target,
  Heart,
  Globe,
  Award,
  TrendingUp,
  Briefcase,
  Building2,
  Linkedin,
  Twitter
} from "lucide-react"

const stats = [
  { label: "Jobs Posted", value: "50K+", icon: Briefcase },
  { label: "Companies", value: "5,000+", icon: Building2 },
  { label: "Job Seekers", value: "2M+", icon: Users },
  { label: "Successful Hires", value: "500K+", icon: Award },
]

const values = [
  {
    icon: Target,
    title: "Mission-Driven",
    description: "We're on a mission to connect talented individuals with meaningful career opportunities.",
  },
  {
    icon: Heart,
    title: "People First",
    description: "We believe in putting people at the center of everything we do, from our users to our team.",
  },
  {
    icon: Globe,
    title: "Inclusive",
    description: "We're committed to creating an inclusive platform that serves people from all backgrounds.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We continuously innovate to provide the best job search and recruitment experience.",
  },
]

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    bio: "Former VP of Product at LinkedIn with 15+ years in HR tech.",
    initials: "SC",
  },
  {
    name: "Michael Rodriguez",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer passionate about building scalable platforms.",
    initials: "MR",
  },
  {
    name: "Emily Thompson",
    role: "VP of Product",
    bio: "Product leader with experience at Indeed and ZipRecruiter.",
    initials: "ET",
  },
  {
    name: "David Kim",
    role: "VP of Engineering",
    bio: "Engineering veteran who's built teams at multiple unicorns.",
    initials: "DK",
  },
  {
    name: "Lisa Park",
    role: "Head of Design",
    bio: "Award-winning designer focused on human-centered experiences.",
    initials: "LP",
  },
  {
    name: "James Wilson",
    role: "Head of Sales",
    bio: "Sales leader with deep expertise in B2B SaaS.",
    initials: "JW",
  },
]

const milestones = [
  { year: "2020", event: "JobHub founded in San Francisco" },
  { year: "2021", event: "Reached 100K users and raised Series A" },
  { year: "2022", event: "Expanded to 10 countries, launched mobile app" },
  { year: "2023", event: "1M+ users, introduced AI-powered matching" },
  { year: "2024", event: "Series C funding, enterprise solutions launch" },
  { year: "2025", event: "2M+ users, global expansion continues" },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
                Connecting Talent with Opportunity
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
                JobHub is on a mission to transform how people find jobs and companies find talent. 
                We believe everyone deserves access to meaningful work.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/jobs">
                  <Button size="lg">Browse Jobs</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">Contact Us</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <Icon className="h-8 w-8 mx-auto text-primary mb-3" />
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="leading-relaxed">
                  JobHub was founded in 2020 with a simple idea: job searching shouldn't be so hard. 
                  Our founders, Sarah and Michael, experienced firsthand the frustrations of both 
                  job seekers and recruiters dealing with outdated, inefficient hiring processes.
                </p>
                <p className="leading-relaxed mt-4">
                  They set out to build a platform that uses modern technology to make the hiring 
                  process faster, fairer, and more human. Today, JobHub helps millions of people 
                  find meaningful work while helping thousands of companies build great teams.
                </p>
                <p className="leading-relaxed mt-4">
                  We're backed by leading investors and are proud to have a diverse, global team 
                  committed to our mission of connecting talent with opportunity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {values.map((value) => {
                const Icon = value.icon
                return (
                  <Card key={value.title} className="text-center">
                    <CardContent className="pt-8 pb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-1/2" />
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className={`relative flex items-center gap-6 mb-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}>
                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} pl-12 md:pl-0`}>
                      <span className="text-primary font-bold text-lg">{milestone.year}</span>
                      <p className="text-muted-foreground mt-1">{milestone.event}</p>
                    </div>
                    <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Our Leadership Team</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Meet the people leading JobHub's mission to transform how the world hires.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {team.map((member) => (
                <Card key={member.name} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-lg">
                        {member.initials}
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary mb-2">{member.role}</p>
                        <p className="text-sm text-muted-foreground">{member.bio}</p>
                        <div className="flex gap-2 mt-3">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Linkedin className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Twitter className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground max-w-3xl mx-auto">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Join Our Team
                </h2>
                <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
                  We're always looking for talented people to join our mission. 
                  Check out our open positions and become part of the JobHub team.
                </p>
                <Link href="/jobs?company=JobHub">
                  <Button variant="secondary" size="lg">
                    View Open Positions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
