import { z } from "zod";
import {
  loginStudentSchema,
  loginSchema,
  type registerSchema,
} from "@/features/auth/schema.ts";
import type { User } from "@/features/me/types.ts";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type AuthResponse = User & {
  token: string;
};

export interface StudentLoginPayload {
  code: string;
  username: string;
  password: string;
}

export interface StudentLoginResponse {
  token: string;
}

export type LoginStudentFormData = z.infer<typeof loginStudentSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

export type RegisterFormData = z.infer<typeof registerSchema>;
