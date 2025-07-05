import { createFileRoute } from "@tanstack/react-router";

import { formatDate } from "@/lib/utils.ts";
import { useGetMe } from "@/features/me/hooks/use-get-me.ts";
import { useTeacherGetClassrooms } from "@/features/teacher/classroom/hooks/use-teacher-get-classrooms.ts";

export const Route = createFileRoute("/_teacher/dashboard")({
  component: RouteComponent,
});

export function RouteComponent() {
  const { data: user } = useGetMe();
  const { data: classrooms } = useTeacherGetClassrooms();

  const classroom = classrooms?.find((cr) => cr.id === user?.classroomId);

  if (!classrooms) return <p className="p-6">Loading classroom...</p>;
  if (!classroom) return null;
  return (
    <div className="flex flex-1 flex-col p-6 space-y-8">
      {/* Classroom Info */}
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-2">{classroom.name}</h1>
        <p className="text-gray-600">Code: {classroom.code}</p>
        <p className="text-gray-600">Max Students: {classroom.maxStudents}</p>
        <p className="text-gray-600">
          Created: {formatDate(classroom.createdAt)}
        </p>
      </div>
    </div>
  );
}
