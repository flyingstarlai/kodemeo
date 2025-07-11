import { create } from "zustand";

interface GameState {
  playerPositions: { id: number; x: number; y: number }[];
  setPlayerPositions: (pos: { id: number; x: number; y: number }[]) => void;
}

export const useGameState = create<GameState>((set) => ({
  playerPositions: [],
  setPlayerPositions: (pos) => set({ playerPositions: pos }),
}));
