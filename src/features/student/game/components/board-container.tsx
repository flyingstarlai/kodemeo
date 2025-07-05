import { GameConstants } from "@/features/student/game/constans.ts";

export const BoardContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const gridW = GameConstants.GRID_COLS * GameConstants.TILE_SIZE,
    gridH = GameConstants.GRID_ROWS * GameConstants.TILE_SIZE;
  return (
    <pixiContainer
      label="board_container"
      x={(GameConstants.GAME_WIDTH - gridW) / 2}
      y={(GameConstants.GAME_HEIGHT - gridH) / 2}
    >
      {children}
    </pixiContainer>
  );
};
