import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password required" }),
});

export const loginStudentSchema = z.object({
  code: z.string().min(1, { message: "Classroom code required" }),
  username: z.string().min(1, { message: "Username required" }),
  password: z.string().min(1, { message: "Password required" }),
});

export const registerSchema = z
  .object({
    name: z.string().min(1, { message: "Full name is required" }),
    email: z
      .string()
      .email({ message: "Must be a valid email" })
      .nonempty({ message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
