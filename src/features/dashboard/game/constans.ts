import type { LevelData } from "@/features/dashboard/challenge/types.ts";

export const GameConstants = {
  GAME_WIDTH: 1280,
  GAME_HEIGHT: 720,
  GRID_COLS: 9,
  GRID_ROWS: 5,
  TILE_SIZE: 80,
  DEBUG_MODE: false,
  DURATION: 1,
};

export const defaultLevel: LevelData = {
  level: 0,
  facing: "up",
  collectible: [],
  obstacle: [],
  goal: [],
  start: [],
  path: [],
  maxStep: 0,
  commands: [],
  guides: [],
};

export const DIRECTION_DELTAS: Record<string, [number, number]> = {
  left: [-1, 0],
  right: [1, 0],
  up: [0, -1],
  down: [0, 1],
};
