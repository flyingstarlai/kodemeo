import React, { useRef, useEffect, useMemo } from "react";
import { useTick } from "@pixi/react";
import type { AnimatedSprite } from "pixi.js";
import { useEcsStore } from "@/stores/use-ecs-store";
import { getCenteredTilePosition } from "@/features/student/game/utils/tile-utils.ts";
import { useAssets } from "@/providers/asset-context.ts";

export const CoinSprite: React.FC<{ eid: number }> = ({ eid }) => {
  const spriteRef = useRef<AnimatedSprite>(null);
  const ecs = useEcsStore.getState();
  const { coin } = useAssets(); // assuming your bundle has a `coin` entry

  // Kick off initial play once textures exist
  const animFacet = ecs.getComponent(eid, "spriteAnimation");
  const initialTextures = useMemo(() => {
    if (!animFacet) return [];
    return coin.animations[animFacet.name];
  }, [animFacet, coin.animations]);

  useEffect(() => {
    const spr = spriteRef.current;
    if (spr && initialTextures.length > 0) {
      spr.textures = initialTextures;
      spr.loop = true;
      spr.play();
    }
  }, [initialTextures]);

  // Every frame update position & speed
  useTick(() => {
    const spr = spriteRef.current;
    if (!spr) return;

    const animF = ecs.getComponent(eid, "spriteAnimation");
    const gridP = ecs.getComponent(eid, "gridPosition");

    if (animF) {
      spr.animationSpeed = animF.fps / 60;
      if (!spr.playing) spr.play();
    }

    if (gridP) {
      const { x, y } = getCenteredTilePosition(gridP.col, gridP.row);
      spr.x = x;
      spr.y = y;
    }
  });

  // Render one AnimatedSprite per eid
  return (
    <pixiAnimatedSprite
      ref={spriteRef}
      textures={initialTextures}
      key={eid}
      anchor={0.5}
      scale={0.6}
      roundPixels={true}
    />
  );
};
