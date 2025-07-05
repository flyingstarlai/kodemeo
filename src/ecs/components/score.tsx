import { useEffect } from "react";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component";
import useAddComponent from "@/features/student/game/hooks/use-add-component.ts";
import type { ScoreFacet } from "@/features/student/game/types.ts";

export const Score: React.FC<ScoreFacet> = ({ stars }) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();
  useEffect(() => {
    addComponent(eid, "score", { stars });
    return () => {
      removeComponent(eid, "score");
    };
  }, [eid, addComponent, removeComponent, stars]);
  return null;
};
