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
}));
