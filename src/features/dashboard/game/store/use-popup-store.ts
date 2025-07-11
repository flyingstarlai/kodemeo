import { create } from "zustand";

interface PopupStore {
  open: boolean;
  onGoal: boolean;
  earnedStars: number;
  title: string;
  message: string;
  hideStar: boolean;
  showDialog: (
    onGoal: boolean,
    earnedStars: number,
    title: string,
    message: string,
    hideStar?: boolean,
  ) => void;
  closeDialog: () => void;
}

export const usePopupStore = create<PopupStore>((set) => ({
  open: false,
  onGoal: false,
  earnedStars: 0,
  title: "",
  message: "",
  hideStar: false,
  showDialog: (onGoal, earnedStars, title, message, hideStar) =>
    set({
      open: true,
      onGoal,
      earnedStars,
      title,
      message,
      hideStar,
    }),
  closeDialog: () => set({ open: false }),
}));
