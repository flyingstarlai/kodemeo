import { create } from "zustand";

interface TreasureRenderData {
  id: number;
  x: number;
  y: number;
  rotation: number;
}

interface TreasureStore {
  sprites: TreasureRenderData[];
  setSprites: (sprites: TreasureRenderData[]) => void;
}

export const useTreasureStore = create<TreasureStore>((set) => ({
  sprites: [],
  setSprites: (sprites) => set({ sprites }),
}));
