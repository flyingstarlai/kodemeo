import { z } from "zod";
import { loginSchema } from "@/features/auth/schema.ts";
import type { User } from "@/features/me/types.ts";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type AuthResponse = User & {
  token: string;
};

export interface LoginPayload {
  code: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export type loginFormData = z.infer<typeof loginSchema>;
