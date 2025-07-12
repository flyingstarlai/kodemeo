import { useEffect } from "react";
import { useChallengeTokenStore } from "@/features/dashboard/game/store/use-challenge-token-store";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store";
import { useCurrentLevel } from "@/features/dashboard/game/hooks/use-current-level";

export const CheckChallengeToken: React.FC = () => {
  const { token, id } = useChallengeTokenStore();
  const showDialog = usePopupStore((s) => s.showDialog);
  const { currentChallenge: challenge } = useCurrentLevel();

  useEffect(() => {
    if (!token) {
      showDialog(false, 0, "Oops!", "Terjadi kesalahan pada level", true);
    }
  }, [challenge, token, id, showDialog]);

  return null;
};
