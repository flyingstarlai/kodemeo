import { useMemo } from "react";
import { useGetChallenges } from "@/features/dashboard/challenge/hooks/use-get-challenges.ts";
import { useSearch } from "@tanstack/react-router";

export const useCurrentLevel = () => {
  const { data: challenges } = useGetChallenges("sequence");
  const { level: challengeId } = useSearch({ strict: false });

  return useMemo(() => {
    if (!challenges || !challengeId)
      return { currentChallenge: undefined, nextChallengeId: undefined };

    const index = challenges.findIndex((c) => c.id === challengeId);
    const currentChallenge = challenges[index];
    const nextChallengeId = challenges[index + 1]?.id;

    return { currentChallenge, nextChallengeId };
  }, [challenges, challengeId]);
};
