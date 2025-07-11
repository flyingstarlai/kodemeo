import { create } from "zustand";

interface CollectibleRenderData {
  id: number;
  x: number;
  y: number;
  animationName: string;
  animationSpeed: number;
}

interface CollectibleStore {
  coins: number;
  maxCoins: number;
  sprites: CollectibleRenderData[];
  setCoins: (n: number) => void;
  setMaxCoins: (n: number) => void;
  setSprites: (sprites: CollectibleRenderData[]) => void;
}

export const useCollectibleStore = create<CollectibleStore>((set) => ({
  coins: 0,
  maxCoins: 0,
  sprites: [],
  setCoins: (n) => set({ coins: n }),
  setMaxCoins: (n) => set({ maxCoins: n }),
  setSprites: (sprites) => set({ sprites }),
}));
