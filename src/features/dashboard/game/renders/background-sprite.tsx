import { useAssets } from "@/providers/asset-context.ts";
import React from "react";
import {
  getTileRenderInfo,
  sliceSpritesheet,
  type TiledMap,
  type TileLayer,
} from "@/lib/tilemap.ts";

export const BackgroundSprite = () => {
  const { sequence } = useAssets();
  const rawMap = sequence.levels as unknown as TiledMap;

  const arenaTex = sequence.arena;

  const frames = React.useMemo(() => {
    return new Map([
      [
        rawMap.tilesets[0].firstgid,
        sliceSpritesheet(arenaTex, rawMap.tilesets[0]),
      ],
    ]);
  }, [arenaTex, rawMap.tilesets]);

  const tileLayers = rawMap.layers.filter(
    (l): l is TileLayer => l.type === "tilelayer",
  );

  return (
    <>
      <>
        {tileLayers.flatMap((layer) =>
          layer.data.map((gid, i) => {
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
          }),
        )}
      </>
    </>
  );
};
