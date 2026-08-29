import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  LayoutTemplate, 
  ZoomIn, 
  ZoomOut, 
  Radio, 
  Trash2,
  Grid,
  HelpCircle,
  Edit2,
  Check,
  Share2
} from 'lucide-react';
import { useCanvasStore } from '../../store/useCanvasStore';

export const TopBar: React.FC = () => {
  const {
    boardTitle,
    setBoardTitle,
    viewTransform,
    zoomIn,
    zoomOut,
    resetZoom,
    setZoomPercent,
    multiplayer,
    setAiModalOpen,
    setTemplatesModalOpen,
    setExportModalOpen,
    setMultiplayerModalOpen,
    setKeyboardShortcutsOpen,
    clearCanvas,
    gridType,
    setGridType
  } = useCanvasStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(boardTitle);

  const zoomPercent = Math.round(viewTransform.zoom * 100);

  const handleSaveTitle = () => {
    if (titleInput.trim()) setBoardTitle(titleInput);
    setIsEditingTitle(false);
  };

  return (
    <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
      <div className="flex items-center gap-2 pointer-events-auto">
        <div className="glass-bar px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px] flex items-center justify-center shadow-md shadow-indigo-500/20">
            <div className="w-full h-full bg-[#090d18] rounded-[11px] flex items-center justify-center text-xs font-extrabold text-indigo-400 font-mono">
              HC
            </div>
          </div>
          
          <div className="max-w-xs">
            {isEditingTitle ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
                  autoFocus
                  className="bg-slate-900 border border-indigo-500 text-xs px-2 py-0.5 rounded text-white font-medium focus:outline-none"
                />
                <button onClick={handleSaveTitle} className="text-emerald-400 p-0.5">
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => { setTitleInput(boardTitle); setIsEditingTitle(true); }}
                className="flex items-center gap-1.5 cursor-pointer group"
              >
                <h1 className="text-xs font-bold text-slate-100 tracking-tight truncate group-hover:text-indigo-300 transition-colors">
                  {boardTitle}
                </h1>
                <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )}
            <p className="text-[10px] text-slate-400 font-mono">HyperCanvas Studio v2.0</p>
          </div>
        </div>

        <button
          onClick={() => setTemplatesModalOpen(true)}
          className="glass-bar px-3 py-2 rounded-xl flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all shadow-lg pointer-events-auto"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-indigo-400" />
          <span>Templates</span>
        </button>
      </div>

      <div className="glass-bar px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xl pointer-events-auto font-mono text-xs">
        <button
          onClick={zoomOut}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <select
          value={zoomPercent}
          onChange={(e) => setZoomPercent(Number(e.target.value))}
          className="bg-transparent text-slate-300 text-[11px] font-mono px-1 py-0.5 focus:outline-none cursor-pointer"
        >
          <option value={50} className="bg-slate-900">50%</option>
          <option value={75} className="bg-slate-900">75%</option>
          <option value={90} className="bg-slate-900">90%</option>
          <option value={100} className="bg-slate-900">100%</option>
          <option value={125} className="bg-slate-900">125%</option>
          <option value={150} className="bg-slate-900">150%</option>
          <option value={200} className="bg-slate-900">200%</option>
        </select>

        <button
          onClick={zoomIn}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-slate-800 mx-1" />

        <button
          onClick={() => setGridType(gridType === 'dots' ? 'grid' : gridType === 'grid' ? 'none' : 'dots')}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title="Grid Pattern (Dots / Grid / None)"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onClick={() => setMultiplayerModalOpen(true)}
          className="glass-bar px-3 py-1.5 rounded-xl flex items-center gap-2.5 shadow-xl hover:border-indigo-500/50 transition-all"
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-slate-300">
              {multiplayer.peers.length + 1} Peers ({multiplayer.latencyMs}ms)
            </span>
          </div>

          <div className="flex -space-x-1.5 pl-2 border-l border-slate-800">
            {multiplayer.peers.map(p => (
              <div
                key={p.id}
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white font-mono border border-[#0e1424]"
                style={{ backgroundColor: p.color }}
                title={p.name}
              >
                {p.initials}
              </div>
            ))}
          </div>
        </button>

        <button
          onClick={() => setExportModalOpen(true)}
          className="glass-bar px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-600 transition-all shadow-lg"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Export</span>
        </button>

        <button
          onClick={() => setKeyboardShortcutsOpen(true)}
          className="glass-bar p-2 rounded-xl text-slate-400 hover:text-slate-200 transition-colors shadow-lg"
          title="Keyboard Shortcuts Guide (?)"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <button
          onClick={clearCanvas}
          className="glass-bar p-2 rounded-xl text-slate-400 hover:text-rose-400 transition-colors shadow-lg"
          title="Clear Board"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
