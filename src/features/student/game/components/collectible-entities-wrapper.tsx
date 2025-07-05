import React, { useMemo } from "react";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { useEntityQuery } from "@/features/student/game/hooks/use-entity-query.ts";
import { CoinEntity } from "@/ecs/entities/coin-entity.tsx";

export const CollectibleEntitiesWrapper: React.FC = () => {
  const level = useEcsStore((s) => s.levelData);
  const [managerEid] = useEntityQuery(["session"]);
  const session = useEcsStore((s) =>
    managerEid != null ? s.getComponent(managerEid, "session") : null,
  );

  const collectibles = useMemo(() => {
    if (session) {
      return level.collectible;
    }
    return [];
  }, [level.collectible, session]);

  if (!session) return null;

  return (
    <>
      {collectibles.map(({ col, row }, idx) => (
        <CoinEntity
          key={`${session.session}_collectible_${idx}`}
          col={col}
          row={row}
        />
      ))}
    </>
  );
};
