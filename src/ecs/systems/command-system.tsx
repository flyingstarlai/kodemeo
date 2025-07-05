import { useTick } from "@pixi/react";
import { useAssets } from "@/providers/asset-context.ts";
import { useEntityQuery } from "@/features/student/game/hooks/use-entity-query";
import { useMovementStore } from "@/stores/use-movement-store";
import { useEcsStore } from "@/stores/use-ecs-store";
import { useDragDropStore } from "@/stores/use-drag-drop-store";
import { computeStars } from "@/features/student/game/utils/score-utils.ts";
import {
  DIRECTION_DELTAS,
  GameConstants,
} from "@/features/student/game/constans.ts";
import { useCompleteLevel } from "@/features/student/game/hooks/use-complete-level.ts";
import { useDialogStore } from "@/stores/use-dialog-store.ts";

export const CommandSystem: React.FC = () => {
  const { audio } = useAssets();

  const { openDialog } = useDialogStore();

  const [pid] = useEntityQuery(["playerTag"]);
  const [managerEid] = useEntityQuery(["session"]);
  const mover = useMovementStore.getState();
  const ecs = useEcsStore.getState();
  const levelData = ecs.levelData;
  const initialCommands = useDragDropStore((s) => s.workspaceItems);
  const { completeAndAdvance } = useCompleteLevel();

  useTick(() => {
    const progressFacet = ecs.getComponent(managerEid, "progress");
    if (progressFacet?.isOver) {
      return;
    }

    const gridPos = ecs.getComponent(pid, "gridPosition");
    const queue = ecs.getComponent(pid, "queue");
    const gridMoving = ecs.getComponent(pid, "gridMovement");
    const moving = mover.getComponent(pid, "movement");

    if (!queue || !gridPos || !gridMoving || !moving || !progressFacet) return;

    if (
      moving.progress < 1 ||
      gridMoving.destCol !== gridMoving.startCol ||
      gridMoving.destRow !== gridMoving.startRow
    ) {
      return;
    }

    const { commands } = queue;

    // ── END OF SEQUENCE?
    if (commands.length === 0) {
      const onGoal = levelData.goal.some(
        (p) => p.col === gridPos.col && p.row === gridPos.row,
      );

      const bag = ecs.getComponent(pid, "bag") || { coins: 0 };
      const collected = bag.coins;
      const totalCoins = levelData.collectible.length;
      const commandCount = initialCommands.length;
      const maxStep = levelData.maxStep;

      const stars = computeStars(
        onGoal,
        collected,
        totalCoins,
        commandCount,
        maxStep,
      );

      ecs.addComponent(managerEid, "score", { stars });

      completeAndAdvance(stars).catch(console.error);

      if (onGoal) {
        audio.onGoal.play();

        ecs.addComponent(managerEid, "progress", {
          isOver: true,
          onGoal: true,
        });
      } else {
        audio.onFailed.play({ volume: 0.7 });
        ecs.addComponent(managerEid, "progress", {
          isOver: true,
        });
        ecs.addComponent(pid, "spriteAnimation", {
          name: "whacked",
          fps: 20,
          isPlaying: false,
        });

        openDialog({
          title: "Challenge Failed",
          message: "Try again and improve your strategy!",
          showStar: false,
        });
      }

      ecs.removeComponent(pid, "queue");

      return;
    }

    //  PULL NEXT COMMAND
    const [nextCmd, ...remaining] = commands;
    const [dx, dy] = DIRECTION_DELTAS[nextCmd.command] ?? [0, 0];
    const startCol = gridPos.col,
      startRow = gridPos.row;
    const rawCol = startCol + dx;
    const rawRow = startRow + dy;

    // OUT-OF-BOUNDS pre-check
    const isOOB =
      rawCol < 0 ||
      rawCol >= GameConstants.GRID_COLS ||
      rawRow < 0 ||
      rawRow >= GameConstants.GRID_ROWS;

    // pre-check: is that target an obstacle or off-path?
    const isObstacle = levelData.obstacle.some(
      (p) => p.col === rawCol && p.row === rawRow,
    );
    const isValidPath =
      levelData.path.some((p) => p.col === rawCol && p.row === rawRow) ||
      levelData.start.some((p) => p.col === rawCol && p.row === rawRow) ||
      levelData.collectible.some((p) => p.col === rawCol && p.row === rawRow) ||
      levelData.goal.some((p) => p.col === rawCol && p.row === rawRow);

    ecs.setCurrentCommand(nextCmd);
    ecs.addComponent(pid, "queue", { commands: remaining });

    if (isOOB || isObstacle || !isValidPath) {
      mover.addComponent(pid, "movement", {
        progress: 0,
        duration: GameConstants.DURATION * 0.5,
      });
      ecs.addComponent(pid, "gridMovement", {
        startCol,
        startRow,
        destCol: startCol + dx * 0.5,
        destRow: startRow + dy * 0.5,
      });
      ecs.addComponent(managerEid, "progress", { isOver: true });
      ecs.removeComponent(pid, "queue");

      setTimeout(() => {
        openDialog({
          title: "Challenge Failed",
          message: "Try again and improve your strategy!",
          showStar: false,
        });
      }, 1000);

      return;
    }

    const destCol = Math.max(0, Math.min(rawCol, GameConstants.GRID_COLS - 1));
    const destRow = Math.max(0, Math.min(rawRow, GameConstants.GRID_ROWS - 1));

    mover.addComponent(pid, "movement", {
      progress: 0,
      duration: GameConstants.DURATION,
    });
    ecs.addComponent(pid, "gridMovement", {
      startCol,
      startRow,
      destCol,
      destRow,
    });

    if (nextCmd.command !== "scratch") {
      ecs.addComponent(pid, "facing", { direction: nextCmd.command });
    }

    ecs.addComponent(pid, "spriteAnimation", {
      name: "walk",
      fps: 8,
      isPlaying: true,
    });
  });

  return null;
};
