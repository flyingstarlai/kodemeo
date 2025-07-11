import { TextStyle } from "pixi.js";
import { useAssets } from "@/providers/asset-context.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { GameConstants } from "@/features/dashboard/game/constans.ts";

export const ScoreText: React.FC = () => {
  const { coin } = useAssets();
  const { coins, maxCoins } = useCollectibleStore();

  if (maxCoins < 1) return null;

  const score = `${coins} / ${maxCoins}`;

  const style = new TextStyle({
    fill: "#00ff00",
    fontSize: 28,
    fontWeight: "500",
    fontFamily: "Fredoka One",
    stroke: { color: "#4a1850", width: 4, join: "round" },
  });

  return (
    <pixiContainer
      label="score"
      x={GameConstants.TILE_SIZE * GameConstants.GRID_COLS}
      y={0}
    >
      <pixiSprite texture={coin.animations["rotate"][0]} scale={0.8} />
      <pixiText text={score} style={style} x={48} y={3} />
    </pixiContainer>
  );
};
