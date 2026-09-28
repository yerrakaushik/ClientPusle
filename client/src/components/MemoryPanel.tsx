import React, { useState } from 'react';
import { 
  Brain, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  History, 
  Sparkles, 
  RefreshCw,
  Database,
  Search,
  Zap,
  ShieldCheck
} from 'lucide-react';
import type { MemoryPanelData } from '../types/index.js';

interface MemoryPanelProps {
  clientId: string;
  clientName: string;
  memoryData: MemoryPanelData | null;
  onRefresh: () => void;
  isLoading: boolean;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({
  clientId,
  clientName,
  memoryData,
  onRefresh,
  isLoading,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const bankId = `hok-${clientId}`;

  const filterList = (items?: string[]) => {
    if (!items) return [];
    if (!filterQuery.trim()) return items;
    return items.filter(i => i.toLowerCase().includes(filterQuery.toLowerCase()));
  };

  const likes = filterList(memoryData?.likesPriorities);
  const concerns = filterList(memoryData?.concerns);
  const dislikes = filterList(memoryData?.dislikes);
  const history = filterList(memoryData?.importantHistory);
  const recent = filterList(memoryData?.recentLearning);

  return (
    <div className="space-y-6">
      {/* Executive Hindsight Telemetry Banner */}
      <div className="p-6 rounded-3xl glass-panel border border-aurora/30 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-aurora/10 border border-aurora/25 flex items-center justify-center text-aurora shadow-lg shadow-aurora/10">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">Hindsight Persistent Memory Core</h2>
              <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-aurora/15 text-aurora border border-aurora/30">
                Bank: {bankId}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Sub-second semantic recall & reflection across historical interactions for <span className="text-slate-200 font-semibold">{clientName}</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick Memory Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filter memory facts..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-obsidian-950 border border-white/[0.08] focus:border-aurora/50 text-xs text-slate-200 placeholder-slate-500 outline-none w-44 sm:w-52 transition-all"
            />
          </div>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/[0.1] hover:border-aurora/40 text-xs font-semibold text-slate-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-aurora ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Engine</span>
          </button>
        </div>
      </div>

      {/* RECENT AGENT LEARNINGS (High Priority Drift Display) */}
      <div className="glass-panel p-6 rounded-3xl border border-aurora/30 bg-gradient-to-br from-aurora/5 via-obsidian-900 to-obsidian-900 space-y-4">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-aurora uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-aurora" />
            <span>Dynamic Adaptations & Recent Learnings</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-aurora/20 text-aurora border border-aurora/30">
            Real-Time Cognitive Updates
          </span>
        </div>

        <div className="space-y-2.5">
          {recent && recent.length > 0 ? (
            recent.map((item, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-aurora/10 border border-aurora/25 text-xs text-emerald-200 flex items-start gap-3 font-medium shadow-sm"
              >
                <Zap className="w-4 h-4 text-aurora shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-1 italic">
              No recent runtime shifts recorded yet. Log an interaction or submit feedback to trigger a live Hindsight adaptation.
            </p>
          )}
        </div>
      </div>

      {/* 4 Quadrants of Cognitive Memory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LIKES / PRIORITIES */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-4 glass-card-hover">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Priorities & Winning Themes</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {likes.length} recalled
            </span>
          </div>

          <div className="space-y-2.5">
            {likes.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 flex items-start gap-2.5"
              >
                <span className="font-bold text-emerald-400 text-sm leading-none mt-0.5">✓</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CONCERNS & RISKS */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-4 glass-card-hover">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4" />
              <span>Risks & Friction Points</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {concerns.length} tracked
            </span>
          </div>

          <div className="space-y-2.5">
            {concerns.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2.5"
              >
                <span className="font-bold text-amber-400 text-sm leading-none mt-0.5">⚠</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DISLIKES & PAST REJECTIONS */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-4 glass-card-hover">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
              <XCircle className="w-4 h-4" />
              <span>Past Rejections & Landmines</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {dislikes.length} recorded
            </span>
          </div>

          <div className="space-y-2.5">
            {dislikes.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 flex items-start gap-2.5"
              >
                <span className="font-bold text-rose-400 text-sm leading-none mt-0.5">✕</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* MILESTONES & AUDIT HISTORY */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-4 glass-card-hover">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <History className="w-4 h-4" />
              <span>Key Timeline Milestones</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {history.length} logged
            </span>
          </div>

          <div className="space-y-2.5">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 flex items-start gap-2.5"
              >
                <span className="font-bold text-cyan-400 text-sm leading-none mt-0.5">•</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
