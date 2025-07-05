import { GameConstants } from "@/features/student/game/constans.ts";

export function getCenteredTilePosition(
  col: number,
  row: number,
): { x: number; y: number } {
  const tileSize = GameConstants.TILE_SIZE;
  // center of the tile in pixels:
  const centerX = col * tileSize + tileSize / 2;
  const centerY = row * tileSize + tileSize / 2;
  return {
    x: centerX,
    y: centerY,
  };
}
