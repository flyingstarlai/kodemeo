import { type PropsWithChildren, useEffect, useState } from "react";
import {
  AssetContext,
  type AssetContextType,
} from "@/providers/asset-context.ts";
import {
  loadBundle,
  loadBundleAtlas,
  registerAssetBundles,
} from "@/lib/asset.ts";

export const AssetProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [assets, setAssets] = useState<AssetContextType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    registerAssetBundles();

    Promise.all([
      loadBundle("stars"),
      loadBundleAtlas("cat"), // Spritesheet
      loadBundleAtlas("mouse"), // Spritesheet
      loadBundleAtlas("coin"), // Spritesheet
      loadBundle("levels"), // JSON + Texture bundle
      loadBundle("maps"),
      loadBundle("chest"), // Texture bundle
      loadBundle("sequence"),
    ])
      .then(([stars, cat, mouse, coin, levels, maps, chest, sequence]) => {
        setAssets({ stars, cat, mouse, coin, levels, maps, chest, sequence });
      })
      .catch((err) => {
        console.error("Failed to load assets", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      });
  }, []);

  if (error) {
    return (
      <div className="text-red-500">Error loading assets: {error.message}</div>
    );
  }
  if (!assets) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-300 dark:bg-zinc-700">
        Loading assets…
      </div>
    );
  }

  return (
    <AssetContext.Provider value={assets}>{children}</AssetContext.Provider>
  );
};
