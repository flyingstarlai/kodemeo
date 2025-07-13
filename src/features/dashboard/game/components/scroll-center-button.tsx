import { Button } from "@/components/ui/button.tsx";
import { IconFocusCentered } from "@tabler/icons-react";
import React from "react";
import { useUIStore } from "@/features/dashboard/game/store/use-ui-store.ts";
import { usePlayerStore } from "@/features/dashboard/game/store/use-player-store.ts";

export const ScrollCenterButton: React.FC = () => {
  const { scrollToCenter } = useUIStore();

  return (
    <Button
      variant="secondary"
      onClick={() => {
        const [position] = usePlayerStore.getState().sprites;
        scrollToCenter({ x: position.x, y: position.y });
      }}
    >
      <IconFocusCentered />
    </Button>
  );
};
