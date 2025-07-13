import { Texture, Rectangle } from "pixi.js";

type BaseLayer = {
  id: number;
  name: string;
  type: string;
  visible: boolean;
  opacity: number;
  x: number;
  y: number;
};

export interface TileLayer extends BaseLayer {
  type: "tilelayer";
  data: number[];
  width: number;
  height: number;
}

export interface TiledObject {
  id: number;
  name: string;
  type: string;
  gid: number;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  visible: boolean;
}

export interface ObjectLayer extends BaseLayer {
  type: "objectgroup";
  draworder: string;
  objects: TiledObject[];
}

export type GroupChildLayer = TileLayer | ObjectLayer | GroupLayer;

export interface GroupLayer extends BaseLayer {
  type: "group";
  layers: GroupChildLayer[];
}

export type Layer = TileLayer | GroupLayer;

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: Layer[];
  tilesets: TilesetInfo[];
}

export interface TilesetInfo {
  name: string;
  firstgid: number;
  columns: number;
  tilecount: number;
  tilewidth: number;
  tileheight: number;
}

export function getTileRenderInfo(
  gid: number,
  index: number,
  rawMap: TiledMap,
  tilesetFrames: Map<number, Texture[]>,
): { texture: Texture; x: number; y: number } | null {
  if (gid === 0) return null;

  const tileset = getTilesetForGid(gid, rawMap.tilesets);
  if (!tileset) return null;

  const frames = tilesetFrames.get(tileset.firstgid);
  if (!frames) return null;

  const frameIndex = gid - tileset.firstgid;
  const texture = frames[frameIndex];
  const col = index % rawMap.width;
  const row = Math.floor(index / rawMap.width);
  const x = col * rawMap.tilewidth + rawMap.tilewidth / 2;
  const y = row * rawMap.tileheight + rawMap.tileheight / 2;

  return { texture, x, y };
}

function getTilesetForGid(
  gid: number,
  tilesets: TilesetInfo[],
): TilesetInfo | null {
  let selected: TilesetInfo | null = null;
  for (const ts of tilesets) {
    if (gid >= ts.firstgid) {
      if (!selected || ts.firstgid > selected.firstgid) {
        selected = ts;
      }
    }
  }
  return selected;
}

export function sliceSpritesheet(
  sheet: Texture,
  tileset: TilesetInfo,
): Texture[] {
  const base = sheet.source;
  const cols = tileset.columns;
  const rows = Math.ceil(tileset.tilecount / cols);
  const w = tileset.tilewidth;
  const h = tileset.tileheight;
  const out: Texture[] = [];

  base.scaleMode = "nearest";

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      if (idx >= tileset.tilecount) break;
      const tex = new Texture({
        source: base,
        frame: new Rectangle(col * w, row * h, w, h),
      });
      tex.source.scaleMode = "nearest";
      out[idx] = tex;
    }
  }

  return out;
}

export function getGroupLayers(map: TiledMap, groupName: string): TileLayer[] {
  const group = map.layers.find(
    (layer): layer is GroupLayer =>
      layer.type === "group" && layer.name === groupName,
  );

  if (!group) {
    console.warn(`Group "${groupName}" not found`);
    return [];
  }

  return flattenTileLayers(group.layers);
}

function flattenTileLayers(layers: GroupChildLayer[]): TileLayer[] {
  const out: TileLayer[] = [];

  for (const layer of layers) {
    if (layer.type === "tilelayer") {
      out.push(layer);
    } else if (layer.type === "group") {
      out.push(...flattenTileLayers(layer.layers));
    }
  }

  return out;
}
