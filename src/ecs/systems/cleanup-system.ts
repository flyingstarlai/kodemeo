import { system, System } from "@lastolivegames/becsy";

import { cleanupGroup } from "./system-group.ts";
import { useCycleStore } from "@/features/dashboard/game/store/use-cycle-store.ts";
import {
  CollectibleTag,
  GoalTag,
  MarkAsDeletedTag,
  PlayerTag,
} from "@/ecs/components";

@system(cleanupGroup)
export class CleanupSystem extends System {
  private readonly entities = this.query(
    (q) =>
      q.current
        .without(MarkAsDeletedTag)
        .and.withAny(PlayerTag, CollectibleTag, GoalTag).usingAll.write,
  );
  execute(): void {
    const shouldCleanup = useCycleStore.getState().shouldCleanup;
    if (!shouldCleanup) return;
    for (const entity of this.entities.current) {
      entity.add(MarkAsDeletedTag);
    }
    useCycleStore.getState().triggerCleanup(false);
  }
}

// ** RE ASSIGN ENTITY **
/*


 private readonly entities = this.query(
    (q) =>
      q.current
        .withAny(PlayerTag, CollectibleTag, ManagerTag, GoalTag)
        .using(
          Position,
          GridPosition,
          GridMovement,
          Rotation,
          SpriteAnimation,
          Bag,
          MarkAsDeletedTag,
          LevelProgress,
        ).write,
  );

const challenge = useLevelStore.getState().currentLevel;
const cleanup = useCycleStore.getState().shouldCleanup;
if (!cleanup || !challenge) return;
for (const entity of this.entities.current) {
  if (entity.has(PlayerTag)) {
    const [spawn] = challenge.start;
    const { x, y } = getCenteredTilePosition(spawn.col, spawn.row);
    const angle = getRotationFromFacing(challenge.facing);

    entity.write(Position).x = x;
    entity.write(Position).y = y;
    entity.write(Rotation).angle = angle;
    entity.write(SpriteAnimation).name = "idle";
    entity.write(SpriteAnimation).frames = 20;
    entity.write(Bag).coins = 0;
    entity.write(GridPosition).col = spawn.col;
    entity.write(GridPosition).row = spawn.row;
    const gridMov = entity.write(GridMovement);
    gridMov.destCol = spawn.col;
    gridMov.destRow = spawn.row;
    gridMov.startCol = spawn.col;
    gridMov.startRow = spawn.row;
  }
  if (entity.has(CollectibleTag) && entity.has(MarkAsDeletedTag)) {
    entity.remove(MarkAsDeletedTag);
  }

  if (entity.has(ManagerTag)) {
    entity.write(LevelProgress).isOver = false;
    entity.write(LevelProgress).onGoal = false;
  }
}
useCycleStore.getState().triggerCleanup(false);

*/
