import type { IWorkspaceItem } from "@/features/student/command/types.ts";
import type { PointerEvent as ReactPointerEvent } from "react";
import { nanoid } from "nanoid";

/**
 * Handles the initial PointerDown event on a palette item.
 *
 * This function:
 * 1. Prevents default dragging behavior and disables text selection.
 * 2. Clones the original item (giving it a fresh ID).
 * 3. Clears any existing parent/children data on the clone if it's a loop.
 * 4. Starts dragging with the cloned item and stores the initial pointer position.
 *
 * @param e               React PointerEvent from onPointerDown.
 * @param item            The original workspace item from COMMAND_ITEMS.
 * @param setDraggingItem Setter function from useDragDrop to begin dragging.
 * @param setPointer      Setter function from useDragDrop to set initial pointer coords.
 */
export function onPalettePointerDown(
  e: ReactPointerEvent,
  item: IWorkspaceItem,
  setDraggingItem: (item: IWorkspaceItem) => void,
  setPointer: (coords: { x: number; y: number }) => void,
) {
  // Prevent browser-native drag behavior and disable text selection
  e.preventDefault();
  document.body.style.userSelect = "none";

  // Create a new clone with a fresh ID, no parent, and an empty children array if it's a loop
  const clonedItem: IWorkspaceItem = {
    ...item,
    id: nanoid(),
    parent: null,
    ...(item.command === "loop" ? { children: [] } : {}),
  };

  // Tell the drag-drop store to start dragging this cloned item
  setDraggingItem(clonedItem);

  // Store the pointer's initial position for preview rendering
  setPointer({ x: e.clientX, y: e.clientY });
}
