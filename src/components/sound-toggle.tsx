import { Button } from "@/components/ui/button";
import { isSoundPlaying, playSound, stopSound } from "@/lib/sounds";
import { useSoundStore } from "@/stores/use-sound-store";
import { IconVolumeOff, IconVolume } from "@tabler/icons-react";
import { useEffect } from "react";

export const SoundToggle: React.FC = () => {
  const muted = useSoundStore((s) => s.muted);
  const setMuted = useSoundStore((s) => s.setMuted);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    if (newMuted) {
      stopSound("bgMusic");
    } else {
      playSound("bgMusic", { loop: true, volume: 0.5 });
    }
  };

  useEffect(() => {
    if (!muted && !isSoundPlaying("bgMusic")) {
      playSound("bgMusic", { loop: true, volume: 0.5 });
    }
  }, [muted]);

  return (
    <Button variant="outline" size="icon" onClick={toggleMute}>
      {muted ? (
        <IconVolumeOff className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <IconVolume className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle sound</span>
    </Button>
  );
};
