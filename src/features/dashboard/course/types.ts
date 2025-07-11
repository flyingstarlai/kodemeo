export interface AssignedCourse {
  assignedCourseId: string;
  courseId: string;
  title: string;
  slug: string;
  description: string | null;
  addedAt: Date;
  isEnrolled: boolean;
}
