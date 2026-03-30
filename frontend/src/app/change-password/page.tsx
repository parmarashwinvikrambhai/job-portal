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
import { Eye, EyeOff, Loader2, Key } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/utils/axios";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect to login if not authenticated
  if (!isAuthenticated && typeof window !== "undefined") {
    // Basic redirect handle, optionally use useEffect
    router.replace("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.put("/api/auth/change-password", {
        newPassword: formData.newPassword,
      });

      if (response.status === 200) {
        toast.success("Password updated successfully!");
        
        // Redirect user back to dashboard or appropriate route based on role
        if (user?.role === "admin") {
          router.replace("/admin");
        } else if (user?.role === "recruiter") {
          router.replace("/recruiter");
        } else {
          router.replace("/dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error updating password");
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

            <h1 className="text-2xl font-bold tracking-tight">Update Security</h1>
            <p className="text-muted-foreground mt-2">
              Ensure your account stays secure by updating your password.
            </p>
          </div>
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl">Change Password</CardTitle>
              <CardDescription>
                Please choose a new password for your account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={formData.newPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, newPassword: e.target.value })
                      }
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showNewPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                      }
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 mt-6"
                  disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
                >
                  {isLoading ? (
                     <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>

              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
