import React from 'react';
import { Line, Group } from 'react-konva';

interface ConnectorProps {
  connector: any;
  startElement?: any;
  endElement?: any;
}

export const ConnectorRenderer: React.FC<ConnectorProps> = ({ 
  connector, startElement, endElement 
}) => {
  if (!startElement || !endElement) return null;

  const getAnchorPoint = (element: any, anchor: string) => {
    const { x, y, width, height } = element;
    const anchorMap = {
      top: { x: x + width / 2, y },
      bottom: { x: x + width / 2, y: y + height },
      left: { x, y: y + height / 2 },
      right: { x: x + width, y: y + height / 2 },
    };
    return anchorMap[anchor as keyof typeof anchorMap] || { x: x + width / 2, y: y + height / 2 };
  };

  const startPoint = getAnchorPoint(startElement, connector.properties?.anchorStart || 'right');
  const endPoint = getAnchorPoint(endElement, connector.properties?.anchorEnd || 'left');

  const generatePath = () => {
    const { x: x1, y: y1 } = startPoint;
    const { x: x2, y: y2 } = endPoint;
    
    if (connector.properties?.connectorType === 'orthogonal') {
      const midX = (x1 + x2) / 2;
      return [x1, y1, midX, y1, midX, y2, x2, y2];
    }
    
    return [x1, y1, x2, y2];
  };

  const getArrowPoints = () => {
    const { x: x1, y: y1 } = startPoint;
    const { x: x2, y: y2 } = endPoint;
    
    // Calculate the angle of the line
    const angle = Math.atan2(y2 - y1, x2 - x1);
    const arrowLength = 12;
    const arrowAngle = Math.PI / 6; // 30 degrees
    
    // Calculate arrow head points
    const x3 = x2 - arrowLength * Math.cos(angle - arrowAngle);
    const y3 = y2 - arrowLength * Math.sin(angle - arrowAngle);
    const x4 = x2 - arrowLength * Math.cos(angle + arrowAngle);
    const y4 = y2 - arrowLength * Math.sin(angle + arrowAngle);
    
    return [x3, y3, x2, y2, x4, y4];
  };

  return (
    <Group>
      <Line
        points={generatePath()}
        stroke={connector.style?.stroke || '#333'}
        strokeWidth={connector.style?.strokeWidth || 2}
        opacity={connector.style?.opacity || 1}
      />
      {/* Arrow head */}
      <Line
        points={getArrowPoints()}
        stroke={connector.style?.stroke || '#333'}
        strokeWidth={connector.style?.strokeWidth || 2}
        lineCap="round"
        lineJoin="round"
        closed={false}
      />
    </Group>
  );
};
