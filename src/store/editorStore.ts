import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface DiagramElement {
  id: string;
  type: 'shape' | 'connector' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: Record<string, any>;
  style: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
  };
}

export interface DiagramState {
  elements: DiagramElement[];
  selectedElements: string[];
  canvasSize: { width: number; height: number };
  zoom: number;
  panOffset: { x: number; y: number };
  tool: 'select' | 'rectangle' | 'circle' | 'triangle' | 'diamond' | 'text' | 'connector' | 'hand';
  isLoading: boolean;
  gridVisible: boolean;
  snapToGrid: boolean;
  connectionMode: {
    isActive: boolean;
    startElementId?: string;
    tempLine?: { x1: number; y1: number; x2: number; y2: number };
  };
}

export interface DiagramActions {
  addElement: (element: Omit<DiagramElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<DiagramElement>) => void;
  deleteElement: (id: string) => void;
  clearAllElements: () => void;
  selectElement: (id: string, multiSelect?: boolean) => void;
  clearSelection: () => void;
  setTool: (tool: DiagramState['tool']) => void;
  setZoom: (zoom: number) => void;
  setPanOffset: (offset: { x: number; y: number }) => void;
  setCanvasSize: (size: { width: number; height: number }) => void;
  toggleGrid: () => void;
  toggleSnapToGrid: () => void;
  setLoading: (loading: boolean) => void;
  startConnection: (elementId: string, x: number, y: number) => void;
  updateTempConnection: (x: number, y: number) => void;
  finishConnection: (endElementId?: string) => void;
  cancelConnection: () => void;
}

export type EditorStore = DiagramState & DiagramActions;

export const useEditorStore = create<EditorStore>((set) => ({
  // Initial state
  elements: [],
  selectedElements: [],
  canvasSize: { width: 1920, height: 1080 },
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  tool: 'select',
  isLoading: false,
  gridVisible: true,
  snapToGrid: true,
  connectionMode: {
    isActive: false,
  },

  // Actions
  addElement: (element) => {
    const newElement: DiagramElement = {
      ...element,
      id: uuidv4(),
    };
    set((state) => ({
      elements: [...state.elements, newElement],
    }));
  },

  updateElement: (id, updates) => {
    set((state) => ({
      elements: state.elements.map((el) =>
        el.id === id ? { ...el, ...updates } : el
      ),
    }));
  },

  deleteElement: (id) => {
    set((state) => ({
      elements: state.elements.filter((el) => el.id !== id),
      selectedElements: state.selectedElements.filter((selId) => selId !== id),
    }));
  },

  clearAllElements: () => {
    set({
      elements: [],
      selectedElements: [],
    });
  },

  selectElement: (id, multiSelect = false) => {
    set((state) => ({
      selectedElements: multiSelect
        ? state.selectedElements.includes(id)
          ? state.selectedElements.filter((selId) => selId !== id)
          : [...state.selectedElements, id]
        : [id],
    }));
  },

  clearSelection: () => {
    set({ selectedElements: [] });
  },

  setTool: (tool) => {
    set({ tool });
  },

  setZoom: (zoom) => {
    set({ zoom: Math.max(0.1, Math.min(5, zoom)) });
  },

  setPanOffset: (panOffset) => {
    set({ panOffset });
  },

  setCanvasSize: (canvasSize) => {
    set({ canvasSize });
  },

  toggleGrid: () => {
    set((state) => ({ gridVisible: !state.gridVisible }));
  },

  toggleSnapToGrid: () => {
    set((state) => ({ snapToGrid: !state.snapToGrid }));
  },

  setLoading: (isLoading) => {
    set({ isLoading });
  },

  startConnection: (elementId, x, y) => {
    set({
      connectionMode: {
        isActive: true,
        startElementId: elementId,
        tempLine: { x1: x, y1: y, x2: x, y2: y },
      },
      tool: 'connector',
    });
  },

  updateTempConnection: (x, y) => {
    set((state) => ({
      connectionMode: {
        ...state.connectionMode,
        tempLine: state.connectionMode.tempLine
          ? { ...state.connectionMode.tempLine, x2: x, y2: y }
          : undefined,
      },
    }));
  },

  finishConnection: (endElementId) => {
    set((state) => {
      if (!state.connectionMode.isActive || !state.connectionMode.startElementId) {
        return {
          connectionMode: { isActive: false },
        };
      }

      if (endElementId && endElementId !== state.connectionMode.startElementId) {
        const startElement = state.elements.find(el => el.id === state.connectionMode.startElementId);
        const endElement = state.elements.find(el => el.id === endElementId);
        
        if (startElement && endElement) {
          // Calculate best anchor points based on element positions
          const startCenterX = startElement.x + startElement.width / 2;
          const startCenterY = startElement.y + startElement.height / 2;
          const endCenterX = endElement.x + endElement.width / 2;
          const endCenterY = endElement.y + endElement.height / 2;
          
          // Determine best anchor points based on relative positions
          let startAnchor = 'right';
          let endAnchor = 'left';
          
          const deltaX = endCenterX - startCenterX;
          const deltaY = endCenterY - startCenterY;
          
          if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal connection
            if (deltaX > 0) {
              startAnchor = 'right';
              endAnchor = 'left';
            } else {
              startAnchor = 'left';
              endAnchor = 'right';
            }
          } else {
            // Vertical connection
            if (deltaY > 0) {
              startAnchor = 'bottom';
              endAnchor = 'top';
            } else {
              startAnchor = 'top';
              endAnchor = 'bottom';
            }
          }

          const newConnector: DiagramElement = {
            id: uuidv4(),
            type: 'connector',
            x: startCenterX,
            y: startCenterY,
            width: Math.abs(endCenterX - startCenterX),
            height: Math.abs(endCenterY - startCenterY),
            rotation: 0,
            properties: {
              connectorType: 'straight',
              startElementId: state.connectionMode.startElementId,
              endElementId: endElementId,
              anchorStart: startAnchor,
              anchorEnd: endAnchor,
            },
            style: {
              stroke: '#333333',
              strokeWidth: 2,
              opacity: 1,
            },
          };

          return {
            elements: [...state.elements, newConnector],
            connectionMode: { isActive: false },
            tool: 'select',
          };
        }
      }

      return {
        connectionMode: { isActive: false },
        tool: 'select',
      };
    });
  },

  cancelConnection: () => {
    set({
      connectionMode: { isActive: false },
      tool: 'select',
    });
  },
}));
