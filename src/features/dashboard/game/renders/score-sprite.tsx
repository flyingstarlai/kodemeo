import { useAssets } from "@/providers/asset-context.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";

export const ScoreSprite: React.FC = () => {
  const { coin } = useAssets();
  const { coins, maxCoins } = useCollectibleStore();

  if (maxCoins < 1) return null;

  return (
    <pixiContainer label="score" x={10} y={10}>
      {Array.from({ length: maxCoins }).map((_, index) => {
        const isCollected = index < coins;
        return (
          <pixiSprite
            key={index}
            texture={coin.animations["rotate"][0]}
            x={index * 50} // spacing between coins
            scale={1}
            tint={isCollected ? undefined : "gray"}
            alpha={isCollected ? 1 : 0.5}
          />
        );
      })}
    </pixiContainer>
  );
};
