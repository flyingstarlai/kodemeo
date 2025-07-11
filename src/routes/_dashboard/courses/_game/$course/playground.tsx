import { createFileRoute } from "@tanstack/react-router";
import GameCanvas from "@/features/dashboard/game/components/game-canvas.tsx";
import { Command } from "@/features/dashboard/command/components/command.tsx";
import { ResultPopup } from "@/features/dashboard/game/components/result-popup.tsx";

type PlayLevel = {
  level: string;
};

export const Route = createFileRoute(
  "/_dashboard/courses/_game/$course/playground",
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): PlayLevel => {
    return {
      level: search.level as string,
    };
  },
});

function RouteComponent() {
  return (
    <div
      id="game-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <ResultPopup />
      <GameCanvas />
      <Command />
    </div>
  );
}
