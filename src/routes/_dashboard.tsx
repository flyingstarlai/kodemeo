import {
  createFileRoute,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { SiteHeader } from "@/components/site-header.tsx";
import { clsx } from "clsx";
import { isAuthenticated } from "@/lib/auth.ts";
import { useEnsureHasUser } from "@/hooks/use-ensure-has-user.ts";
import { AppSidebar } from "@/components/app-sidebar.tsx";

export const Route = createFileRoute("/_dashboard")({
  component: RouteComponent,
  beforeLoad: async ({ location }) => {
    if (!isAuthenticated()) {
      throw redirect({
        to: "/login",

        search: {
          redirect: location.href,
        },
      });
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
        (location.pathname.includes("courses") ||
          location.pathname.includes("map")) &&
          "h-screen overflow-hidden",
      )}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
