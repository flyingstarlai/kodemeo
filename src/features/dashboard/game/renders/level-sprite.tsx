import { useAssets } from "@/providers/asset-context.ts";
import React from "react";
import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import {
  getTileRenderInfo,
  sliceSpritesheet,
  type TiledMap,
} from "@/lib/tilemap.ts";

export const LevelSprite: React.FC = () => {
  const { levels } = useAssets();
  const rawMap = levels.levelsJson as unknown as TiledMap;
  const sheetTex = levels.mapAreaPng;

  const frames = React.useMemo(() => {
    return sliceSpritesheet(sheetTex, rawMap.tilesets[0]);
  }, [sheetTex, rawMap.tilesets]);

  const { currentLevel: challenge } = useLevelStore();

  const layer = rawMap.layers.find(
    (L) => L.type === "tilelayer" && L.name === `level_${challenge?.level}`,
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
