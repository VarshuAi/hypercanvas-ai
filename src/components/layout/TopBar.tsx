import React from 'react';
import { 
  Sparkles, 
  Download, 
  LayoutTemplate, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  RotateCw, 
  Trash2,
  Grid
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const TopBar: React.FC = () => {
  const {
    viewTransform,
    zoomIn,
    zoomOut,
    resetZoom,
    undo,
    redo,
    historyIndex,
    history,
    collaborators,
    isMultiplayerActive,
    toggleMultiplayer,
    setAiModalOpen,
    setTemplatesModalOpen,
    setExportModalOpen,
    clearCanvas,
    gridType,
    setGridType
  } = useCanvasStore();

  const zoomPercent = Math.round(viewTransform.zoom * 100);

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-bar px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] flex items-center justify-center">
            <div className="w-full h-full bg-[#090d18] rounded-[11px] flex items-center justify-center text-xs font-bold text-indigo-400">
              HC
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-xs font-bold text-slate-100 tracking-tight">HyperCanvas <span className="text-indigo-400 font-mono">AI</span></h1>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/40 font-mono">v2.0</span>
            </div>
            <p className="text-[10px] text-slate-400">Infinite Collaborative Engine</p>
          </div>
        </div>

        <button
          onClick={() => setTemplatesModalOpen(true)}
          className="glass-bar px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all shadow-lg pointer-events-auto"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
          <span>Templates</span>
        </button>

        <button
          onClick={() => setAiModalOpen(true)}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white flex items-center gap-2 text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all pointer-events-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Synthesizer</span>
        </button>
      </div>

      <div className="glass-bar px-2 py-1.5 rounded-xl flex items-center gap-1 shadow-xl pointer-events-auto">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 disabled:opacity-30 transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          onClick={zoomOut}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        
        <button
          onClick={resetZoom}
          className="px-2 py-0.5 rounded text-[11px] font-mono font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          title="Reset Zoom to 100%"
        >
          {zoomPercent}%
        </button>

        <button
          onClick={zoomIn}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          onClick={() => setGridType(gridType === 'dots' ? 'lines' : gridType === 'lines' ? 'none' : 'dots')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Toggle Grid Style"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-bar px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-xl">
          <button
            onClick={toggleMultiplayer}
            className="flex items-center gap-1.5 text-xs text-slate-300"
            title="Toggle Multiplayer Simulator"
          >
            <span className={`w-2 h-2 rounded-full ${isMultiplayerActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
            <span className="text-[11px] font-mono font-medium">
              {isMultiplayerActive ? 'Multiplayer (3)' : 'Offline'}
            </span>
          </button>

          {isMultiplayerActive && (
            <div className="flex -space-x-1.5 pl-2 border-l border-slate-800">
              {collaborators.map(c => (
                <div
                  key={c.id}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs border border-[#0e1424] shadow"
                  style={{ backgroundColor: c.color }}
                  title={c.name}
                >
                  {c.avatar}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setExportModalOpen(true)}
          className="glass-bar px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-600 transition-all shadow-lg pointer-events-auto"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export</span>
        </button>

        <button
          onClick={clearCanvas}
          className="glass-bar p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors shadow-lg pointer-events-auto"
          title="Clear Canvas"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
