import { useEffect, useState } from "react";
import { useApplication } from "@pixi/react";
import { GameConstants } from "@/features/dashboard/game/constans.ts";

export function useResizePixiApp(
  resizeRef: React.RefObject<HTMLDivElement | null>,
) {
  const pixi = useApplication();
  const [size, setSize] = useState({
    width: GameConstants.GAME_WIDTH,
    height: GameConstants.GAME_HEIGHT,
  });

  useEffect(() => {
    if (!pixi?.app?.renderer || !resizeRef.current) return;

    const wrapper = resizeRef.current;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    const resize = () => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        const w = wrapper.clientWidth;
        const h = wrapper.clientHeight;
        if (!pixi?.app?.renderer) return;

        pixi.app.renderer.resize(w, h);
        setSize({ width: w, height: h });
      }, 50); // tweak as needed
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    resize(); // initial

    return () => ro.disconnect();
  }, [pixi, resizeRef]);

  return size;
}
