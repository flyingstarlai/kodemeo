import { useQuery } from "@tanstack/react-query";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import type { Enrollment } from "@/features/teacher/enrollment/types.ts";
import { queryKeys } from "@/lib/query-keys.ts";

/**
 * Hook to fetch all enrollments for a given classroom.
 * GET /api/enrollments/{classroomId}
 */
export function useTeacherGetEnrollments(classroomId: string) {
  return useQuery<Enrollment[], Error>({
    queryKey: queryKeys.enrollments(classroomId),
    queryFn: () =>
      getTeacherApiClient()
        .get<Enrollment[]>(`/enrollments/${classroomId}`, withAuthConfig())
        .then((res) => res.data),
    enabled: Boolean(classroomId),
    staleTime: 1000 * 60 * 5, // 5m cache
    gcTime: 1000 * 60 * 10, // 10m GC
  });
}
