import { component, field } from "@lastolivegames/becsy";

export type CommandType =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scratch"
  | "blank";

export interface QueuedCommand {
  id: string;
  parentId: string | null;
  command: CommandType;
}

@component
export class Queue {
  @field.object declare commands: QueuedCommand[];
}
