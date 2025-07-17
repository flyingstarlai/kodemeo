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
} from "@/features/dashboard/command/types.ts";
import { LoopCommand } from "@/features/dashboard/command/components/loop-command.tsx";
import { BaseCommand } from "@/features/dashboard/command/components/base-command.tsx";
import clsx from "clsx";
import { Insertion } from "@/features/dashboard/command/components/insertion.tsx";
import { CommandControls } from "@/features/dashboard/command/components/command-controls.tsx";
import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import { onWorkspacePointerDown } from "@/features/dashboard/command/utils/workspace-panel-utils.ts";
import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import { useManagerStore } from "@/features/dashboard/game/store/use-manager-store.ts";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";
import { useCycleStore } from "@/features/dashboard/game/store/use-cycle-store.ts";
import { flattenWorkspaceItems } from "@/features/dashboard/command/utils/flatten-command.ts";
import { useChallengeTokenStore } from "@/features/dashboard/game/store/use-challenge-token-store.ts";
import { isTokenExpired } from "@/lib/expired.ts";
import { usePopupStore } from "@/features/dashboard/game/store/use-popup-store.ts";

export const WorkspacePanel = forwardRef<HTMLDivElement>((_, ref) => {
  const {
    draggingItem,
    setDraggingItem,
    setHoveredLoopId,
    setPointer,
    workspaceItems,
    insertionIndex,
  } = useDragDropStore();

  const { setCoins } = useCollectibleStore();
  const resetUIState = useUIStore((s) => s.resetUIState);
  const triggerCleanup = useCycleStore((s) => s.triggerCleanup);

  const { setCommands, setExecuteNow } = useManagerStore();
  const { currentCommand, isLevelFailed, setIsPendingCommand } = useUIStore();

  const { token, timestamp } = useChallengeTokenStore();
  const challenge = useLevelStore((s) => s.currentLevel);
  const guides = challenge?.guides ?? [];

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
    if (!token || !timestamp) return;
    if (isTokenExpired(timestamp)) {
      usePopupStore
        .getState()
        .showDialog(
          false,
          0,
          "Oops!",
          "Sesi permainan telah habis, silakan mengulang lagi.",
          true,
        );
      return;
    }
    stopRef.current = false;
    setIsRunning(true);

    const commands = flattenWorkspaceItems(workspaceItems);
    setCommands(commands);
    setExecuteNow(true);
    setIsPendingCommand(true);

    setIsRunning(false);
  }, [
    setCommands,
    setExecuteNow,
    setIsPendingCommand,
    workspaceItems,
    token,
    timestamp,
  ]);

  // Called when the user clicks “Stop”
  const onStop = useCallback(() => {
    stopRef.current = true;
    setCoins(0);
    resetUIState();
    triggerCleanup(true);
    setIsRunning(false);
  }, [resetUIState, setCoins, triggerCleanup]);

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
                    isLevelFailed &&
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
      <div className="absolute inset-0 flex flex-items justify-start items-center px-2  gap-2 pointer-events-none">
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
    <div className="relative xl:px-2 xl:py-2 px-2 py-1 flex items-center justify-between border rounded dark:bg-zinc-800">
      <div
        ref={ref}
        data-dropzone="workspace"
        className="flex w-full flex-wrap gap-2 xl:min-h-[108px] min-h-[90px]"
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
