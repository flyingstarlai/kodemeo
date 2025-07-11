import {
  type Container,
  FederatedEvent,
  TextStyle,
  type Texture,
} from "pixi.js";
import React, { useRef, useState } from "react";
import { useTick } from "@pixi/react";
import { playSound } from "@/lib/sounds.ts";

interface HoverFlagProps {
  x: number;
  y: number;
  label: string;
  texture: Texture;
  starTex: Texture | null;
  onClick: () => void;
  disable: boolean;
}

export const HoverableFlag: React.FC<HoverFlagProps> = ({
  x,
  y,
  label,
  texture,
  starTex,
  onClick,
  disable,
}) => {
  const containerRef = useRef<Container>(null);
  const offset = {
    x: 55 / 2,
    y: 100 / 2,
  };

  const [targetScale] = useState({ hover: 1.1, normal: 1 });
  const [scaleState, setScaleState] = useState<number>(1);
  const [wantHover, setWantHover] = useState(false);
  useTick(() => {
    if (!containerRef.current) return;

    if (disable) {
      containerRef.current.tint = 0xd1d5db;
      containerRef.current.alpha = 0.9;
    }

    const goal = wantHover ? targetScale.hover : targetScale.normal;

    const next = scaleState + (goal - scaleState) * 0.15;
    setScaleState(next);
    containerRef.current.scale.set(next);
  });

  const textStyle = new TextStyle({
    fill: "#fffefe",
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "Fredoka One",
    stroke: { color: "#4a1850", width: 2, join: "round" },
  });

  return (
    <pixiContainer
      ref={containerRef}
      eventMode="static"
      interactive={true}
      cursor={!disable ? "pointer" : "default"}
      onPointerOver={(e: FederatedEvent) => {
        if (disable) return;
        playSound("hover", { volume: 0.5 });
        const s = e.currentTarget;
        s.tint = 0xf0fdfa;
        setWantHover(true);
      }}
      onPointerOut={(e: FederatedEvent) => {
        const s = e.currentTarget;
        s.tint = 0xffffff;
        setWantHover(false);
      }}
      onPointerTap={onClick}
      x={x + offset.x}
      y={y - offset.y}
    >
      <pixiSprite texture={texture} roundPixels={true} anchor={0.5} />
      <pixiText text={label} style={textStyle} anchor={0.5} y={-2} />
      {starTex && (
        <pixiSprite
          texture={starTex}
          roundPixels={true}
          anchor={0.5}
          scale={0.8}
          y={-offset.y - 8}
        />
      )}
    </pixiContainer>
  );
};
