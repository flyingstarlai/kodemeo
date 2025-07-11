import { system, System } from "@lastolivegames/becsy";
import { Elapsed, GoalTag, Position } from "../components";
import { useTreasureStore } from "@/features/dashboard/game/store/use-treasure-store.ts";
import { renderGroup } from "./system-group.ts";

const WIGGLE_DURATION = 0.5;
const PAUSE_DURATION = 1.5;
const CYCLE_LENGTH = WIGGLE_DURATION + PAUSE_DURATION;
const FREQUENCY = 4; // wiggles/sec
const AMPLITUDE = 5 * (Math.PI / 180); // ±5°

@system(renderGroup)
export class TreasureRenderSystem extends System {
  private readonly entities = this.query(
    (q) => q.current.with(GoalTag, Position, Elapsed).write,
  );

  execute() {
    const sprites = [];

    for (const entity of this.entities.current) {
      const pos = entity.read(Position);
      const time = entity.write(Elapsed);

      time.value += this.delta;

      const t = time.value % CYCLE_LENGTH;
      const phase = (t / WIGGLE_DURATION) * FREQUENCY * 2 * Math.PI;

      const rotation = t < WIGGLE_DURATION ? Math.sin(phase) * AMPLITUDE : 0;

      sprites.push({
        id: entity.__id,
        x: pos.x,
        y: pos.y,
        rotation,
      });
    }

    useTreasureStore.getState().setSprites(sprites);
  }
}
