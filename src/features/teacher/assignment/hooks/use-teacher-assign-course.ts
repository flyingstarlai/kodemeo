import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import type { User } from "@/features/me/types.ts";
import type { AssignedCourse } from "@/features/teacher/assignment/types.ts";
import { invalidateQueryByKey, queryKeys } from "@/lib/query-keys.ts";

/**
 * Hook to assign multiple courses to a classroom (room).
 *
 * POST /api/rooms/:roomId/courses
 * Body: { courseIds: string[] }
 */
export function useTeacherAssignCourses() {
  const qc = useQueryClient();
  const user = qc.getQueryData<User>(["user"]);
  const classroomId = user?.classroomId;

  return useMutation<AssignedCourse[], Error, string[]>({
    mutationFn: async (courseIds) => {
      if (!classroomId) {
        return Promise.reject(new Error("No classroom selected"));
      }
      const res = await getTeacherApiClient().post<AssignedCourse[]>(
        `/assignments/${classroomId}`,
        { courseIds },
        withAuthConfig(),
      );
      return res.data;
    },
    onSuccess: (assignedCourses) => {
      if (!classroomId) return;
      // Merge the new assigned courses into the existing classroom detail cache
      qc.setQueryData<AssignedCourse[]>(
        queryKeys.assignedCourses(classroomId),
        assignedCourses,
      );
      invalidateQueryByKey(qc, "assignedCourses", classroomId);
    },
  });
}
