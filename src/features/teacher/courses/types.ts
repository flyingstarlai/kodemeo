import { z } from "zod";
import type { assignCoursesSchema } from "@/features/teacher/courses/schema.ts";

export type AssignCoursesData = z.infer<typeof assignCoursesSchema>;
