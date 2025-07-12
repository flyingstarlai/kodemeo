import { GameConstants } from "@/features/dashboard/game/constans";

export function getPlayerGlobalPosition(x: number, y: number) {
  const gridW = GameConstants.GRID_COLS * GameConstants.TILE_SIZE;
  const gridH = GameConstants.GRID_ROWS * GameConstants.TILE_SIZE;

  const offsetX = (GameConstants.GAME_WIDTH - gridW) / 2;
  const offsetY = (GameConstants.GAME_HEIGHT - gridH) / 2;

  const posX = offsetX + x;
  const posY = offsetY + y;

  return { posX, posY };
}
