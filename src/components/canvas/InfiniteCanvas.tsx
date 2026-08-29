import React, { useRef, useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { MultiplayerCursors } from '../collab/MultiplayerCursors';
import { CanvasElement } from '../../types/canvas';

export const InfiniteCanvas: React.FC = () => {
  const {
    elements,
    selectedIds,
    activeTool,
    viewTransform,
    setViewTransform,
    selectElement,
    clearSelection,
    addElement,
    updateElement,
    gridType
  } = useCanvasStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey) {
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const newZoom = Math.max(0.2, Math.min(3.0, Number((viewTransform.zoom * zoomFactor).toFixed(2))));
      setViewTransform({ zoom: newZoom });
    } else {
      setViewTransform({
        x: viewTransform.x - e.deltaX,
        y: viewTransform.y - e.deltaY,
      });
    }
  };

  const toCanvasCoords = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (clientX - rect.left - viewTransform.x) / viewTransform.zoom,
      y: (clientY - rect.top - viewTransform.y) / viewTransform.zoom,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || activeTool === 'hand') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewTransform.x, y: e.clientY - viewTransform.y });
      return;
    }

    const { x, y } = toCanvasCoords(e.clientX, e.clientY);

    const clicked = [...elements].reverse().find(el => (
      x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
    ));

    if (clicked) {
      selectElement(clicked.id, e.shiftKey);
      setDraggedElementId(clicked.id);
      setDragOffset({ x: x - clicked.x, y: y - clicked.y });
      return;
    }

    if (['sticky', 'rectangle', 'diamond', 'circle', 'text'].includes(activeTool)) {
      const newElement: CanvasElement = {
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: activeTool as any,
        x: Math.round(x - 60),
        y: Math.round(y - 40),
        width: activeTool === 'sticky' ? 170 : activeTool === 'circle' ? 100 : 160,
        height: activeTool === 'sticky' ? 110 : activeTool === 'circle' ? 100 : 80,
        text: activeTool === 'sticky' ? '💡 Idea / Note' : 'New Node',
        fillColor: activeTool === 'sticky' ? '#854d0e' : '#1e1b4b',
        strokeColor: activeTool === 'sticky' ? '#eab308' : '#818cf8',
        strokeWidth: 2,
        textColor: '#f8fafc',
        fontSize: 12
      };
      addElement(newElement);
    } else {
      clearSelection();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setViewTransform({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (draggedElementId) {
      const { x, y } = toCanvasCoords(e.clientX, e.clientY);
      updateElement(draggedElementId, {
        x: Math.round(x - dragOffset.x),
        y: Math.round(y - dragOffset.y),
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedElementId(null);
  };

  const gridClass = gridType === 'dots' ? 'canvas-grid-dots' : gridType === 'lines' ? 'canvas-grid-lines' : '';

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`w-full h-full bg-[#070a13] relative overflow-hidden select-none ${gridClass} ${activeTool === 'hand' || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
    >
      <svg className="w-full h-full absolute inset-0 pointer-events-none">
        <g transform={`translate(${viewTransform.x}, ${viewTransform.y}) scale(${viewTransform.zoom})`}>
          {elements.map(el => (
            <CanvasElementRenderer
              key={el.id}
              element={el}
              isSelected={selectedIds.includes(el.id)}
              elements={elements}
            />
          ))}
        </g>
      </svg>

      <MultiplayerCursors />
    </div>
  );
};
