import { useAssets } from "@/providers/asset-context.ts";
import { useTreasureStore } from "@/features/dashboard/game/store/use-treasure-store.ts";

export const TreasureSprite: React.FC = () => {
  const { chest } = useAssets();

  const [sp] = useTreasureStore((s) => s.sprites);

  if (!sp) return null;

  return (
    <pixiSprite
      texture={chest.chestClosed}
      anchor={0.5}
      scale={0.6}
      x={sp.x}
      y={sp.y}
      rotation={sp.rotation}
    />
  );
};
