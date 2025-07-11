import { useEffect } from "react";
import { useCompleteChallenge } from "@/features/dashboard/challenge/hooks/use-complete-challenge.ts";
import { useChallengeTokenStore } from "@/features/dashboard/game/store/use-challenge-token-store.ts";
import { useManagerStore } from "@/features/dashboard/game/store/use-manager-store.ts";
import { useParams } from "@tanstack/react-router";

export const SubmitChallengeEffect: React.FC = () => {
  const { shouldSubmit, stars, markSubmitted } = useManagerStore();
  const { id, token, timestamp } = useChallengeTokenStore();
  const { course: courseSlug } = useParams({ strict: false });

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
      } catch (err) {
        console.error("❌ Submit challenge failed:", err);
      } finally {
        markSubmitted();
      }
    };

    run();
  }, [shouldSubmit, token, timestamp, mutateAsync, markSubmitted, id, stars]);

  return null;
};
