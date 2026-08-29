import React, { useEffect } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const MultiplayerCursors: React.FC = () => {
  const { collaborators, isMultiplayerActive, updateCollaboratorPosition, viewTransform } = useCanvasStore();

  useEffect(() => {
    if (!isMultiplayerActive) return;

    const interval = setInterval(() => {
      collaborators.forEach(c => {
        const dx = (Math.random() - 0.5) * 40;
        const dy = (Math.random() - 0.5) * 40;
        updateCollaboratorPosition(c.id, Math.max(100, Math.min(1100, c.x + dx)), Math.max(100, Math.min(600, c.y + dy)));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isMultiplayerActive]);

  if (!isMultiplayerActive) return null;

  return (
    <>
      {collaborators.map(c => {
        const screenX = c.x * viewTransform.zoom + viewTransform.x;
        const screenY = c.y * viewTransform.zoom + viewTransform.y;

        return (
          <div
            key={c.id}
            className="absolute pointer-events-none z-30 transition-all duration-700 ease-out"
            style={{ transform: `translate(${screenX}px, ${screenY}px)` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={c.color} className="drop-shadow-lg">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
            </svg>
            
            <div
              className="ml-4 -mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white font-mono shadow-md flex items-center gap-1 whitespace-nowrap"
              style={{ backgroundColor: c.color }}
            >
              <span>{c.avatar}</span>
              <span>{c.name}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};
