import { z } from "zod";

export const signUpFormSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
    jobTitle: z.string().nonempty(),
    department: z.string().nonempty(),
    role: z.enum(["User", "Admin", "Manager"]),
    bio: z.string().optional(),
    twoFactorEnabled: z.boolean(),
    verified: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const projectFormSchema = z.object({
  title: z.string().min(1, "Project name cannot be empty"),
  description: z.string().min(1, "Description name cannot be empty"),
  dueDate: z.date(),
  priority: z.string().min(1, "Priority name cannot be empty"),
  status: z.string().min(1, "Status name cannot be empty"),
  team: z.string().array(),
  category: z.string().min(1, "Category name cannot be empty"),
  budget: z.number().min(1, "Budget name cannot be empty"),
});
