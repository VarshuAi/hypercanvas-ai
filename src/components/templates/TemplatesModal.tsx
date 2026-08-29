import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { TEMPLATES } from '../../data/templates';
import { LayoutTemplate, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export const TemplatesModal: React.FC = () => {
  const { isTemplatesModalOpen, setTemplatesModalOpen, loadTemplate } = useCanvasStore();

  if (!isTemplatesModalOpen) return null;

  const handleSelect = (id: string) => {
    loadTemplate(id);
    setTemplatesModalOpen(false);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-2xl glass-dropdown p-6 rounded-3xl shadow-2xl border border-slate-700/60 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600 text-white">
              <LayoutTemplate className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Template Blueprint Library</h3>
              <p className="text-[11px] text-slate-400">Pick from battle-tested architecture and retrospective templates.</p>
            </div>
          </div>
          <button
            onClick={() => setTemplatesModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => handleSelect(t.id)}
              className="p-5 rounded-2xl bg-[#0c101d] border border-slate-800 hover:border-indigo-500/60 cursor-pointer transition-all space-y-3 group"
            >
              <div className={`h-24 rounded-xl bg-gradient-to-tr ${t.thumbnailColor} opacity-70 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white font-bold text-xs`}>
                <span className="bg-slate-950/60 px-2 py-0.5 rounded w-fit text-[10px] font-mono">{t.category}</span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{t.title}</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
