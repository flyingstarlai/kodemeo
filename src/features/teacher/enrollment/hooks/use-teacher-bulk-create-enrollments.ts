import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Enrollment } from "@/features/teacher/enrollment/types.ts";
import { getTeacherApiClient, withAuthConfig } from "@/lib/api.ts";
import { invalidateQueryByKey } from "@/lib/query-keys.ts";

export function useTeacherBulkCreateEnrollments() {
  const qc = useQueryClient();

  return useMutation<Enrollment[], Error, { file: File; classroomId: string }>({
    mutationFn: async ({ file, classroomId }) => {
      const formData = new FormData();
      formData.append("file", file);

      const config = {
        headers: {
          ...withAuthConfig().headers,
          "Content-Type": "multipart/form-data",
        },
      };
      console.log("Config", config);

      const res = await getTeacherApiClient().post<Enrollment[]>(
        `/enrollments/${classroomId}/import`,
        formData,
        config,
      );
      return res.data;
    },
    onSuccess: (_enrollments, { classroomId }) => {
      // Refresh classroom details
      invalidateQueryByKey(qc, "enrollments", classroomId);
    },
  });
}
