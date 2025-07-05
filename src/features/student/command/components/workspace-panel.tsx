import React, {
  forwardRef,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type {
  IWorkspaceItem,
  ILoopCommand,
  Variant,
} from "@/features/student/command/types.ts";
import { LoopCommand } from "@/features/student/command/components/loop-command.tsx";
import { BaseCommand } from "@/features/student/command/components/base-command.tsx";
import clsx from "clsx";
import { Insertion } from "@/features/student/command/components/insertion.tsx";
import { CommandControls } from "@/features/student/command/components/command-controls.tsx";
import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import { useEcsStore } from "@/stores/use-ecs-store";
import { useEntityQuery } from "../../game/hooks/use-entity-query";
import { onWorkspacePointerDown } from "@/features/student/command/utils/workspace-panel-utils.ts";
import { resetPlayerToStart } from "@/features/student/game/utils/reset-player-utils.ts";
import { queueWorkspaceSequence } from "@/features/student/game/utils/command-utils.ts";

export const WorkspacePanel = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    draggingItem,
    setDraggingItem,
    setHoveredLoopId,
    setPointer,
    workspaceItems,
    insertionIndex,
  } = useDragDropStore();

  const guides = useEcsStore((s) => s.levelData.guides) ?? [];

  const [playerEid] = useEntityQuery(["playerTag"]);
  const currentCommand = useEcsStore((s) => s.currentCommand);
  const [managerEid] = useEntityQuery(["managerTag"]);
  const progressFacet = useEcsStore((s) =>
    s.getComponent(managerEid!, "progress"),
  );
  const level = useEcsStore((s) => s.levelData);

  // State to track whether a sequence is in progress
  const [isRunning, setIsRunning] = useState(false);

  // Mutable ref to signal when a stop is requested
  const stopRef = useRef(false);

  // Filter out the item currently being dragged
  const visibleItems: IWorkspaceItem[] = draggingItem
    ? workspaceItems.filter((item) => item.id !== draggingItem.id)
    : workspaceItems;

  // Start running the sequence; clear any previous stop flag
  const runSequence = useCallback(async () => {
    stopRef.current = false;
    setIsRunning(true);

    if (playerEid !== undefined) {
      queueWorkspaceSequence(workspaceItems, playerEid);
    }

    setIsRunning(false);
  }, [playerEid, workspaceItems]);

  // Called when the user clicks “Stop”
  const onStop = useCallback(() => {
    stopRef.current = true;
    resetPlayerToStart(playerEid, managerEid, level);
    setIsRunning(false);
  }, [level, managerEid, playerEid]);

  const guideItems: IWorkspaceItem[] = guides.map((cmd, idx) => ({
    command: cmd,
    id: `hint_${idx + 1}`, // hint_1, hint_2, …
    parent: null,
    variant: "direction" as Variant, // or whatever variant you use for those icons
  }));

  // Renders each item with a highlight if it is currently running
  const renderItem = (item: IWorkspaceItem, idx: number): ReactNode => {
    const isRunningThisItem =
      currentCommand !== null &&
      currentCommand.parentId === null &&
      currentCommand.id === item.id;

    return (
      <React.Fragment key={item.id}>
        {insertionIndex === idx && draggingItem && (
          <div className="flex items-center gap-1">
            <Insertion type="workspace" />
          </div>
        )}

        <div
          onPointerDown={(e) =>
            onWorkspacePointerDown(
              e,
              item,
              setHoveredLoopId,
              setDraggingItem,
              setPointer,
            )
          }
          className={clsx(
            "workspace-block flex items-center gap-1",
            draggingItem?.id === item.id && "opacity-50",
          )}
          data-id={item.id}
        >
          <div data-drag-handle="container">
            {item.command === "loop" ? (
              <LoopCommand
                item={item as ILoopCommand}
                type="workspace"
                runningCommand={currentCommand}
              />
            ) : (
              <div
                className={clsx(
                  "transition-all duration-200",
                  isRunningThisItem &&
                    "bg-blue-50/50 ring-4 ring-blue-400 rounded animate-pulse",
                  isRunningThisItem &&
                    progressFacet?.isOver &&
                    !progressFacet?.onGoal &&
                    "bg-orange-50/50 ring-orange-400",
                )}
              >
                <BaseCommand item={item} type="workspace" />
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const renderGuideItem = (): ReactNode => {
    return (
      <div className="absolute inset-0 flex flex-items justify-start items-center px-2 gap-2 pointer-events-none">
        {guideItems.map((item) => (
          <div key={item.id} data-workspace-item={true}>
            {item.command === "loop" ? (
              <LoopCommand
                item={item as ILoopCommand}
                type="workspace"
                runningCommand={currentCommand}
              />
            ) : (
              <div className={clsx("transition-all duration-200 opacity-35")}>
                <BaseCommand item={item} type="workspace" />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="relative p-2 flex items-center justify-between border rounded dark:bg-zinc-800">
      <div
        ref={ref}
        data-dropzone="workspace"
        className="flex w-full flex-wrap gap-2 min-h-[108px]"
      >
        {visibleItems.map((item, idx) => renderItem(item, idx))}

        {renderGuideItem()}

        {insertionIndex === visibleItems.length && draggingItem && (
          <div className="flex items-center gap-1">
            <Insertion type="workspace" />
          </div>
        )}
      </div>

      <CommandControls
        isRunning={isRunning}
        onRun={runSequence}
        onStop={onStop}
        disabled={workspaceItems.length === 0}
      />
    </div>
  );
});
