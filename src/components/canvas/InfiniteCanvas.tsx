import React, { useRef, useState, useEffect } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { CanvasElementRenderer } from './CanvasElementRenderer';
import { MultiplayerCursors } from '../collab/MultiplayerCursors';
import { Minimap } from './Minimap';
import { CanvasElement, ToolType } from '../../types/canvas';

export const InfiniteCanvas: React.FC = () => {
  const {
    elements,
    selectedIds,
    activeTool,
    setActiveTool,
    viewTransform,
    setViewTransform,
    selectElement,
    selectMultiple,
    clearSelection,
    addElement,
    updateElement,
    updateSelectedElements,
    gridType,
    snapToGrid,
    deleteSelected,
    duplicateSelected,
    undo,
    redo,
    selectAll
  } = useCanvasStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [dragOffsets, setDragOffsets] = useState<Record<string, { x: number; y: number }>>({});
  const [marqueeBox, setMarqueeBox] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.code === 'Space') {
        setIsSpacePressed(true);
      }
      if (e.key === 'v' || e.key === 'V') setActiveTool('select');
      if (e.key === 'h' || e.key === 'H') setActiveTool('hand');
      if (e.key === 's' || e.key === 'S') setActiveTool('sticky');
      if (e.key === 'r' || e.key === 'R') setActiveTool('rectangle');
      if (e.key === 'd' || e.key === 'D') setActiveTool('diamond');
      if (e.key === 'c' || e.key === 'C') setActiveTool('circle');
      if (e.key === 'a' || e.key === 'A') setActiveTool('connector');

      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        redo();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        duplicateSelected();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        selectAll();
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacePressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIds, undo, redo, deleteSelected, duplicateSelected, selectAll, setActiveTool]);

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
    if (e.button === 1 || activeTool === 'hand' || isSpacePressed) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewTransform.x, y: e.clientY - viewTransform.y });
      return;
    }

    const { x, y } = toCanvasCoords(e.clientX, e.clientY);

    const clicked = [...elements].reverse().find(el => (
      x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height
    ));

    if (clicked) {
      const isAlreadySelected = selectedIds.includes(clicked.id);
      if (!isAlreadySelected) {
        selectElement(clicked.id, e.shiftKey);
      }

      setDraggedElementId(clicked.id);
      
      const targetIds = isAlreadySelected ? selectedIds : [clicked.id];
      const offsets: Record<string, { x: number; y: number }> = {};
      elements.filter(el => targetIds.includes(el.id)).forEach(el => {
        offsets[el.id] = { x: x - el.x, y: y - el.y };
      });
      setDragOffsets(offsets);
      return;
    }

    if (['sticky', 'rectangle', 'rounded', 'diamond', 'circle', 'cylinder', 'cloud', 'frame'].includes(activeTool)) {
      const snapX = snapToGrid ? Math.round(x / 20) * 20 : x;
      const snapY = snapToGrid ? Math.round(y / 20) * 20 : y;

      const newElement: CanvasElement = {
        id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: activeTool as any,
        x: Math.round(snapX - 80),
        y: Math.round(snapY - 45),
        width: activeTool === 'frame' ? 400 : activeTool === 'sticky' ? 200 : activeTool === 'circle' ? 100 : 170,
        height: activeTool === 'frame' ? 300 : activeTool === 'sticky' ? 120 : activeTool === 'circle' ? 100 : 85,
        title: activeTool === 'sticky' ? 'Architecture Note' : 'New Service',
        subtitle: activeTool === 'sticky' ? undefined : 'Component Subtitle',
        text: activeTool === 'sticky' ? 'Write design notes or key decisions here...' : undefined,
        iconName: activeTool === 'cylinder' ? 'Database' : activeTool === 'cloud' ? 'Cloud' : 'Server',
        fillColor: activeTool === 'sticky' ? '#854d0e' : '#1e1b4b',
        strokeColor: activeTool === 'sticky' ? '#eab308' : '#818cf8',
        strokeWidth: 2,
        textColor: '#f8fafc',
        fontSize: 12
      };
      addElement(newElement);
      setActiveTool('select');
    } else {
      clearSelection();
      setMarqueeBox({ startX: x, startY: y, currentX: x, currentY: y });
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

    const { x, y } = toCanvasCoords(e.clientX, e.clientY);

    if (draggedElementId) {
      Object.entries(dragOffsets).forEach(([id, offset]) => {
        let newX = x - offset.x;
        let newY = y - offset.y;
        if (snapToGrid) {
          newX = Math.round(newX / 20) * 20;
          newY = Math.round(newY / 20) * 20;
        }
        updateElement(id, { x: newX, y: newY });
      });
      return;
    }

    if (marqueeBox) {
      setMarqueeBox({ ...marqueeBox, currentX: x, currentY: y });
      const minX = Math.min(marqueeBox.startX, x);
      const maxX = Math.max(marqueeBox.startX, x);
      const minY = Math.min(marqueeBox.startY, y);
      const maxY = Math.max(marqueeBox.startY, y);

      const enclosed = elements.filter(el => (
        el.x + el.width >= minX && el.x <= maxX && el.y + el.height >= minY && el.y <= maxY
      )).map(el => el.id);

      selectMultiple(enclosed);
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggedElementId(null);
    setDragOffsets({});
    setMarqueeBox(null);
  };

  const gridClass = 
    gridType === 'dots' ? 'canvas-grid-dots' : 
    gridType === 'grid' ? 'canvas-grid-lines' : 
    gridType === 'blueprint' ? 'bg-[#060a14]' : '';

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`w-full h-full bg-[#070a13] relative overflow-hidden select-none ${gridClass} ${
        activeTool === 'hand' || isPanning || isSpacePressed ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
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

          {marqueeBox && (
            <rect
              x={Math.min(marqueeBox.startX, marqueeBox.currentX)}
              y={Math.min(marqueeBox.startY, marqueeBox.currentY)}
              width={Math.abs(marqueeBox.currentX - marqueeBox.startX)}
              height={Math.abs(marqueeBox.currentY - marqueeBox.startY)}
              fill="rgba(99, 102, 241, 0.12)"
              stroke="#6366f1"
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          )}
        </g>
      </svg>

      <MultiplayerCursors />
      <Minimap />
    </div>
  );
};
