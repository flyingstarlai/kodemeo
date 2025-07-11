import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudentApiClient, withAuthConfig } from "@/lib/api.ts";
import { getQueryDataByKey } from "@/lib/query-keys.ts";
import type { AssignedCourse } from "@/features/dashboard/course/types.ts";

/**
 * Hook to fetch all courses assigned to the current dashboard's classroom,
 * along with enrollment status and next action.
 * GET /api/classrooms/{classroomId}/dashboard
 */
export function useGetAssignedCourse() {
  const qc = useQueryClient();
  const user = getQueryDataByKey(qc, "user");
  const classroomId = user?.classroomId;

  return useQuery<AssignedCourse[], Error>({
    queryKey: ["classroom", classroomId, "studentAssignedCourses"] as const,
    queryFn: () =>
      getStudentApiClient()
        .get<AssignedCourse[]>(`/courses/${classroomId}`, withAuthConfig())
        .then((res) => res.data),
    enabled: Boolean(classroomId),
    gcTime: 1000 * 60 * 10, // garbage collect after 10 minutes
  });
}
