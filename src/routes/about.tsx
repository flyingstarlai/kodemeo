import { createFileRoute } from "@tanstack/react-router";

type LevelLoad = {
  level: string;
};

export const Route = createFileRoute("/about")({
  component: About,
  validateSearch: (search: Record<string, unknown>): LevelLoad => {
    return {
      level: search.level as string,
    };
  },
});

function About() {
  return <div className="p-2">Hello from About!</div>;
}
