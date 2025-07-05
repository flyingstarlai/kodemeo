import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component";
import useAddComponent from "@/features/student/game/hooks/use-add-component.ts";
import { useEffect } from "react";
import type { PlayerTagFacet } from "@/features/student/game/types.ts";

export const PlayerTag: React.FC<PlayerTagFacet> = () => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "playerTag", { id: eid });
    return () => {
      removeComponent(eid, "playerTag");
    };
  }, [addComponent, eid, removeComponent]);

  return null;
};
