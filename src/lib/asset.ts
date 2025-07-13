import { Assets, Spritesheet, Texture } from "pixi.js";
// Import URLs via Vite
import catAtlasJsonUrl from "@/assets/game/cat_atlas.json?url";
import catSheetPngUrl from "@/assets/game/cat_sheet.png?url";

import coinAtlasJsonUrl from "@/assets/game/coin_atlas.json?url";
import coinSheetPngUrl from "@/assets/game/coin_sheet.png?url";

import mapArenaJsonUrl from "@/assets/game/map_arena.json?url";
import mapArenaPngUrl from "@/assets/game/map_arena.png?url";
import levelsJsonUrl from "@/assets/game/levels.json?url";
import chestClosedPngUrl from "@/assets/game/chest_closed.png?url";

// GAME
import sequenceLevelsJson from "@/assets/game/levels/sequence_level.json?url";

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
import roadTilesPngUrl from "@/assets/game/maps/road_tiles.png?url";
import mapObjectTilesPgnUrl from "@/assets/game/maps/map_object.png?url";
import mapMarkerTilesPngUrl from "@/assets/game/maps/map_marker.png?url";

// AUDIO
import hoverMp3Url from "@/assets/game/sounds/flag-hover.mp3?url";
import selectMp3Url from "@/assets/game/sounds/flag-select.mp3?url";
import collectCoinMp3Url from "@/assets/game/sounds/collect_coin.mp3?url";
import onGoalMp3Url from "@/assets/game/sounds/on_goal.mp3?url";
import failedMp3Url from "@/assets/game/sounds/failed.mp3?url";
import bgMusicMp3Url from "@/assets/game/sounds/bg_sound.mp3?url";
import runningMp3Url from "@/assets/game/sounds/running_in_grass.mp3?url";
import tickMp3Url from "@/assets/game/sounds/tick.mp3?url";
import rejectedMp3Url from "@/assets/game/sounds/rejected.mp3?url";
import destroyMp3Url from "@/assets/game/sounds/destroy.mp3?url";

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
  },
  chest: {
    chestClosed: chestClosedPngUrl,
  },
  audio: {
    onHover: hoverMp3Url,
    onSelect: selectMp3Url,
    collectCoin: collectCoinMp3Url,
    onGoal: onGoalMp3Url,
    onFailed: failedMp3Url,
    bgMusic: bgMusicMp3Url,
    onMoving: runningMp3Url,
    onDrop: tickMp3Url,
    onRejected: rejectedMp3Url,
    onDestroy: destroyMp3Url,
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
