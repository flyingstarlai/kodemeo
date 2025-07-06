import { createFileRoute } from "@tanstack/react-router";
import GameCanvas from "@/features/student/game-bescy/components/game-canvas.tsx";

export const Route = createFileRoute("/_playground/playground")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      id="game-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <GameCanvas />
    </div>
  );
}
