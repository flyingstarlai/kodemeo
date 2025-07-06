import React, { useRef } from "react";
import { Application, extend } from "@pixi/react";
import { AnimatedSprite, Container, Graphics, Sprite, Text } from "pixi.js";
import { ResponsiveSystem } from "@/ecs/systems/responsive-system.tsx";

const GameCanvas: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  extend({
    Container,
    Sprite,
    AnimatedSprite,
    Graphics,
    Text,
  });

  return (
    <div
      id="canvas-wrapper"
      ref={wrapperRef}
      className="flex-1 min-h-0 overflow-hidden lg:rounded-lg lg:shadow-xs"
    >
      <Application
        key={`game-${Math.random()}`}
        resolution={Math.max(window.devicePixelRatio, 2)}
        backgroundColor={0x2a8431}
        className="w-full h-full lg:rounded-lg overflow-hidden"
      >
        <ResponsiveSystem resizeRef={wrapperRef} />
      </Application>
    </div>
  );
};

export default GameCanvas;
