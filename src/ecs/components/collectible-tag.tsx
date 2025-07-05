import type { CollectibleTagFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import useAddComponent from "@/features/student/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component.ts";
import { useEffect } from "react";

export const CollectibleTag: React.FC<CollectibleTagFacet> = () => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "collectibleTag", { id: eid });
    return () => {
      removeComponent(eid, "collectibleTag");
    };
  }, [addComponent, eid, removeComponent]);

  return null;
};
