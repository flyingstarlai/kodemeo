import { useEffect } from "react";
import type { PlaySessionFacet } from "@/features/student/game/types.ts";
import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import useRemoveComponent from "@/features/student/game/hooks/use-remove-component";
import useAddComponent from "@/features/student/game/hooks/use-add-component.ts";

export const PlaySession: React.FC<PlaySessionFacet> = ({ session }) => {
  const eid = useEntityId();
  const addComponent = useAddComponent();
  const removeComponent = useRemoveComponent();

  useEffect(() => {
    addComponent(eid, "session", { session });
    return () => {
      removeComponent(eid, "session");
    };
  }, [addComponent, eid, removeComponent, session]);

  return null;
};
