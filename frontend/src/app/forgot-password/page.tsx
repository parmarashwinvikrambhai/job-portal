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
import { Loader2, Mail } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/forgot-password", {
        email,
      });

      if (response.status === 200) {
        toast.success("Password reset link sent to your email!");
        setIsSuccess(true);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
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
            <h1 className="text-2xl font-bold tracking-tight">Forgot Password</h1>
            <p className="text-muted-foreground mt-2">
              Enter your email address to receive a secure password reset link.
            </p>
          </div>
          
          <Card className="border-border/50 shadow-lg">
            {isSuccess ? (
              <CardContent className="pt-6">
                 <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold">Check your email</h3>
                    <p className="text-muted-foreground text-sm">
                      We've sent a password reset link to <br/>
                      <span className="font-medium text-foreground">{email}</span>
                    </p>
                    <Button
                      variant="outline"
                      className="w-full mt-4"
                      onClick={() => router.push("/login")}
                    >
                      Return to Login
                    </Button>
                 </div>
              </CardContent>
            ) : (
              <>
                <CardHeader className="space-y-1 pb-4">
                  <CardTitle className="text-xl">Reset Password</CardTitle>
                  <CardDescription>
                    We'll email you instructions to reset your password.
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
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                        autoFocus
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 mt-6"
                      disabled={isLoading || !email}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full h-11"
                      onClick={() => router.push("/login")}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>

                  </form>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
