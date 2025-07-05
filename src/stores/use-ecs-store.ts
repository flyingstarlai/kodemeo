import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  EntityId,
  EcsComponentName,
  EcsComponents,
  EcsComponentSlices,
  QueuedCommand,
} from "@/features/student/game/types.ts";
import { defaultLevel } from "@/features/student/game/constans.ts";
import type { LevelData } from "@/features/teacher/assignment/types.ts";

export interface EcsStore {
  nextId: EntityId;
  resetNextId: () => void;

  components: EcsComponentSlices;

  createEntity(): EntityId;

  removeEntity(id: EntityId): void;

  addComponent<K extends EcsComponentName>(
    id: EntityId,
    component: K,
    data: EcsComponents[K],
  ): void;

  removeComponent<K extends EcsComponentName>(id: EntityId, component: K): void;

  getComponent<K extends EcsComponentName>(
    id: EntityId,
    component: K,
  ): EcsComponents[K] | undefined;

  levelData: LevelData;

  setLevelData(level: LevelData): void;
  currentCommand: QueuedCommand | null;
  setCurrentCommand: (command: QueuedCommand | null) => void;
}

// ────────────────────────────────────────────────────────────────────────────────
// Helper: Remove a single entity ID from a Record<EntityId, T>
// ────────────────────────────────────────────────────────────────────────────────
function omitId<T>(
  slice: Record<EntityId, T>,
  idToRemove: EntityId,
): Record<EntityId, T> {
  const result: Record<EntityId, T> = {};
  for (const [key, value] of Object.entries(slice)) {
    const keyNum = Number(key) as EntityId;
    if (keyNum !== idToRemove) {
      result[keyNum] = value;
    }
  }
  return result;
}

// ────────────────────────────────────────────────────────────────────────────────
// Store Definition
// ────────────────────────────────────────────────────────────────────────────────
export const useEcsStore = create<EcsStore>()(
  devtools((set, get) => ({
    // ─── State ──────────────────────────────────────────────────────────────────
    nextId: 0,

    components: {
      gridPosition: {},
      gridMovement: {},
      spriteAnimation: {},
      facing: {},
      queue: {},
      bag: {},
      display: {},
      tile: {},
      playerTag: {},
      collectibleTag: {},
      goalTag: {},
      managerTag: {},
      session: {},
      progress: {},
      score: {},
    },
    currentCommand: null,
    levelData: defaultLevel,
    config: { lesson: "", task: "" },

    // ─── Actions ────────────────────────────────────────────────────────────────
    resetNextId: () => set({ nextId: 0 }, false, "resetNextId"),
    setCurrentCommand: (command: QueuedCommand) =>
      set({ currentCommand: command }, false, "setCurrentCommand"),
    createEntity: (): EntityId => {
      const newId = get().nextId + 1;
      set({ nextId: newId }, false, "createEntity");
      return newId;
    },

    /**
     * Remove an entity from all component slices.
     * This deletes any component data keyed by that entity ID.
     */
    removeEntity: (id: EntityId) =>
      set(
        (state) => ({
          components: {
            gridPosition: omitId(state.components.gridPosition, id),
            gridMovement: omitId(state.components.gridMovement, id),
            spriteAnimation: omitId(state.components.spriteAnimation, id),
            facing: omitId(state.components.facing, id),
            queue: omitId(state.components.queue, id),
            bag: omitId(state.components.bag, id),
            tile: omitId(state.components.tile, id),
            display: omitId(state.components.display, id),
            playerTag: omitId(state.components.playerTag, id),
            collectibleTag: omitId(state.components.collectibleTag, id),
            goalTag: omitId(state.components.goalTag, id),
            managerTag: omitId(state.components.managerTag, id),
            session: omitId(state.components.session, id),
            progress: omitId(state.components.progress, id),
            score: omitId(state.components.score, id),
          },
        }),
        false,
        "removeEntity",
      ),

    /**
     * Add (or overwrite) one component entry for a given entity ID.
     * Usage: addComponent(5, "tile", { col: 2, row: 3, kind: "path" });
     */
    addComponent: <K extends EcsComponentName>(
      id: EntityId,
      component: K,
      data: EcsComponents[K],
    ) =>
      set(
        (state) => ({
          components: {
            ...state.components,
            [component]: {
              ...state.components[component],
              [id]: data,
            },
          },
        }),
        false,
        "addComponent",
      ),

    /**
     * Remove a single component from one entity ID.
     * Usage: removeComponent(5, "tile");
     */
    removeComponent: <K extends EcsComponentName>(id: EntityId, component: K) =>
      set(
        (state) => {
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
        },
        false,
        "removeComponent",
      ),

    /** Fetch a specific component’s data for a given entity. */
    getComponent: <K extends EcsComponentName>(
      id: EntityId,
      component: K,
    ): EcsComponents[K] | undefined => get().components[component][id],

    // ───  Level ────────────────────────────────────────────────────────
    setLevelData: (levelData: LevelData) =>
      set({ levelData: levelData }, false, "setLevel"),
  })),
);
