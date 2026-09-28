import React, { useState } from 'react';
import { Brain, Play, CheckCircle2, ArrowRight, X, Sparkles, FastForward } from 'lucide-react';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteDemoStep: (step: number) => Promise<void>;
  activeStep: number;
}

export const DemoModal: React.FC<DemoModalProps> = ({
  isOpen,
  onClose,
  onExecuteDemoStep,
  activeStep,
}) => {
  const [isRunning, setIsRunning] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Step 1: Explore Client History & Objections',
      desc: 'Inspect Acme Corp (Rahul Sharma). Notice past interactions where a generic proposal was rejected and a 3-phase plan was praised.',
      actionText: '1. Select Acme Corp & Inspect',
    },
    {
      title: 'Step 2: Ask AI with Grounded Memory',
      desc: 'Ask: "Why did Acme reject our previous proposal?". The agent queries Hindsight to return an accurate, unhallucinated answer.',
      actionText: '2. Run Grounded Memory Query',
    },
    {
      title: 'Step 3: New Interaction Retained in Hindsight',
      desc: 'Acme calls with an urgent pivot: "Implementation time is our biggest concern; must complete within 90 days." Hindsight retains this new fact.',
      actionText: '3. Inject 90-Day Interaction & Retain',
    },
    {
      title: 'Step 4: Meeting Brief Adapts (Learning Curve)',
      desc: 'Click "Prepare Me for Meeting". The brief dynamically shifts its strategy, priorities, and questions around the new 90-day deadline!',
      actionText: '4. Re-Generate Brief & View Adaptation',
    },
  ];

  const handleRunStep = async (idx: number) => {
    setIsRunning(true);
    try {
      await onExecuteDemoStep(idx);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div className="glass-panel w-full max-w-2xl rounded-2xl border border-indigo-500/40 p-6 shadow-2xl bg-slate-950 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Hackathon Guided Demo Flow</h3>
              <p className="text-xs text-slate-400">
                A 60-second interactive walkthrough demonstrating persistent memory and adaptation.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {steps.map((step, idx) => {
            const isCompleted = activeStep > idx;
            const isCurrent = activeStep === idx;

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'glass-panel border-indigo-500/50 bg-indigo-950/20 shadow-md'
                    : isCompleted
                    ? 'border-emerald-500/20 bg-emerald-950/10'
                    : 'border-slate-800 bg-slate-900/30 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-300">
                          {idx + 1}
                        </span>
                      )}
                      <h4 className={`text-xs sm:text-sm font-bold ${isCurrent ? 'text-indigo-300' : 'text-white'}`}>
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRunStep(idx)}
                    disabled={isRunning}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-95 ${
                      isCurrent
                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Step {idx + 1}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800 text-xs text-slate-400">
          <span>Demonstrating: <strong>retain()</strong>, <strong>recall()</strong> & <strong>reflect()</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-medium"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
