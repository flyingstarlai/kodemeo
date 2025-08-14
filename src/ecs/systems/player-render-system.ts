import { system, System } from "@lastolivegames/becsy";
import {
  Position,
  GridMovement,
  SpriteAnimation,
  Facing,
  Rotation,
  Attacking,
  GridPosition,
} from "../components";
import { PlayerTag } from "@/ecs/components";
import {
  type SpriteData,
  usePlayerSpriteStore,
} from "@/features/dashboard/game/store/use-player-sprite-store.ts";
import { renderGroup } from "./system-group.ts";
import { getRotationFromTarget } from "@/lib/rotation.ts";

@system(renderGroup)
export class PlayerRenderSystem extends System {
  private readonly players = this.query(
    (q) =>
      q.current
        .with(PlayerTag, GridPosition, Position, Facing, SpriteAnimation)
        .and.using(GridMovement, Attacking)
        .read.and.with(Rotation).write,
  );

  private prevSprites: SpriteData[] = [];

  execute(): void {
    const sprites: SpriteData[] = [];

    for (const player of this.players.current) {
      const pos = player.read(Position);
      const anim = player.read(SpriteAnimation);
      const rotation = player.write(Rotation);

      let nextRotation = rotation.angle;

      // Rotate towards movement target
      if (player.has(GridMovement)) {
        const { startCol, startRow, destCol, destRow } =
          player.read(GridMovement);
        if (destCol !== startCol || destRow !== startRow) {
          nextRotation = this.rotateTowards(
            rotation.angle,
            getRotationFromTarget(startCol, startRow, destCol, destRow),
          );
          rotation.angle = nextRotation;
        }
      }

      // Rotate towards attack target
      if (player.has(Attacking)) {
        const grid = player.read(GridPosition);
        const { targetCol, targetRow, hasTarget } = player.read(Attacking);

        if (hasTarget) {
          nextRotation = this.rotateTowards(
            rotation.angle,
            getRotationFromTarget(grid.col, grid.row, targetCol, targetRow),
          );
          rotation.angle = nextRotation;
        }
      }

      sprites.push({
        id: player.__id,
        x: pos.x,
        y: pos.y,
        rotation: nextRotation,
        animationName: anim.name,
        animationSpeed: anim.frames / 60,
        isLooped: anim.isLooped,
      });
    }

    if (!this.areSpritesEqual(this.prevSprites, sprites)) {
      this.prevSprites = sprites;
      usePlayerSpriteStore.getState().setSprites(sprites);
    }
  }

  /**
   * Smoothly rotate from currentAngle towards targetAngle
   */
  private rotateTowards(currentAngle: number, targetAngle: number): number {
    let diff = targetAngle - currentAngle;
    if (diff > Math.PI) diff -= 2 * Math.PI;
    else if (diff < -Math.PI) diff += 2 * Math.PI;

    const maxDelta = 2 * Math.PI * this.delta;
    return Math.abs(diff) <= maxDelta
      ? targetAngle
      : currentAngle + Math.sign(diff) * maxDelta;
  }

  /**
   * Compare two sprite arrays for equality
   */
  private areSpritesEqual(a: SpriteData[], b: SpriteData[]): boolean {
    return (
      a.length === b.length &&
      a.every((s1, i) => {
        const s2 = b[i];
        return (
          s1.id === s2.id &&
          s1.x === s2.x &&
          s1.y === s2.y &&
          s1.rotation === s2.rotation &&
          s1.animationName === s2.animationName &&
          s1.animationSpeed === s2.animationSpeed &&
          s1.isLooped === s2.isLooped
        );
      })
    );
  }
}
