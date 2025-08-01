import { useCallback } from 'react';
import Konva from 'konva';
import { snapToGrid } from '../utils/canvasHelpers';

export const useCanvasHandlers = (
  stageRef: React.RefObject<Konva.Stage>,
  snapToGridEnabled: boolean,
  zoom: number,
  panOffset: { x: number; y: number },
  tool: string,
  isDrawing: boolean,
  setIsDrawing: (drawing: boolean) => void,
  setDrawingStart: (pos: { x: number; y: number }) => void,
  setCurrentDrawing: (drawing: any) => void,
  setIsDragOver: (over: boolean) => void,
  setAlignmentGuides: (guides: { x?: number; y?: number }) => void,
  setIsEditing: (editing: boolean) => void,
  setEditingElement: (id: string | null) => void,
  setEditingText: (text: string) => void,
  setTextInputPosition: (pos: { x: number; y: number; width: number; height: number }) => void,
  lastClickTime: React.MutableRefObject<number>,
  lastClickedElement: React.MutableRefObject<string | null>,
  selectElement: (id: string, multi?: boolean) => void,
  clearSelection: () => void,
  updateElement: (id: string, updates: any) => void,
  addElement: (element: any) => void,
  elements: any[]
) => {
  const getPointerPosition = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return { x: 0, y: 0 };
    
    return {
      x: snapToGrid((pointer.x - panOffset.x) / zoom, 20, snapToGridEnabled),
      y: snapToGrid((pointer.y - panOffset.y) / zoom, 20, snapToGridEnabled),
    };
  }, [stageRef, snapToGridEnabled, zoom, panOffset]);

  const handleStageMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;
    clearSelection();
    const pos = getPointerPosition();
    if (['rectangle', 'circle', 'triangle', 'diamond', 'text'].includes(tool)) {
      setIsDrawing(true);
      setDrawingStart(pos);
      setCurrentDrawing(null);
    }
  }, [tool, getPointerPosition, clearSelection, setIsDrawing, setDrawingStart, setCurrentDrawing]);

  const handleStageMouseMove = useCallback(() => {
    if (!isDrawing || !['rectangle', 'circle', 'triangle', 'diamond'].includes(tool)) return;
    // Drawing logic would go here
  }, [tool]);

  const handleStageMouseUp = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    setCurrentDrawing(null);
  }, [setIsDrawing, setCurrentDrawing]);

  const handleElementClick = useCallback((elementId: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    const currentTime = Date.now();
    const doubleClickThreshold = 300;
    
    if (currentTime - lastClickTime.current < doubleClickThreshold && lastClickedElement.current === elementId) {
      const element = elements.find(el => el.id === elementId);
      if (element && (element.type === 'text' || element.properties?.text)) {
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
    } else {
      selectElement(elementId, e.evt.ctrlKey || e.evt.metaKey);
    }
    
    lastClickTime.current = currentTime;
    lastClickedElement.current = elementId;
  }, [elements, stageRef, selectElement, setTextInputPosition, setEditingText, setEditingElement, setIsEditing, lastClickTime, lastClickedElement]);

  const handleElementDragEnd = useCallback((elementId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = snapToGrid(e.target.x(), 20, snapToGridEnabled);
    const newY = snapToGrid(e.target.y(), 20, snapToGridEnabled);
    
    updateElement(elementId, { x: newX, y: newY });
    setAlignmentGuides({});
  }, [updateElement, setAlignmentGuides, snapToGridEnabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const shapeType = e.dataTransfer.getData('application/shape-type');
    if (!shapeType) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement = {
      type: 'shape' as const,
      x: snapToGrid((x - panOffset.x) / zoom, 20, snapToGridEnabled),
      y: snapToGrid((y - panOffset.y) / zoom, 20, snapToGridEnabled),
      width: 120,
      height: 80,
      rotation: 0,
      properties: { shapeType, text: shapeType.charAt(0).toUpperCase() + shapeType.slice(1) },
      style: { fill: '#ffffff', stroke: '#333333', strokeWidth: 2, opacity: 1 },
    };

    addElement(newElement);
  }, [setIsDragOver, addElement, panOffset, zoom, snapToGridEnabled]);

  return {
    getPointerPosition,
    handleStageMouseDown,
    handleStageMouseMove,
    handleStageMouseUp,
    handleElementClick,
    handleElementDragEnd,
    handleDrop,
  };
};
