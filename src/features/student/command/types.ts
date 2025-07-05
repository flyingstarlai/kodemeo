export type Variant = "direction" | "action" | "control";

export interface IBaseCommand {
  id: string;
  command: "left" | "right" | "up" | "down" | "scratch";
  parent: string | null;
  variant: Variant;
}

export interface ILoopCommand {
  id: string;
  command: "loop";
  parent: string | null;
  variant: Variant;
  count: number;
  children: Array<IBaseCommand>;
}

export type IWorkspaceItem = IBaseCommand | ILoopCommand;

export interface IHoverSlot {
  ref: string;
  index: number;
}

export interface IRunningId {
  id: string;
  parentId: string | null;
}

export interface DataHandleProps {
  dragHandle: "container" | "child" | undefined;
}
