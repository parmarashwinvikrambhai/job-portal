"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Briefcase,
  Users,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const benefits = [
  {
    icon: Users,
    title: "Reach 2M+ Job Seekers",
    description:
      "Get your job in front of qualified candidates actively looking for opportunities.",
  },
  {
    icon: Zap,
    title: "AI-Powered Matching",
    description:
      "Our smart algorithms connect you with the most relevant candidates.",
  },
  {
    icon: Shield,
    title: "Verified Candidates",
    description: "All candidates are verified to ensure quality applications.",
  },
];

const features = [
  "Unlimited job posts (Enterprise)",
  "Advanced applicant tracking",
  "Team collaboration tools",
  "Analytics and reporting",
  "Custom branding options",
  "Priority customer support",
];

export default function PostJobPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user && user.role === "recruiter") {
      router.push("/recruiter");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-linear-to-b from-secondary/50 to-background py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
                Post a Job & Find Top Talent
              </h1>
              <p className="text-lg text-muted-foreground mb-8 text-balance leading-relaxed">
                Reach millions of qualified candidates and build your dream team
                with JobHub's powerful recruitment platform.
              </p>

              {user ? (
                user.role === "recruiter" ? (
                  <Link href="/recruiter">
                    <Button size="lg">
                      Go to Recruiter Dashboard
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      You're logged in as a Job Seeker. To post jobs, please
                      create a Recruiter account.
                    </p>
                    <Link href="/signup">
                      <Button size="lg">Create Recruiter Account</Button>
                    </Link>
                  </div>
                )
              ) : (
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="/signup">
                    <Button size="lg">
                      Get Started Free
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features & Pricing CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Everything You Need to Hire Successfully
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  JobHub provides all the tools you need to streamline your
                  hiring process, from posting jobs to managing candidates and
                  making offers.
                </p>
                <ul className="space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Card className="p-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Starting at
                  </p>
                  <div className="flex items-baseline justify-center gap-1 mb-4">
                    <span className="text-4xl font-bold">$99</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">
                    14-day free trial. No credit card required.
                  </p>
                  <div className="space-y-3">
                    <Link href="/signup" className="block">
                      <Button className="w-full" size="lg">
                        Start Free Trial
                      </Button>
                    </Link>
                    <Link href="/pricing" className="block">
                      <Button variant="outline" className="w-full" size="lg">
                        View All Plans
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <p className="text-lg italic text-muted-foreground mb-6 leading-relaxed">
                  "JobHub has completely transformed our hiring process. We've
                  reduced our time-to-hire by 40% and found amazing candidates
                  we wouldn't have discovered otherwise."
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    JD
                  </div>
                  <div className="text-left">
                    <p className="font-semibold">Jennifer Davis</p>
                    <p className="text-sm text-muted-foreground">
                      Head of Talent, TechCorp
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
