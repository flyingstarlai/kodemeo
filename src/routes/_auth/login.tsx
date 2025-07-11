import { createFileRoute } from "@tanstack/react-router";
import { LoginForm } from "@/features/auth/components/login-form.tsx";

type StudentLogin = {
  room?: number;
  redirect?: string;
};

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): StudentLogin => {
    return {
      room: search.room as number,
      redirect: search.redirect as string,
    };
  },
});

function RouteComponent() {
  return <LoginForm />;
}
