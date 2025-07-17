import { System, system } from "@lastolivegames/becsy";
import {
  Bag,
  Facing,
  GridMovement,
  GridPosition,
  LevelProgress,
  ManagerTag,
  PlayerTag,
  Queue,
  Score,
  SpriteAnimation,
  Transition,
} from "../components";
import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import {
  DIRECTION_DELTAS,
  GameConstants,
} from "@/features/dashboard/game/constans.ts";
import { inputGroup } from "./system-group.ts";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";
import { useManagerStore } from "@/features/dashboard/game/store/use-manager-store.ts";

import { InputSystem } from "./index.ts";
import { playSound } from "@/lib/sounds.ts";
import { computeStars } from "@/lib/score.ts";

@system(inputGroup, (s) => s.after(InputSystem))
export class CommandSystem extends System {
  private readonly players = this.query(
    (q) =>
      q.current
        .with(PlayerTag, GridPosition, Bag)
        .and.with(Queue, Facing, SpriteAnimation, GridMovement).write,
  );
  private readonly managers = this.query(
    (q) =>
      q.current.with(ManagerTag).and.with(LevelProgress, Score, Transition)
        .write,
  );

  execute(): void {
    const [player] = this.players.current;
    const [manager] = this.managers.current;

    const initialCommands = useDragDropStore.getState().workspaceItems;
    const challenge = useLevelStore.getState().currentLevel;

    if (!player || !manager || !challenge || !initialCommands) return;

    const levelProgress = manager.write(LevelProgress);

    if (levelProgress.isOver) return;

    const movement = player.write(GridMovement);
    const gridPos = player.read(GridPosition);
    const anim = player.write(SpriteAnimation);
    if (
      movement.progress < 1 ||
      movement.destCol !== movement.startCol ||
      movement.destRow !== movement.startRow
    ) {
      return;
    }

    const queue = player.write(Queue);

    if (queue.commands.length === 0) {
      const onGoal = challenge.goal.some(
        (p) => p.col === gridPos.col && p.row === gridPos.row,
      );
      const bag = player.read(Bag);
      const collected = bag.coins;
      const totalCoins = challenge.collectible.length;
      const maxStep = challenge.maxStep;
      const commandCount = initialCommands.length;

      const stars = computeStars(
        onGoal,
        collected,
        totalCoins,
        commandCount,
        maxStep,
      );

      manager.write(Score).stars = stars;

      levelProgress.onGoal = onGoal;
      levelProgress.isOver = true;

      useUIStore.getState().setIsLevelFailed(!onGoal);
      useUIStore.getState().setIsPendingCommand(false);

      if (onGoal) {
        anim.name = "idle";
        anim.frames = 20;

        playSound("onGoal", { volume: 0.7 });
      } else {
        anim.name = "whacked";
        anim.frames = 20;
        playSound("onFailed", { volume: 0.6 });
      }

      anim.isPlaying = true;

      const transition = manager.write(Transition);
      transition.speed = 1;
      transition.alpha = 0;
      transition.target = 0.8;

      player.remove(Queue);

      if (onGoal) {
        useManagerStore.getState().markShouldSubmit(stars);
      } else {
        usePopupStore
          .getState()
          .showDialog(
            onGoal,
            stars,
            onGoal ? "Selamat" : "Ooops!",
            onGoal
              ? "Kamu telah berhasil mencapai tujuan"
              : "Kamu belum mencapai tujuan",
          );
      }

      return;
    }

    const [nextCmd, ...rest] = queue.commands;
    useUIStore.getState().setCurrentCommand(nextCmd);
    queue.commands = rest;

    const delta = DIRECTION_DELTAS[nextCmd.command];
    const destCol = gridPos.col + delta[0];
    const destRow = gridPos.row + delta[1];

    // Validate destination
    const gridOffset = 2;
    const isOutOfBounds =
      destCol < gridOffset ||
      destCol >= GameConstants.GRID_COLS - gridOffset ||
      destRow < gridOffset ||
      destRow >= GameConstants.GRID_ROWS - gridOffset;

    const isObstacle = challenge.obstacle.some(
      (p) => p.col === destCol && p.row === destRow,
    );
    const isValid =
      challenge.path.some((p) => p.col === destCol && p.row === destRow) ||
      challenge.goal.some((p) => p.col === destCol && p.row === destRow) ||
      challenge.start.some((p) => p.col === destCol && p.row === destRow) ||
      challenge.collectible.some((p) => p.col === destCol && p.row === destRow);

    if (isOutOfBounds || isObstacle || !isValid) {
      const duration = GameConstants.DURATION * 0.5;
      const destCol = gridPos.col + delta[0] * 0.5;
      const destRow = gridPos.row + delta[1] * 0.5;

      movement.progress = 0;
      movement.duration = duration;
      movement.destCol = destCol;
      movement.destRow = destRow;
      levelProgress.isOver = true;
      player.remove(Queue);

      return;
    }

    movement.progress = 0;
    movement.duration = GameConstants.DURATION;
    movement.startCol = gridPos.col;
    movement.startRow = gridPos.row;
    movement.destCol = destCol;
    movement.destRow = destRow;

    if (nextCmd.command !== "scratch") {
      player.write(Facing).direction = nextCmd.command;
    }

    anim.name = "walk";
    anim.frames = 8;
    anim.isPlaying = true;
  }
}
