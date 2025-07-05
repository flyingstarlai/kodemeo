import { useShallow } from "zustand/react/shallow";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import type {
  EcsComponentName,
  EntityId,
} from "@/features/student/game/types.ts";

export function useEntityQuery(has: EcsComponentName[]): EntityId[] {
  return useEcsStore(
    useShallow((s) => {
      if (has.length === 0) return [];

      // Build a list of arrays, each array = all entity IDs that have component `c`
      const lists = has.map((c) => {
        // `s.components[c]` is a Record<EntityId, ...>
        const slice = s.components[c] as Record<string, unknown> | undefined;
        if (!slice) {
          // If that slice is missing, no entity can possibly match
          return [] as EntityId[];
        }
        // Convert keys (entity IDs as strings) → numbers
        return Object.keys(slice).map((k) => Number(k) as EntityId);
      });

      // Intersect all arrays so that only IDs present in every slice remain
      return lists.reduce((a, b) => a.filter((id) => b.includes(id)));
    }),
  );
}
