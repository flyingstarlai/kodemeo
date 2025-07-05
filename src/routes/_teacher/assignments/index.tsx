import { createFileRoute } from "@tanstack/react-router";
import { AssignedCourseSection } from "@/features/teacher/assignment/components/assigned-course-section.tsx";

export const Route = createFileRoute("/_teacher/assignments/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-1 flex-col p-6 space-y-8">
      <AssignedCourseSection />
    </div>
  );
}
