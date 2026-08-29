import React, { useState } from 'react';
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
  Sparkles,
  Database,
  Cloud,
  Layers,
  ChevronUp,
  Magnet,
  RotateCcw,
  RotateCw
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { ToolType } from '../../types/canvas';

export const ToolDock: React.FC = () => {
  const { 
    activeTool, 
    setActiveTool, 
    setAiModalOpen,
    snapToGrid,
    toggleSnapToGrid,
    undo,
    redo,
    historyIndex,
    history
  } = useCanvasStore();

  const [isShapeMenuOpen, setIsShapeMenuOpen] = useState(false);

  const primaryTools: Array<{ id: ToolType; label: string; icon: React.ReactNode; shortcut: string }> = [
    { id: 'select', label: 'Select & Move', icon: <MousePointer className="w-4 h-4" />, shortcut: 'V' },
    { id: 'hand', label: 'Pan Canvas', icon: <Hand className="w-4 h-4" />, shortcut: 'H' },
    { id: 'sticky', label: 'Sticky Card', icon: <StickyNote className="w-4 h-4" />, shortcut: 'S' },
  ];

  const shapes: Array<{ id: ToolType; label: string; icon: React.ReactNode }> = [
    { id: 'rectangle', label: 'Service Box', icon: <Square className="w-4 h-4 text-indigo-400" /> },
    { id: 'cylinder', label: 'Database Storage', icon: <Database className="w-4 h-4 text-cyan-400" /> },
    { id: 'diamond', label: 'Decision Router', icon: <Diamond className="w-4 h-4 text-amber-400" /> },
    { id: 'circle', label: 'Queue / Worker', icon: <Circle className="w-4 h-4 text-rose-400" /> },
    { id: 'cloud', label: 'Cloud VPC', icon: <Cloud className="w-4 h-4 text-sky-400" /> },
    { id: 'frame', label: 'Group Container', icon: <Layers className="w-4 h-4 text-emerald-400" /> },
  ];

  const currentShape = shapes.find(s => s.id === activeTool) || shapes[0];

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex items-center gap-2">
      <div className="glass-bar px-2 py-1.5 rounded-2xl flex items-center gap-1 shadow-2xl border border-slate-800">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      <div className="glass-bar px-3 py-2 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-slate-700/60">
        {primaryTools.map(tool => {
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

        <div className="relative">
          <button
            onClick={() => setIsShapeMenuOpen(!isShapeMenuOpen)}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-1 ${
              ['rectangle', 'cylinder', 'diamond', 'circle', 'cloud', 'frame'].includes(activeTool)
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
            title="Geometric & Architecture Shapes"
          >
            {currentShape.icon}
            <ChevronUp className="w-3 h-3 opacity-60" />
          </button>

          {isShapeMenuOpen && (
            <div className="absolute bottom-12 left-0 glass-dropdown p-2 rounded-2xl shadow-2xl border border-slate-700 w-48 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 font-mono px-2 py-1 block">Architecture Shapes</span>
              {shapes.map(s => (
                <button
                  key={s.id}
                  onClick={() => { setActiveTool(s.id); setIsShapeMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {s.icon}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setActiveTool('connector')}
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'connector'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Smart Connector Arrow (A)"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('freehand')}
          className={`p-2.5 rounded-xl transition-all ${
            activeTool === 'freehand'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
          title="Freehand Pen (P)"
        >
          <PenTool className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-slate-800 mx-1" />

        <button
          onClick={toggleSnapToGrid}
          className={`p-2.5 rounded-xl transition-all ${
            snapToGrid
              ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
          }`}
          title="Snap to Grid (20px)"
        >
          <Magnet className="w-4 h-4" />
        </button>

        <button
          onClick={() => setAiModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white flex items-center gap-2 text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all ml-1"
          title="AI Architecture Synthesizer"
        >
          <Sparkles className="w-4 h-4" />
          <span className="font-mono">AI Architect</span>
        </button>
      </div>
    </div>
  );
};
