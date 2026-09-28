# ClientPulse AI

> **"Your AI client relationship memory."**  
> *Built for Microsoft HackwithHyderabad 3.0 • Vectorize Hindsight Challenge Track*

[![Hindsight Memory](https://img.shields.io/badge/Memory-Vectorize%20Hindsight-6366f1.svg)](https://hindsight.vectorize.io/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 1. Executive Summary & Problem

In enterprise B2B sales and account management, client relationships evolve across dozens of meetings, calls, proposals, and objections over quarters. Crucial context—such as why an earlier pricing tier was rejected, which migration strategy received buy-in, or what compliance documentation was mandated—gets buried across disconnected CRM notes, email threads, and Slack messages.

### The Problem with Stateless AI
Standard conversational AI assistants treat every client meeting independently. They don't know:
- Why **Acme Corp** rejected a proposal 3 weeks ago.
- That the client was receptive to a **three-phase rollout** with sandbox isolation.
- That the customer just called with a new constraint: **a strict 90-day implementation deadline**.

### The Solution: ClientPulse AI
**ClientPulse AI** integrates **Vectorize Hindsight** as an intelligent, long-term cognitive memory layer. It retains durable client facts, preferences, objections, and negotiation outcomes. When preparing a sales rep for an upcoming call or answering ad-hoc deal queries, it performs **semantic recall** and **agentic reflection** to formulate adaptive, winning recommendations.

---

## 2. Why Hindsight is Central to the Architecture

ClientPulse AI does **not** treat memory as a static vector cache. Instead, it utilizes the official `@vectorize-io/hindsight-client` across three primary memory primitives:

```
                  ┌─────────────────────────────────────────┐
                  │             ClientPulse AI              │
                  │        (Enterprise Sales Copilot)       │
                  └───────────────────┬─────────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
   1. retain()               2. recall()               3. reflect()
─────────────────────     ─────────────────────     ─────────────────────
Durable Interaction       Sub-100ms Semantic        Agentic Reasoning
Retention                 Lookup                    Over Trajectory
• Objections & rejections • Grounded Q&A            • Strategic Synthesis
• Architectural approvals • Context for Brief       • Adaptive pivots
• Rep outcome feedback    • Memory sources log      • Risk assessments
```

### The 3 Core Hindsight Primitives Used:
1. **`client.retain(bankId, content, options)`**:
   - Every meeting, call, proposal, or note is structured into durable relationship facts and committed to the client's isolated memory bank (e.g., `clientpulse-acme-corp`).
   - Human-in-the-loop feedback (`[Helpful]` / `[Not Helpful]`) is retained as corrective rules for future reasoning.
2. **`client.recall(bankId, query, options)`**:
   - Sub-100ms retrieval of historical objections, past commitments, and successful approaches.
   - Grounded Q&A in the Copilot chat with zero hallucination.
3. **`client.reflect(bankId, query, options)`**:
   - Synthesizes strategic conclusions: *"How should we approach the next meeting based on past outcomes and client feedback?"*

---

## 3. Architecture & Data Model

```
clientpulse-ai/
├── client/                      # React 18 + Vite + Tailwind CSS Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx             # Live Hindsight status & Demo Trigger
│   │   │   ├── Dashboard.tsx          # Client cards & deal metrics
│   │   │   ├── ClientWorkspace.tsx    # Header & 5 functional tabs
│   │   │   ├── InteractionsTimeline.tsx# Log interactions & live retain
│   │   │   ├── AIAssistant.tsx        # Grounded chat with memory sources
│   │   │   ├── MeetingBriefView.tsx   # Executive Briefing & feedback loop
│   │   │   ├── MemoryPanel.tsx        # Visual Hindsight entity inspector
│   │   │   ├── DemoModal.tsx          # 60-Second Guided Hackathon Demo
│   │   │   ├── FeedbackModal.tsx      # Outcome learning loop
│   │   │   └── Toast.tsx              # Reactive notifications
│   │   ├── lib/api.ts                 # Typed REST Client
│   │   └── types/index.ts
│   └── package.json
│
├── server/                      # Express + Node.js + TypeScript Backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── hindsightService.ts    # Official HindsightClient SDK logic
│   │   │   ├── llmService.ts          # Groq SDK / Grounded reasoning
│   │   │   └── clientService.ts       # Orchestration layer
│   │   ├── controllers/clientController.ts
│   │   ├── routes/clientRoutes.ts
│   │   ├── data/store.ts              # Lightweight persistent store
│   │   ├── seed/seedData.ts           # Idempotent seeding mechanism
│   │   └── index.ts                   # Express server entrypoint
│   └── package.json
│
├── .env.example
├── .env
├── README.md
└── package.json
```

### Memory Bank Isolation
To prevent cross-tenant data leakage, each client account receives an isolated memory bank:
- Acme Corp: `clientpulse-acme-corp`
- TechNova: `clientpulse-technova`
- GreenGrid: `clientpulse-greengrid`

---

## 4. Setup & Running Locally

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **npm**: v9+

### 1. Clone & Install Dependencies

```bash
# From workspace root
cd clientpulse-ai

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
cd ..
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```env
# Vectorize Hindsight Cloud Configuration
# Register at https://ui.hindsight.vectorize.io (Use promo code MEMHACK99 for $50 free credits)
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=
HINDSIGHT_BANK_PREFIX=clientpulse

# LLM Configuration (Groq recommended for high-speed hackathon demos)
# Get a free key at https://groq.com
LLM_API_KEY=
LLM_MODEL=llama-3.3-70b-versatile

# Server Port
PORT=5000
```

> **Note on Demo Mode**: If `HINDSIGHT_API_KEY` or `LLM_API_KEY` are not set, the application operates seamlessly in **Demo / Fallback Mode**. The built-in memory engine handles all `retain()`, `recall()`, and `reflect()` operations locally so your hackathon presentation never fails due to network dropouts or exhausted credits.

### 3. Seed Initial Demo Data

```bash
cd server
npm run seed
```

This idempotently seeds **Acme Corp** with 5 historical interactions:
1. Initial discovery: Cloud migration interest, security concern, budget ~₹20 lakh.
2. Proposal rejection: Rejected first proposal due to generic pricing; liked three-phase plan.
3. Security review: Requested detailed HIPAA/SOC2 architecture diagrams.
4. Timeline requirements: Stressed predictable, zero-downtime milestones.
5. Positive feedback: Approved three-phase migration approach with sandbox isolation.

### 4. Start the Application

Open two terminal windows:

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite UI runs on http://localhost:3000
```

Open `http://localhost:3000` in your browser.

---

## 5. Official REST API Specification

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns backend health, Hindsight connection status, and LLM provider |
| `GET` | `/api/clients` | List all enterprise clients and their interaction counts |
| `GET` | `/api/clients/:id` | Fetch specific client details |
| `GET` | `/api/clients/:id/interactions` | Fetch historical timeline of meetings, calls, proposals |
| `POST` | `/api/clients/:id/interactions` | Add new interaction & trigger Hindsight `retain()` |
| `POST` | `/api/clients/:id/chat` | Ask relationship copilot questions grounded in Hindsight `recall()` |
| `POST` | `/api/clients/:id/meeting-brief` | Synthesize meeting brief via Hindsight `recall()` + `reflect()` |
| `GET` | `/api/clients/:id/memory` | Visual entity inspection of the client's memory bank |
| `POST` | `/api/clients/:id/feedback` | Record `[Helpful]` / `[Not Helpful]` feedback and retain critique |
| `POST` | `/api/seed` | Idempotent baseline re-seeding |

---

## 6. 🏆 The 2–3 Minute Hackathon Demo Script (Judge Walkthrough)

Follow this exact flow during your judging presentation for maximum points:

### Minute 0:00 – The Problem (30s)
> *"Judges, enterprise sales reps waste hours digging through old emails and CRM notes before meetings. Normal AI chatbots are stateless—they treat every meeting like day one. ClientPulse AI uses Vectorize Hindsight as a long-term memory layer so the AI remembers past objections, what worked, and gets smarter over time."*

### Minute 0:30 – Step 1: Client Overview & Grounded Memory (45s)
1. Click **Acme Corp** (Rahul Sharma, Healthcare Technology).
2. Show the **Interactions Timeline**: Point out that Acme previously rejected a proposal because the pricing was too generic, but approved a three-phase migration framework.
3. Switch to the **AI Assistant** tab and click the prompt:  
   *"Why did Acme reject our previous proposal?"*
4. Highlight the **"🧠 Memory consulted"** badge: The AI responds accurately from Hindsight memory with zero hallucination. Expand the **"Based on memory"** accordion to show the exact source records.

### Minute 1:15 – Step 2: The Meeting Brief (30s)
1. Click the **"Prepare Me for Meeting"** button.
2. Show the generated **Meeting Brief**:
   - Key Priorities: HIPAA Security, Zero Downtime.
   - What to Avoid: Generic pricing decks.
   - Strategy: Lead with the three-phase plan, then address security before custom pricing.

### Minute 1:45 – Step 3: The Learning Demonstration (45s)
1. Go to **Interactions** and click **"+ Add Interaction"** (or use the top-right **"Hackathon Demo Mode"** button).
2. Enter:
   - Type: `Call`
   - Title: `Urgent Timeline Pivot`
   - Content: *"Acme now says implementation time is their biggest concern. They want the migration completed within 90 days."*
3. Click **"Save & Retain Memory"**. Notice the toast: *"Memory Retained in Hindsight"*.
4. Now click **"Meeting Brief"** and hit **"Re-Generate Brief"**:
   - **Point out the change**: The brief has dynamically adapted!
   - Key Priority #1 is now: **⚡ Accelerated 90-Day Go-Live Window**.
   - The strategy pivoted from a standard rollout to an accelerated milestone plan.

### Minute 2:30 – Step 4: The Feedback Learning Loop (30s)
1. Click **"Not Helpful"** on the brief.
2. In the modal, explain: *"The recommendation focused too much on pricing; the client was actually more concerned about implementation time."*
3. Click **"Retain Feedback to Memory"**.
4. Switch to the **Hindsight Memory Panel**: Point out the **Recent Agent Learnings** card reflecting this feedback!
5. Conclude: *"The agent didn't just store text—it internalized the outcome and adapted its future reasoning. That is AI powered by Hindsight."*

---

## 7. Official Resources & References

- **Hindsight Documentation**: [https://hindsight.vectorize.io/](https://hindsight.vectorize.io/)
- **Hindsight GitHub**: [https://github.com/vectorize-io/hindsight](https://github.com/vectorize-io/hindsight)
- **Hindsight Cloud**: [https://ui.hindsight.vectorize.io](https://ui.hindsight.vectorize.io) *(Promo code: `MEMHACK99` for $50 free credits)*
- **Groq LLM Platform**: [https://groq.com](https://groq.com)

---

## 8. License

MIT License. Developed for HackwithHyderabad 3.0.
