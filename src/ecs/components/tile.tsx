import React, { useEffect } from "react";
import type { TileFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id";
import { useEcsStore } from "@/stores/use-ecs-store";

export const Tile: React.FC<TileFacet> = ({ col, row, kind }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "tile", { col, row, kind });
    return () => {
      removeComponent(eid, "tile");
    };
  }, [eid, col, row, kind, addComponent, removeComponent]);

  return null;
};
