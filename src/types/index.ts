export interface DiagramElement {
  id: string;
  type: 'shape' | 'connector' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: {
    shapeType?: string;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: 'left' | 'center' | 'right';
    connectorType?: 'straight' | 'orthogonal' | 'curved';
    startElementId?: string;
    endElementId?: string;
    anchorStart?: string;
    anchorEnd?: string;
  };
  style: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
    strokeDashArray?: number[];
  };
}

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DiagramTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  elements: DiagramElement[];
  category: string;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'json';
  quality?: number;
  scale?: number;
  bounds?: Bounds;
}

export interface CollaborationState {
  users: {
    id: string;
    name: string;
    color: string;
    cursor?: Point;
    selection?: string[];
  }[];
  isConnected: boolean;
  roomId?: string;
}

export type Tool = 'select' | 'rectangle' | 'circle' | 'text' | 'connector' | 'hand' | 'triangle' | 'diamond';
