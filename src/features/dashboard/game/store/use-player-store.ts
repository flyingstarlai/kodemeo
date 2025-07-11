import { create } from "zustand";

interface PlayerRenderData {
  id: number;
  x: number;
  y: number;
  rotation: number;
  animationName: string;
  animationSpeed: number;
}

interface PlayerStore {
  sprites: PlayerRenderData[];
  setSprites: (sprites: PlayerRenderData[]) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  sprites: [],
  setSprites: (sprites) => set({ sprites }),
}));
