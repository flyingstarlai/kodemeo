import { createContext, useContext } from "react";
import type { Spritesheet } from "pixi.js";
import type { BundleTextures } from "@/lib/asset.ts";

export interface AssetContextType {
  // parsed atlas → Spritesheet
  cat: Spritesheet;
  coin: Spritesheet;
  // generic bundles: JSON objects and Textures
  maps: BundleTextures<"maps">;
  chest: BundleTextures<"chest">;
  stars: BundleTextures<"stars">;
  // audio URLs
  sequence: BundleTextures<"sequence">;
}

export const AssetContext = createContext<AssetContextType | null>(null);

export function useAssets(): AssetContextType {
  const context = useContext(AssetContext);
  if (context === null) {
    throw new Error(`useAssets must be used within AssetProvider.`);
  }
  return context;
}
