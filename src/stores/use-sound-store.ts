import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SoundStore {
  muted: boolean;
  setMuted: (flag: boolean) => void;
}

export const useSoundStore = create<SoundStore>()(
  persist(
    (set) => ({
      muted: false,
      setMuted: (flag) => set({ muted: flag }),
    }),
    {
      name: "sound-pref",
    },
  ),
);
