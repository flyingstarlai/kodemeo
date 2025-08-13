import { create } from "zustand";

interface EnemyData {
  id: number;
  x: number;
  y: number;
  animationName: string;
  animationSpeed: number;
}

interface EnemyStore {
  sprites: EnemyData[];
  setSprites: (sprites: EnemyData[]) => void;
}

export const useEnemyStore = create<EnemyStore>((set) => ({
  sprites: [],

  setSprites: (sprites) => set({ sprites }),
}));
