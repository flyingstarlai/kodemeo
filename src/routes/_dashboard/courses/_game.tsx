/* eslint-disable react-hooks/exhaustive-deps */
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AssetProvider } from "@/providers/asset-provider.tsx";
import { preloadSounds } from "@/lib/sounds.ts";
import { useEffect, useState } from "react";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import { MobileAlertDialog } from "@/components/mobile-alert-dialog.tsx";

export const Route = createFileRoute("/_dashboard/courses/_game")({
  component: RouteComponent,
});

function RouteComponent() {
  const [ready, setReady] = useState(false);
  const sidebar = useSidebar();

  useEffect(() => {
    const loadAssets = async () => {
      const font = "28px 'Fredoka One'";
      await document.fonts.load(font);

      preloadSounds();

      setReady(true);
    };

    loadAssets().finally(() => {
      if (window.innerWidth < 2048) {
        sidebar.setOpen(false);
      }
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex flex-1 min-h-0 flex-col p-2 space-y-2">
        Loading game assets...
      </div>
    );
  }

  return (
    <AssetProvider>
      <MobileAlertDialog />
      <Outlet />
    </AssetProvider>
  );
}
