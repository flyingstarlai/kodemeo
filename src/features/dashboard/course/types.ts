export interface AssignedCourse {
  assignedCourseId: string;
  courseId: string;
  availableWeek: number;
  title: string;
  slug: string;
  description: string | null;
  addedAt: Date;
  isEnrolled: boolean;
}
