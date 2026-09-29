import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Calendar, 
  Brain, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Zap, 
  Target, 
  DollarSign, 
  Activity, 
  Plus, 
  Settings, 
  ChevronDown, 
  Download, 
  AlertTriangle, 
  Scale, 
  MessageCircle,
  MessageSquare,
  CheckCircle2,
  X,
  Check,
  Sliders,
  Server,
  Cpu,
  RefreshCw
} from 'lucide-react';
import type { Client } from '../types/index.js';

interface DashboardProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  totalMemoriesCount: number;
  onAddClient?: (newClient: Client) => void;
  onShowToast?: (type: 'success' | 'memory' | 'error', title: string, message: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  clients,
  onSelectClient,
  totalMemoriesCount,
  onAddClient,
  onShowToast,
}) => {
  const [timeRange, setTimeRange] = useState('Last 12 mon');
  const [showArchitecture, setShowArchitecture] = useState(false);
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(7); // Default August selected

  // Modals
  const [isNewSaleOpen, setIsNewSaleOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // New Sale Form State
  const [newSaleForm, setNewSaleForm] = useState({
    companyName: '',
    industry: 'Enterprise Technology',
    acv: '$650,000',
    stage: 'Negotiation',
    champion: '',
    email: '',
    risk: '',
  });

  // Settings State
  const [hindsightBank, setHindsightBank] = useState(() => 
    localStorage.getItem('clientpulse_hindsight_bank') || 'hok-portfolio-main'
  );
  const [groqModel, setGroqModel] = useState(() => 
    localStorage.getItem('clientpulse_groq_model') || 'llama-3.3-70b-versatile'
  );
  const [syncInterval, setSyncInterval] = useState('Real-time Webhook');
  const [enableFrictionAlerts, setEnableFrictionAlerts] = useState(true);
  const [enableAutoReflect, setEnableAutoReflect] = useState(true);
  const [testingHealth, setTestingHealth] = useState(false);
  const [healthLatency, setHealthLatency] = useState<number | null>(null);
  const [healthStatus, setHealthStatus] = useState<'idle' | 'connected' | 'error'>('idle');

  const totalInteractions = clients.reduce((acc, c) => acc + (c.interactionCount || 0), 0);

  // Real enterprise manager deal valuations
  const [dealState, setDealState] = useState<Record<string, { acv: string; stage: string; risk: string; champion: string; trend: string }>>({
    'acme-corp': { acv: '$1,420,000', stage: 'Negotiation (Stage 4)', risk: 'Downtime Aversion', champion: 'Rahul Sharma (CTIO)', trend: '+14%' },
    'technova': { acv: '$420,000', stage: 'Proposal Review', risk: 'Security Signoff', champion: 'Ananya Roy (VP Eng)', trend: '+8%' },
    'greengrid': { acv: '$180,000', stage: 'Technical Discovery', risk: 'Vendor Consensus', champion: 'Vikram Mehta (IoT Lead)', trend: '+5%' },
    'medicare-plus': { acv: '$540,000', stage: 'Initial Qualification', risk: 'Procurement Delay', champion: 'Dr. Suresh Patil (CMO)', trend: '+12%' },
    'finedge': { acv: '$720,000', stage: 'Closed Won (Expanding)', risk: 'Expansion Scope', champion: 'Neha Kapoor (Head Fintech)', trend: '+22%' },
  });

  // 12 Months Graph Data matching Shadcn chart
  const monthsData = [
    { month: 'Jan', sales: 32000, target: 30000 },
    { month: 'Feb', sales: 38000, target: 32000 },
    { month: 'Mar', sales: 45000, target: 35000 },
    { month: 'Apr', sales: 41000, target: 36000 },
    { month: 'May', sales: 49000, target: 40000 },
    { month: 'Jun', sales: 52000, target: 42000 },
    { month: 'Jul', sales: 47000, target: 44000 },
    { month: 'Aug', sales: 54230, target: 45000 },
    { month: 'Sep', sales: 51000, target: 46000 },
    { month: 'Oct', sales: 58000, target: 48000 },
    { month: 'Nov', sales: 62000, target: 50000 },
    { month: 'Dec', sales: 68000, target: 52000 },
  ];

  // Recent Sales & Memory Chats matching Shadcn right column
  const [recentSales, setRecentSales] = useState([
    {
      name: 'Rahul Sharma',
      email: 'rahul.s@acme-corp.com',
      company: 'Acme Corp',
      clientId: 'acme-corp',
      amount: '+$1,420,000',
      status: '90-Day Timeline Priority',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      initials: 'RS',
    },
    {
      name: 'Dr. Cynthia Thorne',
      email: 'c.thorne@vertex-health.org',
      company: 'Vertex HealthTech',
      clientId: 'medicare-plus',
      amount: '+$860,000',
      status: 'HIPAA Isolation Required',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      initials: 'CT',
    },
    {
      name: 'David Sterling',
      email: 'david@meridian-logistics.com',
      company: 'Meridian Global',
      clientId: 'finedge',
      amount: '+$2,100,000',
      status: 'Legal SLA Sign-off',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      initials: 'DS',
    },
    {
      name: 'Ananya Roy',
      email: 'ananya.roy@technova.io',
      company: 'TechNova Cloud',
      clientId: 'technova',
      amount: '+$420,000',
      status: 'Sandbox Proof of Concept',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      initials: 'AR',
    },
    {
      name: 'Vikram Mehta',
      email: 'v.mehta@greengrid.net',
      company: 'GreenGrid IoT',
      clientId: 'greengrid',
      amount: '+$180,000',
      status: 'Initial RFP Evaluation',
      badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      initials: 'VM',
    },
  ]);

  const handleTestConnection = async () => {
    setTestingHealth(true);
    const start = performance.now();
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      const latency = Math.round(performance.now() - start);
      setHealthLatency(latency);
      setHealthStatus('connected');
      if (onShowToast) {
        onShowToast('success', 'Hindsight Cloud Connected', `Ping verified in ${latency}ms. Vector Bank: ${data?.hindsight?.isLive ? 'Active' : 'Connected'}`);
      }
    } catch (e) {
      setHealthStatus('error');
      if (onShowToast) {
        onShowToast('error', 'Connection Error', 'Could not reach backend API endpoint.');
      }
    } finally {
      setTestingHealth(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('clientpulse_hindsight_bank', hindsightBank);
    localStorage.setItem('clientpulse_groq_model', groqModel);
    if (onShowToast) {
      onShowToast('success', 'Configuration Saved', `Groq Model: ${groqModel} | Bank: ${hindsightBank}`);
    }
    setIsSettingsOpen(false);
  };

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaleForm.companyName.trim()) return;

    const id = newSaleForm.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newClient: Client = {
      id,
      companyName: newSaleForm.companyName,
      industry: newSaleForm.industry || 'Enterprise SaaS',
      status: (newSaleForm.stage as any) || 'Negotiation',
      contactName: newSaleForm.champion || 'Executive Buyer',
      email: newSaleForm.email || `contact@${id}.com`,
      nextMeeting: 'Scheduled in 3 days',
      lastInteractionDate: new Date().toISOString().split('T')[0],
      interactionCount: 1,
    };

    setDealState(prev => ({
      ...prev,
      [id]: {
        acv: newSaleForm.acv || '$650,000',
        stage: newSaleForm.stage || 'Negotiation',
        risk: newSaleForm.risk || 'Migration Timeline & SLA',
        champion: newSaleForm.champion || 'Executive Buyer',
        trend: '+12%',
      }
    }));

    setRecentSales(prev => [
      {
        name: newSaleForm.champion || 'Executive Buyer',
        email: newSaleForm.email || `contact@${id}.com`,
        company: newSaleForm.companyName,
        clientId: id,
        amount: '+' + (newSaleForm.acv || '$650,000'),
        status: newSaleForm.risk ? `Priority: ${newSaleForm.risk}` : 'New Enterprise Deal',
        badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        initials: (newSaleForm.champion || newSaleForm.companyName)
          .split(' ')
          .map(w => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
      },
      ...prev,
    ]);

    if (onAddClient) {
      onAddClient(newClient);
    }

    if (onShowToast) {
      onShowToast('success', 'Enterprise Deal Initialized', `${newSaleForm.companyName} (${newSaleForm.acv}) saved to Hindsight Core`);
    }

    setIsNewSaleOpen(false);
    setNewSaleForm({
      companyName: '',
      industry: 'Enterprise Technology',
      acv: '$650,000',
      stage: 'Negotiation',
      champion: '',
      email: '',
      risk: '',
    });
  };

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto">
      {/* Top Header: Business Dashboard Title + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Business Dashboard
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Monitor your business performance, client relationship memory, and key metrics in real-time
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* + New Sale Button */}
          <button
            onClick={() => setIsNewSaleOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 font-semibold text-xs shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ New Sale</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white dark:bg-[#18181b] hover:bg-slate-100 dark:hover:bg-[#27272a] border border-slate-200 dark:border-[#27272a] text-xs font-semibold text-zinc-900 dark:text-white transition-colors shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* 4 Clean Metric Cards (Exact Match to Screenshot Layout, Typography & Badges) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Revenue */}
        <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Revenue</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1c1c21] text-zinc-300">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              +12%
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              $54,230
            </div>
            <div className="text-xs font-medium text-zinc-300 mt-2 flex items-center gap-1">
              <span>Trending up this month</span>
              <span className="text-emerald-400">↗</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Revenue for the last 6 months
            </div>
          </div>
        </div>

        {/* Card 2: Active Customers */}
        <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Active Customers</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1c1c21] text-zinc-300">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              +5.2%
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              2,350
            </div>
            <div className="text-xs font-medium text-zinc-300 mt-2 flex items-center gap-1">
              <span>Strong user retention</span>
              <span className="text-emerald-400">↗</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Engagement exceeds targets
            </div>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Total Orders</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1c1c21] text-zinc-300">
              <TrendingDown className="w-3 h-3 text-rose-400" />
              -2.1%
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              1,247
            </div>
            <div className="text-xs font-medium text-zinc-300 mt-2 flex items-center gap-1">
              <span>Down 2% this period</span>
              <span className="text-rose-400">↘</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Order volume needs attention
            </div>
          </div>
        </div>

        {/* Card 4: Conversion Rate */}
        <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Conversion Rate</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#1c1c21] text-zinc-300">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              +8.3%
            </span>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight">
              3.24%
            </div>
            <div className="text-xs font-medium text-zinc-300 mt-2 flex items-center gap-1">
              <span>Steady performance increase</span>
              <span className="text-emerald-400">↗</span>
            </div>
            <div className="text-[11px] text-zinc-500 mt-0.5">
              Meets conversion projections
            </div>
          </div>
        </div>
      </div>

      {/* Explainer / Actions Drawer */}
      {showArchitecture && (
        <div className="p-5 rounded-xl bg-[#121215] border border-[#27272a] space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Brain className="w-4 h-4 text-emerald-400" />
              Vectorize Hindsight Memory Core Actions
            </span>
            <span className="text-[10px] font-mono text-zinc-400">Live Bank: hok-acme-corp</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed">
            ClientPulse AI remembers past meeting rejections, timeline pivots (90-day requirement), and stakeholder nuances using <code>retain()</code>, <code>recall()</code>, and <code>reflect()</code>.
          </p>
        </div>
      )}

      {/* Two Column Grid: Interactive Sales Performance Graph (Left) & Recent Deals / Chats (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Interactive Sales Performance Graph */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#27272a] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">Sales Performance</h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  +12.9% vs Target
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Monthly sales vs targets across enterprise accounts
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mr-2">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900 dark:bg-white inline-block" /> Actual
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-zinc-300 dark:bg-zinc-700 inline-block" /> Target
                </span>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-zinc-300 hover:text-white transition-colors">
                <span>{timeRange}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181b] border border-[#27272a] text-xs text-zinc-300 hover:text-white transition-colors">
                <Download className="w-3 h-3" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Dynamic Tooltip on Hover */}
          {hoveredMonth !== null && (
            <div className="p-3 rounded-lg bg-[#18181b] border border-[#27272a] flex items-center justify-between text-xs animate-in fade-in duration-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span className="font-bold text-white">{monthsData[hoveredMonth].month} Performance:</span>
                <span className="text-white font-mono font-bold">${monthsData[hoveredMonth].sales.toLocaleString()}</span>
                <span className="text-zinc-500">vs target ${monthsData[hoveredMonth].target.toLocaleString()}</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400">
                +{(
                  ((monthsData[hoveredMonth].sales - monthsData[hoveredMonth].target) /
                    monthsData[hoveredMonth].target) *
                  100
                ).toFixed(1)}
                % Outperformed
              </span>
            </div>
          )}

          {/* Interactive Dual-Bar Chart */}
          <div className="relative h-64 pt-6 flex items-end gap-3 px-2 border-b border-[#27272a]">
            {/* Horizontal Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="border-b border-zinc-700 w-full" />
              <div className="border-b border-zinc-700 w-full" />
              <div className="border-b border-zinc-700 w-full" />
              <div className="border-b border-zinc-700 w-full" />
            </div>

            {monthsData.map((d, i) => {
              const maxVal = 70000;
              const salesPct = Math.round((d.sales / maxVal) * 100);
              const targetPct = Math.round((d.target / maxVal) * 100);
              const isSelected = hoveredMonth === i;

              return (
                <div
                  key={i}
                  onMouseEnter={() => setHoveredMonth(i)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group relative"
                >
                  <div className="w-full flex items-end justify-center gap-1 h-full pb-2">
                    {/* Target Bar (Muted) */}
                    <div
                      className="w-1/2 max-w-[12px] bg-zinc-300 dark:bg-zinc-700/60 rounded-t-sm transition-all"
                      style={{ height: `${targetPct}%` }}
                    />
                    {/* Actual Sales Bar (White/Highlighted in dark, dark in light) */}
                    <div
                      className={`w-1/2 max-w-[12px] rounded-t-sm transition-all ${
                        isSelected
                          ? 'bg-emerald-500 dark:bg-emerald-400 shadow-md shadow-emerald-500/20'
                          : 'bg-zinc-900 dark:bg-white group-hover:bg-zinc-700 dark:group-hover:bg-zinc-200'
                      }`}
                      style={{ height: `${salesPct}%` }}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-medium transition-colors ${
                      isSelected ? 'text-white font-bold' : 'text-zinc-500'
                    }`}
                  >
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <span>YTD Total: <strong>$599,230</strong> across all active pipelines</span>
            <span className="text-zinc-500 font-mono text-[11px]">Hover over any month to inspect details</span>
          </div>
        </div>

        {/* Right Column (1 Col): Recent Sales & Live Relationship Touchpoints (Matches Screenshot) */}
        <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-5 flex flex-col">
          <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Recent Sales & Chats</h3>
              <p className="text-xs text-zinc-400 mt-0.5">Live memory touchpoints from buying committees</p>
            </div>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {recentSales.map((deal, idx) => (
              <div
                key={idx}
                onClick={() => onSelectClient(deal.clientId || 'acme-corp')}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#18181b] border border-transparent hover:border-[#27272a] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-white shrink-0 group-hover:border-zinc-500">
                    {deal.initials}
                  </div>
                  <div className="min-w-0 leading-tight">
                    <span className="block text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {deal.name}
                    </span>
                    <span className="block text-[11px] text-zinc-400 truncate">
                      {deal.email}
                    </span>
                    <span className={`inline-block mt-1 text-[10px] font-medium px-1.5 py-0.2 rounded border ${deal.badgeColor}`}>
                      {deal.status}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <span className="text-xs font-bold text-white block font-mono">{deal.amount}</span>
                  <span className="text-[10px] text-zinc-500 block">{deal.company}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectClient('acme-corp')}
            className="w-full py-2.5 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
          >
            <span>Open Acme War Room Chat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Enterprise Accounts War Room Roster */}
      <div className="p-6 rounded-xl bg-[#121215] border border-[#27272a] space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272a] pb-3">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Strategic Accounts War Rooms
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Click any account to access grounded pre-call briefs, timeline audit trails, and Hindsight banks.
            </p>
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {clients.length} Accounts Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => {
            const isAcme = client.id === 'acme-corp';
            const deal = dealState[client.id] || { acv: '$500,000', stage: client.status, risk: 'Procurement Delay', champion: client.contactName };

            return (
              <div
                key={client.id}
                onClick={() => onSelectClient(client.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                  isAcme
                    ? 'bg-slate-50 dark:bg-[#18181b] border-slate-300 dark:border-zinc-500 hover:border-zinc-400'
                    : 'bg-white dark:bg-[#141418] border-slate-200 dark:border-[#27272a] hover:border-slate-300 dark:hover:border-zinc-600'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{client.companyName}</h4>
                      {isAcme && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-zinc-900 dark:bg-white text-white dark:text-zinc-950">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block mt-0.5">{client.industry}</span>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${
                    client.status === 'Negotiation' ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20' :
                    client.status === 'Closed Won' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
                    'bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700'
                  }`}>
                    {client.status}
                  </span>
                </div>

                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-[#0d0d10] border border-slate-200 dark:border-[#27272a]/60 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                  <div className="flex justify-between">
                    <span>ACV Value:</span>
                    <strong className="text-zinc-900 dark:text-white font-mono">{deal.acv}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Champion:</span>
                    <span className="text-zinc-800 dark:text-zinc-200">{deal.champion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Core Hurdle:</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium truncate max-w-[150px]">{deal.risk}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-[#27272a]/40 pt-1 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                      Next Call:
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{client.nextMeeting}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-[#27272a] flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                  <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                    <Brain className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    hok-{client.id}
                  </span>
                  <span className="flex items-center gap-1 text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                    Enter War Room
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom Right Pill Widget */}
      <div className="fixed bottom-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={() => onSelectClient('acme-corp')}
          className="px-3.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border border-slate-700 dark:border-zinc-700 text-xs font-semibold text-white shadow-lg transition-colors flex items-center gap-2"
        >
          <span>Upgrade to Pro</span>
        </button>
        <button
          onClick={() => onSelectClient('acme-corp')}
          className="w-9 h-9 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* 🚀 MODAL 1: ADD NEW ENTERPRISE DEAL / SALE                */}
      {/* ======================================================== */}
      {isNewSaleOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">Add New Enterprise Deal</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Initialize persistent cognitive memory & tracking for a client.</p>
                </div>
              </div>
              <button
                onClick={() => setIsNewSaleOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSale} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Company / Account Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Robotics"
                    value={newSaleForm.companyName}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Deal Value (ACV) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $850,000"
                    value={newSaleForm.acv}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, acv: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Sales Stage</label>
                  <select
                    value={newSaleForm.stage}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, stage: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  >
                    <option value="Discovery">Discovery (Stage 1)</option>
                    <option value="Qualification">Qualification (Stage 2)</option>
                    <option value="Proposal Review">Proposal Review (Stage 3)</option>
                    <option value="Negotiation">Negotiation (Stage 4)</option>
                    <option value="Closed Won">Closed Won (Expanding)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. CleanTech, FinTech"
                    value={newSaleForm.industry}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, industry: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Key Champion / Buyer</label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram Malhotra (VP Tech)"
                    value={newSaleForm.champion}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, champion: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Champion Email</label>
                  <input
                    type="email"
                    placeholder="e.g. vikram@company.com"
                    value={newSaleForm.email}
                    onChange={(e) => setNewSaleForm({ ...newSaleForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Key Memory Constraint or Landmine to Track
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Strictly avoid generic pricing decks; client has 60-day mandatory migration cutoff."
                  value={newSaleForm.risk}
                  onChange={(e) => setNewSaleForm({ ...newSaleForm, risk: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsNewSaleOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Initialize in Hindsight Core</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ⚙️ MODAL 2: HINDSIGHT ENGINE & PLATFORM SETTINGS          */}
      {/* ======================================================== */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 text-zinc-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">Hindsight & Platform Settings</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Configure cognitive memory banks, Groq AI inference, and alert parameters.</p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Memory Bank Prefix */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                  <span>Hindsight Memory Bank Identifier</span>
                  <span className="text-[10px] text-zinc-400 font-mono">Tenant Isolation Active</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={hindsightBank}
                    onChange={(e) => setHindsightBank(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-indigo-500 font-mono"
                  />
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">
                    Active
                  </span>
                </div>
              </div>

              {/* LLM Inference Model */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Groq LLM Reasoning Engine
                </label>
                <select
                  value={groqModel}
                  onChange={(e) => setGroqModel(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                >
                  <option value="llama-3.3-70b-versatile">Meta LLaMA 3.3 70B Versatile (Recommended)</option>
                  <option value="mixtral-8x7b-32768">Mixtral 8x7B (32k Long-Context)</option>
                  <option value="llama-3.1-8b-instant">LLaMA 3.1 8B Instant (Ultra-Low Latency)</option>
                </select>
              </div>

              {/* Cognitive Sync Mode */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Memory Synchronization SLA
                </label>
                <select
                  value={syncInterval}
                  onChange={(e) => setSyncInterval(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-white outline-none focus:border-indigo-500"
                >
                  <option value="Real-time Webhook">Real-time Webhook (&lt; 250ms)</option>
                  <option value="Every 30 seconds">Periodic Interval (Every 30s)</option>
                  <option value="Manual Trigger Only">Manual Trigger Only</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2.5 pt-1">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 cursor-pointer">
                  <div className="text-xs">
                    <span className="font-semibold block text-zinc-900 dark:text-white">Landmine & Conflict Alerts</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Notify immediately when proposals conflict with past rejections</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableFrictionAlerts}
                    onChange={(e) => setEnableFrictionAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60 cursor-pointer">
                  <div className="text-xs">
                    <span className="font-semibold block text-zinc-900 dark:text-white">Auto-Reflect on Interactions</span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Automatically synthesize cognitive takeaways after new touchpoints</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableAutoReflect}
                    onChange={(e) => setEnableAutoReflect(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </label>
              </div>

              {/* Health Test Bar */}
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  <span>Backend & Hindsight Health:</span>
                  {healthStatus === 'connected' && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Live ({healthLatency}ms)
                    </span>
                  )}
                  {healthStatus === 'error' && (
                    <span className="text-rose-500 font-semibold">Offline</span>
                  )}
                  {healthStatus === 'idle' && (
                    <span className="text-zinc-400">Not verified</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingHealth}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white border border-slate-300 dark:border-zinc-600 hover:bg-slate-50 text-[11px] font-medium transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${testingHealth ? 'animate-spin' : ''}`} />
                  <span>Test Ping</span>
                </button>
              </div>

              {/* Technical Flow Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowArchitecture(!showArchitecture)}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>{showArchitecture ? 'Hide Architecture Diagram' : 'Show Technical Architecture Diagram'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 text-xs font-semibold shadow-md transition-colors"
              >
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
