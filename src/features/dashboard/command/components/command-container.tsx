import { useDragDropStore } from "@/stores/use-drag-drop-store";
import React, { useEffect, useCallback } from "react";
import type { ILoopCommand, IWorkspaceItem } from "../types";
import {
  findLoopWithChild,
  getInsertionIndex,
} from "@/features/dashboard/command/utils/drag-drop-utils.ts";
import { WorkspacePanel } from "@/features/dashboard/command/components/workspace-panel.tsx";
import { PalettePanel } from "@/features/dashboard/command/components/pallete-panel.tsx";
import { DragPreview } from "./drag-preview";
import { playSound } from "@/lib/sounds.ts";
import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";

export const CommandContainer: React.FC = () => {
  const currentLevel = useLevelStore((s) => s.currentLevel);

  const {
    draggingItem,
    setDraggingItem,
    workspaceItems,
    setWorkspaceItems,
    insertionIndex,
    setInsertionIndex,
    setPointer,
    setIsOverDeleteZone,
    hoveredLoopId,
    setHoveredLoopId,
    loopInsertionIndex,
    setLoopInsertionIndex,
  } = useDragDropStore();

  /**
   * Helper: Given an array of workspace items, a loopId, and a childId,
   * returns a new array where that child has been removed from the specified loop’s children.
   */
  const removeChildFromLoop = useCallback(
    (
      items: IWorkspaceItem[],
      loopId: string,
      childId: string,
    ): IWorkspaceItem[] => {
      return items.map((item) => {
        // Only adjust items that are loops and match the given loopId
        if (item.command !== "loop" || item.id !== loopId) {
          return item;
        }

        // Filter out the child with childId
        const loopItem = item as ILoopCommand;
        const filteredChildren = loopItem.children.filter(
          (c) => c.id !== childId,
        );
        return { ...loopItem, children: filteredChildren };
      });
    },
    [],
  );

  /**
   * Clears only the loop-specific hover states.
   */
  const clearLoopHover = useCallback(() => {
    setHoveredLoopId(null);
    setLoopInsertionIndex(null);
  }, [setHoveredLoopId, setLoopInsertionIndex]);

  /**
   * Clears all hover states (loop + workspace).
   */
  const clearHoverStates = useCallback(() => {
    clearLoopHover();
    setInsertionIndex(null);
  }, [clearLoopHover, setInsertionIndex]);

  /**
   * Resets all drag-related state back to initial.
   */
  const resetDragState = useCallback(() => {
    setDraggingItem(null);
    setInsertionIndex(null);
    setHoveredLoopId(null);
    setLoopInsertionIndex(null);
    setIsOverDeleteZone(false);
  }, [
    setDraggingItem,
    setInsertionIndex,
    setHoveredLoopId,
    setLoopInsertionIndex,
    setIsOverDeleteZone,
  ]);

  useEffect(() => {
    if (!draggingItem) {
      return;
    }

    /**
     * Handles pointer movement during a drag.
     * - Updates the drag preview position.
     * - Determines whether the pointer is over workspace, palette (delete zone), or a loop.
     * - Calculates insertion indices for loops or workspace.
     */
    const handleMove = (e: PointerEvent) => {
      if (!draggingItem) return;

      setPointer({ x: e.clientX, y: e.clientY });

      const targetEl = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      if (!targetEl) {
        clearHoverStates();
        return;
      }

      const paletteZone = targetEl.closest(
        "[data-dropzone='palette']",
      ) as HTMLElement | null;
      const workspaceZone = targetEl.closest(
        "[data-dropzone='workspace']",
      ) as HTMLElement | null;
      const loopZone = targetEl.closest(
        "[data-dropzone='loop']",
      ) as HTMLElement | null;

      const isFromWorkspace = workspaceItems.some(
        (i) => i.id === draggingItem.id,
      );
      const loopInfo = findLoopWithChild(workspaceItems, draggingItem.id);
      const isFromLoop = !!loopInfo;

      // If hovering over the palette, mark delete zone
      setIsOverDeleteZone(!!paletteZone && (isFromWorkspace || isFromLoop));

      // Handle loop hover
      if (loopZone) {
        // If dragging a loop item itself, skip loop insertion calculation
        if (draggingItem.command === "loop") {
          clearLoopHover();
          return;
        }

        const loopId = loopZone.dataset.id!;
        setHoveredLoopId(loopId);

        // Calculate index within the loop's children
        const index = getInsertionIndex(
          loopZone,
          ".loop-child-block",
          e.clientX,
        );
        setLoopInsertionIndex(index);
        setInsertionIndex(null);
        return;
      }

      // If not over a loop, clear any loop-specific hover state
      clearLoopHover();

      // Handle workspace hover
      if (workspaceZone) {
        const index = getInsertionIndex(
          workspaceZone,
          ".workspace-block",
          e.clientX,
        );
        setInsertionIndex(index);
      } else {
        setInsertionIndex(null);
      }
    };

    /**
     * Handles the drop action when the pointer is released.
     * - Moves or removes items according to whether they came from a loop, workspace, or palette.
     */
    const handleUp = (e: PointerEvent) => {
      if (!draggingItem) return;
      const guides = currentLevel?.guides ?? [];

      const targetEl = document.elementFromPoint(
        e.clientX,
        e.clientY,
      ) as HTMLElement | null;
      const isInWorkspace = !!targetEl?.closest('[data-dropzone="workspace"]');
      const isInPalette = !!targetEl?.closest('[data-dropzone="palette"]');

      // Clone workspaceItems to avoid direct mutation
      let updatedItems = [...workspaceItems];

      // Check whether the dragged item originally came from workspace or a loop
      const idxInWorkspace = updatedItems.findIndex(
        (i) => i.id === draggingItem.id,
      );
      const loopInfo = findLoopWithChild(updatedItems, draggingItem.id);
      const isFromWorkspace = idxInWorkspace !== -1;
      const isFromLoop = loopInfo !== null;

      // If dropped into a valid loop
      if (
        hoveredLoopId &&
        loopInsertionIndex !== null &&
        draggingItem.command !== "loop"
      ) {
        updatedItems = updatedItems.map((item) => {
          if (item.command !== "loop") return item;
          const loop = item as ILoopCommand;

          if (loop.id === hoveredLoopId) {
            // Copy children array to avoid mutating original
            const children = [...loop.children];

            if (isFromLoop && loopInfo!.loopId === hoveredLoopId) {
              // Reorder within the same loop
              const oldIndex = loopInfo!.childIndex;
              children.splice(oldIndex, 1);
              const insertAt =
                oldIndex < loopInsertionIndex
                  ? loopInsertionIndex - 1
                  : loopInsertionIndex;
              children.splice(insertAt, 0, draggingItem);
            } else {
              // Move from outside into this loop
              children.splice(loopInsertionIndex, 0, draggingItem);
            }
            return { ...loop, children };
          }

          // If the dragged item was originally in a different loop, remove it from that loop
          if (isFromLoop && loop.id === loopInfo!.loopId) {
            // Use shared helper to remove child
            return removeChildFromLoop(
              updatedItems,
              loopInfo!.loopId,
              draggingItem.id,
            ).find((x) => x.id === loop.id) as ILoopCommand;
          }

          return loop;
        });

        // If the dragged item came from workspace, remove it from the top-level array
        if (isFromWorkspace) {
          updatedItems = updatedItems.filter((i) => i.id !== draggingItem.id);
        }

        setWorkspaceItems(updatedItems);
        resetDragState();
        return;
      }

      // If dropped into workspace (not a loop)
      if (isInWorkspace && insertionIndex !== null) {
        // 1) If we have a guide array and the drop slot is within it,
        //    only allow if the dragged command matches the guide at that index.
        if (
          guides.length > 0 &&
          (insertionIndex >= guides.length || // beyond guide range
            workspaceItems.length >= guides.length || // already filled all guides
            (guides[insertionIndex] !== "blank" &&
              draggingItem.command !== guides[insertionIndex])) // wrong command for this slot
        ) {
          resetDragState();
          playSound("onRejected", { volume: 0.1 });
          return;
        }
        // Remove from loop if it came from one
        if (isFromLoop && loopInfo) {
          updatedItems = removeChildFromLoop(
            updatedItems,
            loopInfo.loopId,
            draggingItem.id,
          );
        }

        // Remove from workspace if it came from top-level
        if (isFromWorkspace) {
          updatedItems = updatedItems.filter((i) => i.id !== draggingItem.id);
        }

        // Insert at the calculated insertionIndex
        updatedItems.splice(insertionIndex, 0, draggingItem);
        setWorkspaceItems(updatedItems);
        playSound("onDrop", { volume: 0.8 });
        resetDragState();
        return;
      }

      // If dropped into palette (delete zone)
      if (isInPalette) {
        // If from workspace, just remove it
        if (isFromWorkspace) {
          updatedItems = updatedItems.filter((i) => i.id !== draggingItem.id);
          playSound("onDestroy", { volume: 0.5 });
        }
        // If from a loop, remove it from that loop's children
        else if (isFromLoop && loopInfo) {
          updatedItems = removeChildFromLoop(
            updatedItems,
            loopInfo.loopId,
            draggingItem.id,
          );
        }

        setWorkspaceItems(updatedItems);
        resetDragState();
        return;
      }

      // If dropped elsewhere, just reset the drag state
      resetDragState();
    };

    // Attach event listeners
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);

    // Cleanup on unmount or when dependencies change
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [
    draggingItem,
    workspaceItems,
    insertionIndex,
    setPointer,
    setInsertionIndex,
    setDraggingItem,
    setWorkspaceItems,
    setHoveredLoopId,
    setLoopInsertionIndex,
    setIsOverDeleteZone,
    hoveredLoopId,
    loopInsertionIndex,
    clearLoopHover,
    clearHoverStates,
    resetDragState,
    removeChildFromLoop,
    currentLevel?.guides,
  ]);

  return (
    <div className="relative flex flex-col gap-y-2 touch-none xl:h-[230px] h-[190px]">
      <WorkspacePanel />
      <PalettePanel />
      <DragPreview />
    </div>
  );
};
