import { create } from "zustand";
import type { QueuedCommand } from "@/ecs/components/logic/queue.ts";

interface ScrollTarget {
  x: number;
  y: number;
}
interface UIStore {
  scrollTarget: ScrollTarget | null;
  currentCommand: QueuedCommand | null;
  isPendingCommand: boolean;
  isLevelFailed: boolean;
  setCurrentCommand: (command: QueuedCommand | null) => void;
  setIsPendingCommand: (flag: boolean) => void;
  setIsLevelFailed: (flag: boolean) => void;
  resetUIState: () => void;
  scrollToCenter: (target: ScrollTarget | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  scrollTarget: { x: 0, y: 0 },
  currentCommand: null,
  isPendingCommand: false,
  isLevelFailed: false,
  setIsPendingCommand: (flag) => set({ isPendingCommand: flag }),
  setIsLevelFailed: (flag) => set({ isLevelFailed: flag }),
  setCurrentCommand: (command) => set({ currentCommand: command }),
  resetUIState: () =>
    set({
      isPendingCommand: false,
      isLevelFailed: false,
      currentCommand: null,
    }),
  scrollToCenter: (target) => set({ scrollTarget: target }),
}));
