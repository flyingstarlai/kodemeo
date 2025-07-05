import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudentApiClient, withAuthConfig } from "@/lib/api.ts";
import { getQueryDataByKey } from "@/lib/query-keys.ts";
import type { AssignedCourseForStudent } from "@/features/teacher/classroom/types.ts";

/**
 * Hook to fetch all courses assigned to the current student's classroom,
 * along with enrollment status and next action.
 * GET /api/classrooms/{classroomId}/student
 */
export function useStudentGetAssignedCourse() {
  const qc = useQueryClient();
  const user = getQueryDataByKey(qc, "user");
  const classroomId = user?.classroomId;

  return useQuery<AssignedCourseForStudent[], Error>({
    queryKey: ["classroom", classroomId, "studentAssignedCourses"] as const,
    queryFn: () =>
      getStudentApiClient()
        .get<AssignedCourseForStudent[]>(
          `/courses/${classroomId}`,
          withAuthConfig(),
        )
        .then((res) => res.data),
    enabled: Boolean(classroomId),
    gcTime: 1000 * 60 * 10, // garbage collect after 10 minutes
  });
}
