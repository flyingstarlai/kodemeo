import { useEcsStore } from "@/stores/use-ecs-store";
import { useEffect } from "react";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import type { GridMovementFacet } from "@/features/student/game/types.ts";

export const GridMovement: React.FC<GridMovementFacet> = ({
  startCol,
  startRow,
  destCol,
  destRow,
}) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "gridMovement", {
      startCol,
      startRow,
      destCol,
      destRow,
    });
    return () => {
      removeComponent(eid, "gridMovement");
    };
  }, [
    eid,
    startCol,
    startRow,
    destCol,
    destRow,
    addComponent,
    removeComponent,
  ]);

  return null;
};
