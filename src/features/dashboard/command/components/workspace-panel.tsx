import React, { useState, useCallback, useRef, type ReactNode } from "react";
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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { MAX_STEPS } from "@/features/dashboard/game/constans.ts";

export const WorkspacePanel = () => {
  const {
    draggingItem,
    setDraggingItem,
    setHoveredLoopId,
    setPointer,
    workspaceItems,
    insertionIndex,
  } = useDragDropStore();

  const setCoins = useCollectibleStore((s) => s.setCoins);
  const resetUIState = useUIStore((s) => s.resetUIState);
  const triggerCleanup = useCycleStore((s) => s.triggerCleanup);

  const { setCommands, setExecuteNow } = useManagerStore();
  const { currentCommand, isLevelFailed, setIsPendingCommand } = useUIStore();

  const { token, timestamp } = useChallengeTokenStore();
  const challenge = useLevelStore((s) => s.currentLevel);
  const showAnswer = useLevelStore((s) => s.showAnswer);
  const guides = challenge?.guides ?? [];
  const answer = challenge?.answer ?? [];

  // State to track whether a sequence is in progress
  const [isRunning, setIsRunning] = useState(false);

  // Mutable ref to signal when a stop is requested
  const stopRef = useRef(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback(() => {
    scrollContainerRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  }, []);

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

  let guideItems: IWorkspaceItem[] = showAnswer
    ? answer.map((cmd, idx) => ({
        command: cmd,
        id: `hint_${idx + 1}`, // hint_1, hint_2, …
        parent: null,
        variant: "direction" as Variant, // or whatever variant you use for those icons
      }))
    : guides.map((cmd, idx) => ({
        command: cmd,
        id: `hint_${idx + 1}`, // hint_1, hint_2, …
        parent: null,
        variant: "direction" as Variant, // or whatever variant you use for those icons
      }));

  if (guideItems.length === 0) {
    guideItems = Array.from({ length: MAX_STEPS }, (_, idx) => ({
      command: "blank",
      id: `hint_blank_${idx + 1}`,
      parent: null,
      variant: "direction" as Variant,
    }));
  }
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
      <div className="absolute inset-0 flex flex-nowrap items-center gap-2 pointer-events-none opacity-35">
        {guideItems.map((item) => (
          <div key={item.id} data-workspace-item={true}>
            {item.command === "loop" ? (
              <LoopCommand
                item={item as ILoopCommand}
                type="workspace"
                runningCommand={currentCommand}
              />
            ) : (
              <BaseCommand item={item} type="workspace" />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex items-center gap-2 border rounded dark:bg-zinc-800 p-2">
      {/* Left Scroll Button */}
      <button
        onClick={scrollLeft}
        className="px-2 py-1 bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 z-20"
      >
        <ChevronLeftIcon className="w-8 h-8" />
      </button>

      {/* Scrollable Workspace */}
      <div
        ref={scrollContainerRef}
        data-dropzone="workspace"
        className="flex w-full flex-nowrap gap-2 xl:min-h-[108px] min-h-[90px] overflow-x-auto scrollbar-hide relative"
      >
        {/* Guide items go first so they align */}
        {renderGuideItem()}

        {/* Actual items */}
        {visibleItems.map((item, idx) => renderItem(item, idx))}
        {insertionIndex === visibleItems.length && draggingItem && (
          <div className="flex items-center gap-1">
            <Insertion type="workspace" />
          </div>
        )}
      </div>

      {/* Right Scroll Button */}
      <button
        onClick={scrollRight}
        className="px-2 py-1 bg-gray-200 dark:bg-zinc-700 rounded hover:bg-gray-300 dark:hover:bg-zinc-600 z-20"
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Controls */}
      <CommandControls
        isRunning={isRunning}
        onRun={runSequence}
        onStop={onStop}
        disabled={workspaceItems.length === 0}
      />
    </div>
  );
};
