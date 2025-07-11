import { createFileRoute } from "@tanstack/react-router";
import { MapCanvas } from "@/features/dashboard/challenge/components/map-canvas.tsx";

type PageLoad = {
  week: number;
};

export const Route = createFileRoute("/_dashboard/courses/_game/$course/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): PageLoad => {
    const raw = search.week as number | undefined;
    return {
      week: raw ? raw : 1,
    };
  },
});

function RouteComponent() {
  return (
    <div
      id="level-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <MapCanvas />
    </div>
  );
}
