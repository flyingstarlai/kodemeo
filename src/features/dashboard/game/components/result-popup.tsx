import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import starFull from "@/assets/game/star_full.png";
import starEmpty from "@/assets/game/star_empty.png";
import { Button } from "@/components/ui/button.tsx";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store.ts";
import { useCycleStore } from "@/features/dashboard/game/store/use-cycle-store.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";
import { useCurrentLevel } from "@/features/dashboard/game/hooks/use-current-level.ts";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useBeginChallenge } from "@/features/dashboard/challenge/hooks/use-begin-challenge.ts";
import { IconLoader } from "@tabler/icons-react";
import { useChallengeTokenStore } from "@/features/dashboard/game/store/use-challenge-token-store.ts";

export const ResultPopup = () => {
  const navigate = useNavigate({ from: "/courses/$course/playground" });
  const { course: courseSlug } = useParams({ strict: false });
  const {
    open,
    onGoal,
    earnedStars,
    title,
    message,
    hideStar,
    closeDialog,
    showDialog,
  } = usePopupStore();

  const { mutateAsync: beginNextChallenge, isPending: beginPending } =
    useBeginChallenge(courseSlug);

  const { nextChallengeId, currentChallenge } = useCurrentLevel();
  const { id, token, timestamp } = useChallengeTokenStore();

  const isPending = beginPending;

  const handleRestart = () => {
    closeDialog();
    useCollectibleStore.getState().setCoins(0);
    useUIStore.getState().resetUIState();
    useCycleStore.getState().triggerCleanup(true);
  };

  const handleContinue = async () => {
    if (!nextChallengeId || !id || !token || !timestamp) return;

    try {
      const beginRes = await beginNextChallenge({
        challengeId: nextChallengeId,
      });

      if (!beginRes.token) {
        closeDialog();
        showDialog(false, 0, "Oops!", "Gagal memulai level baru.", true);
        return;
      }

      closeDialog();

      useCollectibleStore.getState().setCoins(0);
      useUIStore.getState().resetUIState();
      await navigate({
        to: "/courses/$course/playground",
        search: {
          level: nextChallengeId,
        },
      });
    } catch {
      showDialog(false, 0, "Oops!", "Terjadi kesalahan pada server.", true);
    }
  };

  const handleRedirect = async () => {
    if (!currentChallenge || !courseSlug) return;

    closeDialog();

    const challengePerPage = 6;
    const page = Math.ceil(currentChallenge.level / challengePerPage);
    await navigate({
      to: "/courses/$course",
      params: { course: courseSlug },
      search: { page },
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-sm mx-auto dark:bg-zinc-500"
        style={{ fontFamily: "'Fredoka One', system-ui, sans-serif" }}
      >
        <DialogHeader className="flex flex-col items-center space-y-2">
          <DialogTitle>{title}</DialogTitle>
          {!hideStar && (
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <img
                  key={i}
                  src={i < earnedStars ? starFull : starEmpty}
                  alt={i < earnedStars ? "star" : "empty star"}
                  className="w-12 h-12"
                />
              ))}
            </div>
          )}
          <DialogDescription className="text-center text-sm text-muted-foreground">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <div className="flex w-full justify-center gap-x-8 mt-4">
            {hideStar ? (
              <Button variant="outline" onClick={handleRedirect}>
                Kembali ke Menu
              </Button>
            ) : (
              <Button variant="outline" onClick={handleRestart}>
                Coba Lagi
              </Button>
            )}

            {onGoal && (
              <Button
                variant="default"
                onClick={handleContinue}
                disabled={isPending || !currentChallenge || !courseSlug}
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <IconLoader className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  "Lanjutkan"
                )}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
