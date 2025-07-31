import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line, Ellipse, Path } from 'react-konva';
import { useEditorStore } from '../store/editorStore';
import { SelectionHandles } from './SelectionHandles';
import { Connector } from './Connector';
import Konva from 'konva';

export const Canvas: React.FC = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingStart, setDrawingStart] = useState({ x: 0, y: 0 });
  const [currentDrawing, setCurrentDrawing] = useState<any>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingElement, setEditingElement] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [alignmentGuides, setAlignmentGuides] = useState<{ x?: number, y?: number }>({});
  
  // Double-click detection
  const lastClickTime = useRef(0);
  const lastClickedElement = useRef<string | null>(null);
  
  const {
    elements,
    selectedElements,
    canvasSize,
    zoom,
    panOffset,
    gridVisible,
    snapToGrid,
    tool,
    selectElement,
    clearSelection,
    updateElement,
    addElement,
    deleteElement,
    setPanOffset,
  } = useEditorStore();

  useEffect(() => {
    setStageSize(canvasSize);
  }, [canvasSize]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedElements.length > 0) {
        selectedElements.forEach(id => {
          deleteElement(id);
        });
      }
      
      if (e.key === 'Escape') {
        clearSelection();
        setIsDrawing(false);
        setCurrentDrawing(null);
        // Also exit text editing mode
        if (isEditing) {
          setIsEditing(false);
          setEditingElement(null);
          setEditingText('');
        }
      }

      // F2 or Enter to start text editing on selected element
      if ((e.key === 'F2' || e.key === 'Enter') && selectedElements.length === 1 && !isEditing) {
        startTextEditing(selectedElements[0]);
      }
      
      // Tool shortcuts
      if (e.key === 'v' || e.key === 'V') {
        useEditorStore.getState().setTool('select');
      }
      if (e.key === 'h' || e.key === 'H') {
        useEditorStore.getState().setTool('hand');
      }
      if (e.key === 'r' || e.key === 'R') {
        useEditorStore.getState().setTool('rectangle');
      }
      if (e.key === 'c' || e.key === 'C') {
        useEditorStore.getState().setTool('circle');
      }
      if (e.key === 't' || e.key === 'T') {
        useEditorStore.getState().setTool('text');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElements, elements, clearSelection, isEditing, deleteElement]);

  // Text editing functions
  const startTextEditing = (elementId: string) => {
    console.log('🚀 Starting text editing for element:', elementId);
    const element = elements.find(el => el.id === elementId);
    if (!element) {
      console.log('❌ Element not found:', elementId);
      return;
    }

    const stage = stageRef.current;
    if (!stage) {
      console.log('❌ Stage not found');
      return;
    }

    // Simple positioning - center of screen for testing
    const testPosition = {
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2 - 20,
      width: 200,
      height: 40,
    };

    console.log('📍 Using test position:', testPosition);
    console.log('📝 Current text:', element.properties.text);
    console.log('🔄 Setting editing state...');

    setEditingElement(elementId);
    setEditingText(element.properties.text || '');
    setTextInputPosition(testPosition);
    setIsEditing(true);
    
    console.log('✅ Text editing state set!');
  };

  const finishTextEditing = () => {
    if (editingElement) {
      const currentElement = elements.find(el => el.id === editingElement);
      if (currentElement) {
        updateElement(editingElement, {
          properties: {
            ...currentElement.properties,
            text: editingText,
          },
        });
      }
    }
    setIsEditing(false);
    setEditingElement(null);
    setEditingText('');
  };

  const handleTextInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishTextEditing();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditingElement(null);
      setEditingText('');
    }
  };

  const snapToGridCoord = (value: number) => {
    if (snapToGrid) {
      const gridSize = 20;
      return Math.round(value / gridSize) * gridSize;
    }
    return value;
  };

  const getPointerPosition = () => {
    const stage = stageRef.current;
    if (!stage) return { x: 0, y: 0 };
    
    const pointer = stage.getPointerPosition();
    if (!pointer) return { x: 0, y: 0 };
    
    return {
      x: snapToGridCoord((pointer.x - panOffset.x) / zoom),
      y: snapToGridCoord((pointer.y - panOffset.y) / zoom),
    };
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (e.target !== e.target.getStage()) return;
    
    const pos = getPointerPosition();
    
    if (tool === 'select') {
      clearSelection();
    } else if (tool === 'rectangle' || tool === 'circle' || tool === 'triangle' || tool === 'diamond' || tool === 'text') {
      setIsDrawing(true);
      setDrawingStart(pos);
      
      const newElement = {
        type: 'shape' as const,
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        rotation: 0,
        properties: {
          shapeType: tool,
          text: tool === 'text' ? 'Text' : '',
        },
        style: {
          fill: tool === 'text' ? 'transparent' : '#e3f2fd',
          stroke: '#1976d2',
          strokeWidth: 2,
          opacity: 1,
        },
      };
      
      setCurrentDrawing(newElement);
    }
  };

  const handleStageMouseMove = () => {
    if (!isDrawing || !currentDrawing) return;
    
    const pos = getPointerPosition();
    const width = Math.abs(pos.x - drawingStart.x);
    const height = Math.abs(pos.y - drawingStart.y);
    const x = Math.min(pos.x, drawingStart.x);
    const y = Math.min(pos.y, drawingStart.y);
    
    setCurrentDrawing({
      ...currentDrawing,
      x,
      y,
      width: Math.max(width, 10),
      height: Math.max(height, 10),
    });
  };

  const handleStageMouseUp = () => {
    if (isDrawing && currentDrawing && currentDrawing.width > 10 && currentDrawing.height > 10) {
      addElement(currentDrawing);
    }
    
    setIsDrawing(false);
    setCurrentDrawing(null);
    setDrawingStart({ x: 0, y: 0 });
  };

  const handleStageDragStart = () => {
    if (tool === 'hand') {
      stageRef.current?.container().style.setProperty('cursor', 'grabbing');
    }
  };

  const handleStageDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (tool === 'hand') {
      setPanOffset({ x: e.target.x(), y: e.target.y() });
      stageRef.current?.container().style.setProperty('cursor', 'grab');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      if (data.type === 'shape') {
        const stage = stageRef.current;
        if (!stage) return;
        
        const rect = stage.container().getBoundingClientRect();
        const x = (e.clientX - rect.left - panOffset.x) / zoom;
        const y = (e.clientY - rect.top - panOffset.y) / zoom;
        
        const newElement = {
          type: 'shape' as const,
          x: snapToGridCoord(x - 50), // Center the shape on drop
          y: snapToGridCoord(y - 30),
          width: 100,
          height: 60,
          rotation: 0,
          properties: {
            shapeType: data.shapeType,
            text: '',
          },
          style: {
            fill: '#e3f2fd',
            stroke: '#1976d2',
            strokeWidth: 2,
            opacity: 1,
          },
        };
        
        addElement(newElement);
        setIsDragOver(false);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleElementClick = (elementId: string, e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    
    const currentTime = Date.now();
    const timeDiff = currentTime - lastClickTime.current;
    
    console.log('=== CLICK EVENT ===');
    console.log('Element ID:', elementId);
    console.log('Time diff:', timeDiff);
    console.log('Last clicked element:', lastClickedElement.current);
    console.log('Click detail:', e.evt.detail);
    console.log('Ctrl key:', e.evt.ctrlKey);
    console.log('===================');
    
    // Double-click detection: same element clicked within 300ms
    if (timeDiff < 300 && lastClickedElement.current === elementId) {
      console.log('🎯 DOUBLE-CLICK DETECTED (timer)! Starting text editing...');
      startTextEditing(elementId);
      lastClickTime.current = 0; // Reset to prevent triple-click issues
      lastClickedElement.current = null;
      return;
    }
    
    // Fallback methods
    if (e.evt.detail === 2) {
      console.log('🎯 DOUBLE-CLICK DETECTED (detail)! Starting text editing...');
      startTextEditing(elementId);
    } else if (e.evt.ctrlKey) {
      console.log('🎯 CTRL+CLICK DETECTED! Starting text editing...');
      startTextEditing(elementId);
    } else {
      console.log('Single click - selecting element');
      selectElement(elementId, e.evt.ctrlKey || e.evt.metaKey);
      
      // Update click tracking
      lastClickTime.current = currentTime;
      lastClickedElement.current = elementId;
    }
  };

  const handleElementDrag = (elementId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const newX = e.target.x();
    const newY = e.target.y();
    const currentElement = elements.find(el => el.id === elementId);
    
    if (!currentElement) return;
    
    // Show alignment guides during drag
    const snapDistance = 10;
    const otherElements = elements.filter(el => el.id !== elementId);
    const guides: { x?: number, y?: number } = {};
    
    for (const other of otherElements) {
      // Check for horizontal alignment
      if (Math.abs(newY - other.y) < snapDistance) {
        guides.y = other.y;
      }
      if (Math.abs(newY + currentElement.height / 2 - (other.y + other.height / 2)) < snapDistance) {
        guides.y = other.y + other.height / 2;
      }
      
      // Check for vertical alignment
      if (Math.abs(newX - other.x) < snapDistance) {
        guides.x = other.x;
      }
      if (Math.abs(newX + currentElement.width / 2 - (other.x + other.width / 2)) < snapDistance) {
        guides.x = other.x + other.width / 2;
      }
    }
    
    setAlignmentGuides(guides);
  };

  const handleElementDragEnd = (elementId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    let newX = e.target.x();
    let newY = e.target.y();
    
    // Smart snapping functionality
    if (snapToGrid) {
      const gridSize = 20;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    } else {
      // Smart alignment with other elements
      const snapDistance = 10;
      const currentElement = elements.find(el => el.id === elementId);
      if (currentElement) {
        const otherElements = elements.filter(el => el.id !== elementId);
        
        // Check for alignment with other elements
        for (const other of otherElements) {
          // Horizontal alignment
          if (Math.abs(newY - other.y) < snapDistance) {
            newY = other.y;
          }
          if (Math.abs(newY + currentElement.height - (other.y + other.height)) < snapDistance) {
            newY = other.y + other.height - currentElement.height;
          }
          if (Math.abs(newY + currentElement.height / 2 - (other.y + other.height / 2)) < snapDistance) {
            newY = other.y + other.height / 2 - currentElement.height / 2;
          }
          
          // Vertical alignment
          if (Math.abs(newX - other.x) < snapDistance) {
            newX = other.x;
          }
          if (Math.abs(newX + currentElement.width - (other.x + other.width)) < snapDistance) {
            newX = other.x + other.width - currentElement.width;
          }
          if (Math.abs(newX + currentElement.width / 2 - (other.x + other.width / 2)) < snapDistance) {
            newX = other.x + other.width / 2 - currentElement.width / 2;
          }
        }
      }
    }
    
    updateElement(elementId, {
      x: newX,
      y: newY,
    });
    
    // Clear alignment guides
    setAlignmentGuides({});
  };

  const drawGrid = () => {
    if (!gridVisible) return null;
    
    const gridSize = 20;
    const lines = [];
    
    // Vertical lines
    for (let i = 0; i < stageSize.width; i += gridSize) {
      lines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, stageSize.height]}
          stroke="#e0e0e0"
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }
    
    // Horizontal lines
    for (let i = 0; i < stageSize.height; i += gridSize) {
      lines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, stageSize.width, i]}
          stroke="#e0e0e0"
          strokeWidth={1}
          opacity={0.5}
        />
      );
    }
    
    return lines;
  };

  const renderElement = (element: any) => {
    const isSelected = selectedElements.includes(element.id);
    const commonProps = {
      x: element.x,
      y: element.y,
      rotation: element.rotation,
      draggable: tool === 'select',
      onClick: (e: any) => handleElementClick(element.id, e),
      onDragEnd: (e: any) => handleElementDragEnd(element.id, e),
    };

    // Render connectors separately
    if (element.type === 'connector') {
      const startElement = element.properties.startElementId 
        ? elements.find(el => el.id === element.properties.startElementId)
        : undefined;
      const endElement = element.properties.endElementId
        ? elements.find(el => el.id === element.properties.endElementId)
        : undefined;

      return (
        <Connector
          key={element.id}
          connector={element}
          startElement={startElement}
          endElement={endElement}
          isSelected={isSelected}
          onClick={() => selectElement(element.id)}
        />
      );
    }

    switch (element.properties.shapeType) {
      case 'rectangle':
      case 'process':
      case 'class':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Text
              text={element.properties.text || 'Double-click to edit'}
              width={element.width}
              height={element.height}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill={element.properties.text ? "#333" : "#999"}
            />
          </Group>
        );

      case 'terminator':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
              cornerRadius={element.height / 2}
            />
            <Text
              text={element.properties.text || 'Double-click to edit'}
              width={element.width}
              height={element.height}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill={element.properties.text ? "#333" : "#999"}
            />
          </Group>
        );

      case 'circle':
      case 'usecase':
        return (
          <Group key={element.id} {...commonProps}>
            <Circle
              x={element.width / 2}
              y={element.height / 2}
              radius={Math.min(element.width, element.height) / 2}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Text
              text={element.properties.text || 'Double-click to edit'}
              width={element.width}
              height={element.height}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill={element.properties.text ? "#333" : "#999"}
            />
          </Group>
        );

      case 'diamond':
      case 'decision':
        const centerX = element.width / 2;
        const centerY = element.height / 2;
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                centerX, 0,
                element.width, centerY,
                centerX, element.height,
                0, centerY,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Text
              text={element.properties.text || 'Double-click to edit'}
              width={element.width}
              height={element.height}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill={element.properties.text ? "#333" : "#999"}
            />
          </Group>
        );

      case 'triangle':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width / 2, 0,
                element.width, element.height,
                0, element.height,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Text
              text={element.properties.text || 'Double-click to edit'}
              width={element.width}
              height={element.height}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill={element.properties.text ? "#333" : "#999"}
            />
          </Group>
        );

      case 'data':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                0, element.height * 0.3,
                element.width * 0.2, 0,
                element.width, 0,
                element.width * 0.8, element.height,
                0, element.height,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Text
              text={element.properties.text || 'Double-click to edit'}
              width={element.width}
              height={element.height}
              align="center"
              verticalAlign="middle"
              fontSize={14}
              fill={element.properties.text ? "#333" : "#999"}
            />
          </Group>
        );

      case 'actor':
        return (
          <Group key={element.id} {...commonProps}>
            {/* Head */}
            <Circle
              x={element.width / 2}
              y={element.height * 0.2}
              radius={element.width * 0.15}
              fill="none"
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {/* Body */}
            <Line
              points={[
                element.width / 2, element.height * 0.35,
                element.width / 2, element.height * 0.8,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {/* Arms */}
            <Line
              points={[
                element.width * 0.2, element.height * 0.5,
                element.width * 0.8, element.height * 0.5,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {/* Legs */}
            <Line
              points={[
                element.width / 2, element.height * 0.8,
                element.width * 0.3, element.height,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Line
              points={[
                element.width / 2, element.height * 0.8,
                element.width * 0.7, element.height,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
          </Group>
        );

      case 'component':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Rect
              x={-element.width * 0.1}
              y={element.height * 0.2}
              width={element.width * 0.15}
              height={element.height * 0.15}
              fill="none"
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            <Rect
              x={-element.width * 0.1}
              y={element.height * 0.65}
              width={element.width * 0.15}
              height={element.height * 0.15}
              fill="none"
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={14}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'cloud':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width * 0.2, element.height * 0.7,
                element.width * 0.1, element.height * 0.5,
                element.width * 0.15, element.height * 0.3,
                element.width * 0.3, element.height * 0.2,
                element.width * 0.5, element.height * 0.15,
                element.width * 0.7, element.height * 0.2,
                element.width * 0.85, element.height * 0.3,
                element.width * 0.9, element.height * 0.5,
                element.width * 0.8, element.height * 0.7,
                element.width * 0.2, element.height * 0.7,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={14}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'server':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {/* Server indicators */}
            <Circle
              x={element.width * 0.15}
              y={element.height * 0.25}
              radius={element.width * 0.03}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Circle
              x={element.width * 0.25}
              y={element.height * 0.25}
              radius={element.width * 0.03}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Line
              points={[
                element.width * 0.4, element.height * 0.25,
                element.width * 0.8, element.height * 0.25,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={2}
            />
            <Line
              points={[
                element.width * 0.1, element.height * 0.5,
                element.width * 0.9, element.height * 0.5,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={1}
            />
            <Line
              points={[
                element.width * 0.1, element.height * 0.75,
                element.width * 0.9, element.height * 0.75,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={1}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={12}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'router':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              x={element.width * 0.1}
              y={element.height * 0.4}
              width={element.width * 0.8}
              height={element.height * 0.3}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {/* Antennas */}
            <Line
              points={[
                element.width * 0.25, element.height * 0.4,
                element.width * 0.25, element.height * 0.1,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={2}
            />
            <Line
              points={[
                element.width * 0.5, element.height * 0.4,
                element.width * 0.5, element.height * 0.1,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={2}
            />
            <Line
              points={[
                element.width * 0.75, element.height * 0.4,
                element.width * 0.75, element.height * 0.1,
              ]}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={2}
            />
            {/* Ports */}
            <Circle
              x={element.width * 0.25}
              y={element.height * 0.55}
              radius={element.width * 0.02}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Circle
              x={element.width * 0.4}
              y={element.height * 0.55}
              radius={element.width * 0.02}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Circle
              x={element.width * 0.6}
              y={element.height * 0.55}
              radius={element.width * 0.02}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Circle
              x={element.width * 0.75}
              y={element.height * 0.55}
              radius={element.width * 0.02}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
          </Group>
        );

      case 'switch':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height * 0.4}
              y={element.height * 0.3}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {/* Ports */}
            <Circle
              x={element.width * 0.2}
              y={element.height * 0.5}
              radius={element.width * 0.03}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Circle
              x={element.width * 0.4}
              y={element.height * 0.5}
              radius={element.width * 0.03}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Circle
              x={element.width * 0.6}
              y={element.height * 0.5}
              radius={element.width * 0.03}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
            <Circle
              x={element.width * 0.8}
              y={element.height * 0.5}
              radius={element.width * 0.03}
              fill={isSelected ? '#2196f3' : element.style.stroke}
            />
          </Group>
        );

      // New Basic Shapes
      case 'ellipse':
        return (
          <Group key={element.id} {...commonProps}>
            <Ellipse
              x={element.width / 2}
              y={element.height / 2}
              radiusX={element.width / 2}
              radiusY={element.height / 2}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={14}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'pentagon':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width / 2, 0,
                element.width * 0.95, element.height * 0.38,
                element.width * 0.8, element.height,
                element.width * 0.2, element.height,
                element.width * 0.05, element.height * 0.38,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={14}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'hexagon':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width * 0.25, 0,
                element.width * 0.75, 0,
                element.width, element.height / 2,
                element.width * 0.75, element.height,
                element.width * 0.25, element.height,
                0, element.height / 2,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={14}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'octagon':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width * 0.3, 0,
                element.width * 0.7, 0,
                element.width, element.height * 0.3,
                element.width, element.height * 0.7,
                element.width * 0.7, element.height,
                element.width * 0.3, element.height,
                0, element.height * 0.7,
                0, element.height * 0.3,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={14}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'star':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width / 2, 0,
                element.width * 0.6, element.height * 0.35,
                element.width, element.height * 0.35,
                element.width * 0.75, element.height * 0.6,
                element.width * 0.9, element.height,
                element.width / 2, element.height * 0.8,
                element.width * 0.1, element.height,
                element.width * 0.25, element.height * 0.6,
                0, element.height * 0.35,
                element.width * 0.4, element.height * 0.35,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={12}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'heart':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width / 2, element.height * 0.3,
                element.width * 0.1, element.height * 0.1,
                0, element.height * 0.25,
                0, element.height * 0.4,
                element.width / 2, element.height,
                element.width, element.height * 0.4,
                element.width, element.height * 0.25,
                element.width * 0.9, element.height * 0.1,
                element.width / 2, element.height * 0.3,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={12}
                fill="#333"
              />
            )}
          </Group>
        );

      case 'arrow-right':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                0, element.height * 0.3,
                0, element.height * 0.7,
                element.width * 0.7, element.height * 0.7,
                element.width * 0.7, element.height,
                element.width, element.height / 2,
                element.width * 0.7, 0,
                element.width * 0.7, element.height * 0.3,
              ]}
              closed
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
            {element.properties.text && (
              <Text
                text={element.properties.text}
                width={element.width}
                height={element.height}
                align="center"
                verticalAlign="middle"
                fontSize={12}
                fill="#333"
              />
            )}
          </Group>
        );

      // AWS Icons - Render as vector graphics in Konva
      case 'aws-ec2':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill="linear-gradient(45deg, #F58536 0%, #FF9900 100%)"
              stroke={isSelected ? '#2196f3' : '#FF9900'}
              strokeWidth={isSelected ? 3 : 2}
              opacity={element.style.opacity}
              cornerRadius={4}
            />
            <Rect
              x={element.width * 0.1}
              y={element.height * 0.1}
              width={element.width * 0.8}
              height={element.height * 0.8}
              fill="#232F3E"
              cornerRadius={2}
            />
            <Rect
              x={element.width * 0.2}
              y={element.height * 0.2}
              width={element.width * 0.6}
              height={element.height * 0.6}
              fill="#FF9900"
              cornerRadius={1}
            />
            <Rect
              x={element.width * 0.25}
              y={element.height * 0.25}
              width={element.width * 0.5}
              height={element.height * 0.5}
              fill="#232F3E"
              cornerRadius={1}
            />
            {/* Server lines */}
            <Rect x={element.width * 0.3} y={element.height * 0.35} width={element.width * 0.4} height={element.height * 0.08} fill="#FF9900"/>
            <Rect x={element.width * 0.3} y={element.height * 0.45} width={element.width * 0.4} height={element.height * 0.08} fill="#FF9900"/>
            <Rect x={element.width * 0.3} y={element.height * 0.55} width={element.width * 0.4} height={element.height * 0.08} fill="#FF9900"/>
          </Group>
        );

      case 'aws-s3':
        return (
          <Group key={element.id} {...commonProps}>
            <Line
              points={[
                element.width * 0.5, element.height * 0.1,
                element.width * 0.9, element.height * 0.3,
                element.width * 0.9, element.height * 0.9,
                element.width * 0.5, element.height * 1.1,
                element.width * 0.1, element.height * 0.9,
                element.width * 0.1, element.height * 0.3
              ]}
              closed
              fill="#569A31"
              stroke={isSelected ? '#2196f3' : '#569A31'}
              strokeWidth={isSelected ? 3 : 1}
              opacity={element.style.opacity}
            />
            <Line
              points={[
                element.width * 0.5, element.height * 0.1,
                element.width * 0.9, element.height * 0.3,
                element.width * 0.5, element.height * 0.5,
                element.width * 0.1, element.height * 0.3
              ]}
              closed
              fill="#7AA116"
            />
            <Circle x={element.width * 0.35} y={element.height * 0.4} radius={element.width * 0.04} fill="white" opacity={0.9}/>
            <Circle x={element.width * 0.65} y={element.height * 0.4} radius={element.width * 0.04} fill="white" opacity={0.9}/>
          </Group>
        );

      case 'aws-lambda':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill="#FF9900"
              stroke={isSelected ? '#2196f3' : '#FF9900'}
              strokeWidth={isSelected ? 3 : 2}
              opacity={element.style.opacity}
              cornerRadius={4}
            />
            <Line
              points={[
                element.width * 0.2, element.height * 0.9,
                element.width * 0.35, element.height * 0.2,
                element.width * 0.5, element.height * 0.2,
                element.width * 0.35, element.height * 0.9
              ]}
              closed
              fill="#232F3E"
            />
            <Line
              points={[
                element.width * 0.55, element.height * 0.2,
                element.width * 0.7, element.height * 0.2,
                element.width * 0.8, element.height * 0.9,
                element.width * 0.65, element.height * 0.9,
                element.width * 0.7, element.height * 0.7,
                element.width * 0.6, element.height * 0.7
              ]}
              closed
              fill="#232F3E"
            />
          </Group>
        );

      case 'aws-rds':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill="#527FFF"
              stroke={isSelected ? '#2196f3' : '#527FFF'}
              strokeWidth={isSelected ? 3 : 2}
              opacity={element.style.opacity}
              cornerRadius={4}
            />
            <Ellipse
              x={element.width * 0.5}
              y={element.height * 0.25}
              radiusX={element.width * 0.35}
              radiusY={element.height * 0.12}
              fill="#7BB3F0"
            />
            <Rect
              x={element.width * 0.15}
              y={element.height * 0.25}
              width={element.width * 0.7}
              height={element.height * 0.5}
              fill="#3C5998"
            />
            <Ellipse
              x={element.width * 0.5}
              y={element.height * 0.75}
              radiusX={element.width * 0.35}
              radiusY={element.height * 0.12}
              fill="#527FFF"
            />
            <Ellipse
              x={element.width * 0.5}
              y={element.width * 0.45}
              radiusX={element.width * 0.35}
              radiusY={element.height * 0.08}
              fill="#7BB3F0"
            />
            <Ellipse
              x={element.width * 0.5}
              y={element.height * 0.6}
              radiusX={element.width * 0.35}
              radiusY={element.height * 0.08}
              fill="#7BB3F0"
            />
          </Group>
        );

      case 'aws-cloudfront':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill="#FF9900"
              stroke={isSelected ? '#2196f3' : '#FF9900'}
              strokeWidth={isSelected ? 3 : 2}
              opacity={element.style.opacity}
              cornerRadius={4}
            />
            <Circle
              x={element.width * 0.5}
              y={element.height * 0.5}
              radius={element.width * 0.35}
              fill="none"
              stroke="#232F3E"
              strokeWidth={2}
            />
            <Circle
              x={element.width * 0.5}
              y={element.height * 0.5}
              radius={element.width * 0.25}
              fill="none"
              stroke="#232F3E"
              strokeWidth={1.5}
            />
            <Circle
              x={element.width * 0.5}
              y={element.height * 0.5}
              radius={element.width * 0.15}
              fill="none"
              stroke="#232F3E"
              strokeWidth={1}
            />
            <Circle x={element.width * 0.5} y={element.height * 0.5} radius={element.width * 0.04} fill="#232F3E"/>
            {/* Global nodes */}
            <Circle x={element.width * 0.25} y={element.height * 0.25} radius={element.width * 0.04} fill="#232F3E"/>
            <Circle x={element.width * 0.75} y={element.height * 0.25} radius={element.width * 0.04} fill="#232F3E"/>
            <Circle x={element.width * 0.25} y={element.height * 0.75} radius={element.width * 0.04} fill="#232F3E"/>
            <Circle x={element.width * 0.75} y={element.height * 0.75} radius={element.width * 0.04} fill="#232F3E"/>
          </Group>
        );

      case 'aws-vpc':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill="#FF9900"
              stroke={isSelected ? '#2196f3' : '#FF9900'}
              strokeWidth={isSelected ? 3 : 2}
              opacity={element.style.opacity}
              cornerRadius={4}
            />
            <Rect
              x={element.width * 0.08}
              y={element.height * 0.18}
              width={element.width * 0.84}
              height={element.height * 0.64}
              fill="none"
              stroke="#232F3E"
              strokeWidth={2}
              cornerRadius={2}
            />
            <Rect
              x={element.width * 0.15}
              y={element.height * 0.25}
              width={element.width * 0.3}
              height={element.height * 0.25}
              fill="none"
              stroke="#232F3E"
              strokeWidth={1.5}
              cornerRadius={1}
            />
            <Rect
              x={element.width * 0.55}
              y={element.height * 0.25}
              width={element.width * 0.3}
              height={element.height * 0.25}
              fill="none"
              stroke="#232F3E"
              strokeWidth={1.5}
              cornerRadius={1}
            />
            <Rect
              x={element.width * 0.15}
              y={element.height * 0.57}
              width={element.width * 0.7}
              height={element.height * 0.18}
              fill="none"
              stroke="#232F3E"
              strokeWidth={1.5}
              cornerRadius={1}
            />
            <Text
              text="VPC"
              x={element.width * 0.42}
              y={element.height * 0.87}
              fontSize={element.width * 0.1}
              fill="#232F3E"
              align="center"
            />
          </Group>
        );

      case 'aws-apigateway':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill="#FF4B4B"
              stroke={isSelected ? '#2196f3' : '#FF4B4B'}
              strokeWidth={isSelected ? 3 : 2}
              opacity={element.style.opacity}
              cornerRadius={4}
            />
            <Line
              points={[
                element.width * 0.15, element.height * 0.5,
                element.width * 0.5, element.width * 0.15,
                element.width * 0.85, element.height * 0.5,
                element.width * 0.5, element.height * 0.85
              ]}
              closed
              fill="#232F3E"
            />
            <Line
              points={[
                element.width * 0.25, element.height * 0.5,
                element.width * 0.5, element.height * 0.25,
                element.width * 0.75, element.height * 0.5,
                element.width * 0.5, element.height * 0.75
              ]}
              closed
              fill="#FF4B4B"
            />
            <Rect
              x={element.width * 0.35}
              y={element.height * 0.35}
              width={element.width * 0.3}
              height={element.height * 0.3}
              fill="#232F3E"
              cornerRadius={2}
            />
            <Line
              points={[
                element.width * 0.42, element.height * 0.42,
                element.width * 0.58, element.height * 0.5,
                element.width * 0.42, element.height * 0.58
              ]}
              closed
              fill="#FF4B4B"
            />
            <Circle x={element.width * 0.25} y={element.height * 0.5} radius={element.width * 0.04} fill="white"/>
            <Circle x={element.width * 0.75} y={element.height * 0.5} radius={element.width * 0.04} fill="white"/>
          </Group>
        );

      case 'aws-dynamodb':
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill="#527FFF"
              stroke={isSelected ? '#2196f3' : '#527FFF'}
              strokeWidth={isSelected ? 3 : 2}
              opacity={element.style.opacity}
              cornerRadius={4}
            />
            <Rect
              x={element.width * 0.12}
              y={element.height * 0.25}
              width={element.width * 0.76}
              height={element.height * 0.5}
              fill="#232F3E"
              cornerRadius={2}
            />
            <Rect x={element.width * 0.15} y={element.height * 0.29} width={element.width * 0.7} height={element.height * 0.08} fill="#527FFF"/>
            <Rect x={element.width * 0.15} y={element.height * 0.41} width={element.width * 0.7} height={element.height * 0.08} fill="#7BB3F0"/>
            <Rect x={element.width * 0.15} y={element.height * 0.53} width={element.width * 0.7} height={element.height * 0.08} fill="#527FFF"/>
            <Rect x={element.width * 0.15} y={element.height * 0.65} width={element.width * 0.7} height={element.height * 0.08} fill="#7BB3F0"/>
            <Circle x={element.width * 0.25} y={element.height * 0.33} radius={element.width * 0.03} fill="#FFD700"/>
            <Circle x={element.width * 0.25} y={element.height * 0.45} radius={element.width * 0.03} fill="#FFD700"/>
            <Circle x={element.width * 0.25} y={element.height * 0.57} radius={element.width * 0.03} fill="#FFD700"/>
            <Circle x={element.width * 0.25} y={element.height * 0.69} radius={element.width * 0.03} fill="#FFD700"/>
          </Group>
        );

      default:
        return (
          <Group key={element.id} {...commonProps}>
            <Rect
              width={element.width}
              height={element.height}
              fill={element.style.fill}
              stroke={isSelected ? '#2196f3' : element.style.stroke}
              strokeWidth={isSelected ? 3 : element.style.strokeWidth}
              opacity={element.style.opacity}
            />
          </Group>
        );
    }
  };

  return (
    <div 
      className={`canvas-container ${isDragOver ? 'bg-blue-50 border-2 border-dashed border-blue-300' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        scaleX={zoom}
        scaleY={zoom}
        x={panOffset.x}
        y={panOffset.y}
        onMouseDown={handleStageMouseDown}
        onMouseMove={handleStageMouseMove}
        onMouseUp={handleStageMouseUp}
        draggable={tool === 'hand'}
        onDragStart={handleStageDragStart}
        onDragEnd={handleStageDragEnd}
      >
        <Layer>
          {drawGrid()}
          {elements.map(renderElement)}
          {currentDrawing && renderElement({ ...currentDrawing, id: 'preview' })}
          
          {/* Alignment guides */}
          {alignmentGuides.x !== undefined && (
            <Line
              points={[alignmentGuides.x, 0, alignmentGuides.x, stageSize.height]}
              stroke="#ff0000"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.8}
            />
          )}
          {alignmentGuides.y !== undefined && (
            <Line
              points={[0, alignmentGuides.y, stageSize.width, alignmentGuides.y]}
              stroke="#ff0000"
              strokeWidth={1}
              dash={[5, 5]}
              opacity={0.8}
            />
          )}
          
          {/* Selection handles for selected elements */}
          {selectedElements.map(elementId => {
            const element = elements.find(el => el.id === elementId);
            if (!element) return null;
            
            return (
              <SelectionHandles
                key={`handles-${elementId}`}
                element={element}
                onResize={(id, newBounds) => {
                  updateElement(id, newBounds);
                }}
              />
            );
          })}
        </Layer>
      </Stage>
      
      {/* Text editing overlay */}
      {isEditing && editingElement && (
        <>
          {/* Debug indicator */}
          <div
            style={{
              position: 'fixed',
              top: '10px',
              left: '10px',
              background: 'red',
              color: 'white',
              padding: '5px',
              zIndex: 10000,
              fontSize: '12px',
            }}
          >
            Editing: {editingElement}
          </div>
          
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
            onKeyDown={handleTextInputKeyDown}
            onBlur={finishTextEditing}
            autoFocus
            style={{
              position: 'fixed', // Changed from absolute to fixed
              left: textInputPosition.x + 'px',
              top: textInputPosition.y + 'px',
              width: textInputPosition.width + 'px',
              height: '32px', // Fixed height instead of dynamic
              border: '2px solid #2196f3',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '14px',
              textAlign: 'center',
              zIndex: 9999, // Higher z-index
              background: 'white',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'Inter, sans-serif',
            }}
          />
        </>
      )}
    </div>
  );
};
