import {
  getTileRenderInfo,
  sliceSpritesheet,
  type TiledMap,
} from "@/lib/tilemap.ts";
import { useAssets } from "@/providers/asset-context.ts";
import { useSearch } from "@tanstack/react-router";
import { useMemo } from "react";

export const BackgroundMapSprite: React.FC = () => {
  const { sequence } = useAssets();
  const rawMap = sequence.mapSeq as unknown as TiledMap;
  const { week } = useSearch({ strict: false });
  const sheetTex = sequence.autumnMap;

  const frames = useMemo(() => {
    return sliceSpritesheet(sheetTex, rawMap.tilesets[0]);
  }, [sheetTex, rawMap.tilesets]);

  if (!week) return null;

  const path = [1, 2, 3].includes(week) ? `path_${week}` : "path_1";

  return (
    <>
      {rawMap.layers
        .filter(
          (L) =>
            (L.type === "tilelayer" && L.name === path) || L.name === "grass",
        )
        .flatMap((layer) =>
          layer.data.map((gid, i) => {
            if (gid <= 0) return null;
            const info = getTileRenderInfo(gid, i, rawMap, frames);
            if (!info) return null;
            return (
              <pixiSprite
                key={`${layer.name}-${i}`}
                texture={info.texture}
                x={info.x}
                y={info.y}
                anchor={0.5}
              />
            );
          }),
        )}
    </>
  );
};
