import React, { useEffect } from "react";
import { useApplication } from "@pixi/react";
import { GameConstants } from "@/features/dashboard/game/constans.ts";

interface Props {
  resizeRef: React.RefObject<HTMLElement | null>;
}

export const ScreenResponsive: React.FC<Props> = ({ resizeRef }) => {
  const pixi = useApplication();

  useEffect(() => {
    if (!pixi) return;
    // initDevtools({ app: pixi.app }).catch();

    if (!resizeRef.current) return;

    const renderer = pixi.app.renderer;
    if (!renderer) return;

    // Function to resize Pixi and then re-calc scale/position
    const resizeStage = () => {
      const wrapper = resizeRef.current;

      if (wrapper === null) return;

      const newWidth = wrapper.clientWidth;
      const newHeight = wrapper.clientHeight;

      // explicitly resize Pixi's renderer to match wrapper
      renderer.resize(newWidth, newHeight);
      // immediately render because resizing clears the canvas
      pixi.app.render();

      const ww = renderer.view.screen.width;
      const wh = renderer.view.screen.height;

      const vw = GameConstants.GAME_WIDTH;
      const vh = GameConstants.GAME_HEIGHT;

      const rawScale = Math.max(ww / vw, wh / vh);
      const scale = Math.min(Math.max(rawScale, 1), 1.5);

      //  apply scale & center
      pixi.app.stage.scale.set(scale, scale);
      pixi.app.stage.position.set((ww - vw * scale) / 2, (wh - vh * scale) / 2);
    };

    // Observe size changes on the wrapper DOM node
    const ro = new ResizeObserver(() => {
      resizeStage();
    });
    ro.observe(resizeRef.current);

    resizeStage();

    return () => {
      ro.disconnect();
    };
  }, [pixi, resizeRef]);

  return null;
};
