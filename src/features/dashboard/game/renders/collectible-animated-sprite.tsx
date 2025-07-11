import { useAssets } from "@/providers/asset-context.ts";
import React, { useEffect, useRef } from "react";
import type { AnimatedSprite, Texture } from "pixi.js";
import { useCollectibleStore } from "@/features/dashboard/game/store/use-collectible-store.ts";

export const CollectibleAnimatedSprite: React.FC = () => {
  const { coin } = useAssets();
  const sprites = useCollectibleStore((s) => s.sprites);

  if (!sprites) return null;

  return (
    <>
      {sprites.map((sp) => (
        <CoinSprite
          key={sp.id}
          id={sp.id}
          x={sp.x}
          y={sp.y}
          speed={sp.animationSpeed}
          textures={coin.animations[sp.animationName]}
        />
      ))}
    </>
  );
};

const CoinSprite: React.FC<{
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
    />
  );
};
