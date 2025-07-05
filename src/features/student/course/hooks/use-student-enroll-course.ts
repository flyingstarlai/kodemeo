import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentApiClient, withAuthConfig } from "@/lib/api.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import type { AssignedCourseForStudent } from "@/features/teacher/classroom/types.ts";
import type { User } from "@/features/me/types.ts";

interface EnrollPayload {
  assignedCourseId: string;
}

/**
 * Hook for a student to enroll in an assigned course.
 * POST /api/student/{classroomId}/enroll
 * Returns the updated AssignedCourseForStudent
 */
export function useStudentEnrollCourse() {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData<User>(queryKeys.user);
  const classroomId = user?.classroomId;

  return useMutation<AssignedCourseForStudent, Error, EnrollPayload>({
    mutationFn: async ({ assignedCourseId }) => {
      if (!classroomId) {
        return Promise.reject(new Error("No classroom selected"));
      }
      const res = await getStudentApiClient().post<AssignedCourseForStudent>(
        `/courses/${classroomId}/enroll`,
        { assignedCourseId },
        withAuthConfig(),
      );
      return res.data;
    },
    onSuccess: (updatedCourse) => {
      if (!classroomId) return;
      // Update the student-assigned-courses cache with the updated course
      queryClient.setQueryData<AssignedCourseForStudent[]>(
        ["classroom", classroomId, "studentAssignedCourses"],
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
