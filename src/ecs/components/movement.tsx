import { useEffect } from "react";
import type { MovementFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import { useMovementStore } from "@/stores/use-movement-store";

export const Movement: React.FC<MovementFacet> = ({ progress, duration }) => {
  const eid = useEntityId();
  const addComponent = useMovementStore((s) => s.addComponent);
  const removeComponent = useMovementStore((s) => s.removeComponent);
  useEffect(() => {
    addComponent(eid, "movement", { progress, duration });
    return () => {
      removeComponent(eid, "movement");
    };
  }, [addComponent, duration, eid, progress, removeComponent]);

  return null;
};
