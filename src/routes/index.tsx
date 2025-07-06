import { createFileRoute, redirect } from "@tanstack/react-router";
import LandingPage from "@/features/site/components/landing-page.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  beforeLoad: async () => {
    throw redirect({ to: "/dashboard" });
  },
});

function RouteComponent() {
  return <LandingPage />;
}
