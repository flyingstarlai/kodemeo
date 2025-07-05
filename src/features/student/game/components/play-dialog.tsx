import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import starFull from "@/assets/game/star_full.png";
import starEmpty from "@/assets/game/star_empty.png";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import { useEntityQuery } from "../hooks/use-entity-query";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { resetPlayerToStart } from "@/features/student/game/utils/reset-player-utils.ts";
import { useDialogStore } from "@/stores/use-dialog-store.ts";
import { useStudentsGetChallenges } from "@/features/student/challenge/hooks/use-student-get-challenges.ts";
import { useStudentBeginChallenge } from "@/features/student/challenge/hooks/use-student-begin-challenge.ts";

export const PlayDialog: React.FC = () => {
  const { course: courseSlug } = useParams({
    strict: false,
  });
  const { level: challengeId } = useSearch({ strict: false });
  const beginMutation = useStudentBeginChallenge(courseSlug ?? "");

  const { open, title, message, showStar, closeDialog } = useDialogStore();

  const navigate = useNavigate({ from: "/courses/$course/play" });
  const { setWorkspaceItems } = useDragDropStore();

  const [playerEid] = useEntityQuery(["playerTag"]);
  const [managerEid] = useEntityQuery(["session"]);
  const level = useEcsStore((s) => s.levelData);

  const { data: challenges } = useStudentsGetChallenges(courseSlug);

  const progressFacet = useEcsStore((s) =>
    managerEid !== undefined
      ? s.getComponent(managerEid, "progress")
      : undefined,
  );

  const scoreFacet = useEcsStore((s) =>
    managerEid != null ? s.getComponent(managerEid, "score") : undefined,
  );

  const earnedStars = scoreFacet?.stars ?? 0;

  const handleContinue = async () => {
    // find next challenge
    const idx = challenges!.findIndex((c) => c.challengeId === challengeId);
    const next = challenges![idx + 1];

    if (next) {
      await beginMutation.mutateAsync({
        challengeId: next.challengeId,
      });
      await navigate({
        to: "/courses/$course/play",
        params: { course: courseSlug! },
        search: {
          level: next.challengeId,
        },
      });
      setWorkspaceItems([]);

      closeDialog();
    }
  };

  const handleRestart = async () => {
    closeDialog();

    if (playerEid !== undefined) {
      resetPlayerToStart(playerEid, managerEid, level);
      await beginMutation.mutateAsync({
        challengeId: challengeId!,
      });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-sm mx-auto dark:bg-zinc-500"
        style={{ fontFamily: "'Fredoka One', system-ui, sans-serif" }}
      >
        <DialogHeader className="flex flex-col items-center space-y-2">
          <DialogTitle>{title}</DialogTitle>
          {showStar && (
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
            <Button variant="outline" onClick={handleRestart}>
              Restart
            </Button>
            {progressFacet?.onGoal && (
              <Button variant="default" onClick={handleContinue}>
                Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
