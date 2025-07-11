import { create } from "zustand";
import type { LevelData } from "@/features/dashboard/challenge/types.ts";

interface LevelStore {
  currentLevel: LevelData | null;
  setCurrentLevel: (levelData: LevelData) => void;
}

export const useLevelStore = create<LevelStore>((set) => ({
  currentLevel: null,
  setCurrentLevel: (levelData) => set({ currentLevel: levelData }),
}));
