import type {
  ILoopCommand,
  IWorkspaceItem,
} from "@/features/student/command/types.ts";
import type { QueuedCommand } from "@/features/student/game/types.ts";
import { useEcsStore } from "@/stores/use-ecs-store.ts";

/**
 * Recursively flattens a list of IWorkspaceItem into a CommandType[].
 *
 * For each item:
 *  • If item.command !== "loop", push item.command once.
 *  • If item.command === "loop", then:
 *      – look at (item as ILoopCommand).children
 *      – repeat those child commands `count` times
 *      – if children themselves include loops, flatten them recursively
 */
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

/**
 * Immediately enqueue the entire workspace‐item sequence onto the player's `queue` component.
 *
 * @param items - the top‐level IWorkspaceItem[] from your workspace.
 * @param playerEid - the numeric entity ID of the player.
 */
export function queueWorkspaceSequence(
  items: IWorkspaceItem[],
  playerEid: number,
): void {
  const store = useEcsStore.getState();

  const commands = flattenWorkspaceItems(items);

  store.addComponent(playerEid, "queue", { commands });

  store.addComponent(playerEid, "spriteAnimation", {
    name: "walk",
    fps: 20,
    isPlaying: true,
  });
}
