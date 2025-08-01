import React from 'react';
import { Group, Rect, Circle, Ellipse, Line, Text } from 'react-konva';
import { ConnectionHandles } from './ConnectionHandles';

interface ShapeConfig {
  element: any;
  isSelected: boolean;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
  onDoubleClick: (e: any) => void;
  connectionHandles?: {
    onMouseDown: (elementId: string, x: number, y: number) => void;
    onMouseUp: (elementId: string) => void;
  };
}

export const ShapeFactory: React.FC<ShapeConfig> = ({ 
  element, isSelected, onDragEnd, onClick, onDoubleClick, connectionHandles 
}) => {
  const commonProps = {
    draggable: true,
    onDragEnd,
    onClick,
    onDblClick: onDoubleClick,
    stroke: isSelected ? '#2196f3' : element.style?.stroke || '#333',
    strokeWidth: isSelected ? 3 : element.style?.strokeWidth || 2,
    fill: element.style?.fill || '#fff',
    opacity: element.style?.opacity || 1,
  };

  const renderText = () => element.properties?.text && (
    <Text
      text={element.properties.text}
      fontSize={element.properties.fontSize || 14}
      fontFamily={element.properties.fontFamily || 'Arial'}
      x={5}
      y={element.height / 2 - 7}
      width={element.width - 10}
      align="center"
      verticalAlign="middle"
      fill={element.properties.textColor || '#000'}
    />
  );

  const { x, y, width, height } = element;
  const cx = x + width/2, cy = y + height/2;
  
  const shapeComponents = {
    rectangle: () => <Rect x={x} y={y} width={width} height={height} {...commonProps} />,
    process: () => <Rect x={x} y={y} width={width} height={height} {...commonProps} />,
    class: () => <Rect x={x} y={y} width={width} height={height} {...commonProps} />,
    terminator: () => <Rect x={x} y={y} width={width} height={height} cornerRadius={20} {...commonProps} />,
    circle: () => <Circle x={cx} y={cy} radius={Math.min(width, height)/2} {...commonProps} />,
    usecase: () => <Circle x={cx} y={cy} radius={Math.min(width, height)/2} {...commonProps} />,
    ellipse: () => <Ellipse x={cx} y={cy} radiusX={width/2} radiusY={height/2} {...commonProps} />,
    diamond: () => <Line points={[cx, y, x + width, cy, cx, y + height, x, cy]} closed {...commonProps} />,
    decision: () => <Line points={[cx, y, x + width, cy, cx, y + height, x, cy]} closed {...commonProps} />,
    triangle: () => <Line points={[cx, y, x + width, y + height, x, y + height]} closed {...commonProps} />,
    data: () => <Line points={[x + 20, y, x + width, y, x + width - 20, y + height, x, y + height]} closed {...commonProps} />,
    pentagon: () => <Line points={[cx, y, x + width, y + height*0.4, x + width*0.8, y + height, x + width*0.2, y + height, x, y + height*0.4]} closed {...commonProps} />,
    actor: () => (
      <Group>
        <Circle x={cx} y={y + 15} radius={10} {...commonProps} />
        <Line points={[cx, y + 25, cx, y + height - 20]} {...commonProps} />
        <Line points={[x + 10, y + 35, x + width - 10, y + 35]} {...commonProps} />
        <Line points={[cx, y + height - 20, x + 10, y + height]} {...commonProps} />
        <Line points={[cx, y + height - 20, x + width - 10, y + height]} {...commonProps} />
      </Group>
    ),
    component: () => (
      <Group>
        <Rect x={x} y={y} width={width} height={height} {...commonProps} />
        <Rect x={x - 5} y={y + 10} width={10} height={15} {...commonProps} />
        <Rect x={x - 5} y={y + 30} width={10} height={15} {...commonProps} />
      </Group>
    ),
    cloud: () => (
      <Group>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2, baseRadius = Math.min(width, height) / 4;
          const radius = baseRadius + Math.random() * baseRadius * 0.3;
          const cloudX = cx + Math.cos(angle) * (width/3), cloudY = cy + Math.sin(angle) * (height/3);
          return <Circle key={i} x={cloudX} y={cloudY} radius={radius} {...commonProps} />;
        })}
      </Group>
    ),
    server: () => (
      <Group>
        <Ellipse x={cx} y={y + 10} radiusX={width/2} radiusY={10} {...commonProps} />
        <Rect x={x} y={y + 10} width={width} height={height - 20} {...commonProps} />
        <Ellipse x={cx} y={y + height - 10} radiusX={width/2} radiusY={10} {...commonProps} />
        <Line points={[x + 10, y + 25, x + width - 10, y + 25]} {...commonProps} />
        <Line points={[x + 10, y + 35, x + width - 10, y + 35]} {...commonProps} />
      </Group>
    ),
    router: () => (
      <Group>
        <Rect x={x} y={y + 10} width={width} height={height - 20} cornerRadius={5} {...commonProps} />
        {Array.from({ length: 6 }, (_, i) => (
          <Circle key={i} x={x + 15 + i * 12} y={cy} radius={2} fill="#00ff00" stroke="none" />
        ))}
        <Line points={[x - 5, y + 20, x, y + 20]} strokeWidth={3} stroke="#333" />
        <Line points={[x + width, y + 20, x + width + 5, y + 20]} strokeWidth={3} stroke="#333" />
      </Group>
    ),
    switch: () => (
      <Group>
        <Rect x={x} y={y} width={width} height={height} cornerRadius={3} {...commonProps} />
        {Array.from({ length: 4 }, (_, i) => (
          <Rect key={i} x={x + 10 + i * 15} y={y + height - 15} width={8} height={8} fill="#333" cornerRadius={1} />
        ))}
      </Group>
    ),
  };

  const ShapeComponent = shapeComponents[element.properties?.shapeType as keyof typeof shapeComponents] || shapeComponents.rectangle;

  return (
    <Group key={element.id}>
      <ShapeComponent />
      {renderText()}
      {connectionHandles && (
        <ConnectionHandles
          element={element}
          onMouseDown={connectionHandles.onMouseDown}
          onMouseUp={connectionHandles.onMouseUp}
        />
      )}
    </Group>
  );
};
