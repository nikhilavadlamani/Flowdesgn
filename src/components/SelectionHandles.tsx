import React from 'react';
import { Rect, Circle, Group } from 'react-konva';
import { DiagramElement } from '../types';

interface SelectionHandlesProps {
  element: DiagramElement;
  onResize: (elementId: string, newBounds: { x: number; y: number; width: number; height: number }) => void;
}

export const SelectionHandles: React.FC<SelectionHandlesProps> = ({ element, onResize }) => {
  const handleSize = 8;
  const handles = [
    { x: element.x - handleSize / 2, y: element.y - handleSize / 2, cursor: 'nw-resize' }, // top-left
    { x: element.x + element.width / 2 - handleSize / 2, y: element.y - handleSize / 2, cursor: 'n-resize' }, // top-center
    { x: element.x + element.width - handleSize / 2, y: element.y - handleSize / 2, cursor: 'ne-resize' }, // top-right
    { x: element.x + element.width - handleSize / 2, y: element.y + element.height / 2 - handleSize / 2, cursor: 'e-resize' }, // middle-right
    { x: element.x + element.width - handleSize / 2, y: element.y + element.height - handleSize / 2, cursor: 'se-resize' }, // bottom-right
    { x: element.x + element.width / 2 - handleSize / 2, y: element.y + element.height - handleSize / 2, cursor: 's-resize' }, // bottom-center
    { x: element.x - handleSize / 2, y: element.y + element.height - handleSize / 2, cursor: 'sw-resize' }, // bottom-left
    { x: element.x - handleSize / 2, y: element.y + element.height / 2 - handleSize / 2, cursor: 'w-resize' }, // middle-left
  ];

  return (
    <Group>
      {/* Selection border */}
      <Rect
        x={element.x - 2}
        y={element.y - 2}
        width={element.width + 4}
        height={element.height + 4}
        stroke="#2196f3"
        strokeWidth={2}
        fill="transparent"
        dash={[5, 5]}
      />
      
      {/* Resize handles */}
      {handles.map((handle, index) => (
        <Circle
          key={index}
          x={handle.x + handleSize / 2}
          y={handle.y + handleSize / 2}
          radius={handleSize / 2}
          fill="#ffffff"
          stroke="#2196f3"
          strokeWidth={2}
          draggable
          onDragMove={(e) => {
            const newX = e.target.x() - handleSize / 2;
            const newY = e.target.y() - handleSize / 2;
            
            // Calculate new bounds based on which handle is being dragged
            let newBounds = { x: element.x, y: element.y, width: element.width, height: element.height };
            
            switch (index) {
              case 0: // top-left
                newBounds = {
                  x: newX + handleSize / 2,
                  y: newY + handleSize / 2,
                  width: element.x + element.width - (newX + handleSize / 2),
                  height: element.y + element.height - (newY + handleSize / 2),
                };
                break;
              case 2: // top-right
                newBounds = {
                  x: element.x,
                  y: newY + handleSize / 2,
                  width: newX + handleSize / 2 - element.x,
                  height: element.y + element.height - (newY + handleSize / 2),
                };
                break;
              case 4: // bottom-right
                newBounds = {
                  x: element.x,
                  y: element.y,
                  width: newX + handleSize / 2 - element.x,
                  height: newY + handleSize / 2 - element.y,
                };
                break;
              case 6: // bottom-left
                newBounds = {
                  x: newX + handleSize / 2,
                  y: element.y,
                  width: element.x + element.width - (newX + handleSize / 2),
                  height: newY + handleSize / 2 - element.y,
                };
                break;
            }
            
            // Ensure minimum size
            if (newBounds.width > 20 && newBounds.height > 20) {
              onResize(element.id, newBounds);
            }
          }}
        />
      ))}
    </Group>
  );
};
