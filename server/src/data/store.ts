import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Client, Interaction } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

interface DatabaseSchema {
  clients: Client[];
  interactions: Interaction[];
}

const DEFAULT_DATA: DatabaseSchema = {
  clients: [
    {
      id: 'acme-corp',
      companyName: 'Acme Corp',
      contactName: 'Rahul Sharma',
      industry: 'Healthcare Technology',
      email: 'rahul.sharma@acmecorp.health',
      status: 'Negotiation',
      nextMeeting: 'Tomorrow at 10:30 AM',
      lastInteractionDate: '2026-09-20',
      interactionCount: 5,
    },
    {
      id: 'technova',
      companyName: 'TechNova',
      contactName: 'Ananya Roy',
      industry: 'Enterprise SaaS',
      email: 'ananya@technova.io',
      status: 'Proposal Review',
      nextMeeting: 'Thursday at 3:00 PM',
      lastInteractionDate: '2026-09-18',
      interactionCount: 3,
    },
    {
      id: 'greengrid',
      companyName: 'GreenGrid Energy',
      contactName: 'Vikram Mehta',
      industry: 'Clean Energy & IoT',
      email: 'vikram.m@greengrid.in',
      status: 'In Discussion',
      nextMeeting: 'Oct 02 at 11:00 AM',
      lastInteractionDate: '2026-09-15',
      interactionCount: 2,
    },
    {
      id: 'medicare-plus',
      companyName: 'MediCare Plus',
      contactName: 'Dr. Suresh Patil',
      industry: 'Hospital Systems',
      email: 'suresh.p@medicareplus.org',
      status: 'Lead',
      nextMeeting: 'Oct 05 at 2:00 PM',
      lastInteractionDate: '2026-09-12',
      interactionCount: 1,
    },
    {
      id: 'finedge',
      companyName: 'FinEdge Capital',
      contactName: 'Neha Kapoor',
      industry: 'FinTech Banking',
      email: 'neha@finedge.com',
      status: 'Closed Won',
      nextMeeting: 'Quarterly Review (Nov)',
      lastInteractionDate: '2026-09-08',
      interactionCount: 4,
    },
  ],
  interactions: [
    {
      id: 'acme-int-1',
      clientId: 'acme-corp',
      type: 'meeting',
      date: '2026-08-12',
      title: 'Initial Discovery & Cloud Migration Scope',
      content: 'Acme is interested in cloud migration. Their biggest concern is security and compliance. They are heavily worried about migration downtime. Budget indicated is approximately ₹20 lakh.',
      retainedToHindsight: true,
    },
    {
      id: 'acme-int-2',
      clientId: 'acme-corp',
      type: 'proposal',
      date: '2026-08-20',
      title: 'Proposal Review & Pricing Rejection',
      content: 'Acme rejected the first proposal because the pricing structure was too generic and didn\'t reflect their custom healthcare workloads. However, they explicitly liked the proposed three-phase migration strategy.',
      retainedToHindsight: true,
    },
    {
      id: 'acme-int-3',
      clientId: 'acme-corp',
      type: 'call',
      date: '2026-08-28',
      title: 'Security Compliance Deep Dive',
      content: 'Rahul asked for detailed HIPAA & SOC2 security documentation and encryption architecture diagrams. Emphasized that data privacy cannot be compromised during cutover.',
      retainedToHindsight: true,
    },
    {
      id: 'acme-int-4',
      clientId: 'acme-corp',
      type: 'email',
      date: '2026-09-05',
      title: 'Timeline & Milestone Guarantees',
      content: 'The client stressed that predictable implementation timelines are crucial. They cannot afford surprise delays during hospital system peak hours.',
      retainedToHindsight: true,
    },
    {
      id: 'acme-int-5',
      clientId: 'acme-corp',
      type: 'meeting',
      date: '2026-09-20',
      title: 'Architecture Review with Stakeholders',
      content: 'Rahul and the tech committee responded very positively when we explained the three-phase migration plan with sandbox isolation. They reiterated: avoid generic pricing boilerplate.',
      retainedToHindsight: true,
    },
  ],
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      writeDb(DEFAULT_DATA);
      return DEFAULT_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('[Store] Error reading db.json, returning default data:', err);
    return DEFAULT_DATA;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Store] Error writing db.json:', err);
  }
}

export const db = {
  getClients(): Client[] {
    const data = readDb();
    return data.clients.map((c) => {
      const clientInteractions = data.interactions.filter((i) => i.clientId === c.id);
      const latest = clientInteractions.sort((a, b) => (a.date < b.date ? 1 : -1))[0];
      return {
        ...c,
        interactionCount: clientInteractions.length,
        lastInteractionDate: latest ? latest.date : c.lastInteractionDate,
      };
    });
  },

  getClientById(id: string): Client | undefined {
    return this.getClients().find((c) => c.id === id);
  },

  getInteractions(clientId: string): Interaction[] {
    const data = readDb();
    return data.interactions
      .filter((i) => i.clientId === clientId)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  },

  addInteraction(interaction: Interaction): Interaction {
    const data = readDb();
    data.interactions.push(interaction);
    writeDb(data);
    return interaction;
  },

  updateInteractionStatus(id: string, retained: boolean): void {
    const data = readDb();
    const item = data.interactions.find((i) => i.id === id);
    if (item) {
      item.retainedToHindsight = retained;
      writeDb(data);
    }
  },

  resetToDefault(): DatabaseSchema {
    writeDb(DEFAULT_DATA);
    return DEFAULT_DATA;
  },
};
