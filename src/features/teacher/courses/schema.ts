import { z } from "zod";

export const assignCoursesSchema = z.object({
  courseIds: z.array(z.string()).min(1, "Select at least one course"),
});
