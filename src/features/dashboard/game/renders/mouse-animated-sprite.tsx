import React, { useEffect, useRef } from "react";
import { useAssets } from "@/providers/asset-context.ts";
import { useEnemyStore } from "@/features/dashboard/game/store/use-enemy-store.ts";
import type { AnimatedSprite, Texture } from "pixi.js";

export const MouseAnimatedSprite: React.FC = () => {
  const { mouse } = useAssets();
  const sprites = useEnemyStore((s) => s.sprites);

  if (!sprites) return null;

  return (
    <>
      {sprites.map((sp) => (
        <MouseSprite
          key={sp.id}
          id={sp.id}
          x={sp.x}
          y={sp.y}
          speed={sp.animationSpeed}
          textures={mouse.animations[sp.animationName]}
        />
      ))}
    </>
  );
};

const MouseSprite: React.FC<{
  id: number;
  x: number;
  y: number;
  textures: Texture[];
  speed: number;
}> = ({ id, x, y, speed, textures }) => {
  const spriteRef = useRef<AnimatedSprite>(null);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    if (!sprite.playing) {
      sprite.play();
    }
  }, []);

  return (
    <pixiAnimatedSprite
      key={id}
      x={x}
      y={y}
      animationSpeed={speed}
      ref={spriteRef}
      anchor={0.5}
      scale={0.6}
      textures={textures}
      roundPixels={true}
      rotation={-Math.PI * 0.5}
    />
  );
};
