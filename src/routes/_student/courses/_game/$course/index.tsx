import { createFileRoute } from "@tanstack/react-router";
import { ChallengesMap } from "@/features/student/challenge/components/challenges-map.tsx";

type PageLoad = {
  page: number;
};

export const Route = createFileRoute("/_student/courses/_game/$course/")({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): PageLoad => {
    const raw = search.page as number | undefined;
    return {
      page: raw ? raw : 1,
    };
  },
});

function RouteComponent() {
  return (
    <div
      id="level-container"
      className="flex flex-1 min-h-0 flex-col p-2 space-y-2"
    >
      <ChallengesMap />
    </div>
  );
}
