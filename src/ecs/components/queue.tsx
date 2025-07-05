import { useEntityId } from "@/features/student/game/hooks/use-entity-id.ts";
import { useEffect } from "react";
import type { QueueFacet } from "@/features/student/game/types.ts";
import { useEcsStore } from "@/stores/use-ecs-store.ts";

export const Queue: React.FC<QueueFacet> = ({ commands }) => {
  const eid = useEntityId();
  const addComponent = useEcsStore((s) => s.addComponent);
  const removeComponent = useEcsStore((s) => s.removeComponent);

  useEffect(() => {
    // Register the queue on mount
    addComponent(eid, "queue", { commands: [...commands] });

    // Clean up on unmount
    return () => {
      removeComponent(eid, "queue");
    };
    // We only want to run this once on mount/unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};
