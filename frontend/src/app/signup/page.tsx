"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { useEffect } from "react";

type UserType = "seeker" | "recruiter";
import {
  Briefcase,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  User,
  Building2,
  CheckCircle,
} from "lucide-react";

import api from "@/utils/axios";

import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>("seeker");

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "recruiter") {
        router.replace("/recruiter");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, user, router]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (userType === "recruiter" && !company) {
      toast.error("Please enter your company name");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/auth/register", {
        name,
        email,
        password,
        role: userType === "seeker" ? "jobseeker" : "recruiter",
        company: userType === "recruiter" ? company : undefined,
      });

      toast.success("Account created successfully! Please login.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = {
    seeker: [
      "Create and manage your professional profile",
      "Apply to thousands of jobs with one click",
      "Track all your applications in one place",
      "Get personalized job recommendations",
    ],
    recruiter: [
      "Post unlimited job listings",
      "Access to qualified candidates",
      "Manage applications efficiently",
      "Analytics and insights dashboard",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                JobHub
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              Create your account
            </h1>
            <p className="text-muted-foreground mt-2">
              Join thousands of professionals on JobHub
            </p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Sign up</CardTitle>
              <CardDescription>
                Choose your account type and fill in your details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={userType}
                onValueChange={(v) => setUserType(v as UserType)}
                className="mb-6"
              >
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="seeker" className="gap-2 h-10">
                    <User className="h-4 w-4" />
                    Job Seeker
                  </TabsTrigger>
                  <TabsTrigger value="recruiter" className="gap-2 h-10">
                    <Building2 className="h-4 w-4" />
                    Recruiter
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="seeker" className="mt-4">
                  <div className="rounded-lg bg-secondary/30 p-4 mb-4">
                    <p className="text-sm font-medium mb-2">
                      Benefits for Job Seekers:
                    </p>
                    <ul className="space-y-1">
                      {benefits.seeker.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="recruiter" className="mt-4">
                  <div className="rounded-lg bg-secondary/30 p-4 mb-4">
                    <p className="text-sm font-medium mb-2">
                      Benefits for Recruiters:
                    </p>
                    <ul className="space-y-1">
                      {benefits.recruiter.map((benefit, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>

              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                  />
                </div>

                {userType === "recruiter" && (
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="Your company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="h-11"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
