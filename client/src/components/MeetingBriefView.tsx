import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Compass, 
  HelpCircle, 
  Brain, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw,
  Sparkles,
  Clock,
  ShieldCheck,
  Calendar,
  FileText
} from 'lucide-react';
import type { MeetingBrief } from '../types/index.js';

interface MeetingBriefViewProps {
  brief: MeetingBrief | null;
  onRefresh: () => void;
  isLoading: boolean;
  onFeedbackClick: (isHelpful: boolean) => void;
}

export const MeetingBriefView: React.FC<MeetingBriefViewProps> = ({
  brief,
  onRefresh,
  isLoading,
  onFeedbackClick,
}) => {
  if (isLoading) {
    return (
      <div className="glass-panel rounded-3xl p-14 border border-white/[0.08] text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-aurora/10 border border-aurora/25 flex items-center justify-center mx-auto text-aurora">
          <Brain className="w-7 h-7 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white">Synthesizing Executive Strategy via Hindsight</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Recalling past deal objections, stakeholder feedback, and executing reflect reasoning for optimal meeting strategy...
        </p>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="glass-panel rounded-3xl p-14 border border-white/[0.08] text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
        <h3 className="text-lg font-bold text-white">No Brief Generated Yet</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Click below to query Hindsight memory and generate an executive strategic dossier for your upcoming call.
        </p>
        <button
          onClick={onRefresh}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-obsidian-950 font-bold text-xs shadow-md shadow-aurora/20"
        >
          Generate Meeting Brief
        </button>
      </div>
    );
  }

  const hasUrgent90Day = brief.keyPriorities.some(p => p.includes('90-Day') || p.includes('URGENT'));

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl glass-panel border border-white/[0.08]">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-aurora flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-aurora" />
            Executive Strategy Dossier
          </span>
          <h2 className="text-lg font-extrabold text-white mt-0.5">
            Pre-Call Briefing: {brief.clientSnapshot.companyName}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/[0.08] text-xs font-semibold text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-aurora" />
            <span>Re-Synthesize Brief</span>
          </button>
        </div>
      </div>

      {/* Client Snapshot Card */}
      <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Account Champion</span>
          <p className="text-sm font-bold text-white mt-0.5">{brief.clientSnapshot.contactName}</p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Industry Sector</span>
          <p className="text-sm font-semibold text-slate-200 mt-0.5">{brief.clientSnapshot.industry}</p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Deal Status</span>
          <p className="text-sm font-semibold text-amber-400 mt-0.5">{brief.clientSnapshot.status}</p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Scheduled Call</span>
          <p className="text-sm font-semibold text-cyan-300 mt-0.5">{brief.clientSnapshot.nextMeeting}</p>
        </div>
      </div>

      {/* Dynamic Adaptation Banner */}
      {hasUrgent90Day && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/15 via-obsidian-850 to-obsidian-900 border border-amber-500/40 flex items-start gap-4 shadow-xl shadow-amber-950/20 animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-amber-300">
              ⚡ Hindsight Adaptation: 90-Day Timeline Priority Activated
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Based on the newly retained interaction, the agent has updated the priority to an <strong>Accelerated 90-Day Go-Live Window</strong> and completely restructured the strategy and suggested questions below.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Priorities vs Previous Objections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Key Priorities */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/[0.06] pb-3">
            <CheckCircle2 className="w-4 h-4 text-aurora" />
            <span>Key Account Priorities</span>
          </div>
          <ul className="space-y-2">
            {brief.keyPriorities.map((item, idx) => {
              const isUrgent = item.includes('90-Day') || item.includes('URGENT');
              return (
                <li
                  key={idx}
                  className={`text-xs p-3 rounded-xl flex items-start gap-2.5 ${
                    isUrgent
                      ? 'bg-amber-500/15 border border-amber-500/30 text-amber-200 font-bold'
                      : 'bg-obsidian-850/80 text-slate-300'
                  }`}
                >
                  <span className="text-aurora font-bold shrink-0 mt-0.5">•</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Previous Objections */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/[0.06] pb-3">
            <XCircle className="w-4 h-4 text-rose-400" />
            <span>Historical Objections & Pain Points</span>
          </div>
          <ul className="space-y-2">
            {brief.previousObjections.map((item, idx) => (
              <li
                key={idx}
                className="text-xs p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-200 flex items-start gap-2.5"
              >
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">✕</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Grid: What Worked vs What to Avoid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* What Worked */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/[0.06] pb-3">
            <ThumbsUp className="w-4 h-4 text-aurora" />
            <span>Proven Approaches (What Worked)</span>
          </div>
          <ul className="space-y-2">
            {brief.whatWorked.map((item, idx) => (
              <li
                key={idx}
                className="text-xs p-3 rounded-xl bg-aurora/5 border border-aurora/20 text-aurora-300 flex items-start gap-2.5"
              >
                <span className="text-aurora font-bold shrink-0 mt-0.5">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What to Avoid */}
        <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-3.5">
          <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/[0.06] pb-3">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Dangerous Traps (What to Avoid)</span>
          </div>
          <ul className="space-y-2">
            {brief.whatToAvoid.map((item, idx) => (
              <li
                key={idx}
                className="text-xs p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2.5"
              >
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">⚠</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Strategy (Highlighted Hero Block) */}
      <div className="glass-panel p-7 sm:p-8 rounded-3xl border border-aurora/35 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 space-y-3.5 shadow-2xl shadow-aurora/10">
        <div className="flex items-center gap-2.5 text-sm font-bold text-aurora">
          <Compass className="w-5 h-5 text-aurora" />
          <span>Recommended Call Strategy (Synthesized by Hindsight Reflect)</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
          {brief.recommendedStrategy}
        </p>
      </div>

      {/* Suggested Questions to Ask */}
      <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-3.5">
        <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-white/[0.06] pb-3">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Probing Questions to Drive the Call</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {brief.suggestedQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-obsidian-850 border border-white/[0.06] text-xs text-slate-300 flex items-start gap-2.5"
            >
              <span className="text-cyan-400 font-bold">Q{idx + 1}:</span>
              <span className="leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Memory Sources Section (Hackathon centerpiece) */}
      <div className="glass-panel p-6 rounded-3xl border border-white/[0.08] space-y-3.5 bg-obsidian-950/90">
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-aurora uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Memory Sources (Hindsight Retain & Recall Log)</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {brief.memorySources.length} historical memories consulted
          </span>
        </div>

        <div className="space-y-2">
          {brief.memorySources.map((source, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-obsidian-900 border border-white/[0.06] text-xs text-slate-300 flex items-start gap-3"
            >
              <span className="text-aurora font-bold shrink-0">{idx + 1}.</span>
              <span className="leading-relaxed">{source}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback & Continuous Learning Bar */}
      <div className="glass-panel p-5 rounded-2xl border border-white/[0.08] flex flex-wrap items-center justify-between gap-4 bg-obsidian-900/70">
        <div>
          <h4 className="text-xs font-bold text-white">Was this meeting brief helpful?</h4>
          <p className="text-[11px] text-slate-400">
            Your feedback is retained in Hindsight so the AI learns from negotiation outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onFeedbackClick(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-all"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Helpful</span>
          </button>
          <button
            onClick={() => onFeedbackClick(false)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 text-xs font-bold transition-all"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Not Helpful</span>
          </button>
        </div>
      </div>
    </div>
  );
};
