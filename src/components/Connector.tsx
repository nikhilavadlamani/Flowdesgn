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
    
    // Ensure connection points are exactly at the shape edge
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

  // Calculate precise connection points
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
    const arrowLength = 12;
    const arrowAngle = Math.PI / 6;

    // Calculate arrow points more precisely
    const x1 = endPoint.x - arrowLength * Math.cos(angle - arrowAngle);
    const y1 = endPoint.y - arrowLength * Math.sin(angle - arrowAngle);
    const x2 = endPoint.x - arrowLength * Math.cos(angle + arrowAngle);
    const y2 = endPoint.y - arrowLength * Math.sin(angle + arrowAngle);

    return [endPoint.x, endPoint.y, x1, y1, endPoint.x, endPoint.y, x2, y2];
  };

  // Calculate the actual line path, slightly shortened to not overlap with shapes
  const getAdjustedPath = () => {
    const path = getPath();
    if (path.length >= 4) {
      const dx = endPoint.x - startPoint.x;
      const dy = endPoint.y - startPoint.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      
      if (length > 0) {
        // Slightly shorten the line so arrow doesn't overlap with shape
        const shortenBy = 2;
        const unitX = dx / length;
        const unitY = dy / length;
        
        const adjustedEndX = endPoint.x - unitX * shortenBy;
        const adjustedEndY = endPoint.y - unitY * shortenBy;
        
        return [startPoint.x, startPoint.y, adjustedEndX, adjustedEndY];
      }
    }
    return path;
  };

  return (
    <Group onClick={onClick}>
      {/* Main connector line */}
      <Line
        points={getAdjustedPath()}
        stroke={isSelected ? '#2196f3' : (connector.style.stroke || '#333333')}
        strokeWidth={isSelected ? 3 : (connector.style.strokeWidth || 2)}
        opacity={connector.style.opacity || 1}
        lineCap="round"
        lineJoin="round"
      />
      
      {/* Arrow head */}
      <Line
        points={drawArrowHead()}
        stroke={isSelected ? '#2196f3' : (connector.style.stroke || '#333333')}
        strokeWidth={isSelected ? 3 : (connector.style.strokeWidth || 2)}
        opacity={connector.style.opacity || 1}
        fill={isSelected ? '#2196f3' : (connector.style.stroke || '#333333')}
        closed
        lineCap="round"
        lineJoin="round"
      />
      
      {/* Connection point indicators when selected */}
      {isSelected && (
        <>
          <Circle
            x={startPoint.x}
            y={startPoint.y}
            radius={3}
            fill="#4caf50"
            stroke="#ffffff"
            strokeWidth={1}
          />
          <Circle
            x={endPoint.x}
            y={endPoint.y}
            radius={3}
            fill="#f44336"
            stroke="#ffffff"
            strokeWidth={1}
          />
        </>
      )}
    </Group>
  );
};
