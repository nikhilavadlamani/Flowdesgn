import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import { useEditorStore } from '../store/editorStore';
import { Grid } from './Grid';
import { ShapeFactory } from './ShapeFactory';
import { ConnectorRenderer } from './ConnectorRenderer';
import { useCanvasEvents } from '../hooks/useCanvasEvents';

export const Canvas: React.FC = () => {
  const stageRef = useRef<any>(null);
  const [stageSize, setStageSize] = useState({ 
    width: window.innerWidth, 
    height: window.innerHeight 
  });

  const {
    elements,
    selectedElements,
    zoom,
    panOffset,
    tool,
    gridVisible,
    connectionMode,
    updateTempConnection,
    setZoom,
    setPanOffset,
    deleteElement,
    clearSelection,
    cancelConnection,
  } = useEditorStore();

  const {
    handleElementClick,
    handleElementDoubleClick,
    handleElementDragEnd,
    handleStageClick,
    handleConnectionHandleMouseDown,
    handleConnectionHandleMouseUp,
  } = useCanvasEvents();

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      setStageSize({ 
        width: window.innerWidth, 
        height: window.innerHeight 
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElements.length > 0) {
        selectedElements.forEach(id => deleteElement(id));
      }
      if (e.key === 'Escape') {
        clearSelection();
        if (connectionMode.isActive) cancelConnection();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, deleteElement, clearSelection, connectionMode, cancelConnection]);

  // Mouse move handler for connection mode
  const handleMouseMove = useCallback((e: any) => {
    if (connectionMode.isActive && connectionMode.tempLine) {
      const stage = e.target.getStage();
      const point = stage.getPointerPosition();
      updateTempConnection(point.x, point.y);
    }
  }, [connectionMode, updateTempConnection]);

  // Zoom and pan handlers
  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? 1 : -1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    setZoom(newScale);
    setPanOffset({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
  }, [setZoom, setPanOffset]);

  // Drop handler for shape library
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const stageBox = stage.container().getBoundingClientRect();
    const scale = stage.scaleX();
    const x = (e.clientX - stageBox.left - panOffset.x) / scale;
    const y = (e.clientY - stageBox.top - panOffset.y) / scale;

    const shapeData = e.dataTransfer.getData('text/plain');
    try {
      const shape = JSON.parse(shapeData);
      const newElement = {
        type: 'shape' as const,
        x, y,
        width: shape.width || 120,
        height: shape.height || 80,
        rotation: 0,
        properties: {
          shapeType: shape.name,
          text: shape.label || shape.name
        },
        style: {
          fill: '#ffffff',
          stroke: '#333333',
          strokeWidth: 2,
          opacity: 1,
        },
      };
      useEditorStore.getState().addElement(newElement);
    } catch (error) {
      console.error('Error parsing dropped shape data:', error);
    }
  }, [panOffset]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div 
      className="canvas-container w-full h-full relative overflow-hidden bg-gray-100"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onContextMenu={(e) => e.preventDefault()}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={panOffset.x}
        y={panOffset.y}
        onWheel={handleWheel}
        onMouseMove={handleMouseMove}
        onClick={handleStageClick}
        draggable={tool === 'hand'}
      >
        <Layer>
          {gridVisible && (
            <Grid 
              width={stageSize.width} 
              height={stageSize.height} 
              visible={gridVisible} 
            />
          )}
          
          {/* Render shapes with connection handles */}
          {elements
            .filter(element => element.type === 'shape')
            .map(element => (
              <ShapeFactory
                key={element.id}
                element={element}
                isSelected={selectedElements.includes(element.id)}
                onDragEnd={(e) => handleElementDragEnd(e, element.id)}
                onClick={(e) => handleElementClick(e, element.id)}
                onDoubleClick={() => handleElementDoubleClick(element.id)}
                connectionHandles={{
                  onMouseDown: handleConnectionHandleMouseDown,
                  onMouseUp: handleConnectionHandleMouseUp,
                }}
              />
            ))}
          
          {/* Render connectors */}
          {elements
            .filter(element => element.type === 'connector')
            .map(connector => {
              const startElement = elements.find(el => el.id === connector.properties?.startElementId);
              const endElement = elements.find(el => el.id === connector.properties?.endElementId);
              return (
                <ConnectorRenderer
                  key={connector.id}
                  connector={connector}
                  startElement={startElement}
                  endElement={endElement}
                />
              );
            })}
          
          {/* Temporary connection line */}
          {connectionMode.isActive && connectionMode.tempLine && (
            <Line
              points={[
                connectionMode.tempLine.x1, connectionMode.tempLine.y1,
                connectionMode.tempLine.x2, connectionMode.tempLine.y2
              ]}
              stroke="#2196f3"
              strokeWidth={2}
              dash={[5, 5]}
              opacity={0.7}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
