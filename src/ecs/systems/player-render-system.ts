import { system, System } from "@lastolivegames/becsy";
import {
  Position,
  GridMovement,
  SpriteAnimation,
  Facing,
  Rotation,
} from "../components";

import { PlayerTag } from "@/ecs/components";
import { usePlayerStore } from "@/features/dashboard/game/store/use-player-store.ts";
import { renderGroup } from "./system-group.ts";
import { getRotationFromTarget } from "@/lib/rotation.ts";

@system(renderGroup)
export class PlayerRenderSystem extends System {
  private readonly players = this.query(
    (q) =>
      q.current
        .with(PlayerTag, Position, Facing, SpriteAnimation, GridMovement)
        .and.with(Rotation).write,
  );

  execute(): void {
    const sprites = [];

    for (const player of this.players.current) {
      const pos = player.read(Position);
      const anim = player.read(SpriteAnimation);

      const grid = player.read(GridMovement);

      const rotation = player.write(Rotation);

      let nextRotation = rotation.angle;

      if (grid.destCol !== grid.startCol || grid.destRow !== grid.startRow) {
        const targetRotation = getRotationFromTarget(
          grid.startCol,
          grid.startRow,
          grid.destCol,
          grid.destRow,
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

      sprites.push({
        id: player.__id,
        x: pos.x,
        y: pos.y,
        rotation: nextRotation,
        animationName: anim.name,
        animationSpeed: anim.frames / 60,
        playing: anim.isPlaying,
      });
    }

    usePlayerStore.getState().setSprites(sprites);
  }
}
