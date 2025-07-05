import { useDragDropStore } from "@/stores/use-drag-drop-store.ts";
import { LoopCommand } from "@/features/student/command/components/loop-command.tsx";
import { BaseCommand } from "@/features/student/command/components/base-command.tsx";

export const DragPreview: React.FC = () => {
  const { draggingItem, pointer } = useDragDropStore();

  if (!draggingItem) return null;

  return (
    <div
      className="fixed z-50 pointer-events-none opacity-80 scale-90"
      style={{
        left: pointer.x + 10,
        top: pointer.y + 10,
        transform: "translate(-50%, -50%)",
      }}
    >
      {draggingItem.command === "loop" ? (
        <LoopCommand
          type="workspace"
          item={draggingItem}
          runningCommand={null}
        />
      ) : (
        <BaseCommand type="workspace" item={draggingItem} />
      )}
    </div>
  );
};
