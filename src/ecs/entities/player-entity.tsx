import { useCreateEntity } from "@/features/student/game/hooks/use-create-entity.ts";
import { getCenteredTilePosition } from "@/features/student/game/utils/tile-utils";
import { EntityProvider } from "@/providers/entity-provider";
import { useEcsStore } from "@/stores/use-ecs-store";
import { PlayerTag } from "../components/player-tag";
import { GridPosition } from "@/ecs/components/grid-position.tsx";
import { Position } from "../components/position";
import { GameConstants } from "@/features/student/game/constans";
import { Movement } from "../components/movement";
import { GridMovement } from "../components/grid-movement";
import { Facing } from "../components/facing";
import { Bag } from "@/ecs/components/bag.tsx";
import { SpriteAnimation } from "@/ecs/components/sprite-animation.tsx";
import { useMemo } from "react";

interface PlayerProps {
  size?: number;
}

export const PlayerEntity: React.FC<PlayerProps> = () => {
  const eid = useCreateEntity();

  // 1) Subscribe to `level` so that when it changes, this component re-renders
  const level = useEcsStore((s) => s.levelData);

  // 2) useMemo to extract [col,row] from the first start tile and compute pixel
  const { col, row, pixelX, pixelY } = useMemo(() => {
    const [startTile] =
      level.start.length > 0 ? level.start : [{ col: 0, row: 0 }];
    const sc = startTile.col;
    const sr = startTile.row;
    const { x: px, y: py } = getCenteredTilePosition(sc, sr);
    return { col: sc, row: sr, pixelX: px, pixelY: py };
  }, [level.start]);

  // 3) If there’s no start tile at all, render nothing
  if (eid === null || level.start.length === 0) {
    return null;
  }

  // 4) Wrap everything in <EntityProvider> so that all child facets can register themselves:
  return (
    <EntityProvider eid={eid}>
      <PlayerTag />

      <GridPosition col={col} row={row} />

      <Position x={pixelX} y={pixelY} />

      <Movement progress={1} duration={GameConstants.DURATION} />

      <GridMovement startCol={col} startRow={row} destCol={col} destRow={row} />

      <SpriteAnimation name="idle" fps={20} isPlaying={true} />

      <Facing direction={level.facing} />
      <Bag coins={0} />
    </EntityProvider>
  );
};
