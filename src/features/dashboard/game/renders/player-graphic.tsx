import { useGameState } from "@/features/dashboard/game/store/game-state.ts";

export const PlayerGraphic: React.FC = () => {
  const playerPositions = useGameState((s) => s.playerPositions);
  console.log(playerPositions);
  return (
    <>
      {playerPositions.map((pos) => (
        <pixiGraphics
          key={pos.id}
          x={pos.x}
          y={pos.y}
          draw={(g) => {
            g.clear();
            g.setFillStyle(0x00ff00);
            g.rect(0, 0, 50, 50);
            g.fill();
          }}
        />
      ))}
    </>
  );
};
