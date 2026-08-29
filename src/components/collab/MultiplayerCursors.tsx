import React, { useEffect } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const MultiplayerCursors: React.FC = () => {
  const { multiplayer, updatePeerCursor, viewTransform } = useCanvasStore();

  useEffect(() => {
    if (!multiplayer.isConnected) return;

    const interval = setInterval(() => {
      multiplayer.peers.forEach(p => {
        const dx = (Math.random() - 0.5) * 50;
        const dy = (Math.random() - 0.5) * 50;
        updatePeerCursor(
          p.id,
          Math.max(120, Math.min(1150, p.x + dx)),
          Math.max(120, Math.min(600, p.y + dy))
        );
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [multiplayer.isConnected]);

  if (!multiplayer.isConnected) return null;

  return (
    <>
      {multiplayer.peers.map(p => {
        const screenX = p.x * viewTransform.zoom + viewTransform.x;
        const screenY = p.y * viewTransform.zoom + viewTransform.y;

        return (
          <div
            key={p.id}
            className="absolute pointer-events-none z-30 transition-all duration-700 ease-out"
            style={{ transform: `translate(${screenX}px, ${screenY}px)` }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={p.color} className="drop-shadow-lg">
              <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.85a.5.5 0 0 0-.85.36z" />
            </svg>
            
            <div
              className="ml-4 -mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white font-mono shadow-lg flex items-center gap-1.5 whitespace-nowrap"
              style={{ backgroundColor: p.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>{p.name}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};
