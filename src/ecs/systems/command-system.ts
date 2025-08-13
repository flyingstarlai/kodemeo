import { System, system, type Entity } from "@lastolivegames/becsy";
import {
  Attacking,
  Bag,
  EnemyTag,
  Facing,
  GridMovement,
  GridPosition,
  LevelProgress,
  ManagerTag,
  MarkAsDeletedTag,
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
import type { IWorkspaceItem } from "@/features/dashboard/command/types.ts";
import type { LevelData } from "@/features/dashboard/challenge/types.ts";
import type { QueuedCommand } from "@/ecs/components/logic/queue.ts";

@system(inputGroup, (s) => s.after(InputSystem))
export class CommandSystem extends System {
  private readonly players = this.query(
    (q) =>
      q.current
        .with(PlayerTag, GridPosition, Bag)
        .and.with(Queue, Facing, SpriteAnimation)
        .write.and.using(GridMovement, Attacking).write,
  );

  private readonly managers = this.query(
    (q) =>
      q.current.with(ManagerTag).and.with(LevelProgress, Score, Transition)
        .write,
  );

  private readonly enemies = this.query((q) =>
    q.current.without(MarkAsDeletedTag).write.and.with(EnemyTag, GridPosition),
  );

  execute(): void {
    const [player] = this.players.current;
    const [manager] = this.managers.current;

    const initialCommands = useDragDropStore.getState().workspaceItems;
    const challenge = useLevelStore.getState().currentLevel;

    if (!player || !manager || !challenge || !initialCommands) return;

    const levelProgress = manager.write(LevelProgress);
    if (levelProgress.isOver) return;

    // Prevent new command if still moving
    if (player.has(GridMovement) || player.has(Attacking)) {
      return;
    }

    const queue = player.write(Queue);

    // If no more commands → finish level
    if (queue.commands.length === 0) {
      this.finishLevel(player, manager, challenge, initialCommands);
      return;
    }

    // Get next command
    const [nextCmd, ...rest] = queue.commands;
    queue.commands = rest;
    useUIStore.getState().setCurrentCommand(nextCmd);

    // Dispatch to command handlers
    if (nextCmd.command === "scratch") {
      this.tryScratch(player);
    } else {
      this.tryMove(player, manager, nextCmd, challenge);
    }
  }

  private tryScratch(player: Entity) {
    console.log("TRY SCRATCH");

    const grid = player.read(GridPosition);
    const neighbors = [
      { col: grid.col + 1, row: grid.row },
      { col: grid.col - 1, row: grid.row },
      { col: grid.col, row: grid.row + 1 },
      { col: grid.col, row: grid.row - 1 },
    ];

    const attacking: Attacking = {
      isAttacking: true,
      targetCol: grid.col,
      targetRow: grid.row,
    };

    for (const n of neighbors) {
      const isObstacle = this.enemies.current.some((e) => {
        const { col, row } = e.read(GridPosition);
        return col === n.col && row === n.row;
      });

      if (isObstacle) {
        attacking.targetCol = n.col;
        attacking.targetRow = n.row;
        break;
      }
    }

    const anim = player.write(SpriteAnimation);
    anim.name = "scratch";
    anim.isLooped = false;
    anim.frames = 8;
    anim.isPlaying = true;
    player.add(Attacking, attacking);
  }

  private tryMove(
    player: Entity,
    manager: Entity,
    queueCommand: QueuedCommand,
    challenge: LevelData,
  ) {
    const { command } = queueCommand;
    console.log("TRY MOVING", command);

    const { col: playerCol, row: playerRow } = player.read(GridPosition);
    const delta = DIRECTION_DELTAS[command];
    const destCol = playerCol + delta[0];
    const destRow = playerRow + delta[1];

    const gridOffset = 2;
    const isOutOfBounds =
      destCol < gridOffset ||
      destCol >= GameConstants.GRID_COLS - gridOffset ||
      destRow < gridOffset ||
      destRow >= GameConstants.GRID_ROWS - gridOffset;

    const isObstacle = this.enemies.current.some((e) => {
      const { col, row } = e.read(GridPosition);
      return col === destCol && row === destRow;
    });

    const isValid =
      challenge.path.some((p) => p.col === destCol && p.row === destRow) ||
      challenge.goal.some((p) => p.col === destCol && p.row === destRow) ||
      challenge.start.some((p) => p.col === destCol && p.row === destRow) ||
      challenge.collectible.some((p) => p.col === destCol && p.row === destRow);

    if (isOutOfBounds || isObstacle || !isValid) {
      this.addMovement(player, {
        progress: 0,
        duration: GameConstants.DURATION * 0.5,
        startCol: playerCol,
        startRow: playerRow,
        destCol: playerCol + delta[0] * 0.5,
        destRow: playerRow + delta[1] * 0.5,
      });
      manager.write(LevelProgress).isOver = true;
      player.remove(Queue);
      return;
    }

    this.addMovement(player, {
      progress: 0,
      duration: GameConstants.DURATION,
      startCol: playerCol,
      startRow: playerRow,
      destCol,
      destRow,
    });

    player.write(Facing).direction = command;

    const anim = player.write(SpriteAnimation);
    anim.name = "walk";
    anim.isLooped = true;
    anim.frames = 8;
    anim.isPlaying = true;
  }

  private addMovement(player: Entity, movementData: Partial<GridMovement>) {
    const movement = new GridMovement();
    Object.assign(movement, movementData);
    player.add(GridMovement, movement);
  }

  private finishLevel(
    player: Entity,
    manager: Entity,
    challenge: LevelData,
    initialCommands: IWorkspaceItem[],
  ) {
    const gridPos = player.read(GridPosition);
    const anim = player.write(SpriteAnimation);
    const levelProgress = manager.write(LevelProgress);

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
      anim.isLooped = true;
      anim.frames = 20;
      playSound("onGoal", { volume: 0.7 });
      useManagerStore.getState().markShouldSubmit(stars);
    } else {
      anim.name = "whacked";
      anim.isLooped = false;
      anim.frames = 20;
      playSound("onFailed", { volume: 0.6 });
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

    anim.isPlaying = true;

    const transition = manager.write(Transition);
    transition.speed = 1;
    transition.alpha = 0;
    transition.target = 0.8;

    player.remove(Queue);
  }
}
