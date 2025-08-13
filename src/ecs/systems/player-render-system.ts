import { system, System } from "@lastolivegames/becsy";
import {
  Position,
  GridMovement,
  SpriteAnimation,
  Facing,
  Rotation,
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
        .with(PlayerTag, Position, Facing, SpriteAnimation)
        .and.using(GridMovement)
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

      if (player.has(GridMovement)) {
        const movement = player.read(GridMovement);

        if (
          movement.destCol !== movement.startCol ||
          movement.destRow !== movement.startRow
        ) {
          const targetRotation = getRotationFromTarget(
            movement.startCol,
            movement.startRow,
            movement.destCol,
            movement.destRow,
          );

          let diff = targetRotation - rotation.angle;
          if (diff > Math.PI) diff -= 2 * Math.PI;
          else if (diff < -Math.PI) diff += 2 * Math.PI;
          const maxDelta = 2 * Math.PI * this.delta;
          nextRotation =
            Math.abs(diff) <= maxDelta
              ? targetRotation
              : rotation.angle + Math.sign(diff) * maxDelta;

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

  private areSpritesEqual(a: SpriteData[], b: SpriteData[]): boolean {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      const s1 = a[i];
      const s2 = b[i];
      if (
        s1.id !== s2.id ||
        s1.x !== s2.x ||
        s1.y !== s2.y ||
        s1.rotation !== s2.rotation ||
        s1.animationName !== s2.animationName ||
        s1.animationSpeed !== s2.animationSpeed ||
        s1.isLooped !== s2.isLooped
      ) {
        return false;
      }
    }
    return true;
  }
}
