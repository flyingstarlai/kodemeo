import React from "react";
import { clsx } from "clsx";

export const Insertion: React.FC<{ type: "workspace" | "loop" }> = ({
  type,
}) => {
  return (
    <div
      className={clsx(
        "w-2 h-14 bg-blue-200 rounded-sm opacity-60",
        type === "loop" && "bg-lime-400",
      )}
    />
  );
};
