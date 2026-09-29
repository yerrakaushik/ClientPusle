import React from 'react';
import { 
  Brain, 
  Sparkles, 
  BookOpen, 
  RefreshCw, 
  PanelLeft, 
  Search, 
  Command,
  Sun,
  Moon,
  Github,
  Layers,
  Globe
} from 'lucide-react';
import type { SystemStatus } from '../types/index.js';

interface HeaderProps {
  status: SystemStatus | null;
  isGuideOpen: boolean;
  onToggleGuide: () => void;
  onResetSeed: () => void;
  isSeeding: boolean;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  isGuideOpen,
  onToggleGuide,
  onResetSeed,
  isSeeding,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-20 w-full bg-[#09090b] border-b border-[#27272a] h-14">
      <div className="h-full px-4 flex items-center justify-between gap-4">
        {/* Left: Sidebar toggle + Search with ⌘K matching screenshot */}
        <div className="flex items-center gap-3 flex-1 max-w-sm">
          <button
            onClick={onToggleSidebar}
            className="p-1.5 rounded-md hover:bg-[#18181b] text-zinc-400 hover:text-white transition-colors"
            title="Toggle Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>

          {/* Search Bar matching screenshot */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-12 py-1 rounded-md bg-[#121215] border border-[#27272a] text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1 py-0.5 rounded bg-[#18181b] border border-zinc-700 text-[10px] text-zinc-400 font-mono">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </div>
        </div>

        {/* Right Actions: Hindsight Status, User Guide, and Reset Seed */}
        <div className="flex items-center gap-2.5">
          {/* Status indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121215] border border-[#27272a] text-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${status?.hindsight.isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className="text-zinc-400 text-[11px]">Hindsight:</span>
            <span className={`font-medium text-[11px] ${status?.hindsight.isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
              Cloud
            </span>
          </div>

            {/* Interactive User Guide Button */}
            <button
              onClick={onToggleGuide}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                isGuideOpen
                  ? 'bg-white text-zinc-950 font-bold'
                  : 'bg-white text-zinc-950 hover:bg-zinc-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>User Guide</span>
            </button>

            {/* Theme Toggle (Bright Mode / Dark Mode) */}
            <button
              onClick={onToggleTheme}
              title={theme === 'dark' ? "Switch to Bright Mode" : "Switch to Dark Mode"}
              className="p-1.5 rounded-md hover:bg-[#18181b] text-zinc-400 hover:text-white transition-colors flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:text-amber-300 transition-transform duration-200 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-500 hover:text-indigo-400 transition-transform duration-200 hover:-rotate-12" />
              )}
            </button>

            {/* Reset Baseline Seed */}
            <button
              onClick={onResetSeed}
              disabled={isSeeding}
              title="Reset Baseline Seed Data"
              className="p-1.5 rounded-md hover:bg-[#18181b] text-zinc-400 hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>
        </div>
      </header>
    );
  };
