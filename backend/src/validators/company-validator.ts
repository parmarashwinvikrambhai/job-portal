import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string({ message: "Company name is required" })
    .min(2, "Company name must be at least 2 characters long")
    .trim(),
  description: z.string().optional(),
  website: z.preprocess((arg) => (arg === "" ? undefined : arg), z.string().url("Invalid website URL").optional().or(z.literal(""))),
  location: z.string({ message: "Location is required" }).min(2, "Location must be at least 2 characters long").trim(),
  industry: z.string().optional(),
  logo: z.string().optional(),
  recruiterId: z.string({ message: "Recruiter ID is required" }),
});

export const updateCompanySchema = companySchema.partial();
