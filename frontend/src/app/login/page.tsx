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
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store";
import { setUser } from "@/lib/features/auth/auth-slice";
import { Briefcase, Eye, EyeOff, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/axios";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 200) {
        toast.success("Login successful!");
        const { user } = response.data;
        dispatch(setUser(user));

        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "recruiter") {
          router.push("/recruiter");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <Briefcase className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-2xl font-semibold tracking-tight">
                JobHub
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue
            </p>
          </div>
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
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
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>

              </form>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
