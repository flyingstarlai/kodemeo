import { create } from "zustand";
import type {
  EntityId,
  MovementComponentSlices,
  MovementComponentName,
  MovementComponents,
} from "@/features/student/game/types.ts";

/**
 * The PositionStore splits “position” (pixel coords) and “movement” (progress+duration)
 * into two top‐level maps, keyed by entity ID.
 */
export interface MovementStore {
  components: MovementComponentSlices;
  addComponent<K extends MovementComponentName>(
    id: EntityId,
    component: K,
    data: MovementComponents[K],
  ): void;

  removeComponent<K extends MovementComponentName>(
    id: EntityId,
    component: K,
  ): void;

  getComponent<K extends MovementComponentName>(
    id: EntityId,
    component: K,
  ): MovementComponents[K] | undefined;
}

export const useMovementStore = create<MovementStore>((set, get) => ({
  components: {
    position: {},
    movement: {},
  },
  addComponent: <K extends MovementComponentName>(
    id: EntityId,
    component: K,
    data: MovementComponents[K],
  ) =>
    set((state) => ({
      components: {
        ...state.components,
        [component]: {
          ...state.components[component],
          [id]: data,
        },
      },
    })),
  removeComponent: <K extends MovementComponentName>(
    id: EntityId,
    component: K,
  ) =>
    set((state) => {
      const slice = { ...state.components[component] };
      if (!(id in slice)) {
        return {};
      }
      delete slice[id];
      return {
        components: {
          ...state.components,
          [component]: slice,
        },
      };
    }),
  getComponent: <K extends MovementComponentName>(
    id: EntityId,
    component: K,
  ): MovementComponents[K] | undefined => get().components[component][id],
}));
