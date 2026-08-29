import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Trash2, Copy } from 'lucide-react';

const COLORS = [
  '#1e293b', '#1e1b4b', '#064e3b', '#451a03', '#4c0519', '#172554',
  '#0f766e', '#854d0e', '#701a75', '#334155', '#475569'
];

export const PropertyInspector: React.FC = () => {
  const { elements, selectedIds, updateElement, deleteSelected, duplicateSelected } = useCanvasStore();

  const selected = elements.find(el => el.id === selectedIds[0]);

  if (!selected || selectedIds.length === 0) return null;

  return (
    <div className="absolute right-4 top-20 z-20 w-64 glass-bar p-4 rounded-2xl shadow-2xl border border-slate-700/60 pointer-events-auto space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="font-bold text-slate-200 capitalize font-mono text-[11px]">
          {selected.type} Node
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={duplicateSelected}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={deleteSelected}
            className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Content Text</label>
        <textarea
          value={selected.text || ''}
          onChange={(e) => updateElement(selected.id, { text: e.target.value })}
          className="w-full h-16 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs resize-none focus:outline-none focus:border-indigo-500"
          placeholder="Type label or description..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Theme Color</label>
        <div className="grid grid-cols-6 gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => updateElement(selected.id, { fillColor: c })}
              className={`w-6 h-6 rounded-lg transition-transform ${selected.fillColor === c ? 'ring-2 ring-indigo-400 scale-110' : 'hover:scale-105'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
        <div>
          <span>Font Size</span>
          <select
            value={selected.fontSize || 12}
            onChange={(e) => updateElement(selected.id, { fontSize: Number(e.target.value) })}
            className="mt-1 w-full p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono focus:outline-none"
          >
            <option value={10}>10px</option>
            <option value={12}>12px</option>
            <option value={14}>14px</option>
            <option value={16}>16px</option>
          </select>
        </div>

        <div>
          <span>Stroke Width</span>
          <select
            value={selected.strokeWidth || 2}
            onChange={(e) => updateElement(selected.id, { strokeWidth: Number(e.target.value) })}
            className="mt-1 w-full p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 font-mono focus:outline-none"
          >
            <option value={1}>1px</option>
            <option value={2}>2px</option>
            <option value={3}>3px</option>
            <option value={4}>4px</option>
          </select>
        </div>
      </div>
    </div>
  );
};
