import { z } from "zod";
import { createEnrollmentSchema } from "@/features/teacher/enrollment/schema.ts";

export interface Enrollment {
  id: string;
  classroomId: string;
  studentId: string;
  username: string;
  email: string;
  name: string;
  invitedAt: Date;
  joinedAt: Date | null;
}

export interface CreateEnrollmentPayload {
  name: string;
  username: string;
  password: string;
  classroomId: string;
}

export type CreateEnrollmentData = z.infer<typeof createEnrollmentSchema>;
