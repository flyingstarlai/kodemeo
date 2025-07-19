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
  room: string;
  username: string;
  password: string;
}

export interface RoomLoginPayload {
  code: string;
  username: string;
}

export interface LoginResponse {
  token: string;
}

export interface RoomLogin {
  name: string;
  username: string;
}

export type loginFormData = z.infer<typeof loginSchema>;
