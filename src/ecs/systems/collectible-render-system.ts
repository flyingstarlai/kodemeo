import { system, System } from "@lastolivegames/becsy";
import {
  CollectibleTag,
  Position,
  SpriteAnimation,
  MarkAsDeletedTag,
} from "../components";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { renderGroup } from "./system-group.ts";

@system(renderGroup)
export class CollectibleRenderSystem extends System {
  private readonly sprites = this.query((q) =>
    q.current
      .without(MarkAsDeletedTag)
      .and.with(CollectibleTag, Position, SpriteAnimation),
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

    useCollectibleStore.getState().setSprites(sprites);
  }
}
