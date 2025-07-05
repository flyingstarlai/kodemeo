import React from "react";

import {
  getTileRenderInfo,
  sliceSpritesheet,
} from "@/features/student/game/utils/tilemap-utils.ts";
import type { TiledMap } from "@/features/student/game/types.ts";
import { useAssets } from "@/providers/asset-context.ts";
import { useEcsStore } from "@/stores/use-ecs-store.ts";

export const LevelsRenderSystem: React.FC = () => {
  const { maps } = useAssets();
  const rawMap = maps.levelsJson as unknown as TiledMap;
  const sheetTex = maps.mapAreaPng;

  const frames = React.useMemo(() => {
    return sliceSpritesheet(sheetTex, rawMap.tilesets[0]);
  }, [sheetTex, rawMap.tilesets]);

  const levelData = useEcsStore((s) => s.levelData);

  const layer = rawMap.layers.find(
    (L) => L.type === "tilelayer" && L.name === `level_${levelData.level}`,
  );

  return (
    <>
      {layer?.data.map((gid, i) => {
        const info = getTileRenderInfo(gid, i, rawMap, frames);
        if (!info) return null;
        return (
          <pixiSprite
            key={`${layer.name}-${i}`}
            texture={info.texture}
            x={info.x}
            y={info.y}
            anchor={0.5}
            roundPixels={true}
          />
        );
      })}
    </>
  );
};
