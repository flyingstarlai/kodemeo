import type { GridPositionFacet } from "@/features/student/game/types";
import React, { useEffect } from "react";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import { useEcsStore } from "@/stores/use-ecs-store.ts";

/**
 * <GridPosition col={number} row={number} />
 *  - Attaches a { gridPosition: { col, row } } component to the current entity
 */
export const GridPosition: React.FC<GridPositionFacet> = ({ col, row }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "gridPosition", { col, row });

    return () => {
      removeComponent(eid, "gridPosition");
    };
  }, [eid, addComponent, removeComponent, col, row]);

  return null;
};
