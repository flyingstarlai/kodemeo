import React, { useMemo } from "react";
import { useEcsStore } from "@/stores/use-ecs-store.ts";
import { GameConstants } from "../constans";
import type { TileKind } from "../types";
import { TileEntity } from "@/ecs/entities/tile-entity.tsx";
import type { LevelData } from "@/features/teacher/assignment/types.ts";

export const TileEntitiesWrapper: React.FC = () => {
  // 1) Subscribe to the current level
  const level = useEcsStore((s) => s.levelData);

  // 2) Build a flat list of every (col,row,kind) for the full grid
  const tiles = useMemo(() => {
    const list: Array<{ col: number; row: number; kind: TileKind }> = [];
    for (let r = 0; r < GameConstants.GRID_ROWS; r++) {
      for (let c = 0; c < GameConstants.GRID_COLS; c++) {
        list.push({ col: c, row: r, kind: kindAt(c, r, level) });
      }
    }
    return list;
  }, [level]);

  if (!GameConstants.DEBUG_MODE) return null;

  // 3) Render one <TileEntity> per tile
  return (
    <>
      {tiles.map(({ col, row, kind }, idx) => (
        <TileEntity
          key={`tile-${idx}-${col}-${row}`}
          col={col}
          row={row}
          kind={kind}
        />
      ))}
    </>
  );
};

// Helper to decide kind at (col,row)
function kindAt(col: number, row: number, level: LevelData): TileKind {
  for (const [k, list] of Object.entries(level)) {
    if (!Array.isArray(list)) continue;
    if (
      list.some(
        (p: { col: number; row: number }) => p.col === col && p.row === row,
      )
    ) {
      return k as TileKind;
    }
  }
  return "empty";
}
