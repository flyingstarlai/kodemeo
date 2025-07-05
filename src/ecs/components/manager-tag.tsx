import { useEffect } from "react";
import type { ManagerTagFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import useAddComponent from "@/features/student/game/hooks/use-add-component.ts";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component.ts";

export const ManagerTag: React.FC<ManagerTagFacet> = () => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "managerTag", { id: eid });
    return () => {
      removeComponent(eid, "managerTag");
    };
  }, [addComponent, eid, removeComponent]);

  return null;
};
