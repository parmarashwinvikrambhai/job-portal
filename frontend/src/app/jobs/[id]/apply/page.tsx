"use client";

import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Upload,
  CheckCircle,
  Building2,
  Loader2,
} from "lucide-react";
import { featuredJobs } from "@/lib/mock-data";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { addApplication } from "@/lib/features/auth/auth-slice";

export default function ApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const job = featuredJobs.find((j) => j.id === id) || featuredJobs[0];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
      }));
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Add application to user's applications
    dispatch(
      addApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        coverLetter: formData.coverLetter,
      }),
    );

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center bg-muted/30 py-16">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Application Submitted!</h2>
              <p className="text-muted-foreground mt-2">
                Your application for{" "}
                <span className="font-medium text-foreground">{job.title}</span>{" "}
                at{" "}
                <span className="font-medium text-foreground">
                  {job.company}
                </span>{" "}
                has been submitted successfully.
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                We will review your application and get back to you within 5-7
                business days.
              </p>
              <div className="flex flex-col gap-3 mt-6">
                <Button asChild>
                  <Link href="/dashboard">View My Applications</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/jobs">Browse More Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-muted/30">
        {/* Back Button */}
        <div className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            <Link
              href={`/jobs/${job.id}`}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Job Details
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Job Summary */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">{job.title}</h2>
                    <p className="text-muted-foreground">
                      {job.company} - {job.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle>Apply for this position</CardTitle>
                <CardDescription>
                  Fill out the form below to submit your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Resume Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        required
                      />
                      <label htmlFor="resume" className="cursor-pointer">
                        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                        {resume ? (
                          <p className="text-sm font-medium text-primary">
                            {resume.name}
                          </p>
                        ) : (
                          <>
                            <p className="text-sm font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              PDF, DOC, DOCX (max 5MB)
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      value={formData.coverLetter}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coverLetter: e.target.value,
                        })
                      }
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional but recommended. A good cover letter can help you
                      stand out.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => router.back()}
                    >
                      Cancel
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    By submitting this application, you agree to our{" "}
                    <Link
                      href="/privacy"
                      className="underline hover:text-foreground"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms"
                      className="underline hover:text-foreground"
                    >
                      Terms of Service
                    </Link>
                    .
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
