import React from 'react';
import { Line } from 'react-konva';

interface GridProps {
  width: number;
  height: number;
  visible: boolean;
}

export const Grid: React.FC<GridProps> = ({ width, height, visible }) => {
  if (!visible) return null;

  const gridSize = 20;
  const lines = [];

  // Vertical lines
  for (let i = 0; i <= width; i += gridSize) {
    lines.push(
      <Line
        key={`v${i}`}
        points={[i, 0, i, height]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
        opacity={0.5}
      />
    );
  }

  // Horizontal lines
  for (let i = 0; i <= height; i += gridSize) {
    lines.push(
      <Line
        key={`h${i}`}
        points={[0, i, width, i]}
        stroke="#e0e0e0"
        strokeWidth={0.5}
        opacity={0.5}
      />
    );
  }

  return <>{lines}</>;
};
