import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileAlertDialog } from "@/components/mobile-alert-dialog.tsx";
import { AssetProvider } from "@/providers/asset-provider.tsx";
import { preloadSounds } from "@/lib/sounds.ts";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_dashboard/courses/_game")({
  component: RouteComponent,
});

function RouteComponent() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadAssets = async () => {
      const font = "28px 'Fredoka One'";
      await document.fonts.load(font);

      preloadSounds();

      setReady(true);
    };

    loadAssets();
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
