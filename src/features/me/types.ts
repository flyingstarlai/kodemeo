export interface User {
  id: string;
  email: string;
  name: string;
  role: "TEACHER" | "STUDENT" | "ADMIN";
  classroomId: string | null;
  createdAt: string;
}
