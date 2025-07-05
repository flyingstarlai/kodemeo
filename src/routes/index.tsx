import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/features/site/components/landing-page.tsx";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LandingPage />;
}
