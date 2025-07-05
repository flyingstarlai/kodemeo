import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import { invalidateQueryByKey } from "@/lib/query-keys.ts";
import type {
  CreateEnrollmentPayload,
  Enrollment,
} from "@/features/teacher/enrollment/types.ts";

/**
 * Hook to create a new enrollment.
 * POST /api/enrollments
 */
export function useTeacherCreateEnrollment() {
  const qc = useQueryClient();

  return useMutation<Enrollment, Error, CreateEnrollmentPayload>({
    mutationFn: ({ name, username, password, classroomId }) =>
      getTeacherApiClient()
        .post<Enrollment>(
          `/enrollments/${classroomId}`,
          { name, username, password },
          withAuthConfig(),
        )
        .then((res) => res.data),
    onSuccess: (_newEnrollment, { classroomId }) => {
      // Refresh classroom details (enrollments list)
      invalidateQueryByKey(qc, "enrollments", classroomId);
    },
  });
}
