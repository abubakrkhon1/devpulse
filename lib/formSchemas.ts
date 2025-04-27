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
