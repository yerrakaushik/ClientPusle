/// <reference types="vite/client" />
import type { Client, Interaction, MeetingBrief, MemoryPanelData, ChatMessage, SystemStatus } from '../types/index.js';

const getApiBase = () => {
  const env = (import.meta as any).env || {};
  if (env.VITE_API_URL) {
    return env.VITE_API_URL.replace(/\/+$/, '') + '/api';
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // If hosted on a static domain (Vercel, Netlify, GitHub Pages, Render static) and not on the Render backend itself:
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.includes('clientpusle.onrender.com')) {
      return 'https://clientpusle.onrender.com/api';
    }
  }
  return '/api';
};

const API_BASE = getApiBase();

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const fullUrl = `${API_BASE}${url}`;
  const res = await fetch(fullUrl, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const rawText = await res.text();
    throw new Error(
      `API endpoint returned non-JSON response (${res.status}): ${rawText.slice(0, 120)}`
    );
  }

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }
  return data;
}

export const api = {
  async getHealth(): Promise<SystemStatus> {
    return fetchJson<SystemStatus>('/health');
  },

  async getClients(): Promise<Client[]> {
    const res = await fetchJson<{ success: boolean; clients: Client[] }>('/clients');
    return res.clients;
  },

  async getClient(id: string): Promise<Client> {
    const res = await fetchJson<{ success: boolean; client: Client }>(`/clients/${id}`);
    return res.client;
  },

  async getInteractions(clientId: string): Promise<Interaction[]> {
    const res = await fetchJson<{ success: boolean; interactions: Interaction[] }>(`/clients/${clientId}/interactions`);
    return res.interactions;
  },

  async addInteraction(
    clientId: string,
    data: { type: Interaction['type']; title: string; content: string; date?: string }
  ): Promise<{ interaction: Interaction; retainedMemory: boolean }> {
    return fetchJson<{ success: boolean; interaction: Interaction; retainedMemory: boolean }>(
      `/clients/${clientId}/interactions`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  async getMeetingBrief(clientId: string): Promise<MeetingBrief> {
    const res = await fetchJson<{ success: boolean; brief: MeetingBrief }>(`/clients/${clientId}/meeting-brief`, {
      method: 'POST',
    });
    return res.brief;
  },

  async chat(clientId: string, question: string): Promise<ChatMessage> {
    const res = await fetchJson<{ success: boolean; message: ChatMessage }>(`/clients/${clientId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ question }),
    });
    return res.message;
  },

  async getMemoryPanel(clientId: string): Promise<MemoryPanelData> {
    const res = await fetchJson<{ success: boolean; memory: MemoryPanelData }>(`/clients/${clientId}/memory`);
    return res.memory;
  },

  async sendFeedback(
    clientId: string,
    payload: { isHelpful: boolean; feedbackReason?: string; briefId?: string }
  ): Promise<{ success: boolean; message: string }> {
    return fetchJson<{ success: boolean; message: string }>(`/clients/${clientId}/feedback`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async seedData(): Promise<{ success: boolean; message: string }> {
    return fetchJson<{ success: boolean; message: string }>('/seed', {
      method: 'POST',
    });
  },
};
