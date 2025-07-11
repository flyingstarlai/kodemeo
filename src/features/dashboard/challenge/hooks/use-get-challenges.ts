import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudentApiClient, withAuthConfig } from "@/lib/api.ts";
import { queryKeys } from "@/lib/query-keys.ts";
import { getQueryDataByKey } from "@/lib/query-keys.ts";
import type { ChallengeResponse } from "@/features/dashboard/challenge/types.ts";

/**
 * Represents a single challenge entry for a dashboard within an assigned course.
 */

/**
 * Hook to fetch all challenges and their statuses for the current dashboard in a given assigned course.
 * GET /api/dashboard/assignments/{classroomId}/{assignedCourseId}
 */
export function useGetChallenges(courseSlug?: string) {
  const qc = useQueryClient();
  const user = getQueryDataByKey(qc, "user");
  const classroomId = user?.classroomId;

  return useQuery<ChallengeResponse[], Error>({
    queryKey: queryKeys.challengeScores(classroomId ?? "", courseSlug ?? ""),
    queryFn: async () => {
      if (!classroomId) {
        return Promise.reject(new Error("No classroom selected"));
      }

      if (!courseSlug) {
        return Promise.reject(new Error("No course selected"));
      }
      const res = await getStudentApiClient().get<ChallengeResponse[]>(
        `/assignments/${classroomId}/${courseSlug}`,
        withAuthConfig(),
      );
      return res.data;
    },
    enabled: Boolean(classroomId && courseSlug),
    staleTime: 0,
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
