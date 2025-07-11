import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { SoundCleaner } from "@/components/sound-cleaner.tsx";

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <SoundCleaner />
      <TanStackRouterDevtools />
    </>
  ),
});
