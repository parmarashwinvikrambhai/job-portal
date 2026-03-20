import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
 
  email: z
    .string({ message: "Email is required" })
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
 
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password cannot exceed 32 characters"),
 
  role: z
    .enum(["jobseeker", "recruiter"], {
      message: "Role must be either jobseeker or recruiter",
    })
    .default("jobseeker"),
 
  company: z
    .string()
    .max(100, "Company name cannot exceed 100 characters")
    .optional(),
 
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .optional(),
 
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters")
    .optional(),
 
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional(),
 
  skills: z
    .array(z.string().trim())
    .max(20, "You can add up to 20 skills")
    .optional(),

  experience: z
    .string()
    .max(100, "Experience cannot exceed 100 characters")
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Please provide a valid email address")
    .toLowerCase()
    .trim(),
 
  password: z
    .string({ message: "Password is required" })
    .min(6, "Password must be at least 6 characters long")
    .max(32, "Password cannot exceed 32 characters"),
 
})

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters")
    .trim()
    .optional(),
  
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .optional(),
 
  location: z
    .string()
    .max(100, "Location cannot exceed 100 characters")
    .optional(),
 
  bio: z
    .string()
    .max(500, "Bio cannot exceed 500 characters")
    .optional(),
 
  skills: z
    .array(z.string().trim())
    .max(20, "You can add up to 20 skills")
    .optional(),

  experience: z
    .string()
    .max(100, "Experience cannot exceed 100 characters")
    .optional(),
});