import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStudentApiClient, withAuthConfig } from "@/lib/api.ts";
import { getQueryDataByKey, queryKeys } from "@/lib/query-keys.ts";
import type {
  CompleteChallengePayload,
  CompleteChallengeResponse,
} from "@/features/dashboard/challenge/types.ts";

/**
 * Hook to complete a dashboard challenge.
 * POST /api/dashboard/assignments/{classroomId}/{courseSlug}/complete
 */
export function useCompleteChallenge(courseSlug?: string) {
  const qc = useQueryClient();
  const user = getQueryDataByKey(qc, "user");
  const classroomId = user?.classroomId;

  return useMutation<
    CompleteChallengeResponse,
    Error,
    CompleteChallengePayload
  >({
    mutationFn: async ({ challengeId, stars, token, timestamp }) => {
      if (!classroomId) {
        return Promise.reject(new Error("No classroom selected"));
      }

      if (!courseSlug) {
        return Promise.reject(new Error("No course selected"));
      }

      const res = await getStudentApiClient().post<CompleteChallengeResponse>(
        `/assignments/${classroomId}/${courseSlug}/complete`,
        { challengeId, stars, token, timestamp },
        withAuthConfig(),
      );
      return res.data;
    },
    onSuccess: () => {
      if (!classroomId || !courseSlug) return;
      qc.invalidateQueries({
        queryKey: queryKeys.challengeScores(classroomId, courseSlug),
      }).catch();
    },
  });
}
