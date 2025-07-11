import { Texture, Rectangle } from "pixi.js";

export interface TiledMap {
  width: number;
  height: number;
  tilewidth: number;
  tileheight: number;
  layers: Array<{
    name: string;
    type: string;
    visible: boolean;
    data: number[];
    objects: Array<{
      name: string;
      id: number;
      x: number;
      y: number;
    }>;
  }>;
  tilesets: Array<{
    firstgid: number;
    columns: number;
    tilecount: number;
    tilewidth: number;
    tileheight: number;
  }>;
}

export interface TilesetInfo {
  firstgid: number;
  columns: number;
  tilecount: number;
  tilewidth: number;
  tileheight: number;
}

/**
 * Slice a single‐image Texture into an array of tile‐sized sub‐Textures.
 * Automatically sets each to nearest‐neighbor filtering.
 *
 * @param sheet     – the full Texture loaded from your bundle
 * @param tileset   – the matching `tilesets[0]` entry from your Tiled JSON
 * @returns an array of Textures, indexed 0..tilecount−1
 */
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

  // ensure no smoothing when these sub‐textures are rendered
  base.scaleMode = "nearest";

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      if (idx >= tileset.tilecount) break;
      const tex = new Texture({
        source: base,
        frame: new Rectangle(col * w, row * h, w, h),
      });
      // also ensure the texture itself is nearest:
      tex.source.scaleMode = "nearest";
      out[idx] = tex;
    }
  }

  return out;
}

export function getTileRenderInfo(
  gid: number,
  index: number,
  rawMap: TiledMap,
  frames: Texture[],
): { texture: Texture; x: number; y: number } {
  const ts = rawMap.tilesets[0];
  const frameIndex = gid - ts.firstgid;
  const texture = frames[frameIndex];

  const col = index % rawMap.width;
  const row = Math.floor(index / rawMap.width);

  const x = col * rawMap.tilewidth + rawMap.tilewidth / 2;
  const y = row * rawMap.tileheight + rawMap.tileheight / 2;

  // texture.source.scaleMode = "nearest";

  return { texture, x, y };
}
