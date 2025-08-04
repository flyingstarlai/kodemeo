import { Assets, Spritesheet, Texture } from "pixi.js";
// Import URLs via Vite
import catAtlasJsonUrl from "@/assets/game/cat_atlas.json?url";
import catSheetPngUrl from "@/assets/game/cat_sheet.png?url";

import coinAtlasJsonUrl from "@/assets/game/coin_atlas.json?url";
import coinSheetPngUrl from "@/assets/game/coin_sheet.png?url";

import enemyMouseAtlasJsonUrl from "@/assets/game/enemy_mouse.json?url";
import enemyMousePngUrl from "@/assets/game/enemy_mouse.png?url";

import mapArenaJsonUrl from "@/assets/game/map_arena.json?url";
import mapArenaPngUrl from "@/assets/game/map_arena.png?url";
import levelsJsonUrl from "@/assets/game/levels.json?url";
import chestClosedPngUrl from "@/assets/game/chest_closed.png?url";

// GAME
import sequenceLevelsJson from "@/assets/game/levels/sequence_level.json?url";
import mapArenaPng from "@/assets/game/levels/map_arena.png?url";

// MAP LEVEL
import mapFlagPngUrl from "@/assets/game/level_marker_flag.png?url";
import mapSeqJson from "@/assets/game/map_seq.json?url";
import star0of3PngUrl from "@/assets/game/ui/star_0_3.png?url";
import star1of3PngUrl from "@/assets/game/ui/star_1_3.png?url";
import star2of3PngUrl from "@/assets/game/ui/star_2_3.png?url";
import star3of3PngUrl from "@/assets/game/ui/star_3_3.png?url";
import worldMapPngUrl from "@/assets/game/world-map.png?url";
import mapArenaPreviewPngUrl from "@/assets/game/map_arena_preview.png?url";
import sequenceMapUrl from "@/assets/game/maps/sequence_map.json?url";
import loopMapUrl from "@/assets/game/maps/loop_map.json?url";
import roadTilesPngUrl from "@/assets/game/maps/road_tiles.png?url";
import mapObjectTilesPgnUrl from "@/assets/game/maps/map_object.png?url";
import mapMarkerTilesPngUrl from "@/assets/game/maps/map_marker.png?url";

export const spriteBundles = {
  levels: {
    bgArenaJson: mapArenaJsonUrl,
    mapAreaPng: mapArenaPngUrl,
    levelsJson: levelsJsonUrl,
    worldMapPng: worldMapPngUrl,
    arenaPreviewPng: mapArenaPreviewPngUrl,
  },
  maps: {
    sequenceMap: sequenceMapUrl,
    loopMap: loopMapUrl,
    roadTiles: roadTilesPngUrl,
    mapObjectTiles: mapObjectTilesPgnUrl,
    mapMarkerTiles: mapMarkerTilesPngUrl,
  },
  stars: {
    star0of3: star0of3PngUrl,
    star1of3: star1of3PngUrl,
    star2of3: star2of3PngUrl,
    star3of3: star3of3PngUrl,
  },
  sequence: {
    mapFlag: mapFlagPngUrl,
    mapSeq: mapSeqJson,
    levels: sequenceLevelsJson,
    arena: mapArenaPng,
  },
  chest: {
    chestClosed: chestClosedPngUrl,
  },
} as const;

export const atlasBundles = {
  coin: {
    coinAtlas: coinAtlasJsonUrl,
    coinSheet: coinSheetPngUrl,
  },
  cat: {
    catAtlas: catAtlasJsonUrl,
    catSheet: catSheetPngUrl,
  },
  mouse: {
    mouseAtlas: enemyMouseAtlasJsonUrl,
    mouseSheet: enemyMousePngUrl,
  },
};

export type BundleName = keyof typeof spriteBundles;

export type AtlasBundleName = keyof typeof atlasBundles;
/**
 * Maps each bundle entry key to the appropriate type:
 * - keys containing 'atlas' → Spritesheet
 * - audio bundle → string URL
 * - else → PIXI.Texture
 */
export type BundleTextures<B extends BundleName> = {
  readonly [K in keyof (typeof spriteBundles)[B]]: Texture;
};

// Atlas bundles become Spritesheet + Texture
export type AtlasBundleTextures<B extends AtlasBundleName> = {
  readonly [K in keyof (typeof atlasBundles)[B]]: Lowercase<
    Extract<K, string>
  > extends `${string}atlas${string}`
    ? Spritesheet
    : Texture;
};

let hasRegistered = false;

/**
 * Register all bundles with Pixi's global Assets system.
 * Uses `bundleName-entryKey` as the cache key to avoid collisions.
 */
export function registerAssetBundles(): void {
  if (hasRegistered) return;
  hasRegistered = true;

  for (const [bundleName, urlMap] of Object.entries(spriteBundles) as [
    BundleName,
    Record<string, string>,
  ][]) {
    const toRegister: Record<string, string> = {};
    for (const [entryKey, url] of Object.entries(urlMap)) {
      const cacheKey = `${bundleName}-${entryKey}`;
      if (!Assets.cache.has(cacheKey)) {
        toRegister[entryKey] = url;
      }
    }
    if (Object.keys(toRegister).length) {
      Assets.addBundle(bundleName, toRegister);
    }
  }
}

/**
 * Load a generic bundle: returns raw entries (Textures, strings, or parsed JSON).
 * Does NOT parse atlas JSON into Spritesheet.
 */
export async function loadBundle<B extends BundleName>(
  name: B,
): Promise<BundleTextures<B>> {
  const entries = await Assets.loadBundle(name);
  return entries as BundleTextures<B>;
}

/**
 * Load *and* parse a Tiled‐style atlas bundle into a Spritesheet.
 * It finds the JSON entry (has `frames` + `meta`) and its matching Texture,
 * then runs `Spritesheet.parse()` before returning.
 */
export async function loadBundleAtlas<B extends AtlasBundleName>(
  name: B,
): Promise<Spritesheet> {
  // Build our two unique aliases:
  const atlasAlias = `${name}Atlas`;

  // 2) Grab the URL for the JSON from your spriteBundles definition
  const urlMap = atlasBundles[name] as Record<string, string>;

  const atlasKey = (Object.keys(urlMap) as Array<keyof typeof urlMap>).find(
    (k) => /atlas$/i.test(k as string),
  );
  if (!atlasKey) {
    throw new Error(`No atlas URL defined for bundle "${name}"`);
  }

  const sheetKey = (Object.keys(urlMap) as Array<keyof typeof urlMap>).find(
    (k) => k !== atlasKey,
  );
  if (!sheetKey) {
    throw new Error(`No sheet entry defined for bundle "${name}"`);
  }
  const sheetUrl = urlMap[sheetKey];
  const atlasUrl = urlMap[atlasKey];

  const sheetTexture = await Assets.load(sheetUrl);

  if (!Assets.resolver.hasKey(atlasKey)) {
    Assets.add({
      alias: atlasAlias,
      src: atlasUrl,
      data: { texture: sheetTexture },
    });
  }

  return (await Assets.load(atlasAlias)) as Spritesheet;
}
