import React from 'react';
import { Line, Circle, Group } from 'react-konva';
import { DiagramElement } from '../types';

interface ConnectorProps {
  connector: DiagramElement;
  startElement?: DiagramElement;
  endElement?: DiagramElement;
  isSelected: boolean;
  onClick: () => void;
}

export const Connector: React.FC<ConnectorProps> = ({ 
  connector, 
  startElement, 
  endElement, 
  isSelected, 
  onClick 
}) => {
  const getConnectionPoint = (element: DiagramElement, anchor: string) => {
    const centerX = element.x + element.width / 2;
    const centerY = element.y + element.height / 2;
    
    switch (anchor) {
      case 'top':
        return { x: centerX, y: element.y };
      case 'right':
        return { x: element.x + element.width, y: centerY };
      case 'bottom':
        return { x: centerX, y: element.y + element.height };
      case 'left':
        return { x: element.x, y: centerY };
      default:
        return { x: centerX, y: centerY };
    }
  };

  const startPoint = startElement 
    ? getConnectionPoint(startElement, connector.properties.anchorStart || 'right')
    : { x: connector.x, y: connector.y };

  const endPoint = endElement
    ? getConnectionPoint(endElement, connector.properties.anchorEnd || 'left')
    : { x: connector.x + connector.width, y: connector.y + connector.height };

  const getPath = () => {
    const { connectorType = 'straight' } = connector.properties;
    
    switch (connectorType) {
      case 'orthogonal':
        const midX = (startPoint.x + endPoint.x) / 2;
        return [startPoint.x, startPoint.y, midX, startPoint.y, midX, endPoint.y, endPoint.x, endPoint.y];
      
      case 'curved':
        // For now, use straight line - can be enhanced with bezier curves
        return [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
      
      default: // straight
        return [startPoint.x, startPoint.y, endPoint.x, endPoint.y];
    }
  };

  const drawArrowHead = () => {
    const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;

    const x1 = endPoint.x - arrowLength * Math.cos(angle - arrowAngle);
    const y1 = endPoint.y - arrowLength * Math.sin(angle - arrowAngle);
    const x2 = endPoint.x - arrowLength * Math.cos(angle + arrowAngle);
    const y2 = endPoint.y - arrowLength * Math.sin(angle + arrowAngle);

    return [endPoint.x, endPoint.y, x1, y1, endPoint.x, endPoint.y, x2, y2];
  };

  return (
    <Group onClick={onClick}>
      {/* Main connector line */}
      <Line
        points={getPath()}
        stroke={isSelected ? '#2196f3' : (connector.style.stroke || '#000000')}
        strokeWidth={isSelected ? 3 : (connector.style.strokeWidth || 2)}
        opacity={connector.style.opacity || 1}
        dash={connector.style.strokeDashArray}
      />
      
      {/* Arrow head */}
      <Line
        points={drawArrowHead()}
        stroke={isSelected ? '#2196f3' : (connector.style.stroke || '#000000')}
        strokeWidth={isSelected ? 3 : (connector.style.strokeWidth || 2)}
        opacity={connector.style.opacity || 1}
        fill={connector.style.stroke || '#000000'}
        closed
      />
      
      {/* Connection points for visual feedback */}
      {isSelected && (
        <>
          <Circle
            x={startPoint.x}
            y={startPoint.y}
            radius={4}
            fill="#2196f3"
            stroke="#ffffff"
            strokeWidth={2}
          />
          <Circle
            x={endPoint.x}
            y={endPoint.y}
            radius={4}
            fill="#2196f3"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </>
      )}
    </Group>
  );
};
