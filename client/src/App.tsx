import React, { useState, useEffect } from 'react';
import type { Client, Interaction, MeetingBrief, MemoryPanelData, ChatMessage, SystemStatus, InteractionType } from './types/index.js';
import { api } from './lib/api.js';
import { Sidebar } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { Dashboard } from './components/Dashboard.js';
import { ClientWorkspace } from './components/ClientWorkspace.js';
import { DemoGuidePopover } from './components/DemoGuidePopover.js';
import { FeedbackModal } from './components/FeedbackModal.js';
import { Toast, type ToastMessage } from './components/Toast.js';

export function App() {
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>('acme-corp');
  const [currentView, setCurrentView] = useState<'dashboard' | 'account'>('dashboard');
  const [activeTab, setActiveTab] = useState<'overview' | 'committee' | 'interactions' | 'assistant' | 'brief' | 'memory'>('overview');

  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [brief, setBrief] = useState<MeetingBrief | null>(null);
  const [memoryData, setMemoryData] = useState<MemoryPanelData | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [activeDemoStep, setActiveDemoStep] = useState(0);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const addToast = (type: 'success' | 'memory' | 'error', title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    async function loadInitial() {
      try {
        const [health, fetchedClients] = await Promise.all([
          api.getHealth(),
          api.getClients(),
        ]);
        setStatus(health);
        setClients(fetchedClients);
      } catch (err: any) {
        console.error('Initial load failed:', err);
        addToast('error', 'Connection Notice', 'Connecting to ClientPulse backend...');
      }
    }
    loadInitial();
  }, []);

  // When selected client changes
  useEffect(() => {
    if (!selectedClientId) return;

    async function loadClientData() {
      setIsLoading(true);
      try {
        const [fetchedInteractions, fetchedMemory, fetchedBrief] = await Promise.all([
          api.getInteractions(selectedClientId!),
          api.getMemoryPanel(selectedClientId!),
          api.getMeetingBrief(selectedClientId!).catch(() => null),
        ]);
        setInteractions(fetchedInteractions);
        setMemoryData(fetchedMemory);
        if (fetchedBrief) setBrief(fetchedBrief);
      } catch (err) {
        console.error('Failed to load client details:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadClientData();
  }, [selectedClientId]);

  const selectedClient = clients.find((c) => c.id === selectedClientId) || null;

  // Handlers
  const handleAddInteraction = async (data: { type: InteractionType; title: string; content: string; date?: string }) => {
    if (!selectedClientId) return;
    setIsLoading(true);
    try {
      const res = await api.addInteraction(selectedClientId, data);
      setInteractions((prev) => [res.interaction, ...prev]);

      addToast(
        'memory',
        'Memory Retained in Hindsight',
        `New interaction "${data.title}" successfully retained into memory bank hok-${selectedClientId}.`
      );

      // Re-sync memory panel and meeting brief
      const [updatedMemory, updatedBrief] = await Promise.all([
        api.getMemoryPanel(selectedClientId),
        api.getMeetingBrief(selectedClientId),
      ]);
      setMemoryData(updatedMemory);
      setBrief(updatedBrief);
    } catch (err: any) {
      addToast('error', 'Retention Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (question: string) => {
    if (!selectedClientId) return;
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const reply = await api.chat(selectedClientId, question);
      setChatMessages((prev) => [...prev, reply]);
    } catch (err: any) {
      addToast('error', 'Assistant Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshBrief = async () => {
    if (!selectedClientId) return;
    setIsLoading(true);
    try {
      const updatedBrief = await api.getMeetingBrief(selectedClientId);
      setBrief(updatedBrief);
    } catch (err: any) {
      addToast('error', 'Brief Synthesis Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshMemory = async () => {
    if (!selectedClientId) return;
    setIsLoading(true);
    try {
      const mem = await api.getMemoryPanel(selectedClientId);
      setMemoryData(mem);
    } catch (err: any) {
      addToast('error', 'Memory Sync Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSeed = async () => {
    setIsSeeding(true);
    try {
      await api.seedData();
      addToast('success', 'Seed Initialized', 'Acme Corp demo memory bank re-seeded with 5 baseline interactions.');
      if (selectedClientId) {
        const [fetchedInteractions, fetchedMemory, fetchedBrief] = await Promise.all([
          api.getInteractions(selectedClientId),
          api.getMemoryPanel(selectedClientId),
          api.getMeetingBrief(selectedClientId),
        ]);
        setInteractions(fetchedInteractions);
        setMemoryData(fetchedMemory);
        setBrief(fetchedBrief);
      }
    } catch (err: any) {
      addToast('error', 'Seed Error', err.message);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleFeedbackClick = (isHelpful: boolean) => {
    if (isHelpful) {
      addToast('success', 'Positive Feedback Recorded', 'Thank you! The AI will reinforce this strategic pattern.');
    } else {
      setIsFeedbackOpen(true);
    }
  };

  const handleFeedbackSubmit = async (reason: string) => {
    if (!selectedClientId) return;
    try {
      await api.sendFeedback(selectedClientId, {
        isHelpful: false,
        feedbackReason: reason,
      });
      addToast(
        'memory',
        'Correction Retained to Hindsight',
        'The agent will avoid repeating this mistake in future meeting preparations.'
      );
      await Promise.all([handleRefreshMemory(), handleRefreshBrief()]);
    } catch (err: any) {
      addToast('error', 'Feedback Error', err.message);
    }
  };

  // Automated 4-Step Hackathon Demo Runner
  const handleExecuteDemoStep = async (step: number) => {
    setSelectedClientId('acme-corp');
    setCurrentView('account');

    if (step === 0) {
      setActiveTab('overview');
      setActiveDemoStep(1);
      addToast('success', 'Step 1 Ready', 'Acme Corp selected. Notice past proposal rejection due to generic pricing.');
    } else if (step === 1) {
      setActiveTab('assistant');
      await handleSendMessage('Why did Acme reject our previous proposal?');
      setActiveDemoStep(2);
      addToast('memory', 'Step 2 Complete', 'Assistant recalled exact historical memory without hallucination.');
    } else if (step === 2) {
      setActiveTab('interactions');
      await handleAddInteraction({
        type: 'call',
        title: 'Urgent 90-Day Timeline Pivot',
        content: 'Acme now says implementation time is their biggest concern. They want the migration completed within 90 days.',
      });
      setActiveDemoStep(3);
      addToast('memory', 'Step 3 Complete', 'New 90-day constraint retained into Hindsight memory.');
    } else if (step === 3) {
      setActiveTab('brief');
      await handleRefreshBrief();
      setActiveDemoStep(4);
      addToast('success', 'Step 4 Complete', 'Notice how the Brief immediately adapted to prioritize the 90-day window!');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex relative selection:bg-aurora/30 selection:text-aurora">
      {/* Shadcn Left Sidebar */}
      <Sidebar
        currentView={currentView}
        selectedClientId={selectedClientId}
        activeTab={activeTab}
        onSelectDashboard={() => setCurrentView('dashboard')}
        onSelectAccount={(id, tab) => {
          setSelectedClientId(id);
          setCurrentView('account');
          if (tab) setActiveTab(tab);
        }}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        clients={clients}
        onResetSeed={handleResetSeed}
        isSeeding={isSeeding}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          status={status}
          isGuideOpen={isDemoOpen}
          onToggleGuide={() => setIsDemoOpen(!isDemoOpen)}
          onResetSeed={handleResetSeed}
          isSeeding={isSeeding}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Non-intrusive floating Guide Popover */}
        <DemoGuidePopover
          isOpen={isDemoOpen}
          onClose={() => setIsDemoOpen(false)}
          onExecuteDemoStep={handleExecuteDemoStep}
          activeStep={activeDemoStep}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {currentView === 'account' && selectedClientId && selectedClient ? (
            <ClientWorkspace
              client={selectedClient}
              onBack={() => setCurrentView('dashboard')}
              interactions={interactions}
              brief={brief}
              memoryData={memoryData}
              chatMessages={chatMessages}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onAddInteraction={handleAddInteraction}
              onSendMessage={handleSendMessage}
              onRefreshBrief={handleRefreshBrief}
              onRefreshMemory={handleRefreshMemory}
              onFeedbackClick={handleFeedbackClick}
              isLoading={isLoading}
            />
          ) : (
            <Dashboard
              clients={clients}
              onSelectClient={(id) => {
                setSelectedClientId(id);
                setCurrentView('account');
                setActiveTab('overview');
              }}
              totalMemoriesCount={memoryData?.rawCount || 5}
            />
          )}
        </main>
      </div>

      {/* Human-in-the-Loop Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        onSubmit={handleFeedbackSubmit}
        clientName={selectedClient?.companyName || 'Acme Corp'}
      />

      {/* Floating Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
