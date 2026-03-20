"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Clock, Bookmark } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { toggleSaveJobAsync } from "@/lib/features/auth/auth-slice";
import { useRouter } from "next/navigation";

export interface Job {
  id: string;
  _id?: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  salary: string;
  type: "Full-time" | "Part-time" | "Contract" | "Remote";
  posted: string;
  description?: string;
  responsibilities?: string;
  requirements?: string;
  skills?: string[];
  experience?: "Entry" | "Mid" | "Senior" | "Lead" | "Executive";
}

interface JobCardProps {
  job: Job;
  variant?: "default" | "compact";
  onEdit?: (job: Job) => void;
}

export function JobCard({ job, variant = "default", onEdit }: JobCardProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, savedJobs } = useSelector((state: RootState) => state.auth);
  
  const saved = savedJobs.some((j) => (j._id || j.id) === (job._id || job.id));

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push("/login");
      return;
    }
    dispatch(toggleSaveJobAsync(job));
  };
  const typeColors: Record<string, string> = {
    "Full-time": "bg-primary/10 text-primary",
    "Part-time": "bg-warning/20 text-warning-foreground",
    Contract: "bg-accent text-accent-foreground",
    Remote: "bg-success/20 text-success",
  };

  if (variant === "compact") {
    return (
      <Card className="group transition-all hover:shadow-md hover:border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <Link href={`/jobs/${job.id}`}>
                  <h3 className="font-medium leading-tight group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {job.company}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    {job.salary}
                  </span>
                </div>
              </div>
            </div>
            <Badge variant="secondary" className={typeColors[job.type]}>
              {job.type}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="group transition-all hover:shadow-md hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <Link href={`/jobs/${job.id}`}>
                <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                  {job.title}
                </h3>
              </Link>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>
          {user?.role !== "recruiter" && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="shrink-0" 
              onClick={handleSave}
            >
              <Bookmark className={`h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} />
            </Button>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {job.location}
          </span>
          <span className="flex items-center gap-1.5">
            {job.salary}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {job.posted}
          </span>
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-secondary">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <Badge variant="secondary" className={typeColors[job.type]}>
            {job.type}
          </Badge>
          <Button asChild>
            <Link href={`/jobs/${job.id}`}>
              View Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
