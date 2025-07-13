import { Application, extend } from "@pixi/react";
import React, { useRef, useState } from "react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import {
  type HorizontalScrollHandle,
  HorizontalScrollView,
} from "@/features/playground/horizontal-scroll-view.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useAssets } from "@/providers/asset-context.ts";
import { ResizeSync } from "@/features/dashboard/game/components/resize-sync.tsx";

const CONTENT_WIDTH = 4800;
const CONTENT_HEIGHT = 720;
export const VIEW_WIDTH = 1024;
export const VIEW_HEIGHT = 768;
export const DELTA_SCROLL_X = CONTENT_WIDTH / 8;

export const AppContainer: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HorizontalScrollHandle>(null);
  const [screen, setScreen] = useState({
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
  });

  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });

  const { levels } = useAssets();

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="relative flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="secondary"
          onClick={() => scrollRef.current?.scrollBy(DELTA_SCROLL_X)}
        >
          + ←
        </Button>
        <Button
          variant="secondary"
          onClick={() => scrollRef.current?.scrollBy(-DELTA_SCROLL_X)}
        >
          →
        </Button>
      </div>
      <Application
        width={screen.width}
        height={screen.height}
        backgroundColor={0x2a8431}
        resolution={Math.max(window.devicePixelRatio, 2)}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <ResizeSync resizeRef={wrapperRef} onResize={setScreen} />
        <HorizontalScrollView
          ref={scrollRef}
          screenWidth={screen.width}
          screenHeight={screen.height}
          contentWidth={CONTENT_WIDTH}
          contentHeight={CONTENT_HEIGHT}
        >
          <pixiSprite texture={levels.worldMapPng} x={0} y={0} />
        </HorizontalScrollView>
      </Application>
    </div>
  );
};
