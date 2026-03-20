"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Search, 
  MapPin, 
  Users, 
  Briefcase, 
  Building2, 
  Globe,
  Star,
  ArrowRight,
  TrendingUp
} from "lucide-react"

const allCompanies = [
  {
    id: "1",
    name: "TechCorp Inc.",
    logo: "TC",
    industry: "Technology",
    location: "San Francisco, CA",
    size: "1000-5000",
    jobs: 45,
    rating: 4.5,
    description: "Leading technology company specializing in cloud solutions and enterprise software.",
    featured: true,
    benefits: ["Remote Work", "Health Insurance", "Stock Options", "401k"],
  },
  {
    id: "2",
    name: "DesignStudio",
    logo: "DS",
    industry: "Design",
    location: "New York, NY",
    size: "100-500",
    jobs: 23,
    rating: 4.8,
    description: "Award-winning design agency creating beautiful digital experiences.",
    featured: true,
    benefits: ["Flexible Hours", "Creative Freedom", "Learning Budget"],
  },
  {
    id: "3",
    name: "CloudScale",
    logo: "CS",
    industry: "Cloud Computing",
    location: "Seattle, WA",
    size: "500-1000",
    jobs: 67,
    rating: 4.3,
    description: "Building the future of cloud infrastructure and scalable solutions.",
    featured: true,
    benefits: ["Remote Work", "Unlimited PTO", "Tech Stipend"],
  },
  {
    id: "4",
    name: "InfraTech",
    logo: "IT",
    industry: "Infrastructure",
    location: "Austin, TX",
    size: "200-500",
    jobs: 34,
    rating: 4.2,
    description: "Infrastructure solutions for modern enterprises.",
    featured: false,
    benefits: ["Health Insurance", "Gym Membership", "Parental Leave"],
  },
  {
    id: "5",
    name: "DataDriven",
    logo: "DD",
    industry: "Data & Analytics",
    location: "Boston, MA",
    size: "100-200",
    jobs: 28,
    rating: 4.6,
    description: "Turning data into actionable insights for businesses worldwide.",
    featured: false,
    benefits: ["Remote Work", "Conference Budget", "Stock Options"],
  },
  {
    id: "6",
    name: "AppWorks",
    logo: "AW",
    industry: "Mobile Development",
    location: "Los Angeles, CA",
    size: "50-100",
    jobs: 19,
    rating: 4.4,
    description: "Creating innovative mobile applications that users love.",
    featured: false,
    benefits: ["Flexible Hours", "Equipment Budget", "Team Retreats"],
  },
  {
    id: "7",
    name: "GrowthLabs",
    logo: "GL",
    industry: "Marketing",
    location: "Chicago, IL",
    size: "100-200",
    jobs: 15,
    rating: 4.1,
    description: "Data-driven marketing solutions for growing businesses.",
    featured: false,
    benefits: ["Remote Work", "Performance Bonus", "Health Insurance"],
  },
  {
    id: "8",
    name: "UserFirst",
    logo: "UF",
    industry: "UX Research",
    location: "Denver, CO",
    size: "50-100",
    jobs: 12,
    rating: 4.7,
    description: "Human-centered research and design consultancy.",
    featured: false,
    benefits: ["Flexible Hours", "Learning Budget", "Mental Health Support"],
  },
  {
    id: "9",
    name: "SecureNet",
    logo: "SN",
    industry: "Cybersecurity",
    location: "Washington, DC",
    size: "200-500",
    jobs: 38,
    rating: 4.3,
    description: "Protecting businesses with cutting-edge security solutions.",
    featured: false,
    benefits: ["Remote Work", "Certification Support", "401k Match"],
  },
  {
    id: "10",
    name: "FinanceFlow",
    logo: "FF",
    industry: "Fintech",
    location: "New York, NY",
    size: "500-1000",
    jobs: 52,
    rating: 4.4,
    description: "Revolutionizing financial services with innovative technology.",
    featured: true,
    benefits: ["Stock Options", "Bonus Structure", "Health Insurance"],
  },
]

const industries = [
  "All Industries",
  "Technology",
  "Design",
  "Cloud Computing",
  "Infrastructure",
  "Data & Analytics",
  "Mobile Development",
  "Marketing",
  "UX Research",
  "Cybersecurity",
  "Fintech",
]

const companySizes = [
  "All Sizes",
  "1-50",
  "50-100",
  "100-200",
  "200-500",
  "500-1000",
  "1000-5000",
  "5000+",
]

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries")
  const [selectedSize, setSelectedSize] = useState("All Sizes")

  const filteredCompanies = allCompanies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesIndustry = selectedIndustry === "All Industries" || company.industry === selectedIndustry
    const matchesSize = selectedSize === "All Sizes" || company.size === selectedSize
    return matchesSearch && matchesIndustry && matchesSize
  })

  const featuredCompanies = filteredCompanies.filter(c => c.featured)
  const otherCompanies = filteredCompanies.filter(c => !c.featured)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight mb-4 text-balance">
                Discover Great Companies
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-balance">
                Explore top companies hiring now. Find your perfect workplace culture and career opportunities.
              </p>
              
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search companies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-card"
                  />
                </div>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="w-full sm:w-48 h-12 bg-card">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full sm:w-40 h-12 bg-card">
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">500+</p>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">10k+</p>
                <p className="text-sm text-muted-foreground">Open Positions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Industries</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">95%</p>
                <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Companies */}
        {featuredCompanies.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="flex items-center gap-2 mb-8">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">Featured Companies</h2>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {featuredCompanies.map((company) => (
                  <Card key={company.id} className="overflow-hidden hover:shadow-lg transition-shadow border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-xl">
                          {company.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">{company.name}</h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                <Building2 className="h-3.5 w-3.5" />
                                <span>{company.industry}</span>
                              </div>
                            </div>
                            <Badge variant="secondary" className="bg-primary/10 text-primary shrink-0">
                              Featured
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {company.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5" />
                              {company.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Users className="h-3.5 w-3.5" />
                              {company.size} employees
                            </div>
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                              {company.rating}
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-1.5 text-primary font-medium">
                              <Briefcase className="h-4 w-4" />
                              {company.jobs} open positions
                            </div>
                            <Link href={`/jobs?company=${encodeURIComponent(company.name)}`}>
                              <Button size="sm">
                                View Jobs
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All Companies */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold">All Companies</h2>
              <p className="text-sm text-muted-foreground">
                {filteredCompanies.length} companies found
              </p>
            </div>
            
            {filteredCompanies.length === 0 ? (
              <Card className="p-12 text-center">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No companies found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("")
                  setSelectedIndustry("All Industries")
                  setSelectedSize("All Sizes")
                }}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(featuredCompanies.length > 0 ? otherCompanies : filteredCompanies).map((company) => (
                  <Card key={company.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground font-semibold">
                          {company.logo}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{company.name}</h3>
                          <p className="text-sm text-muted-foreground">{company.industry}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {company.rating}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {company.benefits.slice(0, 3).map((benefit) => (
                          <Badge key={benefit} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {company.location.split(",")[0]}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3.5 w-3.5" />
                            {company.jobs} jobs
                          </div>
                        </div>
                        <Link href={`/jobs?company=${encodeURIComponent(company.name)}`}>
                          <Button variant="ghost" size="sm">
                            View
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}
