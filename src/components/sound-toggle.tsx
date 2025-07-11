import { Button } from "@/components/ui/button";
import { useState } from "react";
import { playSound, isSoundPlaying, stopSound } from "@/lib/sounds";
import { IconVolumeOff, IconVolume } from "@tabler/icons-react";

export const SoundToggle: React.FC = () => {
  const [muted, setMuted] = useState(!isSoundPlaying("bgMusic"));

  const toggleMute = () => {
    if (muted) {
      playSound("bgMusic", { loop: true, volume: 0.5 });
    } else {
      stopSound("bgMusic");
    }
    setMuted((prev) => !prev);
  };

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
