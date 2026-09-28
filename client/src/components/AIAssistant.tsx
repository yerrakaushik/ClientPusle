import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  Database,
  Bot,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';
import type { ChatMessage } from '../types/index.js';
import { Compose, type ComposeMention, type ComposeCommand } from './ui/compose.js';

interface AIAssistantProps {
  clientId: string;
  clientName: string;
  messages: ChatMessage[];
  onSendMessage: (question: string) => Promise<void>;
  isLoading: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  clientId,
  clientName,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const toggleSource = (msgId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  const mentions: ComposeMention[] = [
    { id: "rahul", label: "Rahul Sharma", sublabel: "CTIO & Economic Buyer" },
    { id: "rachel", label: "Rachel Foster", sublabel: "VP Enterprise Procurement" },
    { id: "board", label: "Review Board", sublabel: "Technical & HIPAA Gatekeepers" },
    { id: "acme", label: "Acme Corp", sublabel: "Global Financials • $1.4M ACV" },
  ];

  const commands: ComposeCommand[] = [
    {
      id: "objections",
      label: "objections",
      hint: "Recall past rejected proposals & landmines",
      icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />,
    },
    {
      id: "priorities",
      label: "priorities",
      hint: "Recall approved requirements & 90-day timeline",
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-aurora" />,
    },
    {
      id: "brief",
      label: "brief",
      hint: "Synthesize full pre-call strategy dossier",
      icon: <FileText className="w-3.5 h-3.5 text-cyan-400" />,
    },
    {
      id: "recall",
      label: "recall",
      hint: "Semantic search across Hindsight memory bank",
      icon: <Brain className="w-3.5 h-3.5 text-amber-400" />,
    },
  ];

  const suggestedQuestions = [
    'Why did Acme reject our previous proposal?',
    'What approach worked best with Acme?',
    'What are their biggest concerns regarding downtime?',
    'What should I avoid discussing in the upcoming meeting?',
  ];

  const handleSend = (text: string) => {
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
  };

  const handleCommand = (cmd: ComposeCommand) => {
    if (cmd.id === 'objections') {
      handleSend('Why did Acme reject our previous proposal and what landmines should I avoid?');
    } else if (cmd.id === 'priorities') {
      handleSend('What are the key priorities and timeline requirements for Acme?');
    } else if (cmd.id === 'brief') {
      handleSend('Provide an executive pre-call strategy briefing for the upcoming meeting.');
    } else if (cmd.id === 'recall') {
      handleSend('Recall all confirmed facts and stakeholder preferences from Hindsight.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-170px)] min-h-[480px] max-h-[720px] rounded-2xl bg-[#0f0f12] border border-[#27272a] overflow-hidden shadow-2xl">
      {/* Top Banner */}
      <div className="px-5 py-3 border-b border-[#27272a] bg-[#121215] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Relationship Copilot
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Ground Truth Active
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Grounded in {clientName}'s Hindsight memory bank • Use <kbd className="text-slate-300 font-mono">@</kbd> to mention or <kbd className="text-slate-300 font-mono">/</kbd> for commands
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-aurora font-semibold">
          <Brain className="w-4 h-4 animate-pulse" />
          <span className="font-mono text-[11px]">hok-{clientId}</span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.length === 0 && (
          <div className="py-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-aurora/10 border border-aurora/25 flex items-center justify-center mx-auto text-aurora shadow-lg shadow-aurora/10">
              <Brain className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Ask anything about {clientName}</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                The agent recalls historical objections, timeline commitments, and stakeholder nuances with zero hallucination.
              </p>
            </div>

            <div className="pt-2 text-left space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Executive Quick Prompts:
              </span>
              <div className="flex flex-col gap-1.5">
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="text-left px-3 py-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] hover:border-emerald-500/40 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <span>"{q}"</span>
                    <span className="text-[10px] text-zinc-500 group-hover:text-emerald-400 font-mono">↵ ask</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-md'
                  : 'glass-panel border border-white/[0.08] text-slate-200 shadow-sm'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-white/[0.06] text-[11px]">
                  <span className="inline-flex items-center gap-1 font-bold text-aurora">
                    <Brain className="w-3.5 h-3.5" />
                    Hindsight Memory Consulted
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">{msg.timestamp}</span>
                </div>
              )}

              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Memory Sources Accordion */}
              {msg.role === 'assistant' && msg.memorySources && msg.memorySources.length > 0 && (
                <div className="mt-3.5 pt-2.5 border-t border-white/[0.08]">
                  <button
                    onClick={() => toggleSource(msg.id)}
                    className="flex items-center justify-between w-full text-[11px] font-bold text-aurora hover:text-aurora-300 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <Database className="w-3.5 h-3.5" />
                      Verified Memory Citations ({msg.memorySources.length} records)
                    </span>
                    {expandedSources[msg.id] ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {expandedSources[msg.id] && (
                    <div className="mt-2.5 space-y-2 p-3 rounded-xl bg-obsidian-900/90 border border-aurora/20 text-slate-300 text-[11px] animate-in fade-in duration-150">
                      {msg.memorySources.map((source, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-aurora font-bold">{idx + 1}.</span>
                          <span className="leading-relaxed text-slate-300">{source}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2.5 text-xs text-aurora p-3.5 rounded-xl bg-obsidian-850 border border-aurora/30 w-fit">
            <Brain className="w-4 h-4 animate-spin text-aurora" />
            <span>Recalling Hindsight memories & generating grounded answer...</span>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompts Pills */}
      {messages.length > 0 && (
        <div className="px-5 py-2.5 bg-obsidian-900/60 border-t border-white/[0.06] flex items-center gap-2 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium">Quick Prompts:</span>
          {suggestedQuestions.slice(0, 3).map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="shrink-0 px-3 py-1 rounded-full bg-obsidian-850 hover:bg-obsidian-800 text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Rich Command / Mention Compose Input */}
      <div className="p-4 bg-obsidian-950/90 border-t border-white/[0.08]">
        <Compose
          mentions={mentions}
          commands={commands}
          maxLength={400}
          placeholder="Ask AI or press @ to tag stakeholder, / for commands..."
          submitLabel={isLoading ? "Recalling..." : "Send"}
          onSubmit={handleSend}
          onCommand={handleCommand}
          aria-label="Ask Relationship AI"
        />
      </div>
    </div>
  );
};
