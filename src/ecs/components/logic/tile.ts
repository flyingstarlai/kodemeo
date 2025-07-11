import { component, field } from "@lastolivegames/becsy";

export const TileKindEnum = {
  Empty: "empty",
  Path: "path",
  Start: "start",
  Collectible: "collectible",
  Obstacle: "obstacle",
  Goal: "goal",
} as const;

export type TileKind = (typeof TileKindEnum)[keyof typeof TileKindEnum];

@component
export class Tile {
  @field.int32 declare col: number;
  @field.int32 declare row: number;
  @field.staticString([
    "empty",
    "path",
    "start",
    "collectible",
    "obstacle",
    "goal",
  ])
  declare kind: TileKind;
}
