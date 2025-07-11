import type {
  IBaseCommand,
  ILoopCommand,
  IWorkspaceItem,
} from "@/features/dashboard/command/types.ts";
import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Returns the list of children, excluding the one currently being dragged (if any).
 *
 * @param children    Array of child items inside the loop.
 * @param draggingId  The ID of the item currently being dragged (or null/undefined).
 * @returns           Filtered array of children without the dragging item.
 */
export function getVisibleLoopChildren(
  children: IBaseCommand[],
  draggingId: string | null | undefined,
): IBaseCommand[] {
  if (!draggingId) {
    return children;
  }
  return children.filter((child) => child.id !== draggingId);
}

/**
 * Handles the initial PointerDown on a loop child.
 *
 * This function:
 * 1. Verifies that the clicked element has data-drag-handle="child".
 * 2. Sets the dragged child into the drag-drop store.
 * 3. Sets the hovered loop ID and pointer position.
 *
 * @param e                   React PointerEvent from onPointerDown.
 * @param child               The child item being dragged.
 * @param loopId              The ID of the parent loop.
 * @param setDraggingItem     Setter from useDragDrop to begin dragging.
 * @param setHoveredLoopId    Setter from useDragDrop to mark which loop is hovered.
 * @param setPointer          Setter from useDragDrop to set pointer coordinates.
 */
export function onLoopChildPointerDown(
  e: ReactPointerEvent,
  child: IWorkspaceItem,
  loopId: string,
  setDraggingItem: (item: IWorkspaceItem) => void,
  setHoveredLoopId: (id: string | null) => void,
  setPointer: (coords: { x: number; y: number }) => void,
) {
  // Find the nearest element with data-drag-handle="child"
  const el = e.target as HTMLElement;
  const handle = el.closest<HTMLElement>("[data-drag-handle='child']");
  if (!handle) {
    return;
  }

  // Prevent text selection while starting the drag
  document.body.style.userSelect = "none";

  // Begin dragging this child
  setDraggingItem(child);

  // Mark this loop as hovered
  setHoveredLoopId(loopId);

  // Store initial pointer position
  setPointer({ x: e.clientX, y: e.clientY });
}

/**
 * Returns a new array of workspace items where the loop with the given ID
 * has its `count` field updated to `newCount`.
 *
 * @param items     The full array of IWorkspaceItem.
 * @param loopId    The ID of the loop whose count should change.
 * @param newCount  The new count value to assign.
 * @returns         A brand-new array with that loop’s `count` updated.
 */
export function updateLoopCount(
  items: IWorkspaceItem[],
  loopId: string,
  newCount: number,
): IWorkspaceItem[] {
  return items.map((item) => {
    // Only update if this is a loop item with a matching ID
    if (item.command === "loop" && item.id === loopId) {
      const loopItem = item as ILoopCommand;
      return {
        ...loopItem,
        count: newCount,
      };
    }
    return item;
  });
}
