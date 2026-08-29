import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { 
  Trash2, 
  Copy, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignVerticalSpaceAround,
  AlignHorizontalSpaceAround,
  BringToFront, 
  SendToBack,
  Sliders,
  Server,
  Database,
  Shield,
  Key,
  Box,
  Zap,
  Cloud,
  Cpu,
  Globe,
  Terminal
} from 'lucide-react';

const PALETTES = [
  { name: 'Obsidian Slate', fill: '#0f172a', stroke: '#38bdf8', text: '#f8fafc' },
  { name: 'Midnight Indigo', fill: '#1e1b4b', stroke: '#818cf8', text: '#e0e7ff' },
  { name: 'Emerald Vault', fill: '#064e3b', stroke: '#10b981', text: '#d1fae5' },
  { name: 'Amber Amber', fill: '#451a03', stroke: '#f97316', text: '#ffedd5' },
  { name: 'Crimson Rose', fill: '#4c0519', stroke: '#f43f5e', text: '#ffe4e6' },
  { name: 'Cobalt Navy', fill: '#172554', stroke: '#3b82f6', text: '#dbeafe' },
  { name: 'Purple Amethyst', fill: '#3b0764', stroke: '#c084fc', text: '#faf5ff' },
  { name: 'Monochrome Steel', fill: '#1e293b', stroke: '#94a3b8', text: '#f1f5f9' },
];

const ICONS = ['Server', 'Database', 'Shield', 'Key', 'Box', 'Zap', 'Cloud', 'Cpu', 'Globe', 'Terminal'];

export const PropertyInspector: React.FC = () => {
  const { 
    elements, 
    selectedIds, 
    updateElement, 
    deleteSelected, 
    duplicateSelected,
    alignSelected,
    distributeSelected,
    bringToFront,
    sendToBack
  } = useCanvasStore();

  const selected = elements.find(el => el.id === selectedIds[0]);

  if (!selected || selectedIds.length === 0) return null;

  const isMultiple = selectedIds.length > 1;

  return (
    <div className="absolute right-4 top-20 z-20 w-72 glass-bar p-4 rounded-3xl shadow-2xl border border-slate-700/60 pointer-events-auto space-y-4 font-sans text-xs animate-in fade-in slide-in-from-right-4 duration-150">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div>
          <span className="font-bold text-slate-100 font-mono text-[11px] block">
            {isMultiple ? `${selectedIds.length} Nodes Selected` : `${selected.type.toUpperCase()} Node`}
          </span>
          <span className="text-[10px] text-slate-500 font-mono">Properties & Geometry</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={duplicateSelected}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Duplicate (Ctrl+D)"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={deleteSelected}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
            title="Delete (Backspace)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Alignment & Depth</label>
        <div className="flex items-center justify-between p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400">
          <button onClick={() => alignSelected('left')} className="p-1.5 rounded hover:text-white hover:bg-slate-800" title="Align Left">
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => alignSelected('center')} className="p-1.5 rounded hover:text-white hover:bg-slate-800" title="Align Center">
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => alignSelected('right')} className="p-1.5 rounded hover:text-white hover:bg-slate-800" title="Align Right">
            <AlignRight className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-slate-800" />
          <button onClick={() => distributeSelected('horizontal')} className="p-1.5 rounded hover:text-white hover:bg-slate-800" title="Distribute Horizontally">
            <AlignHorizontalSpaceAround className="w-3.5 h-3.5" />
          </button>
          <div className="w-[1px] h-4 bg-slate-800" />
          <button onClick={bringToFront} className="p-1.5 rounded hover:text-white hover:bg-slate-800" title="Bring to Front">
            <BringToFront className="w-3.5 h-3.5" />
          </button>
          <button onClick={sendToBack} className="p-1.5 rounded hover:text-white hover:bg-slate-800" title="Send to Back">
            <SendToBack className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {!isMultiple && (
        <>
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Title / Service Name</label>
              <input
                type="text"
                value={selected.title || selected.text || ''}
                onChange={(e) => updateElement(selected.id, { title: e.target.value, text: e.target.value })}
                className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 font-medium text-xs focus:outline-none focus:border-indigo-500"
                placeholder="e.g. Order Gateway"
              />
            </div>

            {selected.type !== 'sticky' && selected.type !== 'connector' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Subtitle / Protocol</label>
                <input
                  type="text"
                  value={selected.subtitle || ''}
                  onChange={(e) => updateElement(selected.id, { subtitle: e.target.value })}
                  className="w-full p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. gRPC / TLS 1.3"
                />
              </div>
            )}

            {selected.type === 'sticky' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Sticky Content</label>
                <textarea
                  value={selected.text || ''}
                  onChange={(e) => updateElement(selected.id, { text: e.target.value })}
                  className="w-full h-16 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs resize-none focus:outline-none focus:border-indigo-500 font-sans"
                  placeholder="Notes..."
                />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Theme Preset</label>
            <div className="grid grid-cols-4 gap-1.5">
              {PALETTES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => updateElement(selected.id, { 
                    fillColor: p.fill, 
                    strokeColor: p.stroke, 
                    textColor: p.text 
                  })}
                  className="p-1.5 rounded-xl border border-slate-800 hover:border-slate-600 transition-all flex items-center justify-between text-left group"
                  style={{ backgroundColor: p.fill }}
                  title={p.name}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.stroke }} />
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.text }} />
                </button>
              ))}
            </div>
          </div>

          {selected.type === 'connector' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Routing Style</label>
              <div className="grid grid-cols-3 gap-1 text-[11px] font-mono">
                {(['bezier', 'orthogonal', 'straight'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => updateElement(selected.id, { connectorRouting: r })}
                    className={`py-1.5 px-2 rounded-lg capitalize border ${
                      selected.connectorRouting === r
                        ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
