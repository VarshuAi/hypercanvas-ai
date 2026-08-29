import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Sparkles, X, Wand2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_PROMPTS = [
  '⚡ High-Scale E-Commerce Microservices with Kafka, Redis & Postgres',
  '🔐 OAuth2 PKCE Authentication & Identity Provider Flow',
  '🤖 Autonomous Multi-Agent RAG Pipeline with Vector Database'
];

export const AiPromptModal: React.FC = () => {
  const { isAiModalOpen, setAiModalOpen, generateAiDiagram } = useCanvasStore();
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isAiModalOpen) return null;

  const handleGenerate = (p: string) => {
    const targetPrompt = p || prompt;
    if (!targetPrompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      generateAiDiagram(targetPrompt);
      setIsGenerating(false);
      setAiModalOpen(false);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="w-full max-w-xl glass-dropdown p-6 rounded-3xl shadow-2xl border border-indigo-500/30 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Diagram Synthesizer</h3>
              <p className="text-[11px] text-slate-400">Describe any system or workflow to auto-generate canvas nodes.</p>
            </div>
          </div>
          <button
            onClick={() => setAiModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Generate a cloud microservice architecture with Kafka event bus and Postgres sharding..."
            className="w-full h-28 p-4 rounded-2xl bg-slate-900/90 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-sans resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Sample Blueprints</span>
          <div className="space-y-1.5">
            {SAMPLE_PROMPTS.map((sp, i) => (
              <button
                key={i}
                onClick={() => { setPrompt(sp); handleGenerate(sp); }}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
              >
                <span>{sp}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setAiModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={() => handleGenerate(prompt)}
            disabled={!prompt.trim() || isGenerating}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 flex items-center gap-2"
          >
            {isGenerating ? 'Synthesizing...' : <><Wand2 className="w-3.5 h-3.5" /> Generate Canvas Nodes</>}
          </button>
        </div>
      </div>
    </div>
  );
};
