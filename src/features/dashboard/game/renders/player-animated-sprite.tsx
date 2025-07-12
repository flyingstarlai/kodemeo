import { useAssets } from "@/providers/asset-context.ts";
import React, { useEffect, useRef } from "react";
import type { AnimatedSprite } from "pixi.js";
import { usePlayerStore } from "@/features/dashboard/game/store/use-player-store.ts";
import type { ScrollableContentHandle } from "@/features/dashboard/game/components/world-scrollable-container.tsx";

interface Props {
  scrollRef: React.RefObject<ScrollableContentHandle | null>;
}

export const PlayerAnimatedSprite: React.FC<Props> = () => {
  const { cat } = useAssets();
  const [spriteData] = usePlayerStore((s) => s.sprites);

  const spriteRef = useRef<AnimatedSprite>(null);

  useEffect(() => {
    const sprite = spriteRef.current;
    if (!sprite) return;
    if (!sprite.playing) {
      sprite.play();
    }
  }, [spriteData]);

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
      loop={true}
      autoPlay={true}
      roundPixels={true}
    />
  );
};
