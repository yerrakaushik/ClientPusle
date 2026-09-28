import React, { useState } from 'react';
import { 
  Brain, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  X, 
  Sparkles, 
  HelpCircle, 
  Layers,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

interface DemoGuidePopoverProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteDemoStep: (step: number) => Promise<void>;
  activeStep: number;
}

export const DemoGuidePopover: React.FC<DemoGuidePopoverProps> = ({
  isOpen,
  onClose,
  onExecuteDemoStep,
  activeStep,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Step 1: Inspect Client & Past Objections',
      desc: 'Opens Acme Corp War Room. Notice historical interactions where a generic pricing model was rejected and a 3-phase plan was preferred.',
      btnText: 'Run Step 1',
    },
    {
      title: 'Step 2: Grounded Q&A via Memory',
      desc: 'Asks AI Copilot: "Why did Acme reject our previous proposal?". Agent pulls exact memory with zero hallucination.',
      btnText: 'Run Step 2',
    },
    {
      title: 'Step 3: Retain 90-Day Timeline Pivot',
      desc: 'Acme calls with an urgent pivot: "Must complete in 90 days." Hindsight retains this new constraint live into bank hok-acme-corp.',
      btnText: 'Run Step 3',
    },
    {
      title: 'Step 4: Meeting Brief Adapts Instantly',
      desc: 'Regenerates the executive brief. The strategy immediately pivots to prioritize the 90-day window.',
      btnText: 'Run Step 4',
    },
  ];

  const handleStepClick = async (idx: number) => {
    setIsRunning(true);
    try {
      await onExecuteDemoStep(idx);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="absolute right-4 sm:right-8 top-16 z-50 w-96 max-w-[calc(100vw-2rem)] glass-panel-elevated rounded-3xl p-5 shadow-2xl border border-aurora/30 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Popover Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-aurora/10 border border-aurora/25 flex items-center justify-center text-aurora">
            <Sparkles className="w-4 h-4 text-aurora" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-tight">Interactive User Guide</h4>
            <p className="text-[10px] text-aurora font-medium">Live 4-Step Hindsight Walkthrough</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
          title="Close Guide"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Explainer Accordion */}
      <div className="my-3">
        <button
          onClick={() => setShowExplainer(!showExplainer)}
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-obsidian-850 hover:bg-obsidian-800 border border-white/[0.08] text-[11px] text-slate-200 transition-all"
        >
          <span className="flex items-center gap-1.5 font-semibold text-aurora">
            <Info className="w-3.5 h-3.5 text-aurora" />
            What is ClientPulse & How it Works
          </span>
          {showExplainer ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {showExplainer && (
          <div className="mt-2 p-3 rounded-2xl bg-obsidian-950 border border-white/[0.08] text-[11px] text-slate-300 leading-relaxed space-y-2">
            <p>
              <strong>ClientPulse AI</strong> is a relationship intelligence copilot for enterprise sales leaders. Unlike standard chatbots that suffer from amnesia between meetings, it uses <strong>Vectorize Hindsight</strong> to retain durable client knowledge across calls.
            </p>
            <p>
              It grounds all pre-call strategy memos and conversational answers in factual memory, ensuring your sales team never repeats a past mistake or contradicts an executive commitment.
            </p>
          </div>
        )}
      </div>

      {/* 4 Interactive Steps */}
      <div className="space-y-2 mt-2">
        {steps.map((step, idx) => {
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;

          return (
            <div
              key={idx}
              className={`p-3 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-aurora/10 border-aurora/40 shadow-sm'
                  : isDone
                  ? 'bg-emerald-950/20 border-emerald-500/20'
                  : 'bg-obsidian-950/60 border-white/[0.06] opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-aurora shrink-0" />
                    ) : (
                      <span className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center shrink-0 ${
                        isCurrent ? 'bg-aurora text-obsidian-950' : 'bg-obsidian-800 text-slate-400 border border-white/[0.08]'
                      }`}>
                        {idx + 1}
                      </span>
                    )}
                    <h5 className={`text-[11px] font-bold ${isCurrent ? 'text-aurora' : 'text-slate-200'}`}>
                      {step.title}
                    </h5>
                  </div>
                  <p className="text-[10px] text-slate-400 pl-5 leading-normal">
                    {step.desc}
                  </p>
                </div>

                <button
                  onClick={() => handleStepClick(idx)}
                  disabled={isRunning}
                  className={`shrink-0 px-2.5 py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center gap-1 active:scale-95 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-obsidian-950 shadow-md shadow-aurora/20'
                      : 'bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 border border-white/[0.06]'
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>{step.btnText}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-slate-400">
        <span>Click steps to watch the screen react live</span>
        <button
          onClick={onClose}
          className="text-aurora hover:underline font-semibold"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
