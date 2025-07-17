import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import { useCurrentLevel } from "@/features/dashboard/game/hooks/use-current-level.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { useEffect, useRef } from "react";
import { useCycleStore } from "@/features/dashboard/game/store/use-cycle-store.ts";
import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import { CheckLockedChallenge } from "@/features/dashboard/game/components/check-locked-challenge.tsx";
import { CheckChallengeToken } from "@/features/dashboard/game/components/check-challenge-token.tsx";
import {
  extractLevelDataFromMap,
  type GroupLayer,
  type TiledMap,
} from "@/lib/tilemap.ts";
import { useAssets } from "@/providers/asset-context.ts";
import { useNavigate } from "@tanstack/react-router";

export const LevelLoader: React.FC = () => {
  const { sequence } = useAssets();
  const { setCurrentLevel } = useLevelStore();
  const navigate = useNavigate({ from: "/courses/$course/playground" });
  const { currentChallenge: challenge } = useCurrentLevel();
  const setMaxCoins = useCollectibleStore((s) => s.setMaxCoins);
  const triggerCleanup = useCycleStore((s) => s.triggerCleanup);
  const setWorkspace = useDragDropStore((s) => s.setWorkspaceItems);

  const prevChallengeId = useRef<string | null>(null);

  useEffect(() => {
    if (!challenge) {
      navigate({ to: "/courses" });
      return;
    }

    if (prevChallengeId.current !== challenge.id) {
      setWorkspace([]);
      triggerCleanup(true);
    }

    prevChallengeId.current = challenge.id;

    const levelName = `level_${challenge.level}`;
    const map = sequence.levels as unknown as TiledMap;
    const levelGroup = map.layers.find(
      (l): l is GroupLayer => l.type === "group" && l.name === levelName,
    );

    if (!levelGroup) return;
    const levelData = extractLevelDataFromMap(levelGroup);

    setCurrentLevel(levelData);
    setMaxCoins(levelData.collectible.length);
  }, [
    challenge,
    setCurrentLevel,
    setMaxCoins,
    triggerCleanup,
    setWorkspace,
    sequence.levels,
  ]);
  return (
    <>
      <CheckLockedChallenge />
      <CheckChallengeToken />
    </>
  );
};
