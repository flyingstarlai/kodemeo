import { type Texture } from "pixi.js";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";

import { useAssets } from "@/providers/asset-context.ts";
import type { TiledMap } from "@/features/student/game/types.ts";
import { useStudentsGetChallenges } from "@/features/student/challenge/hooks/use-student-get-challenges.ts";
import { useStudentBeginChallenge } from "@/features/student/challenge/hooks/use-student-begin-challenge.ts";
import { HoverableFlag } from "@/features/student/challenge/components/hoverable-flag.tsx";

export const ChallengeProgressRenderSystem: React.FC = () => {
  const { sequence, stars: starTexs, audio } = useAssets();
  const { course: courseSlug } = useParams({ strict: false });
  const { page } = useSearch({ strict: false });

  const rawMap = sequence.mapSeq as unknown as TiledMap;
  const flagTex = sequence.mapFlag;
  const navigate = useNavigate({ from: "/courses/$course" });

  const { data: challenges } = useStudentsGetChallenges(courseSlug);

  const beginMutation = useStudentBeginChallenge(courseSlug);

  if (!challenges || challenges.length === 0) {
    return;
  }

  // pick which marker layer to render
  const markerKey = [1, 2, 3].includes(page ?? 1)
    ? `marker_${page}`
    : "marker_1";
  const markerLayer = rawMap.layers.find(
    (l) => l.type === "objectgroup" && l.name === markerKey,
  );
  if (!markerLayer) return null;

  const handleStart = (challengeId: string, isLocked: boolean) => {
    if (isLocked) return;
    beginMutation.mutate(
      { challengeId },
      {
        onSuccess: async () => {
          await navigate({
            to: `/courses/$course/play`,
            params: { course: courseSlug! },
            search: { level: challengeId },
          });
        },
      },
    );
  };

  return (
    <>
      {markerLayer.objects.map((obj) => {
        const label = obj.name.split("_")[1];

        // find the persisted progress for that level

        const challenge = challenges.find(
          (ch) => obj.name === `level_${ch.level}`,
        );

        if (!challenge) return null;

        const { challengeId, stars, isLocked } = challenge;

        // choose a star texture only if unlocked
        let starTex: Texture | null = null;
        if (!isLocked) {
          if (stars === 1) starTex = starTexs.star1of3;
          else if (stars === 2) starTex = starTexs.star2of3;
          else if (stars === 3) starTex = starTexs.star3of3;
          else starTex = starTexs.star0of3;
        }

        return (
          <HoverableFlag
            key={obj.id}
            label={label}
            x={Math.round(obj.x)}
            y={Math.round(obj.y)}
            texture={flagTex}
            starTex={starTex}
            disable={isLocked}
            onClick={async () => {
              if (isLocked) return;
              audio.onSelect.play();
              handleStart(challengeId, isLocked);
            }}
          />
        );
      })}
    </>
  );
};
