"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2 } from "lucide-react";

interface SkillsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userSkills: string[];
  onSubmit: (skills: string[]) => Promise<void>;
}

export function SkillsDialog({
  open,
  onOpenChange,
  userSkills,
  onSubmit,
}: SkillsDialogProps) {
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (open) {
      const initialSkills = userSkills || [];
      setSkills(initialSkills);
      setIsDirty(false);
    }
  }, [open, userSkills]);

  useEffect(() => {
    if (open) {
      // Check if skills list has changed (order doesn't matter for dirty check usually, but let's be safe)
      const initialSkills = [...(userSkills || [])].sort().join(",");
      const currentSkills = [...skills].sort().join(",");
      setIsDirty(initialSkills !== currentSkills);
    }
  }, [skills, userSkills, open]);

  const addSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(skills);
      onOpenChange(false);
    } catch (error) {
      console.error("Save skills error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Skills</DialogTitle>
          <DialogDescription>
            Add skills that highlight your professional expertise.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g. React, Python, Figma"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button type="button" size="icon" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 min-h-[40px] p-4 bg-muted/50 rounded-lg">
            {skills.length > 0 ? (
              skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1.5 bg-background border-border"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground w-full text-center py-2">
                No skills added yet.
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={isSubmitting || !isDirty}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Skills"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
