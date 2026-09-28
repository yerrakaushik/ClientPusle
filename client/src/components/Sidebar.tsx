import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Clock, 
  Bot, 
  FileText, 
  Brain, 
  MoreVertical, 
  X, 
  ChevronRight, 
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Shield,
  Layers,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import type { Client } from '../types/index.js';

export type WorkspaceTab = 'overview' | 'committee' | 'interactions' | 'assistant' | 'brief' | 'memory';

interface SidebarProps {
  currentView: 'dashboard' | 'account';
  selectedClientId: string | null;
  activeTab: WorkspaceTab;
  onSelectDashboard: () => void;
  onSelectAccount: (clientId: string, tab?: WorkspaceTab) => void;
  isOpen: boolean;
  onToggle: () => void;
  clients: Client[];
  onResetSeed?: () => void;
  isSeeding?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedClientId,
  activeTab,
  onSelectDashboard,
  onSelectAccount,
  isOpen,
  onToggle,
  clients,
  onResetSeed,
  isSeeding = false,
}) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  const clientValuations: Record<string, string> = {
    'acme-corp': '$1.4M',
    'technova': '$420k',
    'greengrid': '$180k',
    'medicare-plus': '$540k',
    'finedge': '$720k',
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Main Sidebar Shell */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-[#09090b] flex flex-col transition-all duration-300 shrink-0 ${
          isOpen 
            ? 'w-64 translate-x-0 opacity-100 border-r border-[#27272a]' 
            : 'w-0 -translate-x-full lg:translate-x-0 overflow-hidden opacity-0 pointer-events-none border-transparent'
        }`}
      >
        <div className="w-64 h-full flex flex-col shrink-0">
          {/* Brand Header */}
          <div className="p-4 border-b border-[#27272a] flex items-center justify-between">
            <div 
              onClick={onSelectDashboard}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white shadow-sm group-hover:bg-zinc-700 transition-colors">
                <Brain className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="leading-tight">
                <div className="text-[13px] font-bold text-white tracking-tight flex items-center gap-1.5">
                  ClientPulse AI
                  <span className="text-[9px] font-semibold uppercase px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Pro
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 font-normal">
                  Hindsight Memory Engine
                </div>
              </div>
            </div>

            <button
              onClick={onToggle}
              className="lg:hidden p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800"
              title="Close Sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Navigation Menu */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-5">
            {/* Main Views Section */}
            <div className="space-y-1">
              <div className="px-3 text-[11px] font-semibold text-zinc-400 mb-1">
                Overview
              </div>

              <button
                onClick={onSelectDashboard}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-[#18181b] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                  <span>Portfolio Dashboard</span>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300">
                  {clients.length || 5} Deals
                </span>
              </button>
            </div>

            {/* Enterprise Accounts Section (Direct Selection) */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-3 text-[11px] font-semibold text-zinc-400 mb-1">
                <span>Enterprise Accounts</span>
                <span className="text-[10px] text-zinc-500 font-mono">5 ACTIVE</span>
              </div>

              <div className="space-y-0.5">
                {clients.map((c) => {
                  const isCurrentClient = currentView === 'account' && selectedClientId === c.id;
                  const acv = clientValuations[c.id] || '$500k';
                  return (
                    <button
                      key={c.id}
                      onClick={() => onSelectAccount(c.id, 'overview')}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors group ${
                        isCurrentClient
                          ? 'bg-[#18181b] text-emerald-400 font-semibold border border-emerald-500/20'
                          : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Building2 className={`w-3.5 h-3.5 shrink-0 ${isCurrentClient ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                        <span className="truncate">{c.companyName}</span>
                      </div>
                      <span className={`text-[10px] shrink-0 font-mono ${isCurrentClient ? 'text-emerald-300' : 'text-zinc-500'}`}>
                        {acv}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Account Intelligence Tools (Active when viewing an account) */}
            <div className="space-y-1 pt-1 border-t border-[#27272a]/60">
              <div className="flex items-center justify-between px-3 text-[11px] font-semibold text-zinc-400 mb-1">
                <span>Account Workspace</span>
                {currentView === 'account' && selectedClient && (
                  <span className="text-[10px] text-emerald-400 font-medium truncate max-w-[90px]">
                    {selectedClient.companyName}
                  </span>
                )}
              </div>

              <button
                onClick={() => onSelectAccount(selectedClientId || 'acme-corp', 'overview')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  currentView === 'account' && activeTab === 'overview'
                    ? 'bg-[#18181b] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span>Account Dossier</span>
              </button>

              <button
                onClick={() => onSelectAccount(selectedClientId || 'acme-corp', 'committee')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  currentView === 'account' && activeTab === 'committee'
                    ? 'bg-[#18181b] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-zinc-400" />
                <span>Buying Committee</span>
              </button>

              <button
                onClick={() => onSelectAccount(selectedClientId || 'acme-corp', 'interactions')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  currentView === 'account' && activeTab === 'interactions'
                    ? 'bg-[#18181b] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                <span>Touchpoints Ledger</span>
              </button>

              <button
                onClick={() => onSelectAccount(selectedClientId || 'acme-corp', 'assistant')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  currentView === 'account' && activeTab === 'assistant'
                    ? 'bg-[#18181b] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hindsight Copilot</span>
              </button>

              <button
                onClick={() => onSelectAccount(selectedClientId || 'acme-corp', 'brief')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  currentView === 'account' && activeTab === 'brief'
                    ? 'bg-[#18181b] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-zinc-400" />
                <span>Meeting Brief</span>
              </button>

              <button
                onClick={() => onSelectAccount(selectedClientId || 'acme-corp', 'memory')}
                className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  currentView === 'account' && activeTab === 'memory'
                    ? 'bg-[#18181b] text-white shadow-sm font-semibold'
                    : 'text-zinc-400 hover:text-white hover:bg-[#121215]'
                }`}
              >
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Memory Bank</span>
              </button>
            </div>
          </div>

          {/* Interactive User Profile Card (SJ - Sarah Jenkins) */}
          <div className="p-3 border-t border-[#27272a] bg-[#09090b] relative">
            <button
              onClick={() => setShowProfileModal(!showProfileModal)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#18181b] transition-colors group text-left border border-transparent hover:border-zinc-800"
              title="Click to view Sarah Jenkins profile and system status"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                  SJ
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-1.5">
                    <span className="block text-[13px] font-medium text-white truncate">Sarah Jenkins</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="block text-[11px] text-zinc-400 truncate">sarah@enterprise.com</span>
                </div>
              </div>
              <MoreVertical className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 shrink-0" />
            </button>

            {/* Profile Popover Details */}
            {showProfileModal && (
              <div className="absolute bottom-16 left-3 right-3 p-4 rounded-xl bg-[#121215] border border-[#27272a] shadow-2xl z-50 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-150">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                      SJ
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Sarah Jenkins</div>
                      <div className="text-[10px] text-zinc-400">Principal Enterprise AE</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-[11px] space-y-1.5 text-zinc-300">
                  <div className="flex justify-between py-0.5 border-b border-zinc-800/60">
                    <span className="text-zinc-500">Status</span>
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Active Session
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-zinc-800/60">
                    <span className="text-zinc-500">Hindsight Node</span>
                    <span className="font-mono text-[10px] text-zinc-300">hok-{selectedClientId || 'acme-corp'}</span>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-zinc-800/60">
                    <span className="text-zinc-500">Groq LLM</span>
                    <span className="font-mono text-[10px] text-zinc-300">gpt-oss-120b</span>
                  </div>
                </div>

                {onResetSeed && (
                  <button
                    onClick={() => {
                      onResetSeed();
                      setShowProfileModal(false);
                    }}
                    disabled={isSeeding}
                    className="w-full py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-zinc-700"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSeeding ? 'animate-spin' : ''}`} />
                    <span>Reset Baseline Seed Data</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
