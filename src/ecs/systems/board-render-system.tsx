import React from "react";
import { TextStyle } from "pixi.js";
import { GameConstants } from "@/features/student/game/constans";

export const BoardRenderSystem: React.FC = () => {
  const gridW = GameConstants.GRID_COLS * GameConstants.TILE_SIZE;
  const gridH = GameConstants.GRID_ROWS * GameConstants.TILE_SIZE;
  const ts = GameConstants.TILE_SIZE;

  if (!GameConstants.DEBUG_MODE) return null;

  // a simple style for the numbers
  const labelStyle = new TextStyle({
    fill: "#00ff00",
    fontSize: 14,
    fontWeight: "bold",
  });

  // 1) column labels (0,1,2…)
  const colLabels = [...Array(GameConstants.GRID_COLS)].map((_, col) => {
    const x = col * ts + ts / 2;
    return (
      <pixiText
        label={`text_${col}`}
        key={`col-${col}`}
        text={`${col}`}
        style={labelStyle}
        x={x}
        y={-ts * 0.3} // put them above the grid by 30% of tile size
        anchor={{ x: 0.5, y: 0 }}
      />
    );
  });

  // 2) row labels (0,1,2…)
  const rowLabels = [...Array(GameConstants.GRID_ROWS)].map((_, row) => {
    const y = row * ts + ts / 2;
    return (
      <pixiText
        key={`row-${row}`}
        text={`${row}`}
        style={labelStyle}
        x={-ts * 0.3} // put them left of the grid by 30% of tile size
        y={y}
        anchor={{ x: 1, y: 0.5 }}
      />
    );
  });

  return (
    <>
      {/* your existing debug grid lines */}
      <pixiGraphics
        label="debug_lines"
        draw={(g) => {
          g.clear();
          g.setStrokeStyle({ color: 0xffb91b, alpha: 0.8 });
          g.moveTo(0, 0);
          for (let x = 0; x <= GameConstants.GRID_COLS; x++) {
            g.moveTo(x * GameConstants.TILE_SIZE, 0).lineTo(
              x * GameConstants.TILE_SIZE,
              gridH,
            );
          }
          for (let y = 0; y <= GameConstants.GRID_ROWS; y++) {
            g.moveTo(0, y * GameConstants.TILE_SIZE).lineTo(
              gridW,
              y * GameConstants.TILE_SIZE,
            );
          }
          g.stroke();
        }}
      />

      {/* column numbers above */}
      {colLabels}

      {/* row numbers to the left */}
      {rowLabels}
    </>
  );
};
