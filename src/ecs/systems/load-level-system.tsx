import { useEffect, useMemo } from "react";
import { useSearch } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { useApplication } from "@pixi/react";

import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { useStudentsGetChallenges } from "@/features/student/challenge/hooks/use-student-get-challenges.ts";
import type { StudentChallengeResponse } from "@/features/teacher/assignment/types.ts";

export const LoadLevelSystem: React.FC = () => {
  const pixi = useApplication();
  const { level } = useSearch({ strict: false }); // e.g. "?level=2Eo-J5C71ngUck9cjz2yC"
  const { course: courseSlug } = useParams({ strict: false });

  const { level: challengeId } = useSearch({ strict: false });

  const { data: challenges } = useStudentsGetChallenges(courseSlug);

  const challenge = useMemo<StudentChallengeResponse | undefined>(
    () => challenges?.find((c) => c.challengeId === challengeId),
    [challenges, challengeId],
  );

  const setLevel = useEcsStore((s) => s.setLevelData);
  const resetNextId = useEcsStore((s) => s.resetNextId);

  useEffect(() => {
    if (!pixi || !challenge) return;

    setLevel({ ...challenge.levelData });
  }, [pixi, level, challenge, resetNextId, setLevel]);

  return null;
};
