import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { SiteHeader } from "@/components/site-header.tsx";
import { clsx } from "clsx";
import { isAuthenticated, isTeacher } from "@/lib/auth.ts";
import { useEnsureHasUser } from "@/hooks/use-ensure-has-user.ts";
import { StudentAppSidebar } from "@/components/student-app-sidebar.tsx";

export const Route = createFileRoute("/_student")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",

        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      });
    }
    if (isTeacher()) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  const location = useLocation();
  useEnsureHasUser();
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className={clsx(
        location.pathname.includes("courses") && "h-screen overflow-hidden",
      )}
    >
      <StudentAppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
