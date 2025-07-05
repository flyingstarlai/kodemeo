import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { useCallback } from "react";
import type {
  EcsComponentName,
  EntityId,
} from "@/features/student/game/types.ts";

export function useRemoveEntities() {
  // Grab the entire `components` object and the `removeEntity` action:
  const components = useEcsStore((s) => s.components);
  const removeEntity = useEcsStore((s) => s.removeEntity);

  // useCallback so that the returned function is stable across re-renders
  return useCallback(
    (has: EcsComponentName[]) => {
      if (has.length === 0) return;

      // 1) Get an array of arrays of IDs, one for each component name
      const listsOfIds: EntityId[][] = has.map((compName) => {
        return Object.keys(components[compName]).map((k) => Number(k));
      });

      if (listsOfIds.length === 0) return;

      // 2) Compute the intersection
      const intersection = listsOfIds.reduce((prev, curr) =>
        prev.filter((id) => curr.includes(id)),
      );

      // 3) Remove each ID in the intersection
      intersection.forEach((id) => {
        removeEntity(id);
      });
    },
    [components, removeEntity],
  );
}
