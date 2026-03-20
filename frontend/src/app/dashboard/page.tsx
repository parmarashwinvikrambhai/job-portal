"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { removeSavedJob } from "@/lib/features/auth/auth-slice";
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Calendar,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  Heart,
  Trash2,
  Loader2,
} from "lucide-react";

const statusStyles = {
  pending: {
    label: "Pending",
    className: "bg-warning/20 text-warning-foreground",
    icon: Clock,
  },
  accepted: {
    label: "Accepted",
    className: "bg-success/20 text-success",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, applications, savedJobs } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role === "recruiter") {
      router.push("/recruiter");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const applicationStats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const profileCompletion = user.skills && user.skills.length > 0 ? 85 : 60;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Welcome {user.name.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile and track your applications
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Section */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Avatar className="h-20 w-20 mx-auto">
                      <AvatarFallback className="text-xl bg-primary text-primary-foreground">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <h2 className="mt-4 text-xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground">
                      {user.title || "Job Seeker"}
                    </p>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{user.email}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{user.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        Profile Completion
                      </span>
                      <span className="font-medium">{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                  </div>

                  <Button variant="outline" className="w-full mt-4">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Skills Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No skills added yet
                      </p>
                    )}
                  </div>
                  <Button variant="link" className="mt-4 p-0 h-auto">
                    + Add more skills
                  </Button>
                </CardContent>
              </Card>

            
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {applicationStats.total}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Applied
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-warning">
                      {applicationStats.pending}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-success">
                      {applicationStats.accepted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Accepted
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-destructive">
                      {applicationStats.rejected}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rejected
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Applications & Saved Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>My Activity</CardTitle>
                  <CardDescription>
                    Track your applications and saved jobs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="applications">
                    <TabsList className="mb-4">
                      <TabsTrigger value="applications">
                        Applications ({applications.length})
                      </TabsTrigger>
                      <TabsTrigger value="saved">
                        Saved Jobs ({savedJobs.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="applications" className="space-y-4">
                      {applications.length === 0 ? (
                        <div className="text-center py-8">
                          <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-muted-foreground">
                            No applications yet
                          </p>
                          <Button asChild className="mt-4">
                            <Link href="/jobs">Browse Jobs</Link>
                          </Button>
                        </div>
                      ) : (
                        applications.map((application) => {
                          const status = statusStyles[application.status];
                          const StatusIcon = status.icon;
                          return (
                            <div
                              key={application.id}
                              className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                  <h3 className="font-medium">
                                    {application.jobTitle}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {application.company}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {application.appliedDate}
                                  </div>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className={status.className}
                                >
                                  <StatusIcon className="mr-1.5 h-3 w-3" />
                                  {status.label}
                                </Badge>
                                <Button variant="ghost" size="icon" asChild>
                                  <Link href={`/jobs/${application.jobId}`}>
                                    <ExternalLink className="h-4 w-4" />
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </TabsContent>

                    <TabsContent value="saved" className="space-y-4">
                      {savedJobs.length === 0 ? (
                        <div className="text-center py-8">
                          <Heart className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                          <p className="text-muted-foreground">
                            No saved jobs yet
                          </p>
                          <Button asChild className="mt-4">
                            <Link href="/jobs">Explore Jobs</Link>
                          </Button>
                        </div>
                      ) : (
                        savedJobs.map((job) => (
                          <div
                            key={job._id || job.id}
                            className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/20 transition-colors"
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                                <Briefcase className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {typeof job.company === 'string' ? job.company : job.company?.name} - {job.location}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium text-primary hidden sm:block">
                                {typeof job.salary === 'string' ? job.salary : `${job.salary?.min} - ${job.salary?.max} ${job.salary?.currency}`}
                              </span>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/jobs/${job._id || job.id}`}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => dispatch(removeSavedJob(job._id || job.id))}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
