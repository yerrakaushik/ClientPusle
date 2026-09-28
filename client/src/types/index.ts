export type InteractionType = 'meeting' | 'email' | 'call' | 'proposal' | 'feedback' | 'note';

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  industry: string;
  email: string;
  status: 'Lead' | 'In Discussion' | 'Proposal Review' | 'Negotiation' | 'Closed Won';
  nextMeeting: string;
  lastInteractionDate?: string;
  interactionCount?: number;
}

export interface Interaction {
  id: string;
  clientId: string;
  type: InteractionType;
  date: string;
  title: string;
  content: string;
  retainedToHindsight?: boolean;
}

export interface MemoryPanelData {
  likesPriorities: string[];
  concerns: string[];
  dislikes: string[];
  importantHistory: string[];
  recentLearning: string[];
  rawCount: number;
  lastUpdated: string;
}

export interface MeetingBrief {
  clientSnapshot: {
    companyName: string;
    contactName: string;
    industry: string;
    status: string;
    nextMeeting: string;
  };
  keyPriorities: string[];
  previousObjections: string[];
  whatWorked: string[];
  whatToAvoid: string[];
  openCommitments: string[];
  recommendedStrategy: string;
  suggestedQuestions: string[];
  memorySources: string[];
  generatedAt: string;
  reflectionSummary?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  memoryConsulted?: boolean;
  memorySources?: string[];
}

export interface SystemStatus {
  status: string;
  app: string;
  hindsight: {
    isLive: boolean;
    baseUrl: string;
    bankPrefix: string;
  };
  llm: {
    configured: boolean;
    model: string;
  };
}
