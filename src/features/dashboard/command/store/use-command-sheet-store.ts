import { create } from "zustand";

interface CommandSheetStore {
  isOpen: boolean;
  toggle: () => void;
}

export const useCommandSheetStore = create<CommandSheetStore>((set) => ({
  isOpen: false,
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
