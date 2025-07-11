import { create } from "zustand";

interface TransitionStore {
  progress: number;
  active: boolean;
  setProgress: (alpha: number) => void;
  setActive: (flag: boolean) => void;
}

export const useTransitionStore = create<TransitionStore>((set) => ({
  progress: 0,
  active: false,
  setProgress: (alpha) => set({ progress: alpha }),
  setActive: (flag) => set({ active: flag }),
}));
