import dotenv from 'dotenv';
dotenv.config();
import { HindsightClient } from '@vectorize-io/hindsight-client';
import type { MemoryPanelData } from '../types/index.js';

interface HindsightConfig {
  baseUrl: string;
  apiKey?: string;
  bankPrefix: string;
}

function getConfig(): HindsightConfig {
  return {
    baseUrl: process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io',
    apiKey: process.env.HINDSIGHT_API_KEY,
    bankPrefix: process.env.HINDSIGHT_BANK_PREFIX || 'clientpulse',
  };
}

// In-memory bank for fallback demo reliability (ensures hackathon demo works even offline)
const fallbackMemoryBanks: Record<string, Array<{ text: string; timestamp: string; tags?: string[] }>> = {
  'clientpulse-acme-corp': [
    {
      text: 'Acme Corp is heavily interested in cloud migration for their healthcare systems. Security and compliance are their #1 priority.',
      timestamp: '2026-08-12',
      tags: ['priority', 'security', 'migration'],
    },
    {
      text: 'Acme rejected the first proposal because the pricing structure was too generic. However, they explicitly approved our three-phase migration approach.',
      timestamp: '2026-08-20',
      tags: ['objection', 'pricing', 'what-worked'],
    },
    {
      text: 'Client requested comprehensive HIPAA & SOC2 security documentation and encryption architecture diagrams before proceeding.',
      timestamp: '2026-08-28',
      tags: ['security', 'compliance', 'documentation'],
    },
    {
      text: 'Acme stressed that predictable implementation timelines and zero unannounced downtime are strict operational requirements.',
      timestamp: '2026-09-05',
      tags: ['timeline', 'downtime', 'priority'],
    },
    {
      text: 'Stakeholders responded very positively to the three-phase migration framework with isolated staging sandbox. Re-emphasized avoiding generic pricing decks.',
      timestamp: '2026-09-20',
      tags: ['what-worked', 'positive-feedback'],
    },
  ],
};

export class HindsightService {
  private client: HindsightClient | null = null;
  private isLive = false;

  constructor() {
    this.initClient();
  }

  private initClient(): void {
    const config = getConfig();
    if (config.apiKey) {
      try {
        this.client = new HindsightClient({
          baseUrl: config.baseUrl,
          apiKey: config.apiKey,
        });
        this.isLive = true;
        console.log(`[HindsightService] Initialized with Live Hindsight Cloud: ${config.baseUrl}`);
      } catch (err) {
        console.warn('[HindsightService] Could not initialize HindsightClient, using fallback:', err);
        this.isLive = false;
      }
    } else {
      console.log('[HindsightService] HINDSIGHT_API_KEY not provided. Running in Demo / Fallback mode.');
      this.isLive = false;
    }
  }

  public getStatus(): { isLive: boolean; baseUrl: string; bankPrefix: string } {
    const config = getConfig();
    return {
      isLive: this.isLive,
      baseUrl: config.baseUrl,
      bankPrefix: config.bankPrefix,
    };
  }

  public getBankId(clientId: string): string {
    const config = getConfig();
    const cleanId = clientId.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    return `${config.bankPrefix}-${cleanId}`;
  }

  /**
   * Retain new durable information into Hindsight memory bank
   */
  public async retain(
    clientId: string,
    content: string,
    options?: { context?: string; tags?: string[]; timestamp?: string }
  ): Promise<{ success: boolean; memoryId?: string; mode: 'live' | 'demo' }> {
    const bankId = this.getBankId(clientId);
    const timestamp = options?.timestamp || new Date().toISOString();

    if (this.isLive && this.client) {
      try {
        console.log(`[Hindsight retain] Retaining memory to bank: ${bankId}`);
        const response = await this.client.retain(bankId, content, {
          context: options?.context,
          timestamp,
        });
        return {
          success: true,
          memoryId: (response as any)?.operation_id || (response as any)?.id || 'live-mem',
          mode: 'live',
        };
      } catch (err) {
        console.error(`[Hindsight retain] Failed live retain to ${bankId}:`, err);
        // Fall back gracefully so demo never breaks
      }
    }

    // Fallback in-memory retention
    if (!fallbackMemoryBanks[bankId]) {
      fallbackMemoryBanks[bankId] = [];
    }
    fallbackMemoryBanks[bankId].push({
      text: content,
      timestamp,
      tags: options?.tags,
    });

    console.log(`[Hindsight retain] Retained to memory bank (${bankId}): "${content.slice(0, 70)}..."`);
    return {
      success: true,
      memoryId: `mem-${Date.now()}`,
      mode: 'demo',
    };
  }

  /**
   * Recall memories from Hindsight bank
   */
  public async recall(
    clientId: string,
    query: string,
    options?: { limit?: number; budget?: 'low' | 'mid' | 'high' }
  ): Promise<{ memories: string[]; mode: 'live' | 'demo' }> {
    const bankId = this.getBankId(clientId);

    if (this.isLive && this.client) {
      try {
        console.log(`[Hindsight recall] Querying bank: ${bankId} with "${query}"`);
        const response: any = await this.client.recall(bankId, query, {
          budget: options?.budget || 'mid',
        });

        let memories: string[] = [];
        if (response?.memories && Array.isArray(response.memories)) {
          memories = response.memories.map((m: any) => m.content || m.text || JSON.stringify(m));
        } else if (response?.results && Array.isArray(response.results)) {
          memories = response.results.map((r: any) => r.text || r.content);
        } else if (typeof response === 'string') {
          memories = [response];
        }

        if (memories.length > 0) {
          return { memories, mode: 'live' };
        }
      } catch (err) {
        console.error(`[Hindsight recall] Live recall error for ${bankId}:`, err);
      }
    }

    // Fallback recall: keyword & semantic matching against client bank
    const bank = fallbackMemoryBanks[bankId] || [];
    const queryTokens = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

    const scored = bank.map((entry) => {
      const lower = entry.text.toLowerCase();
      let matchCount = 0;
      for (const token of queryTokens) {
        if (lower.includes(token)) matchCount++;
      }
      return { entry, score: matchCount };
    });

    scored.sort((a, b) => b.score - a.score);
    const limit = options?.limit || 5;
    const recalled = (scored.length > 0 && scored[0].score > 0)
      ? scored.slice(0, limit).map((s) => s.entry.text)
      : bank.slice(-limit).map((b) => b.text);

    return {
      memories: recalled.length > 0 ? recalled : bank.map((b) => b.text),
      mode: 'demo',
    };
  }

  /**
   * Reflect over Hindsight bank (synthesizes conclusions)
   */
  public async reflect(
    clientId: string,
    query: string,
    options?: { includeFacts?: boolean }
  ): Promise<{ text: string; facts?: string[]; mode: 'live' | 'demo' }> {
    const bankId = this.getBankId(clientId);

    if (this.isLive && this.client) {
      try {
        console.log(`[Hindsight reflect] Synthesizing insights for bank: ${bankId}`);
        const response: any = await this.client.reflect(bankId, query, {
          includeFacts: options?.includeFacts ?? true,
        });

        const text = response?.text || response?.answer || response?.summary || '';
        const facts = response?.facts || [];
        if (text) {
          return { text, facts, mode: 'live' };
        }
      } catch (err) {
        console.error(`[Hindsight reflect] Live reflect error for ${bankId}:`, err);
      }
    }

    // Fallback reflection synthesis
    const bank = fallbackMemoryBanks[bankId] || [];
    const has90Days = bank.some((b) => b.text.toLowerCase().includes('90') || b.text.toLowerCase().includes('timeline'));
    const text = `Reflection on ${clientId}:\n` +
      `Historical pattern shows high sensitivity to generic pricing and extreme risk-aversion toward downtime. ` +
      `The three-phase migration approach has established trust. ` +
      (has90Days
        ? `CRITICAL UPDATE: Client has pivoted to an urgent 90-day cutover requirement which must supersede prior pace considerations.`
        : `Primary strategy must prioritize security guarantees and fixed milestone predictability before discussing pricing tiers.`);

    return {
      text,
      facts: bank.map((b) => b.text),
      mode: 'demo',
    };
  }

  /**
   * Get structured memory panel data for visual UI inspection
   */
  public async getMemoryPanel(clientId: string): Promise<MemoryPanelData> {
    const bankId = this.getBankId(clientId);
    const recallResult = await this.recall(clientId, 'priorities concerns objections feedback', { limit: 10 });
    const memories = recallResult.memories;

    const likesPriorities: string[] = [];
    const concerns: string[] = [];
    const dislikes: string[] = [];
    const importantHistory: string[] = [];
    const recentLearning: string[] = [];

    // Analyze memories into structured sections
    for (const mem of memories) {
      const lower = mem.toLowerCase();

      if (lower.includes('security') || lower.includes('hipaa') || lower.includes('compliance')) {
        likesPriorities.push('Enterprise HIPAA & SOC2 Security Guarantees');
      }
      if (lower.includes('three-phase') || lower.includes('migration plan')) {
        likesPriorities.push('Three-phase migration strategy with sandbox isolation');
      }
      if (lower.includes('predictable') || lower.includes('timeline') && !lower.includes('90')) {
        likesPriorities.push('Predictable, milestone-based implementation schedules');
      }

      if (lower.includes('downtime') || lower.includes('disruption')) {
        concerns.push('Risk of hospital system cutover downtime');
      }
      if (lower.includes('90') || lower.includes('ninety')) {
        concerns.push('Tight 90-day go-live delivery window');
        recentLearning.push('Client updated constraint: Full migration required within 90 days');
      }

      if (lower.includes('generic') || lower.includes('rejected') || lower.includes('pricing')) {
        dislikes.push('Generic pricing proposals & boilerplate fee schedules');
        importantHistory.push('Previous proposal rejected due to generic pricing');
      }
      if (lower.includes('documentation') || lower.includes('diagrams')) {
        importantHistory.push('Formal security architecture diagrams requested');
      }
      if (lower.includes('too much on pricing')) {
        recentLearning.push('Feedback applied: Shift focus away from pricing toward timeline execution');
      }
    }

    // Deduplicate lists
    return {
      likesPriorities: Array.from(new Set(likesPriorities.length ? likesPriorities : ['Security and compliance', 'Three-phase migration'])),
      concerns: Array.from(new Set(concerns.length ? concerns : ['Migration downtime risk', 'Implementation predictability'])),
      dislikes: Array.from(new Set(dislikes.length ? dislikes : ['Generic pricing decks'])),
      importantHistory: Array.from(new Set(importantHistory.length ? importantHistory : ['Previous proposal was rejected', 'Security documentation requested'])),
      recentLearning: Array.from(new Set(recentLearning.length ? recentLearning : ['Three-phase plan received positive feedback from stakeholders'])),
      rawCount: memories.length,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export const hindsightService = new HindsightService();
