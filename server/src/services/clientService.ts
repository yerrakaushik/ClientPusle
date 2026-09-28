import { db } from '../data/store.js';
import { hindsightService } from './hindsightService.js';
import { llmService } from './llmService.js';
import type { Client, Interaction, MeetingBrief, MemoryPanelData, ChatMessage, FeedbackPayload } from '../types/index.js';

export const clientService = {
  getAllClients(): Client[] {
    return db.getClients();
  },

  getClient(id: string): Client | undefined {
    return db.getClientById(id);
  },

  getInteractions(clientId: string): Interaction[] {
    return db.getInteractions(clientId);
  },

  async addInteraction(
    clientId: string,
    data: { type: Interaction['type']; title: string; content: string; date?: string }
  ): Promise<{ interaction: Interaction; retainedMemory: boolean }> {
    const client = db.getClientById(clientId);
    if (!client) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }

    const interactionDate = data.date || new Date().toISOString().split('T')[0];
    const interaction: Interaction = {
      id: `${clientId}-int-${Date.now()}`,
      clientId,
      type: data.type,
      date: interactionDate,
      title: data.title,
      content: data.content,
      retainedToHindsight: false,
    };

    // Save to local store
    db.addInteraction(interaction);

    // Format durable memory content for Hindsight
    const durableMemory = `Client: ${client.companyName}\n` +
      `Contact: ${client.contactName} (${client.industry})\n` +
      `Interaction Type: ${data.type.toUpperCase()}\n` +
      `Date: ${interactionDate}\n` +
      `Title: ${data.title}\n` +
      `Notes: ${data.content}`;

    let retained = false;
    try {
      const result = await hindsightService.retain(clientId, durableMemory, {
        context: `${client.companyName} sales history`,
        timestamp: interactionDate,
      });
      retained = result.success;
      if (retained) {
        db.updateInteractionStatus(interaction.id, true);
        interaction.retainedToHindsight = true;
      }
    } catch (err) {
      console.error('[ClientService] Failed to retain interaction to Hindsight:', err);
    }

    return { interaction, retainedMemory: retained };
  },

  async getMeetingBrief(clientId: string): Promise<MeetingBrief> {
    const client = db.getClientById(clientId);
    if (!client) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }

    // Recall key memories from Hindsight
    const recallResult = await hindsightService.recall(
      clientId,
      'objections priorities what worked what failed concerns timeline security pricing',
      { budget: 'high', limit: 8 }
    );

    // Synthesize reasoning via reflect
    let reflectionText = '';
    try {
      const reflectResult = await hindsightService.reflect(
        clientId,
        `What strategy and precautions should we take for the upcoming meeting with ${client.companyName}?`
      );
      reflectionText = reflectResult.text;
    } catch (err) {
      console.warn('[ClientService] Reflect query skipped, proceeding with recall memories:', err);
    }

    const clientSnapshot = {
      companyName: client.companyName,
      contactName: client.contactName,
      industry: client.industry,
      status: client.status,
      nextMeeting: client.nextMeeting,
    };

    return llmService.generateMeetingBrief({
      clientSnapshot,
      memories: recallResult.memories,
      reflectionText,
    });
  },

  async askAssistant(clientId: string, question: string): Promise<ChatMessage> {
    const client = db.getClientById(clientId);
    if (!client) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }

    // Recall specific memories for this question
    const recallResult = await hindsightService.recall(clientId, question, { limit: 5 });
    const interactions = db.getInteractions(clientId).map((i) => `[${i.date} - ${i.type}] ${i.title}: ${i.content}`);

    const { answer, memorySources } = await llmService.generateChatResponse({
      clientName: client.companyName,
      contactName: client.contactName,
      question,
      memories: recallResult.memories,
      interactionHistory: interactions,
    });

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: answer,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      memoryConsulted: true,
      memorySources,
    };
  },

  async getMemoryPanel(clientId: string): Promise<MemoryPanelData> {
    const client = db.getClientById(clientId);
    if (!client) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }
    return hindsightService.getMemoryPanel(clientId);
  },

  async recordFeedback(clientId: string, payload: FeedbackPayload): Promise<{ success: boolean; message: string }> {
    const client = db.getClientById(clientId);
    if (!client) {
      throw new Error(`Client with ID ${clientId} not found.`);
    }

    if (!payload.isHelpful && payload.feedbackReason) {
      const correctionMemory = `CORRECTIVE OUTCOME & SALES REP FEEDBACK for ${client.companyName}:\n` +
        `User Feedback: The previous AI recommendation was not helpful because: "${payload.feedbackReason}".\n` +
        `Rule for future meetings: Adjust strategy to reflect this feedback and avoid repeating this mistake.`;

      await hindsightService.retain(clientId, correctionMemory, {
        context: 'Rep outcome feedback',
        tags: ['feedback', 'correction'],
      });

      return {
        success: true,
        message: 'Feedback retained in Hindsight. The AI will adapt its future meeting recommendations.',
      };
    }

    return {
      success: true,
      message: 'Positive feedback recorded.',
    };
  },
};
