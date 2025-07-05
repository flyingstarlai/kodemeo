import { createFileRoute } from "@tanstack/react-router";
import { LoginStudentForm } from "@/features/auth/components/login-student-form.tsx";

type StudentLogin = {
  room: number;
};

export const Route = createFileRoute("/_auth/student/login")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): StudentLogin => {
    return {
      room: search.room as number,
    };
  },
});

function RouteComponent() {
  return <LoginStudentForm />;
}
