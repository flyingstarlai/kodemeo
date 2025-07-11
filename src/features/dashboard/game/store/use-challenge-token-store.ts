import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ChallengeTokenStore {
  id: string | null;
  token: string | null;
  timestamp: string | null;
  setToken: (id: string, token: string, timestamp: string) => void;
}

export const useChallengeTokenStore = create<ChallengeTokenStore>()(
  persist(
    (set) => ({
      id: null,
      token: null,
      timestamp: null,
      setToken: (id, token, timestamp) => set({ id, token, timestamp }),
    }),
    {
      name: "challenge-token",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
