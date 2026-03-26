"use client";

import Link from "next/link";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  IndianRupee,
  Clock,
  Briefcase,
  Globe,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useSelector, useDispatch, useStore } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { toggleSaveJobAsync } from "@/lib/features/auth/auth-slice";
import api from "@/utils/axios";
import toast from "react-hot-toast";

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, savedJobs, applications } = useSelector((state: RootState) => state.auth);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/jobs/${id}`);
        setJob(response.data.job);
      } catch (error) {
        console.error("Failed to fetch job", error);
        toast.error("Job not found");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const alreadyApplied = applications.some((app: any) => app.jobId === id);

  const saved = job
    ? savedJobs.some((j) => (j._id || j.id) === (job._id || job.id))
    : false;

  const handleSaveJob = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!job) return;
    dispatch(toggleSaveJobAsync(job));
  };

  const handleApply = () => {
    if (!user) {
      router.push("/login");
    } else if (alreadyApplied) {
      toast.error("You have already applied for this job");
    } else {
      router.push(`/jobs/${job._id}/apply`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Briefcase className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="text-2xl font-bold">Job Not Found</h2>
          <Button onClick={() => router.back()}>Back to Jobs</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const salaryDisplay = `₹${job.salary?.min?.toLocaleString()} - ₹${job.salary?.max?.toLocaleString()}`;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-muted/30">
        <div className="border-b border-border bg-background">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6 lg:p-8">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
                      {job.company?.logo ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${job.company.logo}`}
                          alt={job.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold lg:text-3xl">
                        {job.title}
                      </h1>
                      <p className="text-lg text-muted-foreground mt-1">
                        {job.company?.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <IndianRupee className="h-4 w-4" />
                          {salaryDisplay}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary capitalize"
                        >
                          {job.jobType}
                        </Badge>
                        <Badge variant="secondary" className="capitalize">
                          {job.experience}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {user?.role !== "recruiter" && (
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
                      <Button 
                        size="lg" 
                        onClick={handleApply}
                        disabled={alreadyApplied}
                        variant={alreadyApplied ? "secondary" : "default"}
                        className={alreadyApplied ? "cursor-not-allowed" : ""}
                      >
                        {alreadyApplied ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4 text-success" />
                            <span className="text-success">Applied</span>
                          </>
                        ) : (
                          "Apply Now"
                        )}
                      </Button>
                      <Button variant="outline" size="lg" onClick={handleSaveJob}>
                        {saved ? (
                          <>
                            <BookmarkCheck className="mr-2 h-4 w-4 text-primary" />
                            Saved
                          </>
                        ) : (
                          <>
                            <Bookmark className="mr-2 h-4 w-4" />
                            Save Job
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="prose prose-sm max-w-none">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </div>

                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <>
                      <h4 className="font-semibold text-lg text-foreground mt-8 mb-4">
                        Responsibilities
                      </h4>
                      <ul className="space-y-3">
                        {job.responsibilities.map((resp: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {job.requirements && job.requirements.length > 0 && (
                    <>
                      <h4 className="font-semibold text-lg text-foreground mt-8 mb-4">Requirements</h4>
                      <ul className="space-y-3">
                        {job.requirements.map((req: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </CardContent>
              </Card>

              {job.skillsRequired && job.skillsRequired.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill: string) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="px-3 py-1.5"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About the Company</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted overflow-hidden">
                      {job.company?.logo ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL}${job.company.logo}`}
                          alt={job.company.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-7 w-7 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.company?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Technology
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    {job.company?.website && (
                      <div className="flex items-center gap-3 text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <a href={job.company.website} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">
                          {job.company.website.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.company?.location || job.location}</span>
                    </div>
                  </div>

                  {job.company?.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {job.company.description}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Posted
                      </span>
                      <span className="text-sm font-medium">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Job Type
                      </span>
                      <span className="text-sm font-medium capitalize">{job.jobType}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Salary
                      </span>
                      <span className="text-sm font-medium">{salaryDisplay}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Experience
                      </span>
                      <span className="text-sm font-medium capitalize">{job.experience}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Openings
                      </span>
                      <span className="text-sm font-medium">{job.openings}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {(user?.role === "jobseeker" || !user) && (
                <Card className="bg-primary text-primary-foreground border-none">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-lg">
                      Interested in this job?
                    </h3>
                    <p className="text-sm text-primary-foreground/80 mt-2">
                      Apply now and take the next step in your career
                    </p>
                    <Button
                      variant="secondary"
                      className="w-full mt-4 bg-white text-primary hover:bg-white/90 border-none"
                      onClick={handleApply}
                      disabled={alreadyApplied}
                    >
                      {alreadyApplied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Applied
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
