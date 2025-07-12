import { useEffect } from "react";
import { useCurrentLevel } from "@/features/dashboard/game/hooks/use-current-level";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store";

export const CheckLockedChallenge: React.FC = () => {
  const { currentChallenge: challenge } = useCurrentLevel();
  const showDialog = usePopupStore((s) => s.showDialog);

  useEffect(() => {
    if (challenge?.isLocked) {
      showDialog(
        false,
        0,
        "Locked",
        "Selesaikan level sebelumnya dulu ya!",
        true,
      );
    }
  }, [challenge, showDialog]);

  return null;
};
