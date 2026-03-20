import { z } from "zod";

export const jobSchema = z.object({
  title: z
    .string({ message: "Job title is required" })
    .min(2, "Title must be at least 2 characters")
    .trim(),
  description: z
    .string({ message: "Job description is required" })
    .min(10, "Description must be at least 10 characters"),
  company: z.string({ message: "Company ID is required" }),
  location: z
    .string({ message: "Location is required" })
    .min(2, "Location must be at least 2 characters")
    .trim(),
  jobType: z
    .enum(["full-time", "part-time", "contract", "internship", "remote"])
    .default("full-time"),
  salary: z
    .object({
      min: z.coerce.number().min(0).default(0),
      max: z.coerce.number().min(0).default(0),
      currency: z.string().default("INR"),
    })
    .optional()
    .default({ min: 0, max: 0, currency: "INR" }),
  experience: z
    .enum(["fresher", "1-2 years", "2-5 years", "5-10 years", "10+ years"])
    .default("fresher"),
  skillsRequired: z.array(z.string().trim()).optional().default([]),
  responsibilities: z.array(z.string().trim()).optional().default([]),
  requirements: z.array(z.string().trim()).optional().default([]),
  openings: z.coerce.number().min(1).default(1),
  deadline: z
    .string()
    .optional()
    .nullable()
    .transform((v) => (v ? new Date(v) : null)),
  status: z.enum(["open", "closed"]).default("open"),
});

export const updateJobSchema = jobSchema.partial();
