import { useEffect, useRef } from "react";
import { World } from "@lastolivegames/becsy";
import { useTick } from "@pixi/react";
import { createWorld } from "@/ecs/world.ts";

export const WorldInitializer: React.FC = () => {
  const worldRef = useRef<World | null>(null);

  useEffect(() => {
    (async () => {
      if (!worldRef.current) {
        worldRef.current = await createWorld();
      }
    })();

    return () => {
      // disposeWorld().finally(() => {
      //   worldRef.current = null;
      // });
    };
  }, []);

  useTick(async () => {
    const world = worldRef.current;
    if (world && world.alive) {
      await world.execute();
    }
  });

  return null;
};
