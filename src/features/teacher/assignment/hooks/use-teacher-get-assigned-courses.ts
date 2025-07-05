import { useQuery } from "@tanstack/react-query";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { AssignedCourse } from "@/features/teacher/assignment/types.ts";

/**
 * Hook to fetch all assigned courses for the current me's classroom.
 * GET /api/assignments/{classroomId}
 */
export function useTeacherGetAssignedCourses(classroomId: string) {
  return useQuery<AssignedCourse[], Error>({
    queryKey: queryKeys.assignedCourses(classroomId!),
    queryFn: () =>
      getTeacherApiClient()
        .get<AssignedCourse[]>(`/assignments/${classroomId}`, withAuthConfig())
        .then((res) => res.data),
    enabled: Boolean(classroomId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
