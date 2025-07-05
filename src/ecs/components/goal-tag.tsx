import useAddComponent from "@/features/student/game/hooks/use-add-component";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id";
import type { GoalTagFacet } from "@/features/student/game/types";
import { useEffect } from "react";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component.ts";

export const GoalTag: React.FC<GoalTagFacet> = () => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "goalTag", { id: eid });
    return () => {
      removeComponent(eid, "goalTag");
    };
  }, [addComponent, eid, removeComponent]);

  return null;
};
