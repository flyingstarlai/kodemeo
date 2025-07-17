import React from "react";
import {
  getTileRenderInfo,
  sliceSpritesheet,
  type TiledMap,
  getGroupLayers,
} from "@/lib/tilemap.ts";
import { useLevelStore } from "@/features/dashboard/game/store/use-level-store.ts";
import { useAssets } from "@/providers/asset-context.ts";

export const LevelSprite: React.FC = () => {
  const { sequence } = useAssets();
  const rawMap = sequence.levels as unknown as TiledMap;
  const levelTex = sequence.arena;

  const { currentLevel: challenge } = useLevelStore();

  const frames = React.useMemo(() => {
    return new Map([
      [
        rawMap.tilesets[0].firstgid,
        sliceSpritesheet(levelTex, rawMap.tilesets[0]),
      ],
    ]);
  }, [levelTex, rawMap.tilesets]);

  const groupName = `level_${challenge?.level}`;
  const groupLayers = getGroupLayers(rawMap, groupName).filter(
    (layer) => layer.name === "path",
  );

  return (
    <>
      {groupLayers
        .filter((l) => l.name === "path")
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
