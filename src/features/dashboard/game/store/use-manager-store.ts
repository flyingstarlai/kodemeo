import { create } from "zustand";
import type { QueuedCommand } from "@/ecs/components/logic/queue.ts";

interface ManagerStore {
  commands: QueuedCommand[];
  executeNow: boolean;
  stars: number;
  shouldSubmit: boolean;
  setCommands: (commands: QueuedCommand[]) => void;
  setExecuteNow: (flag: boolean) => void;
  markShouldSubmit: (stars: number) => void;
  markSubmitted: () => void;
}

export const useManagerStore = create<ManagerStore>((set) => ({
  commands: [],
  executeNow: false,
  stars: 0,
  shouldSubmit: false,
  setCommands: (commands) => set({ commands }),
  setExecuteNow: (flag) => set({ executeNow: flag }),
  markShouldSubmit: (stars: number) => set({ shouldSubmit: true, stars }),
  markSubmitted: () => set({ shouldSubmit: false, stars: 0 }),
}));
