import { z } from "zod";

export const applicationSchema = z.object({
  phone: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number must not exceed 15 characters"),
  coverLetter: z.string().optional(),
});
