import { z } from "zod";
export const skillCategory = z.object({
  category: z
    .string()
    .max(14, "length must be less than or equal to 14")
    .optional(),
  skills: z
    .string()
    .max(10, "length must be less than or equal to 10")
    .optional(),
});
export const educationValidation = z.object({
  degree: z.string().min(1, "degree is required"),
  school: z.string().min(1, "school is required"),
  year: z.string().min(1, "year is required"),
});
export const experienceValidation = z.object({
  role: z.string().min(1, "role is required"),
  company: z.string().min(1, "company is required"),
  period: z.string().min(1, "period is required"),
  description: z.string().min(1, "description is required"),
});
export const BlogValidation = z.object({});
