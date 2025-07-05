export type EntityId = number;
export type CommandType = "up" | "down" | "left" | "right" | "scratch";
export type QueuedCommand = {
  id: string;
  parentId: string | null;
  command: CommandType;
};

// ─── TILE KINDS ───────────────────────────────────────────────────────────────
export type TileKind =
  | "empty"
  | "path"
  | "start"
  | "collectible"
  | "obstacle"
  | "goal";

// ─── ECS COMPONENT INTERFACES ─────────────────────────────────────────────────

export interface GridPositionFacet {
  col: number;
  row: number;
}

export interface PositionFacet {
  x: number;
  y: number;
}

export interface MovementFacet {
  progress: number; // normalized 0 → 1
  duration: number; // total seconds for this movement
}

export interface GridMovementFacet {
  startCol: number;
  startRow: number;
  destCol: number;
  destRow: number;
}

export interface SpriteAnimationFacet {
  name: "idle" | "walk" | "scratch" | "whacked" | "rotate";
  fps: number; // frames per second
  isPlaying: boolean;
}

export interface FacingFacet {
  direction: "up" | "down" | "left" | "right";
}

export interface TileFacet {
  col: number;
  row: number;
  kind: TileKind;
}

export interface DisplayFacet {
  color: number;
  size: number;
}

export interface QueueFacet {
  commands: QueuedCommand[];
}

export interface BagFacet {
  coins: number;
}

export interface PlayerTagFacet {
  id?: number;
}

export interface CollectibleTagFacet {
  id?: number;
}

export interface GoalTagFacet {
  id?: number;
}

export interface ManagerTagFacet {
  id?: number;
}

export interface LevelProgressFacet {
  isOver: boolean;
  onGoal?: boolean;
}

export interface PlaySessionFacet {
  session: string;
}

export interface ScoreFacet {
  stars: number;
}

// ─── AGGREGATED ECS COMPONENTS TYPE ────────────────────────────────────────────────
export interface EcsComponents {
  gridPosition: GridPositionFacet;
  gridMovement: GridMovementFacet;
  spriteAnimation: SpriteAnimationFacet;
  facing: FacingFacet;
  queue: QueueFacet;
  bag: BagFacet;
  tile: TileFacet;
  display: DisplayFacet;
  playerTag: PlayerTagFacet;
  collectibleTag: CollectibleTagFacet;
  goalTag: GoalTagFacet;
  managerTag: ManagerTagFacet;
  progress: LevelProgressFacet;
  session: PlaySessionFacet;
  score: ScoreFacet;
}

// Each component name (key in `components`) must be one of these:
export type EcsComponentName = keyof EcsComponents;

// For the store, we keep a record of EntityId → component‐data for each component:
export type EcsComponentSlices = {
  [K in EcsComponentName]: Record<EntityId, EcsComponents[K]>;
};

// ─── AGGREGATED MOVEMENT COMPONENTS TYPE ────────────────────────────────────────────────
export interface MovementComponents {
  position: PositionFacet;
  movement: MovementFacet;
}

// Each component name (key in `components`) must be one of these:
export type MovementComponentName = keyof MovementComponents;

// For the store, we keep a record of EntityId → component‐data for each component:
export type MovementComponentSlices = {
  [K in MovementComponentName]: Record<EntityId, MovementComponents[K]>;
};

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: Array<{
    name: string;
    type: string;
    visible: boolean;
    data: number[];
    objects: Array<{
      name: string;
      id: number;
      x: number;
      y: number;
    }>;
  }>;
  tilesets: Array<{
    firstgid: number;
    columns: number;
    tilecount: number;
    tilewidth: number;
    tileheight: number;
  }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;
