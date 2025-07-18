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
  const isBlank = item.command === "blank";

  return (
    <div
      className={clsx(
        "w-10 h-10 xl:w-14 xl:h-14 p-1 xl:p-2 border rounded flex items-center justify-center flex-shrink-0 cursor-grab drag-handle",
        variantMap[item.variant],
        active && "border-4 shadow-xl shadow-green-400",
      )}
    >
      {!isBlank ? (
        <img
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          src={isDirection ? arrowIcon : pawIcon}
          alt={item.command}
          style={{ transform: rotationMap[item.command] }}
          className={clsx(
            "w-5 h-5 xl:w-6 xl:h-6 pointer-events-none select-none",
            !isDirection && "w-6 h-6 xl:w-8 xl:h-8",
          )}
        />
      ) : (
        <div className="text-green-600 font-extrabold text-2xl"> </div>
      )}
    </div>
  );
};
