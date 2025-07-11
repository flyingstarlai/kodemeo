import type {
  IWorkspaceItem,
  ILoopCommand,
} from "@/features/dashboard/command/types.ts";

export interface RunningId {
  id: string;
  parentId: string | null;
}

/**
 * Delay helper.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs a sequence of workspace items (including nested loops), logging each step.
 * Checks `shouldStop()` before each step; if it returns true, the function aborts early
 * and clears any highlight.
 *
 * @param items         The array of workspace items.
 * @param setRunningId  Callback to highlight the currently running command/child.
 * @param shouldStop    A function that returns true if the run should abort.
 * @param delayMs       Number of milliseconds to wait between commands (default = 500).
 */
export async function runWorkspaceSequence(
  items: IWorkspaceItem[],
  setRunningId: (rid: RunningId | null) => void,
  shouldStop: () => boolean,
  delayMs = 500,
): Promise<void> {
  const totalItems = items.length;
  console.log(`Running workspace sequence: [1/${totalItems}] start`);

  for (let idx = 0; idx < totalItems; idx++) {
    if (shouldStop()) {
      // Abort early
      console.log(`Sequence stopped manually [${idx + 1}/${totalItems}]`);
      setRunningId(null);
      return;
    }

    const item = items[idx];
    const indexPrefix = `[${idx + 1}/${totalItems}]`;

    if (item.command === "loop") {
      const loopItem = item as ILoopCommand;

      if (loopItem.children.length === 0) {
        console.warn(
          `${indexPrefix} Loop block ${loopItem.id} has no children; skipping`,
        );
        continue;
      }

      for (let repeatIndex = 0; repeatIndex < loopItem.count; repeatIndex++) {
        for (const child of loopItem.children) {
          if (shouldStop()) {
            console.log(
              `Sequence stopped manually during loop [${idx + 1}/${totalItems}]`,
            );
            setRunningId(null);
            return;
          }

          console.log(
            `${indexPrefix} Loop [${repeatIndex + 1}/${loopItem.count}] > ${child.command}`,
          );
          setRunningId({ id: child.id, parentId: loopItem.id });
          await delay(delayMs);
        }
      }
    } else {
      if (shouldStop()) {
        console.log(`Sequence stopped manually [${idx + 1}/${totalItems}]`);
        setRunningId(null);
        return;
      }

      console.log(`${indexPrefix} Base > ${item.command}`);
      setRunningId({ id: item.id, parentId: null });
      await delay(delayMs);
    }
  }

  console.log(`Sequence complete [${totalItems}/${totalItems}]`);
  setRunningId(null);
}
