import { create } from "zustand";
import type { QueuedCommand } from "@/ecs/components/logic/queue.ts";

interface UIStore {
  currentCommand: QueuedCommand | null;
  isPendingCommand: boolean;
  isLevelFailed: boolean;
  setCurrentCommand: (command: QueuedCommand | null) => void;
  setIsPendingCommand: (flag: boolean) => void;
  setIsLevelFailed: (flag: boolean) => void;
  resetUIState: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
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
}));
