import { useEntityQuery } from "@/features/student/game/hooks/use-entity-query.ts";
import { CoinSprite } from "@/features/student/game/components/coin-sprite.tsx";

export const CoinsRenderSystem: React.FC = () => {
  const entities = useEntityQuery(["collectibleTag"]);
  return (
    <>
      {entities.map((eid) => (
        <CoinSprite key={eid} eid={eid} />
      ))}
    </>
  );
};
