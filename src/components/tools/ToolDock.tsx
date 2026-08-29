import React from 'react';
import { 
  MousePointer, 
  Hand, 
  StickyNote, 
  Square, 
  Diamond, 
  Circle, 
  ArrowUpRight, 
  PenTool, 
  Type, 
  Sparkles
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ToolType } from '../../types/canvas';

export const ToolDock: React.FC = () => {
  const { activeTool, setActiveTool, setAiModalOpen } = useCanvasStore();

  const tools: Array<{ id: ToolType; label: string; icon: React.ReactNode; shortcut: string }> = [
    { id: 'select', label: 'Select Tool', icon: <MousePointer className="w-4 h-4" />, shortcut: 'V' },
    { id: 'hand', label: 'Pan Hand', icon: <Hand className="w-4 h-4" />, shortcut: 'H' },
    { id: 'sticky', label: 'Sticky Note', icon: <StickyNote className="w-4 h-4" />, shortcut: 'S' },
    { id: 'rectangle', label: 'Rectangle Shape', icon: <Square className="w-4 h-4" />, shortcut: 'R' },
    { id: 'diamond', label: 'Decision Diamond', icon: <Diamond className="w-4 h-4" />, shortcut: 'D' },
    { id: 'circle', label: 'Circle Node', icon: <Circle className="w-4 h-4" />, shortcut: 'C' },
    { id: 'connector', label: 'Connector Arrow', icon: <ArrowUpRight className="w-4 h-4" />, shortcut: 'A' },
    { id: 'freehand', label: 'Freehand Draw', icon: <PenTool className="w-4 h-4" />, shortcut: 'P' },
    { id: 'text', label: 'Markdown Text Block', icon: <Type className="w-4 h-4" />, shortcut: 'T' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
      <div className="glass-bar px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-slate-700/60">
        {tools.map(tool => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`p-2.5 rounded-xl transition-all relative group flex items-center justify-center ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
              title={`${tool.label} (${tool.shortcut})`}
            >
              {tool.icon}
            </button>
          );
        })}

        <div className="w-[1px] h-6 bg-slate-800 mx-1.5" />

        <button
          onClick={() => setAiModalOpen(true)}
          className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 text-cyan-300 hover:text-white transition-all shadow-md"
          title="AI Prompt Assistant"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
        </button>
      </div>
    </div>
  );
};
