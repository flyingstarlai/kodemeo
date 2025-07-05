import { useCreateEntity } from "@/features/student/game/hooks/use-create-entity.ts";
import { EntityProvider } from "@/providers/entity-provider.tsx";
import { CollectibleTag } from "@/ecs/components/collectible-tag.tsx";
import { GridPosition } from "@/ecs/components/grid-position.tsx";
import { SpriteAnimation } from "@/ecs/components/sprite-animation.tsx";

export const CoinEntity: React.FC<{ col: number; row: number }> = ({
  col,
  row,
}) => {
  const eid = useCreateEntity();

  if (eid === null) {
    return null;
  }

  return (
    <EntityProvider eid={eid}>
      <CollectibleTag />
      <GridPosition col={col} row={row} />
      <SpriteAnimation name="rotate" fps={8} isPlaying={true} />
    </EntityProvider>
  );
};
