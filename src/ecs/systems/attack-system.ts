import { System, system } from "@lastolivegames/becsy";
import { logicGroup } from "@/ecs/systems/system-group.ts";
import {
  Attacking,
  EnemyTag,
  GridPosition,
  MarkAsDeletedTag,
  PlayerTag,
  SpriteAnimation,
} from "@/ecs/components";
import { MovementSystem } from "@/ecs/systems/movement-system.ts";
import { usePlayerSpriteStore } from "@/features/dashboard/game/store/use-player-sprite-store.ts";

@system(logicGroup, (s) => s.after(MovementSystem))
export class AttackSystem extends System {
  private readonly players = this.query(
    (q) =>
      q.current
        .with(PlayerTag, GridPosition)
        .and.with(SpriteAnimation, Attacking).write,
  );

  private readonly enemies = this.query((q) =>
    q.current.without(MarkAsDeletedTag).write.and.with(EnemyTag, GridPosition),
  );

  execute(): void {
    const playerStore = usePlayerSpriteStore.getState();

    const [player] = this.players.current;
    if (!player) return;

    if (!playerStore.completed) return;

    playerStore.toggleComplete();

    const atk = player.read(Attacking);

    for (const enemy of this.enemies.current) {
      const ePos = enemy.read(GridPosition);
      if (atk.targetCol === ePos.col && atk.targetRow === ePos.row) {
        enemy.add(MarkAsDeletedTag);
      }
    }

    player.remove(Attacking);
  }
}
