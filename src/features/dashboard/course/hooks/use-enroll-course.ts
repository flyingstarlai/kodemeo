import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentApiClient, withAuthConfig } from "@/lib/api.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { User } from "@/features/me/types.ts";
import type { AssignedCourse } from "@/features/dashboard/course/types.ts";

interface EnrollPayload {
  assignedCourseId: string;
}

/**
 * Hook for a dashboard to enroll in an assigned course.
 * POST /api/dashboard/{classroomId}/enroll
 * Returns the updated AssignedCourseForStudent
 */
export function useEnrollCourse() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(queryKeys.user);
  const classroomId = user?.classroomId;

  return useMutation<AssignedCourse, Error, EnrollPayload>({
    mutationFn: async ({ assignedCourseId }) => {
      if (!classroomId) {
        return Promise.reject(new Error("No classroom selected"));
      }
      const res = await getStudentApiClient().post<AssignedCourse>(
        `/courses/${classroomId}/enroll`,
        { assignedCourseId },
        withAuthConfig(),
      );
      return res.data;
    },
    onSuccess: (updatedCourse) => {
      if (!classroomId) return;
      // Update the dashboard-assigned-courses cache with the updated course
      queryClient.setQueryData<AssignedCourse[]>(
        queryKeys.assignedCourses(classroomId),
        (old) => {
          if (!old) return [updatedCourse];
          return old.map((course) =>
            course.assignedCourseId === updatedCourse.assignedCourseId
              ? updatedCourse
              : course,
          );
        },
      );
    },
  });
}
