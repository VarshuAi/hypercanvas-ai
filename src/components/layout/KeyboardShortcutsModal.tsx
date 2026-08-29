import React from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { HelpCircle, X } from 'lucide-react';

const SHORTCUTS = [
  { key: 'V', desc: 'Select & Move Tool' },
  { key: 'H / Space+Drag', desc: 'Pan Canvas' },
  { key: 'S', desc: 'Add Sticky Note' },
  { key: 'R', desc: 'Add Service Rectangle' },
  { key: 'D', desc: 'Add Decision Diamond' },
  { key: 'C', desc: 'Add Queue / Circle' },
  { key: 'A', desc: 'Connector Arrow' },
  { key: 'P', desc: 'Freehand Pen' },
  { key: 'Ctrl + Z', desc: 'Undo Action' },
  { key: 'Ctrl + Y / Ctrl+Shift+Z', desc: 'Redo Action' },
  { key: 'Ctrl + D', desc: 'Duplicate Selection' },
  { key: 'Ctrl + A', desc: 'Select All Nodes' },
  { key: 'Delete / Backspace', desc: 'Delete Selected Nodes' },
  { key: 'Scroll Wheel', desc: 'Pan Up/Down' },
  { key: 'Ctrl + Scroll Wheel', desc: 'Smooth Zoom In / Out' },
];

export const KeyboardShortcutsModal: React.FC = () => {
  const { isKeyboardShortcutsOpen, setKeyboardShortcutsOpen } = useCanvasStore();

  if (!isKeyboardShortcutsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-lg glass-dropdown p-6 rounded-3xl shadow-2xl border border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-100">Keyboard Shortcuts & Navigation</h3>
          </div>
          <button
            onClick={() => setKeyboardShortcutsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-bold text-[11px]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
