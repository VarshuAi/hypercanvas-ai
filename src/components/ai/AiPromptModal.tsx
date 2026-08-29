import React, { useState } from 'react';
import { useCanvasStore } from '../../store/useCanvasStore';
import { Sparkles, X, Wand2, ArrowRight, Layers, ShieldCheck, Database, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';

const SAMPLE_PROMPTS = [
  {
    title: 'Cloud Microservices with Kafka Event Bus & PostgreSQL Sharding',
    domain: 'Distributed Systems',
    icon: <Layers className="w-3.5 h-3.5 text-indigo-400" />
  },
  {
    title: 'Zero-Trust Identity Federation & OAuth 2.1 PKCE Flow',
    domain: 'Security & Auth',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
  },
  {
    title: 'Autonomous Multi-Agent RAG Pipeline with Qdrant Vector Cluster',
    domain: 'AI & Inference',
    icon: <Cpu className="w-3.5 h-3.5 text-cyan-400" />
  },
  {
    title: 'Change Data Capture (CDC) Pipeline with Debezium & ClickHouse OLAP',
    domain: 'Data Engineering',
    icon: <Database className="w-3.5 h-3.5 text-emerald-400" />
  }
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
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="w-full max-w-xl glass-dropdown p-6 rounded-3xl shadow-2xl border border-indigo-500/30 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Architecture Synthesizer</h3>
              <p className="text-[11px] text-slate-400">Describe any system topology to auto-generate structured vector nodes and connectors.</p>
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
            placeholder="Describe your system architecture (e.g. Generate high-throughput payment pipeline with Kafka event stream and Aurora PostgreSQL database)..."
            className="w-full h-28 p-4 rounded-2xl bg-slate-900 border border-slate-700/80 text-slate-100 text-xs focus:outline-none focus:border-indigo-500 font-sans resize-none leading-relaxed"
          />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Architecture Blueprints</span>
          <div className="grid grid-cols-1 gap-2">
            {SAMPLE_PROMPTS.map((sp, i) => (
              <button
                key={i}
                onClick={() => { setPrompt(sp.title); handleGenerate(sp.title); }}
                className="w-full text-left p-3 rounded-xl bg-slate-900/70 hover:bg-slate-800 border border-slate-800/80 text-xs text-slate-200 hover:text-white transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  {sp.icon}
                  <span className="truncate">{sp.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                    {sp.domain}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </div>
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
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-40 flex items-center gap-2"
          >
            {isGenerating ? 'Synthesizing Architecture...' : <><Wand2 className="w-3.5 h-3.5" /> Synthesize Architecture Graph</>}
          </button>
        </div>
      </div>
    </div>
  );
};
