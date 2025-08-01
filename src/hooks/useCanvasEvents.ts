import { useCallback } from 'react';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEditorStore } from '../store/editorStore';

export const useCanvasEvents = () => {
  const {
    selectedElements,
    selectElement,
    clearSelection,
    updateElement,
    elements,
    connectionMode,
    startConnection,
    finishConnection,
    cancelConnection,
  } = useEditorStore();

  const handleElementClick = useCallback((e: KonvaEventObject<MouseEvent>, elementId: string) => {
    e.cancelBubble = true;
    
    if (connectionMode.isActive) {
      if (connectionMode.startElementId && connectionMode.startElementId !== elementId) {
        finishConnection(elementId);
      } else {
        cancelConnection();
      }
      return;
    }

    const isMultiSelect = e.evt.ctrlKey || e.evt.metaKey;
    selectElement(elementId, isMultiSelect);
  }, [connectionMode, selectElement, finishConnection, cancelConnection]);

  const handleElementDoubleClick = useCallback((elementId: string) => {
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const newText = prompt('Enter text:', element.properties?.text || '');
      if (newText !== null) {
        updateElement(elementId, {
          properties: { ...element.properties, text: newText }
        });
      }
    }
  }, [elements, updateElement]);

  const handleElementDragEnd = useCallback((e: KonvaEventObject<DragEvent>, elementId: string) => {
    updateElement(elementId, {
      x: e.target.x(),
      y: e.target.y()
    });
  }, [updateElement]);

  const handleStageClick = useCallback((e: KonvaEventObject<MouseEvent>) => {
    if (e.target === e.target.getStage()) {
      clearSelection();
      if (connectionMode.isActive) {
        cancelConnection();
      }
    }
  }, [clearSelection, connectionMode, cancelConnection]);

  const handleConnectionHandleMouseDown = useCallback((elementId: string, x: number, y: number) => {
    startConnection(elementId, x, y);
  }, [startConnection]);

  const handleConnectionHandleMouseUp = useCallback((elementId: string) => {
    if (connectionMode.isActive && connectionMode.startElementId !== elementId) {
      finishConnection(elementId);
    }
  }, [connectionMode, finishConnection]);

  return {
    handleElementClick,
    handleElementDoubleClick,
    handleElementDragEnd,
    handleStageClick,
    handleConnectionHandleMouseDown,
    handleConnectionHandleMouseUp,
  };
};
