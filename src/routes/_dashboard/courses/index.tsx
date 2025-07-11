import { createFileRoute } from "@tanstack/react-router";
import { CourseItem } from "@/features/dashboard/course/components/course-item.tsx";
import { useGetAssignedCourse } from "@/features/dashboard/course/hooks/use-get-assigned-course.ts";

export const Route = createFileRoute("/_dashboard/courses/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: assignedCourses, error, isLoading } = useGetAssignedCourse();

  if (isLoading) return <p className="p-6">Loading courses...</p>;
  if (error)
    return (
      <p className="p-6 text-red-600">Error loading courses: {error.message}</p>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Courses</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedCourses?.map((ac) => (
          <CourseItem key={ac.assignedCourseId} course={ac} />
        ))}
      </div>
    </div>
  );
}
