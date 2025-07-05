import React, { useEffect } from "react";
import type { FacingFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id";
import { useEcsStore } from "@/stores/use-ecs-store.ts";

export const Facing: React.FC<FacingFacet> = ({ direction }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "facing", { direction });
    return () => {
      removeComponent(eid, "facing");
    };
  }, [eid, direction, addComponent, removeComponent]);

  return null;
};
