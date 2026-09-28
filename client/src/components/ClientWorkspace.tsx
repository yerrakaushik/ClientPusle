import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  FileText, 
  Brain, 
  Bot, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Scale
} from 'lucide-react';
import type { Client, Interaction, MeetingBrief, MemoryPanelData, ChatMessage, InteractionType } from '../types/index.js';
import { InteractionsTimeline } from './InteractionsTimeline.js';
import { AIAssistant } from './AIAssistant.js';
import { MeetingBriefView } from './MeetingBriefView.js';
import { MemoryPanel } from './MemoryPanel.js';
import type { WorkspaceTab } from './Sidebar.js';

interface ClientWorkspaceProps {
  client: Client;
  onBack: () => void;
  interactions: Interaction[];
  brief: MeetingBrief | null;
  memoryData: MemoryPanelData | null;
  chatMessages: ChatMessage[];
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  onAddInteraction: (data: { type: InteractionType; title: string; content: string; date?: string }) => Promise<void>;
  onSendMessage: (question: string) => Promise<void>;
  onRefreshBrief: () => Promise<void>;
  onRefreshMemory: () => Promise<void>;
  onFeedbackClick: (isHelpful: boolean) => void;
  isLoading: boolean;
}

export const ClientWorkspace: React.FC<ClientWorkspaceProps> = ({
  client,
  onBack,
  interactions,
  brief,
  memoryData,
  chatMessages,
  activeTab,
  setActiveTab,
  onAddInteraction,
  onSendMessage,
  onRefreshBrief,
  onRefreshMemory,
  onFeedbackClick,
  isLoading,
}) => {
  const [showComparison, setShowComparison] = useState(false);
  const isAcme = client.id === 'acme-corp';

  return (
    <div className="space-y-6 py-6">
      {/* Workspace Header / Relationship Dossier */}
      <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-zinc-300 hover:text-white transition-colors"
              title="Return to Business Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {client.companyName}
                </h1>
                {isAcme && (
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-white text-zinc-950">
                    Primary Account
                  </span>
                )}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#18181b] text-zinc-300 border border-[#27272a]">
                  {client.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 mt-1">
                <span className="flex items-center gap-1.5 font-medium">
                  <Users className="w-3.5 h-3.5 text-emerald-400" />
                  Champion: <strong className="text-white">{client.contactName}</strong> (CTIO)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  Upcoming Call: <strong className="text-zinc-200">{client.nextMeeting}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
                  <Brain className="w-3 h-3 text-emerald-400" />
                  Bank: hok-{client.id}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-zinc-400" />
              <span>{showComparison ? 'Hide Benchmark' : 'Stateless vs Memory'}</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('brief');
                onRefreshBrief();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-zinc-950 hover:bg-zinc-200 text-xs font-bold shadow-sm transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Meeting Brief</span>
            </button>
          </div>
        </div>

        {/* Live Side-by-Side Comparison Box: Stateless AI vs Hindsight Memory */}
        {showComparison && (
          <div className="p-5 rounded-2xl bg-obsidian-900 border border-aurora/30 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-aurora" />
                Live Benchmark: Why Stateless AI Fails in Enterprise Deals
              </span>
              <span className="text-[10px] text-slate-400 font-mono">The Hackathon Test</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-1.5">
                <span className="font-bold text-rose-300 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  Stateless AI (Without Hindsight)
                </span>
                <p className="text-slate-300 leading-relaxed">
                  "Hello! How can I help with Acme Corp? I recommend sending our standard healthcare cloud brochure and scheduling an introductory discovery call to discuss their general requirements."
                </p>
                <span className="text-[10px] text-rose-400 block font-semibold">❌ Forgets previous proposal rejection; forgets security objections.</span>
              </div>

              <div className="p-3.5 rounded-xl bg-aurora/10 border border-aurora/30 space-y-1.5">
                <span className="font-bold text-aurora flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-aurora" />
                  ClientPulse AI (With Hindsight Memory)
                </span>
                <p className="text-slate-200 leading-relaxed font-medium">
                  "Acme previously rejected generic pricing on Aug 20. Lead with the approved 3-phase sandbox plan, address Rahul's HIPAA encryption requirements upfront, and align with their new 90-day deadline."
                </p>
                <span className="text-[10px] text-aurora font-semibold block">✓ 100% grounded in historical memory; adapts strategy dynamically.</span>
              </div>
            </div>
          </div>
        )}

        {/* Workspace Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-white/[0.06] pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Account Dossier</span>
          </button>

          <button
            onClick={() => setActiveTab('committee')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'committee'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Buying Committee</span>
          </button>

          <button
            onClick={() => setActiveTab('interactions')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'interactions'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Touchpoints ({interactions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'assistant'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Copilot</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('brief');
              if (!brief) onRefreshBrief();
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'brief'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Meeting Brief</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('memory');
              if (!memoryData) onRefreshMemory();
            }}
            className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'memory'
                ? 'bg-white text-zinc-950 font-bold shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-[#18181b]'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-emerald-400" />
            <span>Memory Bank</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Account Dossier Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>What Wins with This Account</span>
              </h4>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="p-3 rounded-lg bg-[#18181b] border border-emerald-500/20 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Three-phase architecture:</strong> Sandbox staging allows hospital clinical staff to test workflows before cutover.</span>
                </li>
                <li className="p-3 rounded-lg bg-[#18181b] border border-emerald-500/20 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Detailed HIPAA architecture diagrams:</strong> Establishes immediate technical credibility with the review committee.</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>What Provokes Rejection</span>
              </h4>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="p-3 rounded-lg bg-[#18181b] border border-rose-500/20 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Generic boilerplate pricing:</strong> Previous proposal was rejected because rates were not mapped to custom healthcare workloads.</span>
                </li>
                <li className="p-3 rounded-lg bg-[#18181b] border border-rose-500/20 flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Open-ended cutover schedules:</strong> They demand day-specific commitments with zero unannounced disruption.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Buying Committee Dedicated View */}
      {activeTab === 'committee' && (
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Key Stakeholder Committee Map</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Tracked decision makers, internal influence weight, and known preferences stored in memory.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                Committee Aligned
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Rahul Sharma</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    High Rapport
                  </span>
                </div>
                <p className="text-zinc-400 font-medium">Chief Technology & Information Security Officer</p>
                <div className="pt-2 border-t border-zinc-800 text-zinc-300 space-y-1">
                  <div>• <strong>Primary Priority:</strong> Zero data leakage during live hospital cutover.</div>
                  <div>• <strong>Preferred Strategy:</strong> Three-phase migration with sandbox isolation.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Technical Review Board</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                    Gatekeeper
                  </span>
                </div>
                <p className="text-zinc-400 font-medium">Infrastructure & Compliance Committee</p>
                <div className="pt-2 border-t border-zinc-800 text-zinc-300 space-y-1">
                  <div>• <strong>Requirement:</strong> Detailed HIPAA encryption diagrams.</div>
                  <div>• <strong>Concern:</strong> Cannot afford downtime during hospital peak hours.</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#18181b] border border-[#27272a] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Finance & Procurement</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                    Budget Auth
                  </span>
                </div>
                <p className="text-zinc-400 font-medium">Commercial Evaluation</p>
                <div className="pt-2 border-t border-zinc-800 text-zinc-300 space-y-1">
                  <div>• <strong>Budget Range:</strong> ₹20,00,000 ($240,000).</div>
                  <div>• <strong>Rule:</strong> Completely rejects generic boilerplate price decks.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Tab 2: Interaction Ledger */}
      {activeTab === 'interactions' && (
        <InteractionsTimeline
          clientId={client.id}
          interactions={interactions}
          onAddInteraction={onAddInteraction}
          isLoading={isLoading}
        />
      )}

      {/* Tab 3: Relationship Copilot Chat */}
      {activeTab === 'assistant' && (
        <AIAssistant
          clientId={client.id}
          clientName={client.companyName}
          messages={chatMessages}
          onSendMessage={onSendMessage}
          isLoading={isLoading}
        />
      )}

      {/* Tab 4: Executive Briefing Dossier */}
      {activeTab === 'brief' && (
        <MeetingBriefView
          brief={brief}
          onRefresh={onRefreshBrief}
          isLoading={isLoading}
          onFeedbackClick={onFeedbackClick}
        />
      )}

      {/* Tab 5: Cognitive Memory Bank */}
      {activeTab === 'memory' && (
        <MemoryPanel
          clientId={client.id}
          clientName={client.companyName}
          memoryData={memoryData}
          onRefresh={onRefreshMemory}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
