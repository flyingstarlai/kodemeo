import playIcon from "@/assets/command/play-button.png";
import stopIcon from "@/assets/command/stop-button.png";
import React from "react";
import { clsx } from "clsx";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";

interface CommandControlsProps {
  isRunning: boolean;
  onRun: () => void;
  onStop: () => void;
  disabled: boolean;
}

export const CommandControls: React.FC<CommandControlsProps> = ({
  onRun,
  onStop,
  disabled,
}) => {
  const isPending = useUIStore((s) => s.isPendingCommand);
  return (
    <div>
      {isPending ? (
        <div onClick={onStop} className="opacity-70">
          <img src={stopIcon} alt="stop" />
        </div>
      ) : (
        <div
          onClick={() => {
            if (!disabled) {
              onRun();
            }
          }}
          className={clsx(
            disabled
              ? "cursor-not-allowed opacity-40"
              : "cursor-pointer opacity-70",
          )}
        >
          <img src={playIcon} alt="play" />
        </div>
      )}
    </div>
  );
};
