import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Eye } from 'lucide-react';

export const Minimap: React.FC = () => {
  const { elements, viewTransform, selectedIds } = useCanvasStore();

  if (elements.length === 0) return null;

  const minX = Math.min(...elements.map(e => e.x), 0) - 100;
  const maxX = Math.max(...elements.map(e => e.x + e.width), 1200) + 100;
  const minY = Math.min(...elements.map(e => e.y), 0) - 100;
  const maxY = Math.max(...elements.map(e => e.y + e.height), 700) + 100;

  const totalWidth = maxX - minX;
  const totalHeight = maxY - minY;

  const mapWidth = 160;
  const mapHeight = 100;
  const scale = Math.min(mapWidth / totalWidth, mapHeight / totalHeight);

  return (
    <div className="absolute bottom-6 right-6 z-20 glass-bar p-2 rounded-2xl shadow-2xl border border-slate-800 pointer-events-auto">
      <div className="flex items-center justify-between px-1 mb-1 text-[10px] text-slate-400 font-mono">
        <span className="flex items-center gap-1 font-bold">
          <Eye className="w-3 h-3 text-indigo-400" />
          Minimap Radar
        </span>
        <span>{elements.length} nodes</span>
      </div>

      <svg width={mapWidth} height={mapHeight} className="bg-[#090d18] rounded-xl border border-slate-800/80 overflow-hidden">
        {elements.map(el => {
          if (el.type === 'connector') return null;
          const mx = (el.x - minX) * scale;
          const my = (el.y - minY) * scale;
          const mw = Math.max(4, el.width * scale);
          const mh = Math.max(3, el.height * scale);
          const isSelected = selectedIds.includes(el.id);

          return (
            <rect
              key={el.id}
              x={mx}
              y={my}
              width={mw}
              height={mh}
              rx={1.5}
              fill={isSelected ? '#6366f1' : el.fillColor || '#1e293b'}
              stroke={isSelected ? '#ffffff' : el.strokeColor || '#334155'}
              strokeWidth={0.7}
            />
          );
        })}
      </svg>
    </div>
  );
};
