import type {
  ILoopCommand,
  IWorkspaceItem,
} from "@/features/dashboard/command/types.ts";
import type { QueuedCommand } from "@/ecs/components/logic/queue.ts";

export function flattenWorkspaceItems(
  items: IWorkspaceItem[],
): QueuedCommand[] {
  const result: QueuedCommand[] = [];

  function helper(item: IWorkspaceItem, parentId: string | null) {
    if (item.command === "loop") {
      const loopItem = item as ILoopCommand;
      // For each repetition:
      for (let i = 0; i < loopItem.count; i++) {
        // Recurse over each child, marking this loop’s id as parentId
        for (const child of loopItem.children) {
          helper(child, loopItem.id);
        }
      }
    } else {
      // Base command: emit one entry with the given parentId
      result.push({
        id: item.id,
        parentId: parentId,
        command: item.command,
      });
    }
  }

  for (const item of items) {
    // Top‐level items have no parent loop: parentId = null
    helper(item, null);
  }

  return result;
}
