import { system, System } from "@lastolivegames/becsy";
import {
  Position,
  Velocity,
} from "@/features/student/game-bescy/ecs/components";

@system
export class Movement extends System {
  private readonly movables = this.query(
    (q) => q.current.with(Velocity).and.with(Position).write,
  );

  execute(): void {
    for (const movable of this.movables.current) {
      const velocity = movable.read(Velocity);
      const position = movable.write(Position);

      position.x += this.delta * velocity.vx;
      position.y += this.delta * velocity.vy;
    }
  }
}
