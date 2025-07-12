import { useEffect } from "react";
import { useCompleteChallenge } from "@/features/dashboard/challenge/hooks/use-complete-challenge.ts";
import { useChallengeTokenStore } from "@/features/dashboard/game/store/use-challenge-token-store.ts";
import { useManagerStore } from "@/features/dashboard/game/store/use-manager-store.ts";
import { useParams } from "@tanstack/react-router";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store.ts";

export const SubmitChallengeEffect: React.FC = () => {
  const { shouldSubmit, stars, markSubmitted } = useManagerStore();
  const { id, token, timestamp } = useChallengeTokenStore();
  const { course: courseSlug } = useParams({ strict: false });
  const { showDialog } = usePopupStore();
  const { mutateAsync } = useCompleteChallenge(courseSlug);

  useEffect(() => {
    if (!shouldSubmit || !token || !timestamp) return;

    const run = async () => {
      try {
        await mutateAsync({
          challengeId: id!,
          stars,
          token,
          timestamp,
        });
      } catch {
        showDialog(false, 0, "Oops!", "Gagal mengirim nilai.", true);
      } finally {
        markSubmitted();
        showDialog(
          true,
          stars,
          "Selamat",
          "Kamu telah berhasil mencapai tujuan",
        );
      }
    };

    run();
  }, [
    shouldSubmit,
    token,
    timestamp,
    mutateAsync,
    markSubmitted,
    id,
    stars,
    showDialog,
  ]);

  return null;
};
