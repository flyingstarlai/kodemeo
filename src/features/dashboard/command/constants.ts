import { nanoid } from "nanoid";
import type {
  IWorkspaceItem,
  Variant,
} from "@/features/dashboard/command/types.ts";

export const COMMAND_ITEMS: IWorkspaceItem[] = [
  {
    id: nanoid(),
    command: "left",
    parent: null,
    variant: "direction",
  },
  {
    id: nanoid(),
    command: "right",
    parent: null,
    variant: "direction",
  },
  {
    id: nanoid(),
    command: "up",
    parent: null,
    variant: "direction",
  },
  {
    id: nanoid(),
    command: "down",
    parent: null,
    variant: "direction",
  },
  {
    id: nanoid(),
    command: "scratch",
    parent: null,
    variant: "action",
  },
  {
    id: nanoid(),
    command: "loop",
    variant: "control",
    parent: null,
    children: [],
    count: 2,
  },
];

export const variantMap: Record<Variant, string> = {
  direction: "bg-green-200/80 border-green-300",
  action: "bg-lime-200/80 border-lime-300",
  control: "bg-sky-200/80 border-sky-300",
};

export const DEFAULT_DELAY_MS = 600;
