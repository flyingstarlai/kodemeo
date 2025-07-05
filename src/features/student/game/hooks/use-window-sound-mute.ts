import { useEffect } from "react";
import { sound } from "@pixi/sound";

export function useWindowSoundMute() {
  useEffect(() => {
    const onBlur = () => {
      // Mute every playing sound
      sound.pauseAll();
    };
    const onFocus = () => {
      // Unmute all sounds so they can play again
      sound.resumeAll();
    };

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);
}
