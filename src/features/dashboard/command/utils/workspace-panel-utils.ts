import type {
  DataHandleProps,
  IWorkspaceItem,
} from "@/features/dashboard/command/types.ts";
import type { PointerEvent as ReactPointerEvent } from "react";

/**
 * Handles the initial PointerDown on a workspace item.
 *
 * This function:
 * 1. Finds the closest element with `data-drag-handle="container"`.
 * 2. If found, it prevents text selection on <body>.
 * 3. Clears any hovered loop ID, sets the dragged item, and updates the pointer position.
 *
 * @param e          The React PointerEvent from onPointerDown.
 * @param item       The workspace item being clicked.
 * @param setHoveredLoopId   Setter from useDragDrop to clear hovered loop.
 * @param setDraggingItem    Setter from useDragDrop to start dragging.
 * @param setPointer         Setter from useDragDrop to set initial pointer coords.
 */
export function onWorkspacePointerDown(
  e: ReactPointerEvent,
  item: IWorkspaceItem,
  setHoveredLoopId: (id: string | null) => void,
  setDraggingItem: (item: IWorkspaceItem) => void,
  setPointer: (coords: { x: number; y: number }) => void,
) {
  // Find the nearest element that actually has the data-drag-handle attribute
  const el = e.target as HTMLElement;
  const handle = el.closest<HTMLElement>("[data-drag-handle]");
  const handleType = handle?.dataset as unknown as DataHandleProps;

  if (!handleType) {
    // If there was no handle element, do nothing
    return;
  }

  // Prevent text from being selected while dragging
  document.body.style.userSelect = "none";

  if (handleType.dragHandle === "container") {
    // Clear any existing hovered loop
    setHoveredLoopId(null);

    // Tell the store “we are now dragging this item”
    setDraggingItem(item);

    // Store the starting pointer coords for the drag preview
    setPointer({ x: e.clientX, y: e.clientY });
  }
}
