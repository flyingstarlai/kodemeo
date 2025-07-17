import { useAssets } from "@/providers/asset-context";
import {
  type GroupLayer,
  type ObjectLayer,
  sliceSpritesheet,
  type TiledMap,
  type TiledObject,
} from "@/lib/tilemap.ts";
import { useMemo } from "react";

interface Props {
  map: TiledMap;
  page: number;
}

export const ObjectMapSprite: React.FC<Props> = ({ map, page }) => {
  const { maps } = useAssets();

  const { tileset, frames } = useMemo(() => {
    const ts = map.tilesets.find((ts) => ts.name === "map_object");
    const sheet = maps.mapObjectTiles;
    return {
      tileset: ts,
      frames: ts ? sliceSpritesheet(sheet, ts) : [],
    };
  }, [map.tilesets, maps.mapObjectTiles]);

  if (!tileset || frames.length === 0) return null;

  const group = map.layers.find(
    (layer): layer is GroupLayer =>
      layer.type === "group" && layer.name === `week_${page}`,
  );
  if (!group) return null;

  const objectLayers = group.layers.filter(
    (l): l is ObjectLayer => l.type === "objectgroup",
  );
  return (
    <>
      {objectLayers.flatMap((layer) =>
        layer.objects.map((obj: TiledObject) => {
          const frameIndex = obj.gid - tileset.firstgid;
          const texture = frames[frameIndex];
          if (!texture) return null;

          const centerX = obj.x + obj.width / 2;
          const centerY = obj.y - obj.height / 2;

          return (
            <pixiSprite
              key={`${layer.name}-${obj.id}`}
              width={obj.width}
              height={obj.height}
              texture={texture}
              x={Math.round(centerX)}
              y={Math.round(centerY)}
              anchor={0.5}
              roundPixels
            />
          );
        }),
      )}
    </>
  );
};
