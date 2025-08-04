import { create } from "zustand";
import type { LevelData } from "@/features/dashboard/challenge/types.ts";

interface LevelStore {
  currentLevel: LevelData | null;
  showAnswer: boolean;
  setCurrentLevel: (levelData: LevelData) => void;
  setShowAnswer: (showAnswer: boolean) => void;
}

export const useLevelStore = create<LevelStore>((set) => ({
  currentLevel: null,
  showAnswer: false,
  setCurrentLevel: (levelData) => set({ currentLevel: levelData }),
  setShowAnswer: (showAnswer) => set({ showAnswer }),
}));
