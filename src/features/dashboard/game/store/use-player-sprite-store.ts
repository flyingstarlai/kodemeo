import { create } from "zustand";

export interface SpriteData {
  id: number;
  x: number;
  y: number;
  rotation: number;
  animationName: string;
  animationSpeed: number;
  isLooped: boolean;
}

interface PlayerStore {
  sprites: SpriteData[];
  completed: boolean;
  setSprites: (sprites: SpriteData[]) => void;
  toggleComplete: () => void;
}

export const usePlayerSpriteStore = create<PlayerStore>((set) => ({
  sprites: [],
  completed: false,
  setSprites: (sprites) => set({ sprites }),
  toggleComplete: () => set((state) => ({ completed: !state.completed })),
}));
