import Konva from 'konva';

export const getPointerPosition = (stage: Konva.Stage | null) => {
  if (!stage) return { x: 0, y: 0 };
  return stage.getPointerPosition() || { x: 0, y: 0 };
};

export const snapToGrid = (value: number, gridSize: number = 20, enabled: boolean = true): number => {
  if (!enabled) return value;
  return Math.round(value / gridSize) * gridSize;
};

export const calculateAlignmentGuides = (
  draggedElement: any,
  allElements: any[],
  threshold: number = 5
) => {
  const guides: { x?: number; y?: number } = {};
  const centerX = draggedElement.x + draggedElement.width / 2;
  const centerY = draggedElement.y + draggedElement.height / 2;

  for (const element of allElements) {
    if (element.id === draggedElement.id || element.type !== 'shape') continue;

    const elementCenterX = element.x + element.width / 2;
    const elementCenterY = element.y + element.height / 2;

    // Check for horizontal alignment
    if (Math.abs(centerY - elementCenterY) < threshold) {
      guides.y = elementCenterY;
    }
    if (Math.abs(draggedElement.y - element.y) < threshold) {
      guides.y = element.y;
    }
    if (Math.abs(draggedElement.y + draggedElement.height - element.y - element.height) < threshold) {
      guides.y = element.y + element.height;
    }

    // Check for vertical alignment
    if (Math.abs(centerX - elementCenterX) < threshold) {
      guides.x = elementCenterX;
    }
    if (Math.abs(draggedElement.x - element.x) < threshold) {
      guides.x = element.x;
    }
    if (Math.abs(draggedElement.x + draggedElement.width - element.x - element.width) < threshold) {
      guides.x = element.x + element.width;
    }
  }

  return guides;
};

export const handleDoubleClick = (
  elementId: string,
  currentTime: number,
  lastClickTime: React.MutableRefObject<number>,
  lastClickedElement: React.MutableRefObject<string | null>,
  setIsEditing: (editing: boolean) => void,
  setEditingElement: (id: string | null) => void,
  setEditingText: (text: string) => void,
  setTextInputPosition: (pos: { x: number; y: number; width: number; height: number }) => void,
  element: any,
  stageRef: React.RefObject<Konva.Stage>
) => {
  const doubleClickThreshold = 300;
  
  if (
    currentTime - lastClickTime.current < doubleClickThreshold &&
    lastClickedElement.current === elementId
  ) {
    if (element.type === 'text' || element.properties?.text) {
      const stage = stageRef.current;
      if (stage) {
        const stageBox = stage.container().getBoundingClientRect();
        setTextInputPosition({
          x: stageBox.left + element.x,
          y: stageBox.top + element.y,
          width: element.width,
          height: element.height,
        });
        setEditingText(element.properties?.text || 'Text');
        setEditingElement(elementId);
        setIsEditing(true);
      }
    }
  }
  
  lastClickTime.current = currentTime;
  lastClickedElement.current = elementId;
};
