import React, { useEffect } from "react";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import type { DisplayFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";

/**
 * <Display color={0xffffff} size={64} />
 *  - Attaches { display: { color, size } } to the current entity (for debug drawing).
 */
export const Display: React.FC<DisplayFacet> = ({ color, size }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    addComponent(eid, "display", { color, size });
    return () => {
      removeComponent(eid, "display");
    };
  }, [eid, color, size, addComponent, removeComponent]);

  return null;
};
