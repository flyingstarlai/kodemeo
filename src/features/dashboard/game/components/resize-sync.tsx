import { useResizePixiApp } from "@/features/dashboard/game/hooks/use-resize-app.ts";
import { useEffect } from "react";

interface Props {
  resizeRef: React.RefObject<HTMLDivElement | null>;
  onResize: (size: { width: number; height: number }) => void;
}

export const ResizeSync: React.FC<Props> = ({ resizeRef, onResize }) => {
  const size = useResizePixiApp(resizeRef);

  useEffect(() => {
    onResize(size);
  }, [size, onResize]);

  return null;
};
