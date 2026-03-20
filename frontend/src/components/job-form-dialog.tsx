"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  IndianRupee,
  GraduationCap,
  Users,
  CalendarDays,
  X,
  Plus,
  FileText,
  CheckCircle,
} from "lucide-react";

interface JobFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobToEdit?: any | null;
  onSubmit: (jobData: any) => void;
}

const emptyForm = {
  title: "",
  description: "",
  location: "",
  jobType: "full-time" as string,
  salaryMin: "",
  salaryMax: "",
  currency: "INR",
  experience: "fresher" as string,
  skillsRequired: [] as string[],
  openings: "1",
  deadline: "",
  responsibilities: "",
  requirements: "",
};

export function JobFormDialog({
  open,
  onOpenChange,
  jobToEdit,
  onSubmit,
}: JobFormDialogProps) {
  const [form, setForm] = useState(emptyForm);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (jobToEdit) {
      setForm({
        title: jobToEdit.title || "",
        description: jobToEdit.description || "",
        location: jobToEdit.location || "",
        jobType: jobToEdit.jobType || "full-time",
        salaryMin: jobToEdit.salary?.min?.toString() || "",
        salaryMax: jobToEdit.salary?.max?.toString() || "",
        currency: jobToEdit.salary?.currency || "INR",
        experience: jobToEdit.experience || "fresher",
        skillsRequired: jobToEdit.skillsRequired || [],
        openings: jobToEdit.openings?.toString() || "1",
        deadline: jobToEdit.deadline
          ? new Date(jobToEdit.deadline).toISOString().split("T")[0]
          : "",
        responsibilities: jobToEdit.responsibilities?.join("\n") || "",
        requirements: jobToEdit.requirements?.join("\n") || "",
      });
    } else {
      setForm(emptyForm);
    }
    setSkillInput("");
  }, [jobToEdit, open]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skillsRequired.includes(trimmed)) {
      setForm({ ...form, skillsRequired: [...form.skillsRequired, trimmed] });
    }
    setSkillInput("");
  };

  const handleSkillKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skill: string) => {
    setForm({
      ...form,
      skillsRequired: form.skillsRequired.filter((s) => s !== skill),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: form.title,
      description: form.description,
      location: form.location,
      jobType: form.jobType,
      salary: {
        min: Number(form.salaryMin) || 0,
        max: Number(form.salaryMax) || 0,
        currency: form.currency,
      },
      experience: form.experience,
      skillsRequired: form.skillsRequired,
      openings: Number(form.openings) || 1,
      deadline: form.deadline || null,
      responsibilities: form.responsibilities
        .split("\n")
        .map((s: string) => s.trim())
        .filter((s: string) => s !== ""),
      requirements: form.requirements
        .split("\n")
        .map((s: string) => s.trim())
        .filter((s: string) => s !== ""),
      ...(jobToEdit?._id && { _id: jobToEdit._id }),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Briefcase className="h-5 w-5 text-primary" />
            {jobToEdit ? "Edit Job Listing" : "Post a New Job"}
          </DialogTitle>
          <DialogDescription>
            {jobToEdit
              ? "Update your job listing details below."
              : "Fill in the details to create a new job listing."}
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-5 mt-2" onSubmit={handleSubmit}>
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="font-medium">
              Job Title <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="jobTitle"
                placeholder="e.g. Senior Frontend Engineer"
                className="pl-10"
                value={form.title}
                required
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          {/* Location + Job Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="font-medium">
                Location <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. Mumbai, India"
                  className="pl-10"
                  value={form.location}
                  required
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-medium">Job Type</Label>
              <Select
                value={form.jobType}
                onValueChange={(v) => setForm({ ...form, jobType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <Label className="font-medium">Salary Range</Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Min (e.g. 500000)"
                  className="pl-10"
                  type="number"
                  min={0}
                  value={form.salaryMin}
                  onChange={(e) =>
                    setForm({ ...form, salaryMin: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Max (e.g. 1200000)"
                  className="pl-10"
                  type="number"
                  min={0}
                  value={form.salaryMax}
                  onChange={(e) =>
                    setForm({ ...form, salaryMax: e.target.value })
                  }
                />
              </div>
              <Select
                value={form.currency}
                onValueChange={(v) => setForm({ ...form, currency: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">INR ₹</SelectItem>
                  <SelectItem value="USD">USD $</SelectItem>
                  <SelectItem value="EUR">EUR €</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Experience + Openings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-medium flex items-center gap-1">
                <GraduationCap className="h-4 w-4" /> Experience Level
              </Label>
              <Select
                value={form.experience}
                onValueChange={(v) => setForm({ ...form, experience: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresher">Fresher</SelectItem>
                  <SelectItem value="1-2 years">1-2 years</SelectItem>
                  <SelectItem value="2-5 years">2-5 years</SelectItem>
                  <SelectItem value="5-10 years">5-10 years</SelectItem>
                  <SelectItem value="10+ years">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="openings" className="font-medium flex items-center gap-1">
                <Users className="h-4 w-4" /> Openings
              </Label>
              <Input
                id="openings"
                type="number"
                min={1}
                placeholder="e.g. 2"
                value={form.openings}
                onChange={(e) => setForm({ ...form, openings: e.target.value })}
              />
            </div>
          </div>

          {/* Skills Required */}
          <div className="space-y-2">
            <Label className="font-medium">Skills Required</Label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g. React, Node.js (press Enter to add)"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
              />
              <Button type="button" variant="outline" size="icon" onClick={addSkill}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {form.skillsRequired.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {form.skillsRequired.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="flex items-center gap-1 pr-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Application Deadline */}
          <div className="space-y-2">
            <Label htmlFor="deadline" className="font-medium flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> Application Deadline
            </Label>
            <Input
              id="deadline"
              type="date"
              value={form.deadline}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            />
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="font-medium flex items-center gap-1">
              <FileText className="h-4 w-4" /> Job Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the role basics..."
              rows={3}
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities" className="font-medium flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Responsibilities
            </Label>
            <Textarea
              id="responsibilities"
              placeholder="Enter responsibilities (one per line)..."
              rows={4}
              value={form.responsibilities}
              onChange={(e) =>
                setForm({ ...form, responsibilities: e.target.value })
              }
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="font-medium flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> Requirements
            </Label>
            <Textarea
              id="requirements"
              placeholder="Enter requirements (one per line)..."
              rows={4}
              value={form.requirements}
              onChange={(e) =>
                setForm({ ...form, requirements: e.target.value })
              }
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">
              {jobToEdit ? "Save Changes" : "Post Job"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
