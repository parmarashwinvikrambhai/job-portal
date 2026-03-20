import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { JobCard } from "@/components/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MapPin, Briefcase, Users, Building2, TrendingUp, ArrowRight } from "lucide-react"
import { featuredJobs, companies } from "@/lib/mock-data"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-linear-to-b from-secondary/50 to-background py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Find Your Next{" "}
                <span className="text-primary">Dream Job</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto text-pretty">
                Discover thousands of job opportunities from top companies. Connect with recruiters and take the next step in your career journey.
              </p>
              
              {/* Search Form */}
              <div className="mt-10">
                <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card rounded-2xl shadow-lg border border-border">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Job title or keyword"
                      className="pl-12 h-12 text-base border-0 bg-muted/50"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="City or remote"
                      className="pl-12 h-12 text-base border-0 bg-muted/50"
                    />
                  </div>
                  <Button size="lg" className="h-12 px-8" asChild>
                    <Link href="/jobs">Search Jobs</Link>
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-12 flex flex-wrap justify-center gap-8 lg:gap-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">10,000+</div>
                  <div className="text-sm text-muted-foreground mt-1">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">5,000+</div>
                  <div className="text-sm text-muted-foreground mt-1">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground">2M+</div>
                  <div className="text-sm text-muted-foreground mt-1">Job Seekers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Featured Jobs</h2>
                <p className="text-muted-foreground mt-1">Handpicked opportunities from top companies</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link href="/jobs">
                  View All Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              {featuredJobs.slice(0, 6).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            <div className="mt-8 text-center sm:hidden">
              <Button asChild>
                <Link href="/jobs">View All Jobs</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Browse by Category</h2>
              <p className="text-muted-foreground mt-2">Explore jobs across different industries</p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Briefcase, name: "Engineering", count: 3240 },
                { icon: Users, name: "Design", count: 1890 },
                { icon: TrendingUp, name: "Marketing", count: 2150 },
                { icon: Building2, name: "Finance", count: 1670 },
              ].map((category) => (
                <Link href="/jobs" key={category.name}>
                  <Card className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                          <category.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold group-hover:text-primary transition-colors">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.count.toLocaleString()} jobs</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Companies */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Popular Companies</h2>
              <p className="text-muted-foreground mt-2">Top employers actively hiring</p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <Card key={company.name} className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted">
                        <Building2 className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold group-hover:text-primary transition-colors">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.industry}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">{company.jobs}</div>
                        <div className="text-xs text-muted-foreground">open jobs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">Ready to Find Your Dream Job?</h2>
              <p className="mt-4 text-primary-foreground/80 leading-relaxed">
                Join thousands of job seekers who have found their perfect career match through JobHub.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/jobs">Browse Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    <Footer />
    </div>
  )
}
