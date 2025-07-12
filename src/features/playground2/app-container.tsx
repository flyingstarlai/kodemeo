import { Application, extend } from "@pixi/react";
import React, { useEffect, useRef, useState } from "react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { useAssets } from "@/providers/asset-context.ts";
import { ResizeSync } from "@/features/dashboard/game/components/resize-sync.tsx";
import {
  WorldScrollableContainer,
  type ScrollableContentHandle,
} from "@/features/dashboard/game/components/world-scrollable-container.tsx";
import { Button } from "@/components/ui/button.tsx";
import { WorldContainer } from "@/features/dashboard/game/components/world-container.tsx";

const CONTENT_WIDTH = 1280;
const CONTENT_HEIGHT = 720;
export const VIEW_WIDTH = 992;
export const VIEW_HEIGHT = 668;
export const DELTA_SCROLL_X = CONTENT_WIDTH / 8;

const TILE_SIZE = 80;
const PLAYER_SIZE = 40;

export const AppContainer: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<ScrollableContentHandle>(null);
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

  const { maps } = useAssets();

  const [playerPos, setPlayerPos] = useState({ x: 6, y: 4 }); // tile pos

  const playerX = playerPos.x * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2;
  const playerY = playerPos.y * TILE_SIZE + (TILE_SIZE - PLAYER_SIZE) / 2;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setPlayerPos((prev) => {
        const next = { ...prev };
        if (e.key === "ArrowLeft") next.x = Math.max(0, prev.x - 1);
        if (e.key === "ArrowRight") next.x = Math.min(15, prev.x + 1);
        if (e.key === "ArrowUp") next.y = Math.max(0, prev.y - 1);
        if (e.key === "ArrowDown") next.y = Math.min(8, prev.y + 1);
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollToCenter(playerX, playerY);
  }, [playerX, playerY, screen.width, screen.height]);

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="relative flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          variant="secondary"
          onClick={() => scrollRef.current?.scrollToCenter(playerX, playerY)}
        >
          Center
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
        <WorldScrollableContainer
          ref={scrollRef}
          screenWidth={screen.width}
          screenHeight={screen.height}
          contentWidth={CONTENT_WIDTH}
          contentHeight={CONTENT_HEIGHT}
        >
          <pixiSprite texture={maps.arenaPreviewPng} x={0} y={0} />
          <WorldContainer>
            <pixiGraphics
              x={playerX}
              y={playerY}
              draw={(g) => {
                g.clear();
                g.setFillStyle({ color: 0x3366ff });
                g.rect(0, 0, PLAYER_SIZE, PLAYER_SIZE);
                g.fill();
              }}
            />
          </WorldContainer>
        </WorldScrollableContainer>
      </Application>
    </div>
  );
};
