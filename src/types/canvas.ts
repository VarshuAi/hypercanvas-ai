export type ElementType = 
  | 'sticky'
  | 'rectangle'
  | 'rounded'
  | 'diamond'
  | 'circle'
  | 'cylinder'
  | 'cloud'
  | 'frame'
  | 'connector'
  | 'freehand'
  | 'text'
  | 'document';

export type ToolType = 
  | 'select'
  | 'hand'
  | 'sticky'
  | 'rectangle'
  | 'rounded'
  | 'diamond'
  | 'circle'
  | 'cylinder'
  | 'cloud'
  | 'frame'
  | 'connector'
  | 'freehand'
  | 'text'
  | 'document'
  | 'eraser';

export type AnchorPosition = 'top' | 'right' | 'bottom' | 'left' | 'center';
export type ConnectorRouting = 'orthogonal' | 'bezier' | 'straight';
export type ArrowHeadStyle = 'arrow' | 'triangle' | 'diamond' | 'circle' | 'none';

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
  title?: string;
  text?: string;
  subtitle?: string;
  author?: string;
  iconName?: string;
  
  fillColor?: string;
  fillOpacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeStyle?: 'solid' | 'dashed' | 'dotted';
  textColor?: string;
  fontSize?: number;
  borderRadius?: number;
  zIndex?: number;
  
  fromId?: string;
  toId?: string;
  fromAnchor?: AnchorPosition;
  toAnchor?: AnchorPosition;
  connectorRouting?: ConnectorRouting;
  arrowStart?: ArrowHeadStyle;
  arrowEnd?: ArrowHeadStyle;
  
  points?: FreehandPoint[];
  brushColor?: string;
  brushSize?: number;
  isHighlighter?: boolean;

  childrenIds?: string[];
  isLocked?: boolean;
}

export interface ViewTransform {
  x: number;
  y: number;
  zoom: number;
}

export interface SelectionBox {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
}

export interface ResizeState {
  elementId: string;
  handle: 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';
  startX: number;
  startY: number;
  origX: number;
  origY: number;
  origW: number;
  origH: number;
}
