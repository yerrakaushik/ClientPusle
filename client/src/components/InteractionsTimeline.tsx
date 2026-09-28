import React, { useState } from 'react';
import { 
  Calendar, 
  MessageSquare, 
  Phone, 
  FileText, 
  Plus, 
  Brain, 
  CheckCircle2, 
  Sparkles,
  FileCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import type { Interaction, InteractionType } from '../types/index.js';

interface InteractionsTimelineProps {
  clientId: string;
  interactions: Interaction[];
  onAddInteraction: (data: { type: InteractionType; title: string; content: string; date?: string }) => Promise<void>;
  isLoading: boolean;
}

export const InteractionsTimeline: React.FC<InteractionsTimelineProps> = ({
  interactions,
  onAddInteraction,
  isLoading,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [type, setType] = useState<InteractionType>('call');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddInteraction({
        type,
        title: title.trim(),
        content: content.trim(),
      });
      setTitle('');
      setContent('');
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (t: InteractionType) => {
    switch (t) {
      case 'meeting':
        return <Calendar className="w-3.5 h-3.5 text-cyan-400" />;
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-aurora" />;
      case 'proposal':
        return <FileCheck className="w-3.5 h-3.5 text-amber-400" />;
      case 'email':
        return <MessageSquare className="w-3.5 h-3.5 text-slate-300" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5 rounded-2xl glass-panel border border-white/[0.08]">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            Historical Touchpoints & Cognitive Trail
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-obsidian-850 text-slate-300 font-mono border border-white/[0.08]">
              {interactions.length} entries
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Every executive interaction is retained into Hindsight memory and indexed for sub-second semantic retrieval.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-obsidian-950 font-bold text-xs shadow-md shadow-aurora/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{showAddForm ? 'Cancel Entry' : 'Log New Interaction'}</span>
        </button>
      </div>

      {/* Add Interaction Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-3xl border border-aurora/30 bg-obsidian-900/90 space-y-4 animate-in fade-in duration-200 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="w-4 h-4 text-aurora" />
              <span>Log Interaction & Retain to Vectorize Hindsight</span>
            </div>
            <span className="text-[10px] font-mono text-aurora bg-aurora/15 px-2.5 py-0.5 rounded-full border border-aurora/30 font-semibold">
              Live Ingestion
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interaction Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as InteractionType)}
                className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/[0.08] text-slate-200 text-xs focus:border-aurora/50 outline-none transition-all"
              >
                <option value="call">Phone / Video Call</option>
                <option value="meeting">Executive Meeting</option>
                <option value="proposal">Commercial Proposal</option>
                <option value="email">Email Thread</option>
                <option value="note">Internal Account Note</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject / Interaction Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Urgent Timeline Pivot & 90-Day Requirement"
                className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/[0.08] text-slate-200 text-xs focus:border-aurora/50 outline-none placeholder:text-slate-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Discussion & Stakeholder Feedback</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="e.g. Acme now says implementation time is their biggest concern. They want the migration completed within 90 days."
              className="w-full px-3 py-2.5 rounded-xl bg-obsidian-950 border border-white/[0.08] text-slate-200 text-xs focus:border-aurora/50 outline-none placeholder:text-slate-500 transition-all leading-relaxed"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium hover:bg-white/[0.04] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-obsidian-950 text-xs font-bold shadow-lg shadow-aurora/20 disabled:opacity-50 transition-all active:scale-95"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Retaining to Hindsight...' : 'Save & Retain Memory'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Timeline List */}
      <div className="relative pl-6 sm:pl-8 space-y-5 before:absolute before:left-3 sm:before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-aurora/40 before:via-white/[0.08] before:to-obsidian-950">
        {interactions.map((interaction) => {
          const is90DayPivot = interaction.content.toLowerCase().includes('90') || interaction.title.toLowerCase().includes('90');

          return (
            <div key={interaction.id} className="relative group">
              {/* Timeline node icon */}
              <div className={`absolute -left-6 sm:-left-8 top-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all ${
                is90DayPivot
                  ? 'bg-amber-500/20 border border-amber-400 text-amber-400 ring-4 ring-amber-500/10'
                  : 'bg-obsidian-900 border border-white/[0.15] group-hover:border-aurora/50'
              }`}>
                {getTypeIcon(interaction.type)}
              </div>

              <div className={`p-6 rounded-3xl border transition-all ${
                is90DayPivot
                  ? 'glass-panel border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-obsidian-900 to-obsidian-900 shadow-xl shadow-amber-500/5'
                  : 'glass-panel border-white/[0.08] hover:border-white/[0.15] bg-obsidian-900/70 glass-card-hover'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                      is90DayPivot ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-obsidian-850 text-slate-300 border border-white/[0.06]'
                    }`}>
                      {interaction.type}
                    </span>
                    <h4 className={`text-sm sm:text-base font-bold ${is90DayPivot ? 'text-amber-200' : 'text-white'}`}>
                      {interaction.title}
                    </h4>
                    {is90DayPivot && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500 text-obsidian-950 shadow-sm animate-pulse">
                        TIMELINE PIVOT
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">{interaction.date}</span>
                    {interaction.retainedToHindsight !== false && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-aurora/10 text-aurora border border-aurora/25">
                        <Brain className="w-3 h-3 text-aurora" />
                        Retained in Memory
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 whitespace-pre-wrap font-normal">
                  {interaction.content}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
