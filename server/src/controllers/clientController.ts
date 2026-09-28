import type { Request, Response } from 'express';
import { clientService } from '../services/clientService.js';
import { hindsightService } from '../services/hindsightService.js';
import { llmService } from '../services/llmService.js';
import { db } from '../data/store.js';

export const clientController = {
  getClients(req: Request, res: Response): void {
    try {
      const clients = clientService.getAllClients();
      res.json({ success: true, clients });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getClientById(req: Request, res: Response): void {
    try {
      const client = clientService.getClient(req.params.id);
      if (!client) {
        res.status(404).json({ success: false, error: 'Client not found' });
        return;
      }
      res.json({ success: true, client });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getInteractions(req: Request, res: Response): void {
    try {
      const interactions = clientService.getInteractions(req.params.id);
      res.json({ success: true, interactions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async addInteraction(req: Request, res: Response): Promise<void> {
    try {
      const { type, title, content, date } = req.body;
      if (!type || !title || !content) {
        res.status(400).json({ success: false, error: 'Type, title, and content are required' });
        return;
      }
      const result = await clientService.addInteraction(req.params.id, {
        type,
        title,
        content,
        date,
      });
      res.status(201).json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getMeetingBrief(req: Request, res: Response): Promise<void> {
    try {
      const brief = await clientService.getMeetingBrief(req.params.id);
      res.json({ success: true, brief });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async chatWithAssistant(req: Request, res: Response): Promise<void> {
    try {
      const { question } = req.body;
      if (!question || typeof question !== 'string') {
        res.status(400).json({ success: false, error: 'Question string is required' });
        return;
      }
      const message = await clientService.askAssistant(req.params.id, question);
      res.json({ success: true, message });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async getMemoryPanel(req: Request, res: Response): Promise<void> {
    try {
      const memory = await clientService.getMemoryPanel(req.params.id);
      res.json({ success: true, memory });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async recordFeedback(req: Request, res: Response): Promise<void> {
    try {
      const { isHelpful, feedbackReason, briefId } = req.body;
      if (typeof isHelpful !== 'boolean') {
        res.status(400).json({ success: false, error: 'isHelpful boolean is required' });
        return;
      }
      const result = await clientService.recordFeedback(req.params.id, {
        isHelpful,
        feedbackReason,
        briefId,
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  async seedData(req: Request, res: Response): Promise<void> {
    try {
      // Re-seed default database & trigger Hindsight retain for demo client
      db.resetToDefault();
      const acmeInteractions = db.getInteractions('acme-corp');
      for (const int of acmeInteractions) {
        await hindsightService.retain(
          'acme-corp',
          `Client: Acme Corp\nType: ${int.type.toUpperCase()}\nDate: ${int.date}\nTitle: ${int.title}\nContent: ${int.content}`,
          { timestamp: int.date }
        );
      }
      res.json({ success: true, message: 'Idempotent seed completed successfully for Acme Corp and core clients.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  },

  getHealth(req: Request, res: Response): void {
    const hindsightStatus = hindsightService.getStatus();
    res.json({
      status: 'healthy',
      app: 'ClientPulse AI',
      timestamp: new Date().toISOString(),
      hindsight: hindsightStatus,
      llm: {
        configured: llmService.isConfigured(),
        model: llmService.getModelName(),
      },
    });
  },
};
