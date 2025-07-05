import { useEffect } from "react";
import type { LevelProgressFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component.ts";
import useAddComponent from "@/features/student/game/hooks/use-add-component.ts";

export const LevelProgress: React.FC<LevelProgressFacet> = ({
  isOver,
  onGoal,
}) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "progress", { isOver, onGoal });
    return () => {
      removeComponent(eid, "session");
    };
  }, [addComponent, eid, isOver, onGoal, removeComponent]);

  return null;
};
