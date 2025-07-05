// src/hooks/teacher/use-teacher-get-assignment-scores.ts
import { useQuery } from "@tanstack/react-query";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import type { StudentScoresResponse } from "@/features/teacher/assignment/types.ts";

/**
 * Fetches every student’s challenge scores for one assigned course.
 * GET /api/teacher/assignments/{classroomId}/{courseSlug}
 */
export function useTeacherGetAssignedCourseScores(
  classroomId: string,
  courseSlug: string,
) {
  return useQuery<StudentScoresResponse[], Error>({
    // unique key per classroom + courseSlug
    queryKey: ["teacher", "assignments", classroomId, courseSlug] as const,
    queryFn: () =>
      getTeacherApiClient()
        .get<StudentScoresResponse[]>(
          `/assignments/${classroomId}/${courseSlug}`,
          withAuthConfig(),
        )
        .then((res) => res.data),
    enabled: Boolean(classroomId && courseSlug),
    gcTime: 1000 * 60 * 10, // garbage collect after 10m
  });
}
