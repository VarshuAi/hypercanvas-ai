export type ElementType = 
  | 'sticky'
  | 'rectangle'
  | 'diamond'
  | 'circle'
  | 'connector'
  | 'freehand'
  | 'text'
  | 'document'
  | 'frame';

export type ToolType = 
  | 'select'
  | 'hand'
  | 'sticky'
  | 'rectangle'
  | 'diamond'
  | 'circle'
  | 'connector'
  | 'freehand'
  | 'text'
  | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface FreehandPoint extends Point {
  pressure?: number;
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  text?: string;
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  textColor?: string;
  fontSize?: number;
  opacity?: number;
  zIndex?: number;
  
  fromId?: string;
  toId?: string;
  connectorStyle?: 'bezier' | 'orthogonal' | 'straight';
  arrowStart?: boolean;
  arrowEnd?: boolean;

  points?: FreehandPoint[];
  markdownContent?: string;
  tags?: string[];
}

export interface ViewTransform {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasHistoryState {
  elements: CanvasElement[];
}
