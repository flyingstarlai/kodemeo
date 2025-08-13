import { system, System } from "@lastolivegames/becsy";
import {
  EnemyTag,
  Position,
  SpriteAnimation,
  MarkAsDeletedTag,
} from "../components";
import { renderGroup } from "./system-group.ts";
import { useEnemyStore } from "@/features/dashboard/game/store/use-enemy-store.ts";

@system(renderGroup)
export class MouseRenderSystem extends System {
  private readonly sprites = this.query((q) =>
    q.current
      .without(MarkAsDeletedTag)
      .and.with(EnemyTag, Position, SpriteAnimation),
  );

  execute() {
    const sprites = [];

    for (const entity of this.sprites.current) {
      const pos = entity.read(Position);
      const anim = entity.read(SpriteAnimation);
      sprites.push({
        id: entity.__id,
        x: pos.x,
        y: pos.y,
        animationName: anim.name,
        animationSpeed: anim.frames / 60,
        playing: anim.isPlaying,
      });
    }

    useEnemyStore.getState().setSprites(sprites);
  }
}
