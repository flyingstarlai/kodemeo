import { createFileRoute } from "@tanstack/react-router";
import { AppContainer } from "@/features/playground2/app-container.tsx";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { useEffect } from "react";
import { AssetProvider } from "@/providers/asset-provider.tsx";

export const Route = createFileRoute("/_dashboard/map")({
  component: RouteComponent,
});

function RouteComponent() {
  const sidebar = useSidebar();
  useEffect(() => {
    if (sidebar.state === "expanded") {
      sidebar.toggleSidebar();
    }
  }, []);
  return (
    <div
      id="level-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <AssetProvider>
        <AppContainer />
      </AssetProvider>
    </div>
  );
}
