import { system, System } from "@lastolivegames/becsy";
import {
  Score,
  LevelProgress,
  Position,
  GridPosition,
  GridMovement,
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
import { GameConstants } from "@/features/dashboard/game/constans.ts";
import { spawnerGroup } from "./system-group.ts";
import type { LevelData } from "@/features/dashboard/challenge/types.ts";
import { sysLogger } from "@/lib/logger.ts";
import { getCenteredTilePosition } from "@/lib/tiles.ts";
import { getRotationFromFacing } from "@/lib/rotation.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";

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

  spawnPlayer(level: LevelData) {
    const [spawn] = level.start;
    const { x, y } = getCenteredTilePosition(spawn.col, spawn.row);
    const angle = getRotationFromFacing(level.facing);
    this.createEntity(
      Position,
      { x, y },
      GridPosition,
      { col: spawn.col, row: spawn.row },
      GridMovement,
      {
        startCol: spawn.col,
        startRow: spawn.row,
        destCol: spawn.col,
        destRow: spawn.row,
        progress: 1,
        duration: GameConstants.DURATION,
      },
      SpriteAnimation,
      { name: "idle", frames: 20, isPlaying: false },
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
