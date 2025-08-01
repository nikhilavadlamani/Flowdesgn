import React from 'react';
import { Circle } from 'react-konva';

interface ConnectionHandlesProps {
  element: any;
  onMouseDown?: (elementId: string, x: number, y: number) => void;
  onMouseUp?: (elementId: string) => void;
}

export const ConnectionHandles: React.FC<ConnectionHandlesProps> = ({
  element,
  onMouseDown,
  onMouseUp,
}) => {
  const handles = [
    { x: element.x + element.width / 2, y: element.y, anchor: 'top' },
    { x: element.x + element.width, y: element.y + element.height / 2, anchor: 'right' },
    { x: element.x + element.width / 2, y: element.y + element.height, anchor: 'bottom' },
    { x: element.x, y: element.y + element.height / 2, anchor: 'left' },
  ];

  return (
    <>
      {handles.map((handle, index) => (
        <Circle
          key={`handle-${element.id}-${index}`}
          x={handle.x}
          y={handle.y}
          radius={4}
          fill="#1976d2"
          stroke="#ffffff"
          strokeWidth={1.5}
          opacity={0.8}
          onMouseEnter={(e) => {
            const target = e.target as any;
            target.fill("#ff5722");
            target.radius(6);
            target.opacity(1);
            e.target.getLayer()?.batchDraw();
          }}
          onMouseLeave={(e) => {
            const target = e.target as any;
            target.fill("#1976d2");
            target.radius(4);
            target.opacity(0.8);
            e.target.getLayer()?.batchDraw();
          }}
          onMouseDown={() => onMouseDown?.(element.id, handle.x, handle.y)}
          onMouseUp={() => onMouseUp?.(element.id)}
        />
      ))}
    </>
  );
};
