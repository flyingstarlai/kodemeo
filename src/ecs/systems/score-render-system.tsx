import { TextStyle } from "pixi.js";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { useAssets } from "@/providers/asset-context";
import { useEntityQuery } from "@/features/student/game/hooks/use-entity-query.ts";
import { GameConstants } from "@/features/student/game/constans.ts";

export const ScoreRenderSystem: React.FC = () => {
  const level = useEcsStore((s) => s.levelData);
  const { coin } = useAssets();
  const coinTex = coin.animations["rotate"][0];
  const [eid] = useEntityQuery(["playerTag"]);
  const bagFacet = useEcsStore((s) => s.getComponent(eid, "bag"));
  if (!bagFacet) return null;

  const totalCollectible = level.collectible.length;
  if (totalCollectible < 1) return null;
  const scoreText = `${bagFacet.coins} / ${level.collectible.length}`;
  const textStyle = new TextStyle({
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
      <pixiSprite texture={coinTex} scale={0.8} />
      <pixiText text={scoreText} style={textStyle} x={48} y={3} />
    </pixiContainer>
  );
};
