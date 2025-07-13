import {
  getTileRenderInfo,
  sliceSpritesheet,
  getGroupLayers,
  type TiledMap,
  type TileLayer,
} from "@/lib/tilemap-group.ts";
import { useAssets } from "@/providers/asset-context.ts";
import { useParams, useSearch } from "@tanstack/react-router";
import { useMemo } from "react";
import { MarkerSprite } from "@/features/dashboard/challenge/renders/marker-sprite.tsx";
import { ObjectMapSprite } from "@/features/dashboard/challenge/renders/object-map-sprite.tsx";

export const RoadMapSprite: React.FC = () => {
  const { maps } = useAssets();
  const rawMap = maps.sequenceMap as unknown as TiledMap;
  const { page } = useSearch({ strict: false });
  const { course: courseSlug } = useParams({ strict: false });

  const roadTex = maps.roadTiles;

  const roadFrames = useMemo(() => {
    return new Map([
      [
        rawMap.tilesets[0].firstgid,
        sliceSpritesheet(roadTex, rawMap.tilesets[0]),
      ],
    ]);
  }, [roadTex, rawMap.tilesets]);

  if (!page) return null;

  const groupName = `week_${page}`;
  const groupLayers = getGroupLayers(rawMap, groupName);
  const grassLayer = rawMap.layers.find(
    (l): l is TileLayer => l.type === "tilelayer" && l.name === "grass",
  );

  const tileLayers: TileLayer[] = [
    ...(grassLayer ? [grassLayer] : []),
    ...groupLayers.filter((l) => l.type === "tilelayer"),
  ];

  return (
    <>
      {tileLayers.flatMap((layer) =>
        layer.data.map((gid, i) => {
          if (gid <= 0) return null;
          const info = getTileRenderInfo(gid, i, rawMap, roadFrames);
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

      {/* 🔁 Render marker in separate component */}
      <ObjectMapSprite map={rawMap} page={page} />
      <MarkerSprite map={rawMap} page={page} courseSlug={courseSlug!} />
    </>
  );
};
