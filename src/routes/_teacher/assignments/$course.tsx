import { createFileRoute } from "@tanstack/react-router";
import { AssignedCourseScores } from "@/features/teacher/assignment/components/assigned-course-scores.tsx";

export const Route = createFileRoute("/_teacher/assignments/$course")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col p-6 space-y-8">
      <AssignedCourseScores />{" "}
    </div>
  );
}
