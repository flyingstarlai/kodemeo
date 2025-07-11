import { create } from "zustand";

interface CycleState {
  shouldCleanup: boolean;
  shouldSpawn: boolean;
  triggerCleanup: (flag: boolean) => void;
  triggerSpawn: (flag: boolean) => void;
}

export const useCycleStore = create<CycleState>((set) => ({
  shouldCleanup: false,
  shouldSpawn: false,
  triggerCleanup: (flag) => set({ shouldCleanup: flag }),
  triggerSpawn: (flag) => set({ shouldSpawn: flag }),
}));
