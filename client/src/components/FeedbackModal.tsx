import React, { useState } from 'react';
import { Brain, X, Send, Sparkles, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => Promise<void>;
  clientName: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clientName,
}) => {
  const [reason, setReason] = useState(
    'The recommendation focused too much on pricing. The client was actually more concerned about implementation time.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const quickPillOptions = [
    'The recommendation focused too much on pricing. The client was actually more concerned about implementation time.',
    'Missed the HIPAA security documentation requirement discussed with Rahul.',
    'Failed to account for zero-downtime cutover safeguards.',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(reason.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-aurora/30 p-7 shadow-2xl bg-obsidian-900/95 space-y-5">
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <div className="w-8 h-8 rounded-lg bg-aurora/10 border border-aurora/25 flex items-center justify-center text-aurora">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <span className="block leading-tight">Executive Cognitive Feedback Loop</span>
              <span className="text-[10px] text-slate-400 font-normal">Train Hindsight for {clientName}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-aurora/10 border border-aurora/20 text-xs text-emerald-200 leading-relaxed flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-aurora shrink-0 mt-0.5" />
          <span>
            This critique is retained directly into the <strong>Hindsight long-term memory bank</strong> for <strong>{clientName}</strong>. All future briefings and strategy memos will adapt automatically to prevent repeating this issue.
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2">
              What was suboptimal about the AI strategy?
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-obsidian-950 border border-white/[0.08] focus:border-aurora/50 text-xs text-slate-200 outline-none leading-relaxed transition-all"
              required
            />
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Enterprise Manager Suggested Critiques:
            </span>
            <div className="space-y-2">
              {quickPillOptions.map((opt, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setReason(opt)}
                  className="w-full text-left p-2.5 rounded-xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/[0.06] hover:border-aurora/30 text-[11px] text-slate-300 transition-all leading-snug"
                >
                  "{opt}"
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-medium hover:bg-white/[0.04] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-obsidian-950 text-xs font-bold shadow-lg shadow-aurora/20 disabled:opacity-50 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Retaining Correction...' : 'Retain Correction to Hindsight'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
