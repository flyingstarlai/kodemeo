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

export const ResultPopup = () => {
  const navigate = useNavigate({ from: "/courses/$course/playground" });
  const { course: courseSlug } = useParams({ strict: false });
  const { open, onGoal, earnedStars, title, message, hideStar, closeDialog } =
    usePopupStore();
  const beginMutation = useBeginChallenge(courseSlug);
  const { setCoins } = useCollectibleStore();
  const resetUIState = useUIStore((s) => s.resetUIState);
  const triggerCleanup = useCycleStore((s) => s.triggerCleanup);
  const { nextChallengeId, currentChallenge } = useCurrentLevel();

  const handleRestart = () => {
    closeDialog();
    // restart logic
    setCoins(0);
    resetUIState();
    triggerCleanup(true);
  };

  const handleContinue = async () => {
    if (!nextChallengeId) return;

    beginMutation.mutate(
      { challengeId: nextChallengeId },
      {
        onSuccess: async () => {
          closeDialog();

          setCoins(0);
          resetUIState();
          await navigate({
            to: "/courses/$course/playground",
            search: {
              level: nextChallengeId,
            },
          });
        },
        onError: (err: unknown) => {
          console.error("❌ Gagal lanjut ke tantangan berikutnya:", err);
          usePopupStore
            .getState()
            .showDialog(
              false,
              0,
              "Oops!",
              "Tidak bisa lanjut ke level berikutnya. Coba lagi ya.",
              true,
            );
        },
      },
    );
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
                disabled={beginMutation.isPending}
              >
                {beginMutation.isPending ? (
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
