import { DiagramElement, Point } from '../types';

export const snapToGrid = (point: Point, gridSize: number = 20): Point => {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize,
  };
};

export const getElementBounds = (element: DiagramElement) => {
  return {
    x: element.x,
    y: element.y,
    width: element.width,
    height: element.height,
    right: element.x + element.width,
    bottom: element.y + element.height,
    centerX: element.x + element.width / 2,
    centerY: element.y + element.height / 2,
  };
};

export const isPointInElement = (point: Point, element: DiagramElement): boolean => {
  return (
    point.x >= element.x &&
    point.x <= element.x + element.width &&
    point.y >= element.y &&
    point.y <= element.y + element.height
  );
};

export const getDistance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

export const getElementsInBounds = (
  elements: DiagramElement[],
  bounds: { x: number; y: number; width: number; height: number }
): DiagramElement[] => {
  return elements.filter(element => {
    const elementBounds = getElementBounds(element);
    return !(
      elementBounds.right < bounds.x ||
      elementBounds.x > bounds.x + bounds.width ||
      elementBounds.bottom < bounds.y ||
      elementBounds.y > bounds.y + bounds.height
    );
  });
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const cloneElement = (element: DiagramElement): DiagramElement => {
  return {
    ...element,
    id: generateId(),
    x: element.x + 20,
    y: element.y + 20,
    properties: { ...element.properties },
    style: { ...element.style },
  };
};

export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
};

export const getConnectorPath = (
  start: Point,
  end: Point,
  type: 'straight' | 'orthogonal' | 'curved' = 'straight'
): string => {
  switch (type) {
    case 'straight':
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
      
    case 'orthogonal':
      const midX = (start.x + end.x) / 2;
      return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
      
    case 'curved':
      const controlX1 = start.x + (end.x - start.x) * 0.5;
      const controlY1 = start.y;
      const controlX2 = start.x + (end.x - start.x) * 0.5;
      const controlY2 = end.y;
      return `M ${start.x} ${start.y} C ${controlX1} ${controlY1} ${controlX2} ${controlY2} ${end.x} ${end.y}`;
      
    default:
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }
};

export const getAnchorPoints = (element: DiagramElement): Record<string, Point> => {
  const bounds = getElementBounds(element);
  
  return {
    top: { x: bounds.centerX, y: bounds.y },
    right: { x: bounds.right, y: bounds.centerY },
    bottom: { x: bounds.centerX, y: bounds.bottom },
    left: { x: bounds.x, y: bounds.centerY },
    topLeft: { x: bounds.x, y: bounds.y },
    topRight: { x: bounds.right, y: bounds.y },
    bottomLeft: { x: bounds.x, y: bounds.bottom },
    bottomRight: { x: bounds.right, y: bounds.bottom },
  };
};

export const findNearestAnchor = (point: Point, element: DiagramElement): { anchor: string; point: Point } => {
  const anchors = getAnchorPoints(element);
  let nearest = { anchor: 'top', point: anchors.top };
  let minDistance = getDistance(point, anchors.top);
  
  for (const [anchorName, anchorPoint] of Object.entries(anchors)) {
    const distance = getDistance(point, anchorPoint);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = { anchor: anchorName, point: anchorPoint };
    }
  }
  
  return nearest;
};
