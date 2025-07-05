import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getQueryDataByKey, queryKeys } from "@/lib/query-keys.ts";
import { getStudentApiClient, withAuthConfig } from "@/lib/api.ts";
import type {
  BeginPayload,
  BeginResponse,
} from "@/features/teacher/assignment/types.ts";

/**
 * Hook to begin a challenge: retrieves an HMAC token and timestamp.
 * POST /api/student/assignments/{classroomId}/{assignedCourseId}/begin
 */
export function useStudentBeginChallenge(courseSlug?: string) {
  const qc = useQueryClient();
  const user = getQueryDataByKey(qc, "user");
  const classroomId = user?.classroomId;

  return useMutation<BeginResponse, Error, BeginPayload>({
    // Start a challenge and retrieve HMAC token + timestamp
    mutationFn: async ({ challengeId }) => {
      if (!classroomId)
        return Promise.reject(new Error("No classroom selected"));

      if (!courseSlug) {
        return Promise.reject(new Error("No course selected"));
      }
      const res = await getStudentApiClient().post<BeginResponse>(
        `/assignments/${classroomId}/${courseSlug}/begin`,
        { challengeId },
        withAuthConfig(),
      );
      return res.data;
    },
    onSuccess: (data, { challengeId }) => {
      if (!classroomId || !courseSlug) return;
      qc.setQueryData(
        queryKeys.studentChallengeBegin(classroomId, courseSlug, challengeId),
        data,
      );
    },
  });
}
