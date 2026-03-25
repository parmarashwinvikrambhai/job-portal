"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Briefcase,
  Users,
  Eye,
  MapPin,
  Clock,
  MoreHorizontal,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  Star,
  Loader2,
  Building2,
  Settings,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import {
  addJob,
  setRecruiterJobs,
  updateRecruiterJob,
  deleteJob,
} from "@/lib/features/jobs/jobs-slice";
import { JobFormDialog } from "@/components/job-form-dialog";
import { CompanyFormDialog } from "@/components/company-form-dialog";
import api from "@/utils/axios";

interface Applicant {
  id: string;
  name: string;
  position: string;
  email: string;
  appliedDate: string;
  status: string;
  experience: string;
  skills: string[];
  resume: string;
  coverLetter?: string;
  phone: string;
}

const statusStyles = {
  open: { label: "open", className: "bg-success/20 text-success" },
  closed: { label: "Closed", className: "bg-muted text-muted-foreground" },
  pending: { label: "New", className: "bg-primary/20 text-primary" },
  accepted: {
    label: "Accepted",
    className: "bg-success/20 text-success",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  hired: {
    label: "Hired",
    className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-bold",
  },
};

function RecruiterDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { recruiterJobsList } = useSelector((state: RootState) => state.jobs);

  const [isPostJobOpen, setIsPostJobOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("jobs");
  const [applicantsData, setApplicantsData] = useState<Applicant[]>([]);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [isRegisterCompanyOpen, setIsRegisterCompanyOpen] = useState(false);
  const [hasCompany, setHasCompany] = useState(false); 
  const [companyInfo, setCompanyInfo] = useState<any | null>(null);
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role === "jobseeker") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const fetchApplicants = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get("/api/applications/recruiter");
      const apps = response.data.applications || [];
      const formattedApps = apps.map((app: any) => ({
        id: app._id,
        name: app.applicant?.name || "Unknown",
        position: app.job?.title || "Unknown Job",
        email: app.applicant?.email || "",
        appliedDate: app.createdAt 
          ? new Date(app.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Recently",
        status: app.status || "pending",
        experience: app.applicant?.experience || "N/A",
        skills: app.applicant?.skills || [],
        resume: app.resume,
        coverLetter: app.coverLetter,
        phone: app.phone || app.applicant?.phone || "",
      }));
      setApplicantsData(formattedApps);
    } catch (error) {
      console.error("Failed to fetch applicants", error);
    }
  }, [user]);

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId);
    try {
      const response = await api.put(`/api/applications/status/${applicationId}`, { status: newStatus });
      if (response.status === 200) {
        toast.success(`Application ${newStatus} successfully`);
        // Refresh data
        fetchApplicants();
        // Update selected applicant if it matches
        if (selectedApplicant && selectedApplicant.id === applicationId) {
          setSelectedApplicant(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${newStatus} application`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    try {
      const response = await api.get(`/api/jobs/recruiter/${user.id}`);
      if (response.data.jobs) {
        dispatch(setRecruiterJobs(response.data.jobs));
      }
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    }
  }, [user, dispatch]);

  const fetchCompany = useCallback(async () => {
    if (!user) return;
    try {
      setIsCompanyLoading(true);
      const response = await api.get(`/api/company/recruiter/${user.id}`);
      if (response.data.company) {
        setHasCompany(true);
        setCompanyInfo(response.data.company);
      }
    } catch (error) {
      console.log("No company found for this recruiter");
    } finally {
      setIsCompanyLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.role === "recruiter") {
      fetchCompany();
      fetchJobs();
      fetchApplicants();
    }
  }, [user, fetchCompany, fetchJobs, fetchApplicants]);

  const handleRegisterCompany = async (companyData: FormData) => {
    if (!user) return;
    try {
      companyData.append("recruiterId", user.id);
      const response = await api.post("/api/company/register", companyData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        setHasCompany(true);
        setCompanyInfo(response.data.company);
        toast.success("Company registered successfully!");
        setIsRegisterCompanyOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to register company");
    }
  };

  const handleUpdateCompany = async (companyData: FormData) => {
    if (!companyInfo) return;
    try {
      const response = await api.put(`/api/company/update/${companyInfo._id}`, companyData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setCompanyInfo(response.data.company);
        toast.success("Company updated successfully!");
        setIsRegisterCompanyOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update company");
    }
  };

  const handleCompanySubmit = (data: FormData) => {
    if (hasCompany) {
      handleUpdateCompany(data);
    } else {
      handleRegisterCompany(data);
    }
  };

  useEffect(() => {
    const editId = searchParams.get("edit");
    if (editId) {
      const jobToEdit = recruiterJobsList.find((j) => j._id === editId);
      if (jobToEdit) {
        setEditingJob(jobToEdit);
        setIsPostJobOpen(true);
      }
    }
  }, [searchParams, recruiterJobsList]);

  const handleFormSubmit = async (jobData: any) => {
    try {
      if (!companyInfo) {
        toast.error("Please register your company first");
        return;
      }

      if (editingJob) {
        const payload = { ...jobData };
        delete payload._id; // remove from body
        const response = await api.put(`/api/jobs/update/${editingJob._id}`, payload);
        if (response.status === 200) {
          dispatch(updateRecruiterJob(response.data.job));
          toast.success("Job updated successfully");
          router.replace("/recruiter");
        }
      } else {
        const payload = { ...jobData, company: companyInfo._id };
        const response = await api.post("/api/jobs/create", payload);
        if (response.status === 201) {
          dispatch(addJob(response.data.job));
          toast.success("Job posted successfully");
        }
      }
      setEditingJob(null);
      setIsPostJobOpen(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const toggleJobStatus = async (jobId: string) => {
    const job = recruiterJobsList.find((j) => j._id === jobId);
    if (job) {
      const newStatus = job.status === "open" ? "closed" : "open";
      try {
        const response = await api.put(`/api/jobs/update/${jobId}`, { status: newStatus });
        if (response.status === 200) {
          dispatch(updateRecruiterJob(response.data.job));
          toast.success(`Job marked as ${newStatus}`);
        }
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const response = await api.delete(`/api/jobs/${jobId}`);
      if (response.status === 200) {
        dispatch(deleteJob(jobId));
        toast.success("Job deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete job");
    }
  };

  const stats = {
    activeJobs: recruiterJobsList.filter((j) => j.status === "open").length,
    totalApplicants: applicantsData.length,
    newApplications: applicantsData.filter((a) => a.status === "pending").length,
    shortlisted: applicantsData.filter((a) => a.status === "shortlisted").length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          {/* Company Registration Prompt */}
          {!isCompanyLoading && !hasCompany && (
            <Card className="mb-8 border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Ready to post your first job?</h3>
                      <p className="text-muted-foreground text-sm">
                        You need to register your company profile first. We've saved your company name: <strong>{user?.company}</strong>
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setIsRegisterCompanyOpen(true)}>
                    Register Company Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome, {user?.name.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground mt-1 flex items-center gap-1">
                {companyInfo ? (
                  <>
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium text-foreground">{companyInfo.name}</span>
                    <button 
                      onClick={() => setIsRegisterCompanyOpen(true)}
                      className="ml-2 p-1 rounded-full hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                      title="Edit Company Profile"
                    >
                      <Settings className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  "Manage your job listings and applicants"
                )}
              </p>
            </div>
            <Button
              size="lg"
              disabled={!hasCompany}
              onClick={() => {
                setEditingJob(null);
                setIsPostJobOpen(true);
              }}
            >
              <Plus className="mr-2 h-5 w-5" />
              Post New Job
            </Button>

            <JobFormDialog
              open={isPostJobOpen}
              onOpenChange={setIsPostJobOpen}
              jobToEdit={editingJob}
              onSubmit={handleFormSubmit}
            />

            <CompanyFormDialog
              open={isRegisterCompanyOpen}
              onOpenChange={setIsRegisterCompanyOpen}
              companyToEdit={companyInfo}
              initialName={user?.company || ""}
              onSubmit={handleCompanySubmit}
            />
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Briefcase className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{stats.activeJobs}</div>
                    <div className="text-sm text-muted-foreground">
                      Active Jobs
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveTab("applicants")}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
                    <Users className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.totalApplicants}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Applicants
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveTab("applicants")}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20">
                    <Eye className="h-6 w-6 text-warning-foreground" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.newApplications}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      New Applications
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => setActiveTab("applicants")}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/20">
                    <Star className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {stats.shortlisted}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Shortlisted
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="jobs">
                Job Listings ({recruiterJobsList.length})
              </TabsTrigger>
              <TabsTrigger value="applicants">
                Applicants ({applicantsData.length})
              </TabsTrigger>
            </TabsList>

            {/* Job Listings Tab */}
            <TabsContent value="jobs">
              <Card>
                <CardHeader>
                  <CardTitle>Your Job Listings</CardTitle>
                  <CardDescription>
                    Manage and track your posted job positions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {recruiterJobsList.length === 0 ? (
                    <div className="text-center py-12">
                      <Briefcase className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                      <p className="text-lg font-medium text-muted-foreground">
                        No job listings yet
                      </p>
                      <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs mx-auto">
                        You haven't posted any jobs yet. Use the "Post New Job" button above to get started.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recruiterJobsList.map((job) => {
                        const status =
                          (statusStyles as any)[job.status] ||
                          statusStyles.open;
                        return (
                          <div
                            key={job._id || job.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:border-primary/20 transition-colors gap-4"
                          >
                            <div className="flex items-start gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                                <Briefcase className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3.5 w-3.5" />
                                    {job.location}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5" />
                                    Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : job.posted}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {job.applicationsCount || 0} applicants
                                </span>
                              </div>
                              <Badge
                                variant="secondary"
                                className={status.className}
                              >
                                {status.label}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditingJob(job);
                                      setIsPostJobOpen(true);
                                    }}
                                  >
                                    Edit Job
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setActiveTab("applicants")}
                                  >
                                    View Applicants
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => toggleJobStatus(job._id || job.id)}
                                  >
                                    {job.status === "open"
                                      ? "Close Job"
                                      : "Reopen Job"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteJob(job._id || job.id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Applicants Tab */}
            <TabsContent value="applicants">
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Applicants List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Applicants</CardTitle>
                      <CardDescription>
                        Review and manage candidate applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {applicantsData.map((applicant) => {
                          const status =
                            (statusStyles as any)[applicant.status] ||
                            statusStyles.pending;
                          return (
                            <div
                              key={applicant.id}
                              className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-colors cursor-pointer gap-4 ${
                                selectedApplicant?.id === applicant.id
                                  ? "border-primary bg-primary/5"
                                  : "border-border hover:border-primary/20"
                              }`}
                              onClick={() => setSelectedApplicant(applicant)}
                            >
                              <div className="flex items-center gap-4">
                                <Avatar>
                                  <AvatarFallback className="bg-muted">
                                    {applicant.name
                                      .split(" ")
                                      .map((n: string) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-medium">
                                    {applicant.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {applicant.position}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">
                                  {applicant.appliedDate}
                                </span>
                                <Badge
                                  variant="secondary"
                                  className={status.className}
                                >
                                  {status.label}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Applicant Details */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Applicant Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedApplicant ? (
                        <div className="space-y-6">
                          <div className="text-center">
                            <Avatar className="h-16 w-16 mx-auto">
                              <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                                {selectedApplicant.name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <h3 className="mt-3 font-semibold text-lg">
                              {selectedApplicant.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedApplicant.position}
                            </p>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedApplicant.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <Briefcase className="h-4 w-4 text-muted-foreground" />
                              <span>
                                {selectedApplicant.experience} experience
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Applied {selectedApplicant.appliedDate}
                              </span>
                            </div>
                            {selectedApplicant.phone && (
                              <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{selectedApplicant.phone}</span>
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedApplicant.skills && selectedApplicant.skills.length > 0 ? (
                                selectedApplicant.skills.map((skill: string) => (
                                  <Badge key={skill} variant="secondary">
                                    {skill}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-sm text-muted-foreground italic">No skills listed</span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Button className="w-full" asChild>
                              <a href={`${process.env.NEXT_PUBLIC_API_URL}${selectedApplicant.resume}`} target="_blank" rel="noreferrer">
                                <FileText className="mr-2 h-4 w-4" />
                                View Resume
                              </a>
                            </Button>
                            <div className="flex gap-3">
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleStatusUpdate(selectedApplicant.id, "shortlisted")}
                                disabled={updatingStatus === selectedApplicant.id || selectedApplicant.status === "shortlisted"}
                              >
                                {updatingStatus === selectedApplicant.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                )}
                                Shortlist
                              </Button>
                              <Button 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => handleStatusUpdate(selectedApplicant.id, "rejected")}
                                disabled={updatingStatus === selectedApplicant.id || selectedApplicant.status === "rejected"}
                              >
                                {updatingStatus === selectedApplicant.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <XCircle className="mr-2 h-4 w-4" />
                                )}
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Select an applicant to view details</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    <Footer />
    </div>
  );
}


export default function RecruiterDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <RecruiterDashboardContent />
    </Suspense>
  );
}
