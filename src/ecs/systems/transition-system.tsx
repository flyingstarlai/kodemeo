import React, { useState } from "react";
import { useTick } from "@pixi/react";

interface ScreenTransitionProps {
  onComplete: () => void;
  color: number;
}

export const TransitionSystem: React.FC<ScreenTransitionProps> = ({
  onComplete,
  color,
}) => {
  const [alpha, setAlpha] = useState(1);

  useTick((ticker) => {
    const next = alpha - 0.02 * ticker.deltaTime;
    if (next <= 0) {
      setAlpha(0);
      onComplete();
    } else {
      setAlpha(next);
    }
  });

  return (
    <pixiGraphics
      label="transition"
      draw={(g) => {
        g.clear();
        g.setFillStyle({ color, alpha });
        g.rect(0, 0, 2000, 2000);
        g.fill();
      }}
    />
  );
};
