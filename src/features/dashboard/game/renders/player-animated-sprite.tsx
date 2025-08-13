import { useAssets } from "@/providers/asset-context.ts";
import React, { useEffect, useRef } from "react";
import type { AnimatedSprite } from "pixi.js";
import { usePlayerSpriteStore } from "@/features/dashboard/game/store/use-player-sprite-store.ts";

export const PlayerAnimatedSprite: React.FC = () => {
  const { cat } = useAssets();
  const [spriteData] = usePlayerSpriteStore((s) => s.sprites);
  const toggleComplete = usePlayerSpriteStore((s) => s.toggleComplete);

  const spriteRef = useRef<AnimatedSprite>(null);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    if (!sprite.playing) {
      console.log("playing sprite data");
      sprite.onComplete = () => {
        // sprite.gotoAndStop(4);
        console.log("completed sprite data");
        if (spriteData.animationName === "scratch") toggleComplete();
      };

      sprite.play();
    }
  }, [spriteData, toggleComplete]);

  if (!spriteData) return null;

  return (
    <pixiAnimatedSprite
      key={spriteData.id}
      x={spriteData.x}
      y={spriteData.y}
      rotation={spriteData.rotation}
      animationSpeed={spriteData.animationSpeed}
      ref={spriteRef}
      anchor={0.5}
      textures={cat.animations[spriteData.animationName]}
      loop={spriteData.isLooped}
      autoPlay={true}
      roundPixels={true}
    />
  );
};
