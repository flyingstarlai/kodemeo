import React from "react";
import { useCreateEntity } from "@/features/student/game/hooks/use-create-entity.ts";
import { getCenteredTilePosition } from "@/features/student/game/utils/tile-utils";
import { EntityProvider } from "@/providers/entity-provider.tsx";
import { GridPosition } from "@/ecs/components/grid-position.tsx";
import { Position } from "../components/position";
import { GameConstants } from "@/features/student/game/constans.ts";
import { Display } from "../components/display";
import { Tile } from "@/ecs/components/tile.tsx";
import type { TileKind } from "@/features/student/game/types.ts";

// Adjust these imports / names to match your Tile component’s implementation
// If you already have a <Tile> facet that adds components, you can call that instead.
// Here is one possible implementation:

export interface TileEntityProps {
  col: number;
  row: number;
  kind: TileKind;
}

export const TileEntity: React.FC<TileEntityProps> = ({ col, row, kind }) => {
  // 1) Get a unique eid for this tile
  const eid = useCreateEntity();

  // 2) Until `eid` is non-null, render nothing
  if (eid === null) {
    return null;
  }

  // 3) Compute the pixel position (center of the tile)
  const { x: pixelX, y: pixelY } = getCenteredTilePosition(col, row);

  // 4) Render facets under EntityProvider
  return (
    <EntityProvider eid={eid}>
      <GridPosition col={col} row={row} />
      <Position x={pixelX} y={pixelY} />
      {kind !== "empty" && (
        <Display color={COLOR_MAP[kind]} size={GameConstants.TILE_SIZE} />
      )}
      <Tile col={col} row={row} kind={kind} />
    </EntityProvider>
  );
};

const COLOR_MAP: Record<Exclude<TileKind, "empty">, number> = {
  path: 0xffffff,
  start: 0xe7bfff,
  collectible: 0x00ff00,
  obstacle: 0xe03131,
  goal: 0x698dff,
};
