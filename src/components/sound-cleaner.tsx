import { useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { isSoundPlaying, stopSound } from "@/lib/sounds";

export const SoundCleaner: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const isPlayground = location.pathname.includes("playground");

    if (!isPlayground && isSoundPlaying("bgMusic")) {
      stopSound("bgMusic");
    }
  }, [location.pathname]);

  return null;
};
