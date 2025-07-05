import { useEffect, useRef } from "react";
import { sound } from "@pixi/sound";
import { useAssets } from "@/providers/asset-context";
import type { BundleTextures } from "@/features/student/game/utils/asset-utils.ts";

export function useBackgroundMusic(
  key: keyof BundleTextures<"audio">,
  volume = 0.5,
) {
  const { audio } = useAssets();
  const startedRef = useRef(false);

  useEffect(() => {
    // Register the sound if it isn't yet
    if (!sound.find(key as string)) {
      sound.add(key as string, audio[key]!);
    }

    function startMusic() {
      if (startedRef.current) return;
      startedRef.current = true;

      // Resume the AudioContext (must be from user gesture)
      sound.context.audioContext.resume().then(() => {
        // Now we can play the loop
        sound.play(key as string, {
          loop: true,
          volume,
          start: 0,
        });
      });

      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    }

    // Listen for the first user gesture
    window.addEventListener("pointerdown", startMusic);
    window.addEventListener("keydown", startMusic);

    return () => {
      // Clean up and stop music on unmount
      sound.stop(key as string);
      window.removeEventListener("pointerdown", startMusic);
      window.removeEventListener("keydown", startMusic);
    };
  }, [key, audio, volume]);
}
