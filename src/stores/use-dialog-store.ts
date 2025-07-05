import { create } from "zustand";

interface DialogStore {
  open: boolean;
  title: string;
  message: string;
  showStar: boolean;
  openDialog: (params: {
    title: string;
    message: string;
    showStar?: boolean;
  }) => void;
  closeDialog: () => void;
}

export const useDialogStore = create<DialogStore>((set) => ({
  open: false,
  title: "",
  message: "",
  showStar: false,
  openDialog: ({ title, message, showStar = false }) =>
    set({ open: true, title, message, showStar }),
  closeDialog: () =>
    set({ open: false, title: "", message: "", showStar: false }),
}));
