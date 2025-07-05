import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileAlertDialog } from "@/components/mobile-alert-dialog.tsx";
import { AssetProvider } from "@/providers/asset-provider.tsx";

export const Route = createFileRoute("/_student/courses/_game")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AssetProvider>
      <MobileAlertDialog />
      <Outlet />
    </AssetProvider>
  );
}
