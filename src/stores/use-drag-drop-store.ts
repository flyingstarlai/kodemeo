import { create } from "zustand";
import type {
  IWorkspaceItem,
  IHoverSlot,
} from "@/features/dashboard/command/types.ts";

interface DragDropStore {
  draggingItem: IWorkspaceItem | null;
  setDraggingItem: (item: IWorkspaceItem | null) => void;

  pointer: { x: number; y: number };
  setPointer: (pos: { x: number; y: number }) => void;

  insertionIndex: number | null;
  setInsertionIndex: (index: number | null) => void;

  hoveredSlot: IHoverSlot | null;
  setHoveredSlot: (slot: IHoverSlot | null) => void;

  workspaceItems: IWorkspaceItem[];
  setWorkspaceItems: (items: IWorkspaceItem[]) => void;

  isOverDeleteZone: boolean;
  setIsOverDeleteZone: (val: boolean) => void;

  hoveredLoopId: string | null;
  setHoveredLoopId: (id: string | null) => void;

  loopInsertionIndex: number | null;
  setLoopInsertionIndex: (i: number | null) => void;
}

export const useDragDropStore = create<DragDropStore>((set) => ({
  draggingItem: null,
  setDraggingItem: (item) => set({ draggingItem: item }),

  pointer: { x: 0, y: 0 },
  setPointer: (pos) => set({ pointer: pos }),

  insertionIndex: null,
  setInsertionIndex: (index) => set({ insertionIndex: index }),

  hoveredSlot: null,
  setHoveredSlot: (slot) => set({ hoveredSlot: slot }),

  workspaceItems: [],
  setWorkspaceItems: (items) => set({ workspaceItems: items }),

  isOverDeleteZone: false,
  setIsOverDeleteZone: (val: boolean) => set({ isOverDeleteZone: val }),

  hoveredLoopId: null,
  setHoveredLoopId: (id) => set({ hoveredLoopId: id }),

  loopInsertionIndex: null,
  setLoopInsertionIndex: (i) => set({ loopInsertionIndex: i }),
}));
