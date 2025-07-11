import clsx from "clsx";
import arrowIcon from "@/assets/command/right-arrow.png";
import pawIcon from "@/assets/command/paw.png";
import type { IBaseCommand } from "@/features/dashboard/command/types.ts";
import { variantMap } from "@/features/dashboard/command/constants.ts";

export type BaseCommandProps = {
  type: "workspace" | "palette" | "loop";
  active?: boolean;
  item: IBaseCommand;
};

const rotationMap: Record<string, string> = {
  right: "rotate(0deg)",
  down: "rotate(90deg)",
  left: "rotate(180deg)",
  up: "rotate(-90deg)",
};

export const BaseCommand: React.FC<BaseCommandProps> = ({ item, active }) => {
  const isDirection = ["left", "right", "up", "down"].includes(item.command);

  return (
    <div
      className={clsx(
        "w-14 h-14 p-2 border rounded flex items-center justify-center flex-shrink-0 cursor-grab drag-handle",
        variantMap[item.variant],
        active && "border-4 shadow-lg shadow-green-400",
      )}
    >
      <img
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        src={isDirection ? arrowIcon : pawIcon}
        alt={item.command}
        style={{ transform: rotationMap[item.command] }}
        className={clsx(
          "w-6 h-6 pointer-events-none select-none",
          !isDirection && "w-8 h-8",
        )}
      />
    </div>
  );
};
