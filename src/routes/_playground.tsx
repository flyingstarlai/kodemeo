import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { clsx } from "clsx";
import { StudentAppSidebar } from "@/components/student-app-sidebar.tsx";
import { SiteHeader } from "@/components/site-header.tsx";

export const Route = createFileRoute("/_playground")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className={clsx(
        location.pathname.includes("playground") && "h-screen overflow-hidden",
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
