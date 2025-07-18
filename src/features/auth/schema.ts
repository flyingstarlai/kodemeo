import { z } from "zod";

export const loginSchema = z.object({
  room: z.string().min(1, { message: "Classroom code required" }),
  username: z.string().min(1, { message: "Username required" }),
  password: z.string().min(1, { message: "Password required" }),
});
