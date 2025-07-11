import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import { useCurrentLevel } from "@/features/dashboard/game/hooks/use-current-level.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { useEffect, useRef } from "react";
import { useCycleStore } from "@/features/dashboard/game/store/use-cycle-store.ts";
import { useChallengeTokenStore } from "@/features/dashboard/game/store/use-challenge-token-store.ts";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store.ts";

export const LevelLoader: React.FC = () => {
  const { id, token } = useChallengeTokenStore();
  const { setCurrentLevel } = useLevelStore();
  const showDialog = usePopupStore((s) => s.showDialog);
  const { currentChallenge: challenge } = useCurrentLevel();
  const setMaxCoins = useCollectibleStore((s) => s.setMaxCoins);
  const triggerCleanup = useCycleStore((s) => s.triggerCleanup);

  const prevChallengeId = useRef<string | null>(null);

  useEffect(() => {
    if (!challenge) return;

    if (
      prevChallengeId.current &&
      challenge.challengeId !== prevChallengeId.current
    ) {
      console.log("Level changed: triggering cleanup");
      triggerCleanup(true);
    }

    prevChallengeId.current = challenge.challengeId;

    // Challenge is locked
    if (challenge.isLocked) {
      showDialog(
        false,
        0,
        "Locked",
        "Selesaikan level sebelumnya dulu ya!",
        true,
      );
      return;
    }

    // Invalid token or challenge mismatch
    if (!token) {
      console.log(challenge.challengeId, id);
      showDialog(false, 0, "Oops!", "Terjadi kesalahan pada level", true);
      return;
    }

    // if valid: load level
    setCurrentLevel(challenge.levelData);
    setMaxCoins(challenge.levelData.collectible.length);

    prevChallengeId.current = challenge.challengeId;
  }, [
    challenge,
    id,
    token,
    setCurrentLevel,
    setMaxCoins,
    showDialog,
    triggerCleanup,
  ]);
  return null;
};
