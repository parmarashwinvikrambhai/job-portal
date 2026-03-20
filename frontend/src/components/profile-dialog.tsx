"use client";

import { useState, useEffect } from "react";
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
import { User, MapPin, Phone, Briefcase, GraduationCap } from "lucide-react";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: any;
  onSubmit: (profileData: any) => void;
}

export function ProfileDialog({
  open,
  onOpenChange,
  user,
  onSubmit,
}: ProfileDialogProps) {
  const [form, setForm] = useState({
    name: "",
    bio: "",
    location: "",
    phone: "",
    skills: "",
    experience: "",
  });

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (user && open) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        skills: user.skills ? user.skills.join(", ") : "",
        experience: user.experience || "",
      });
      setIsDirty(false);
    }
  }, [user, open]);

  useEffect(() => {
    if (!open || !user) return;

    const currentSkills = user.skills ? user.skills.join(", ") : "";
    const hasChanged =
      form.name !== (user.name || "") ||
      form.bio !== (user.bio || "") ||
      form.location !== (user.location || "") ||
      form.phone !== (user.phone || "") ||
      form.skills !== currentSkills ||
      form.experience !== (user.experience || "");

    setIsDirty(hasChanged);
  }, [form, user, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const skillsArray = form.skills
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s !== "");

    const profileData = {
      ...form,
      skills: skillsArray,
    };

    onSubmit(profileData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your professional profile information here.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="name"
                placeholder="Your Name"
                className="pl-10"
                value={form.name}
                required
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g. Mumbai, India"
                  className="pl-10"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="10 digit number"
                  className="pl-10"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Experience *</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="experience"
                placeholder="e.g. 2 years, Fresher"
                className="pl-10"
                value={form.experience}
                required
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="skills"
                placeholder="React, Node.js, TypeScript"
                className="pl-10"
                value={form.skills}
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself..."
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" disabled={!isDirty}>
              Save Changes
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
