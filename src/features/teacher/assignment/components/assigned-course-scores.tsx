import { useTeacherGetAssignedCourseScores } from "@/features/teacher/assignment/hooks/use-teacher-get-assigned-course-scores.ts";
import { useGetMe } from "@/features/me/hooks/use-get-me.ts";
import { useParams } from "@tanstack/react-router";
import { QueryStatus } from "@/components/query-status.tsx";
import { DataTable } from "@/features/teacher/assignment/components/data-table.tsx";
import { useMemo } from "react";
import { makeAssignedScoresColumns } from "@/features/teacher/assignment/components/columns.tsx";

export const AssignedCourseScores: React.FC = () => {
  const { course: courseSlug } = useParams({ strict: false });
  const { data: user } = useGetMe();

  const {
    data: scores,
    isLoading,
    error,
  } = useTeacherGetAssignedCourseScores(user!.classroomId!, courseSlug!);

  const columns = useMemo(
    () => makeAssignedScoresColumns(scores ?? []),
    [scores],
  );

  if (isLoading || error) {
    return <QueryStatus isLoading={isLoading} error={error} />;
  }

  if (!scores || scores.length === 0) {
    return <p>No student has enrolled this coursed.</p>;
  }

  return <DataTable data={scores} columns={columns} course={courseSlug} />;
};
