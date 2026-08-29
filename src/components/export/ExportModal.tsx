import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Download, X, FileCode, Check, Copy } from 'lucide-react';

export const ExportModal: React.FC = () => {
  const { isExportModalOpen, setExportModalOpen, elements } = useCanvasStore();
  const [copied, setCopied] = useState(false);

  if (!isExportModalOpen) return null;

  const handleExportJson = () => {
    const data = JSON.stringify(elements, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hypercanvas-board-${Date.now()}.json`;
    a.click();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(elements, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-md glass-dropdown p-6 rounded-3xl shadow-2xl border border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Export Canvas Workspace</h3>
          </div>
          <button
            onClick={() => setExportModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">Export your visual diagram and whiteboard elements into standard open formats.</p>

        <div className="space-y-2 pt-2">
          <button
            onClick={handleExportJson}
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              Download Canvas JSON Dataset
            </span>
            <span className="text-[10px] text-slate-500 font-mono">{elements.length} elements</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              {copied ? 'Copied to Clipboard!' : 'Copy Raw Elements JSON'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
