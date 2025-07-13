import React from "react";
import { useTransitionStore } from "@/features/dashboard/game/store/use-transition-store.ts";

export const ScreenTransition: React.FC<{ color: number }> = ({ color }) => {
  const { progress } = useTransitionStore();

  return (
    <pixiGraphics
      label="transition"
      draw={(g) => {
        g.clear();
        g.setFillStyle({ color, alpha: progress });
        g.rect(0, 0, 2000, 2000);
        g.fill();
      }}
    />
  );
};
