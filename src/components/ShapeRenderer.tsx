import React from 'react';
import { Rect, Circle, Ellipse, Line, Group } from 'react-konva';

interface ShapeRendererProps {
  element: any;
  isSelected: boolean;
  onDragMove: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
  onDoubleClick: (e: any) => void;
}

export const ShapeRenderer: React.FC<ShapeRendererProps> = ({
  element,
  isSelected,
  onDragMove,
  onDragEnd,
  onClick,
  onDoubleClick,
}) => {
  const commonProps = {
    draggable: true,
    onDragMove,
    onDragEnd,
    onClick,
    onDblClick: onDoubleClick,
    stroke: isSelected ? '#1976d2' : element.style?.stroke || '#333',
    strokeWidth: isSelected ? 3 : element.style?.strokeWidth || 2,
    fill: element.style?.fill || '#fff',
    opacity: element.style?.opacity || 1,
  };

  const renderShape = () => {
    switch (element.properties?.shapeType) {
      case 'rectangle':
      case 'process':
      case 'class':
        return (
          <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            {...commonProps}
          />
        );

      case 'terminator':
        return (
          <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            cornerRadius={20}
            {...commonProps}
          />
        );

      case 'circle':
      case 'usecase':
        return (
          <Circle
            x={element.x + element.width / 2}
            y={element.y + element.height / 2}
            radius={Math.min(element.width, element.height) / 2}
            {...commonProps}
          />
        );

      case 'ellipse':
        return (
          <Ellipse
            x={element.x + element.width / 2}
            y={element.y + element.height / 2}
            radiusX={element.width / 2}
            radiusY={element.height / 2}
            {...commonProps}
          />
        );

      case 'diamond':
      case 'decision':
        return (
          <Line
            points={[
              element.x + element.width / 2, element.y,
              element.x + element.width, element.y + element.height / 2,
              element.x + element.width / 2, element.y + element.height,
              element.x, element.y + element.height / 2,
            ]}
            closed
            {...commonProps}
          />
        );

      case 'triangle':
        return (
          <Line
            points={[
              element.x + element.width / 2, element.y,
              element.x + element.width, element.y + element.height,
              element.x, element.y + element.height,
            ]}
            closed
            {...commonProps}
          />
        );

      case 'data':
        return (
          <Line
            points={[
              element.x + 20, element.y,
              element.x + element.width, element.y,
              element.x + element.width - 20, element.y + element.height,
              element.x, element.y + element.height,
            ]}
            closed
            {...commonProps}
          />
        );

      case 'actor':
        return (
          <Group>
            <Circle
              x={element.x + element.width / 2}
              y={element.y + 15}
              radius={10}
              {...commonProps}
            />
            <Line
              points={[
                element.x + element.width / 2, element.y + 25,
                element.x + element.width / 2, element.y + element.height - 20,
              ]}
              {...commonProps}
            />
            <Line
              points={[
                element.x + 10, element.y + 35,
                element.x + element.width - 10, element.y + 35,
              ]}
              {...commonProps}
            />
            <Line
              points={[
                element.x + element.width / 2, element.y + element.height - 20,
                element.x + 10, element.y + element.height,
              ]}
              {...commonProps}
            />
            <Line
              points={[
                element.x + element.width / 2, element.y + element.height - 20,
                element.x + element.width - 10, element.y + element.height,
              ]}
              {...commonProps}
            />
          </Group>
        );

      case 'component':
        return (
          <Group>
            <Rect
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              {...commonProps}
            />
            <Rect
              x={element.x - 5}
              y={element.y + 10}
              width={10}
              height={15}
              {...commonProps}
            />
            <Rect
              x={element.x - 5}
              y={element.y + 30}
              width={10}
              height={15}
              {...commonProps}
            />
          </Group>
        );

      case 'cloud':
        return (
          <Group>
            {Array.from({ length: 8 }, (_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const baseRadius = Math.min(element.width, element.height) / 4;
              const radius = baseRadius + Math.random() * baseRadius * 0.3;
              const centerX = element.x + element.width / 2;
              const centerY = element.y + element.height / 2;
              const x = centerX + Math.cos(angle) * (element.width / 3);
              const y = centerY + Math.sin(angle) * (element.height / 3);
              
              return (
                <Circle
                  key={i}
                  x={x}
                  y={y}
                  radius={radius}
                  {...commonProps}
                />
              );
            })}
          </Group>
        );

      case 'server':
        return (
          <Group>
            <Ellipse
              x={element.x + element.width / 2}
              y={element.y + 10}
              radiusX={element.width / 2}
              radiusY={10}
              {...commonProps}
            />
            <Rect
              x={element.x}
              y={element.y + 10}
              width={element.width}
              height={element.height - 20}
              {...commonProps}
            />
            <Ellipse
              x={element.x + element.width / 2}
              y={element.y + element.height - 10}
              radiusX={element.width / 2}
              radiusY={10}
              {...commonProps}
            />
            <Line
              points={[element.x + 10, element.y + 25, element.x + element.width - 10, element.y + 25]}
              {...commonProps}
            />
            <Line
              points={[element.x + 10, element.y + 35, element.x + element.width - 10, element.y + 35]}
              {...commonProps}
            />
          </Group>
        );

      case 'router':
        return (
          <Group>
            <Rect
              x={element.x}
              y={element.y + 10}
              width={element.width}
              height={element.height - 20}
              cornerRadius={5}
              {...commonProps}
            />
            {Array.from({ length: 6 }, (_, i) => (
              <Circle
                key={i}
                x={element.x + 15 + i * 12}
                y={element.y + element.height / 2}
                radius={2}
                fill="#00ff00"
                stroke="none"
              />
            ))}
            <Line
              points={[element.x - 5, element.y + 20, element.x, element.y + 20]}
              strokeWidth={3}
              stroke="#333"
            />
            <Line
              points={[element.x + element.width, element.y + 20, element.x + element.width + 5, element.y + 20]}
              strokeWidth={3}
              stroke="#333"
            />
          </Group>
        );

      case 'switch':
        return (
          <Group>
            <Rect
              x={element.x}
              y={element.y}
              width={element.width}
              height={element.height}
              cornerRadius={3}
              {...commonProps}
            />
            {Array.from({ length: 4 }, (_, i) => (
              <Rect
                key={i}
                x={element.x + 10 + i * 15}
                y={element.y + element.height - 15}
                width={8}
                height={8}
                fill="#333"
                cornerRadius={1}
              />
            ))}
          </Group>
        );

      case 'pentagon':
        return (
          <Line
            points={[
              element.x + element.width / 2, element.y,
              element.x + element.width, element.y + element.height * 0.4,
              element.x + element.width * 0.8, element.y + element.height,
              element.x + element.width * 0.2, element.y + element.height,
              element.x, element.y + element.height * 0.4,
            ]}
            closed
            {...commonProps}
          />
        );

      default:
        return (
          <Rect
            x={element.x}
            y={element.y}
            width={element.width}
            height={element.height}
            {...commonProps}
          />
        );
    }
  };

  return renderShape();
};
