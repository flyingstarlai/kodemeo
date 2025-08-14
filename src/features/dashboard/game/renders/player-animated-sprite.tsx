import { useAssets } from "@/providers/asset-context.ts";
import React, { useEffect, useRef } from "react";
import type { AnimatedSprite } from "pixi.js";
import { usePlayerSpriteStore } from "@/features/dashboard/game/store/use-player-sprite-store.ts";
import { playSound } from "@/lib/sounds.ts";

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
      sprite.onFrameChange = (frame) => {
        if (spriteData.animationName === "scratch" && frame === 4) {
          playSound("onScratch", { volume: 0.5 });
        }
      };
      sprite.onComplete = () => {
        console.log("completed sprite data");
        if (spriteData.animationName === "scratch") {
          sprite.stop();
          toggleComplete();
        }
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
