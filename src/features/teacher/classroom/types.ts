import { z } from "zod";
import type { createRoomSchema } from "@/features/teacher/classroom/schema.ts";
import type { Enrollment } from "@/features/teacher/enrollment/types.ts";
import type { AssignedCourse } from "@/features/teacher/assignment/types.ts";

export interface Classroom {
  id: string;
  name: string;
  teacherId: string;
  maxStudents: number;
  code: string;
  createdAt: string;
}

export interface ClassroomDetail extends Classroom {
  enrollments: Enrollment[];
  courses: AssignedCourse[];
}

export type CreateClassroomPayload = Omit<
  Classroom,
  "id" | "createdAt" | "code" | "teacherId" | "maxStudents"
>;

export type createRoomData = z.infer<typeof createRoomSchema>;

export interface AssignedCourseForStudent {
  assignedCourseId: string;
  courseId: string;
  title: string;
  slug: string;
  description: string | null;
  addedAt: Date;
  isEnrolled: boolean;
}
