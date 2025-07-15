import { system, System } from "@lastolivegames/becsy";
import {
  Position,
  LevelProgress,
  Score,
  ManagerTag,
  PlayerTag,
  SpriteAnimation,
  GridMovement,
  GridPosition,
  Queue,
  Transition,
} from "@/ecs/components";
import { logicGroup } from "./system-group.ts";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";
import { isSoundPlaying, playSound, stopSound } from "@/lib/sounds.ts";
import { getCenteredTilePosition } from "@/lib/tiles.ts";

@system(logicGroup)
export class MovementSystem extends System {
  private readonly players = this.query(
    (q) =>
      q.current
        .with(PlayerTag, Position, GridMovement, SpriteAnimation, GridPosition)
        .write.and.using(Queue).write,
  );

  private readonly managers = this.query(
    (q) => q.current.with(ManagerTag, LevelProgress, Score, Transition).write,
  );
  execute(): void {
    const [player] = this.players.current;
    const [manager] = this.managers.current;

    if (!player || !manager) return;

    const gridMovement = player.write(GridMovement);

    if (
      gridMovement.startCol === gridMovement.destCol &&
      gridMovement.startRow === gridMovement.destRow &&
      gridMovement.progress >= 1
    ) {
      if (isSoundPlaying("onMoving")) {
        stopSound("onMoving");
      }

      return;
    }

    if (!isSoundPlaying("onMoving")) {
      playSound("onMoving", { loop: true, volume: 0.8, rate: 0.5 });
    }

    let newProgress =
      gridMovement.progress + this.delta / gridMovement.duration;
    if (newProgress > 1) newProgress = 1;

    gridMovement.progress = newProgress;

    // Interpolate position
    const startPos = getCenteredTilePosition(
      gridMovement.startCol,
      gridMovement.startRow,
    );
    const endPos = getCenteredTilePosition(
      gridMovement.destCol,
      gridMovement.destRow,
    );

    const pos = player.write(Position);
    pos.x = startPos.x + (endPos.x - startPos.x) * newProgress;
    pos.y = startPos.y + (endPos.y - startPos.y) * newProgress;

    if (newProgress === 1) {
      stopSound("onMoving");

      const gridPos = player.write(GridPosition);
      gridPos.col = gridMovement.destCol;
      gridPos.row = gridMovement.destRow;

      // Snap movement state
      gridMovement.startCol = gridMovement.destCol;
      gridMovement.startRow = gridMovement.destRow;

      // const queue = player.read(Queue);
      const levelProgress = manager.write(LevelProgress);

      if (levelProgress.isOver) {
        playSound("onFailed", { volume: 0.5 });

        manager.write(Score).stars = 0;
        const anim = player.write(SpriteAnimation);
        anim.name = "whacked";
        anim.frames = 20;
        anim.isPlaying = true;

        const transition = manager.write(Transition);
        transition.speed = 1;
        transition.alpha = 0;
        transition.target = 0.8;

        usePopupStore
          .getState()
          .showDialog(false, 0, "Oops!", "Kamu belum mencapai tujuan y");
        useUIStore.getState().setIsLevelFailed(true);
        useUIStore.getState().setIsPendingCommand(false);
      }
    }
  }
}
