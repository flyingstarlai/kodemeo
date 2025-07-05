import type {
  ILoopCommand,
  IWorkspaceItem,
} from "@/features/student/command/types.ts";

/**
 * Finds which loop (if any) contains a given child ID.
 * @param items Array of workspace items (including loops).
 * @param childId ID of the child to locate.
 * @returns An object with loopIndex, childIndex, and loopId if found; otherwise null.
 */
export function findLoopWithChild(
  items: IWorkspaceItem[],
  childId: string,
): { loopIndex: number; childIndex: number; loopId: string } | null {
  for (let loopIndex = 0; loopIndex < items.length; loopIndex++) {
    const item = items[loopIndex];
    if (item.command === "loop" && "children" in item) {
      const childIndex = (item as ILoopCommand).children.findIndex(
        (c) => c.id === childId,
      );
      if (childIndex !== -1) {
        return {
          loopIndex,
          childIndex,
          loopId: item.id,
        };
      }
    }
  }
  return null;
}

/**
 * Calculates the insertion index based on the pointer's X position inside a container.
 * The container must contain elements matching the provided selector (e.g., ".workspace-block" or ".loop-child-block").
 *
 * @param container The HTMLElement to search within.
 * @param itemSelector A CSS selector string for the child blocks inside the container.
 * @param clientX The X coordinate of the pointer event.
 * @returns The index at which the dragged item should be inserted.
 */
export function getInsertionIndex(
  container: HTMLElement,
  itemSelector: string,
  clientX: number,
): number {
  const blocks = Array.from(
    container.querySelectorAll<HTMLElement>(itemSelector),
  );
  for (let i = 0; i < blocks.length; i++) {
    const { left, width } = blocks[i].getBoundingClientRect();
    if (clientX < left + width / 2) {
      return i;
    }
  }
  return blocks.length;
}
