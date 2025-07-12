import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import { useCurrentLevel } from "@/features/dashboard/game/hooks/use-current-level.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { useEffect, useRef } from "react";
import { useCycleStore } from "@/features/dashboard/game/store/use-cycle-store.ts";
import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import { CheckLockedChallenge } from "@/features/dashboard/game/components/check-locked-challenge.tsx";
import { CheckChallengeToken } from "@/features/dashboard/game/components/check-challenge-token.tsx";

export const LevelLoader: React.FC = () => {
  const { setCurrentLevel } = useLevelStore();
  const { currentChallenge: challenge } = useCurrentLevel();
  const setMaxCoins = useCollectibleStore((s) => s.setMaxCoins);
  const triggerCleanup = useCycleStore((s) => s.triggerCleanup);
  const setWorkspace = useDragDropStore((s) => s.setWorkspaceItems);

  const prevChallengeId = useRef<string | null>(null);

  useEffect(() => {
    if (!challenge) return;

    if (prevChallengeId.current !== challenge.challengeId) {
      setWorkspace([]);
      triggerCleanup(true);
    }

    prevChallengeId.current = challenge.challengeId;

    setCurrentLevel(challenge.levelData);
    setMaxCoins(challenge.levelData.collectible.length);
  }, [challenge, setCurrentLevel, setMaxCoins, triggerCleanup, setWorkspace]);
  return (
    <>
      <CheckLockedChallenge />
      <CheckChallengeToken />
    </>
  );
};
