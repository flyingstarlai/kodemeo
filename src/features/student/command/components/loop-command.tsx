import React, { useCallback } from "react";
import repeatIcon from "@/assets/command/repeat-sign.png";
import { clsx } from "clsx";
import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import { useEcsStore } from "@/stores/use-ecs-store";
import {
  getVisibleLoopChildren,
  onLoopChildPointerDown,
  updateLoopCount,
} from "../utils/loop-command-utils";
import type { QueuedCommand } from "@/features/student/game/types.ts";
import type { ILoopCommand } from "../types";
import { BaseCommand } from "./base-command";
import { variantMap } from "@/features/student/command/constants.ts";
import { Insertion } from "@/features/student/command/components/insertion.tsx";
import { LoopCount } from "@/features/student/command/components/loop-count.tsx";
import { useEntityQuery } from "@/features/student/game/hooks/use-entity-query.ts";

type LoopCommandProps = {
  type: "palette" | "workspace";
  item: ILoopCommand;
  runningCommand: QueuedCommand | null;
};

export const LoopCommand: React.FC<LoopCommandProps> = ({
  item,
  type,
  runningCommand,
}) => {
  const {
    hoveredLoopId,
    loopInsertionIndex,
    draggingItem,
    setDraggingItem,
    setHoveredLoopId,
    setPointer,
    workspaceItems,
    setWorkspaceItems,
  } = useDragDropStore();

  const [managerEid] = useEntityQuery(["session"]);
  const progressFacet = useEcsStore((s) =>
    s.getComponent(managerEid!, "progress"),
  );

  const handleCountChange = useCallback(
    (newCount: number) => {
      const updated = updateLoopCount(workspaceItems, item.id, newCount);
      setWorkspaceItems(updated);
    },
    [workspaceItems, setWorkspaceItems, item.id],
  );

  if (type === "workspace") {
    const isRunningParent =
      runningCommand !== null &&
      item.command === "loop" &&
      runningCommand.parentId === item.id;

    const isActive = hoveredLoopId === item.id && !!draggingItem;

    // Get children excluding the currently dragged item
    const visibleChildren = getVisibleLoopChildren(
      item.children,
      draggingItem?.id,
    );

    return (
      <div
        className={clsx(
          "h-[92px] p-2 border rounded flex items-center gap-x-2 justify-center flex-shrink-0 cursor-grab",
          variantMap[item.variant],
          isRunningParent && "ring-2 ring-sky-400 rounded",
        )}
      >
        <div
          className="p-2 h-[74px] min-w-[74px] gap-2 bg-sky-100/50 border rounded flex items-center justify-center flex-wrap cursor-grab drag-handle px-2"
          data-dropzone="loop"
          data-id={item.id}
        >
          {visibleChildren.map((child, index) => {
            const isRunningChild =
              runningCommand !== null &&
              runningCommand.parentId === item.id &&
              runningCommand.id === child.id;

            return (
              <React.Fragment key={child.id}>
                {isActive && loopInsertionIndex === index && (
                  <Insertion type="loop" />
                )}
                <div
                  data-id={child.id}
                  data-drag-handle="child"
                  className={clsx(
                    "loop-child-block drag-handle loop-child flex items-center gap-1 transition-all duration-200",
                    isRunningChild && [
                      "bg-blue-200/20 dark:bg-blue-800/20",
                      "ring-4 ring-blue-400 dark:ring-blue-300",
                      "rounded",
                      "animate-pulse",
                    ],
                    isRunningChild &&
                      progressFacet?.isOver &&
                      !progressFacet?.onGoal &&
                      "bg-orange-50/50 ring-orange-400",
                  )}
                  onPointerDown={(e) =>
                    onLoopChildPointerDown(
                      e,
                      child,
                      item.id,
                      setDraggingItem,
                      setHoveredLoopId,
                      setPointer,
                    )
                  }
                >
                  <BaseCommand item={child} type="loop" />
                </div>
              </React.Fragment>
            );
          })}

          {isActive && loopInsertionIndex === visibleChildren.length && (
            <div className="flex items-center gap-1">
              <Insertion type="loop" />
            </div>
          )}
        </div>

        <div data-drag-handle="counter" className="drag-handle counter">
          <LoopCount count={item.count} onChange={handleCountChange} />
        </div>
      </div>
    );
  }

  // Render for palette context
  return (
    <div
      className={clsx(
        "w-14 h-14 p-2 border rounded flex items-center justify-center flex-shrink-0 cursor-grab",
        variantMap[item.variant],
      )}
    >
      <img
        draggable={false}
        src={repeatIcon}
        onDragStart={(e) => e.preventDefault()}
        alt={item.command}
        className="w-7 h-7 pointer-events-none select-none touch-none"
      />
    </div>
  );
};
