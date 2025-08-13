import { system, System } from "@lastolivegames/becsy";
import {
  Score,
  LevelProgress,
  Position,
  GridPosition,
  SpriteAnimation,
  Rotation,
  Facing,
  Bag,
  PlayerTag,
  ManagerTag,
  CollectibleTag,
  Elapsed,
  GoalTag,
  Transition,
} from "../components";
import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import { spawnerGroup } from "./system-group.ts";
import type { LevelData } from "@/features/dashboard/challenge/types.ts";
import { sysLogger } from "@/lib/logger.ts";
import { getCenteredTilePosition } from "@/lib/tiles.ts";
import { getRotationFromFacing } from "@/lib/rotation.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";
import { EnemyTag } from "@/ecs/components/tags/enemy-tag.ts";

@system(spawnerGroup)
export class SpawnerSystem extends System {
  private readonly entities = this.query(
    (q) =>
      q.current.withAny(GoalTag, PlayerTag, CollectibleTag, ManagerTag).and
        .usingAll.write,
  );
  async prepare() {
    this.spawnManager();
  }

  execute() {
    const level = useLevelStore.getState().currentLevel;

    if (!level) return;

    if (this.entities.current.length > 1) return;

    sysLogger.log("Spawn Entities");

    for (const entity of this.entities.current) {
      if (entity.has(ManagerTag)) {
        entity.write(LevelProgress).isOver = false;
        entity.write(LevelProgress).onGoal = false;
        entity.write(Transition).alpha = 1;
        entity.write(Transition).target = 0;
        entity.write(Transition).speed = 1;
        entity.write(Score).stars = 0;
      }
    }

    this.spawnTreasure(level);
    this.spawnPlayer(level);
    this.spawnCoins(level);
    this.spawnObstacle(level);
  }

  spawnCoins(level: LevelData) {
    const coins = level.collectible;

    for (const coin of coins) {
      const { x, y } = getCenteredTilePosition(coin.col, coin.row);
      this.createEntity(
        Position,
        { x, y },
        GridPosition,
        { col: coin.col, row: coin.row },
        SpriteAnimation,
        { name: "rotate", frames: 8, isPlaying: false },
        CollectibleTag,
      );
    }
  }

  spawnObstacle(level: LevelData) {
    const obstacles = level.obstacle;

    for (const obstacle of obstacles) {
      const { x, y } = getCenteredTilePosition(obstacle.col, obstacle.row);
      this.createEntity(
        Position,
        { x, y },
        GridPosition,
        { col: obstacle.col, row: obstacle.row },
        SpriteAnimation,
        { name: "idle", isLooped: true, frames: 17, isPlaying: false },
        EnemyTag,
      );
    }
  }

  spawnPlayer(level: LevelData) {
    const [spawn] = level.start;
    const { x, y } = getCenteredTilePosition(spawn.col, spawn.row);
    const angle = getRotationFromFacing(level.facing);
    this.createEntity(
      Position,
      { x, y },
      GridPosition,
      { col: spawn.col, row: spawn.row },
      SpriteAnimation,
      { name: "idle", isLooped: true, frames: 20, isPlaying: false },
      Rotation,
      { angle },
      Facing,
      { direction: level.facing },
      Bag,
      { coins: 0 },
      PlayerTag,
    );

    useUIStore.getState().scrollToCenter({ x, y });
  }

  spawnTreasure(level: LevelData) {
    const [treasure] = level.goal;

    const goal = getCenteredTilePosition(treasure.col, treasure.row);
    this.createEntity(
      Position,
      { x: goal.x, y: goal.y },
      GridPosition,
      { col: treasure.col, row: treasure.row },
      Elapsed,
      { value: 0 },
      GoalTag,
    );
  }

  spawnManager() {
    this.createEntity(
      LevelProgress,
      { isOver: false, onGoal: false },
      Transition,
      { alpha: 1, target: 0, speed: 0.5 },
      Score,
      { stars: 0 },
      ManagerTag,
    );
  }
}
