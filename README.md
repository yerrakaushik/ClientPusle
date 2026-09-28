# 🧠 ClientPulse AI — Enterprise Relationship Memory Engine
### *AI Agents That Learn Using Hindsight • HackwithHyderabad 3.0 (Microsoft)*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vectorize Hindsight](https://img.shields.io/badge/Memory-Hindsight_Cloud-00DF8F)](https://hindsight.vectorize.io)
[![Groq](https://img.shields.io/badge/Inference-Groq_Llama--3.3_/_GPT--OSS--120B-F55036)](https://groq.com)
[![Vite](https://img.shields.io/badge/Build-Vite_6.0-646CFF?logo=vite)](https://vitejs.dev/)

> **ClientPulse AI** is an autonomous B2B client relationship intelligence platform powered by **Vectorize Hindsight persistent cognitive memory**. Unlike stateless LLMs and naive RAG architectures that repeat costly mistakes across client meetings, ClientPulse retains experiential memories across every call, chat, and deal touchpoint—automatically recalling what strategies win, what provokes rejection, and adapting sales strategies in real time.

---

## 🌟 The Core Problem in Enterprise Client Management

In high-stakes B2B enterprise negotiations ($200k – $1.5M+ deals), deals fail not from lack of product features, but from **repeated cognitive mistakes**:
* **Repeated Landmines:** Account executives inadvertently suggest open-ended cutover timelines or generic rate decks that previously provoked furious stakeholder rejection.
* **Stateless Amnesia:** Traditional CRM chatbots treat every meeting as a blank slate. They forget subtle objections voiced 3 months ago by key decision makers.
* **Naive RAG Failure:** Standard semantic search retrieves raw document chunks without understanding *causal outcomes* (e.g. *"Why did the Technical Review Board veto our initial architecture?"*).

### 💡 The Solution: Hindsight-Powered Experiential Learning
ClientPulse leverages **Vectorize Hindsight**'s three-tier cognitive memory architecture:
1. **`Retain` (Experiential Ingestion):** Ingests raw meeting transcripts, client pushback, budget changes, and stakeholder preferences with automatic causal extraction.
2. **`Recall` (Temporal & Contextual Retrieval):** When prepping for a high-stakes call, retrieves relevant historical lessons, past objections, and proven winning strategies without hallucination.
3. **`Reflect` (High-Order Synthesis):** Synthesizes cross-meeting patterns into executive meeting briefs, risk warnings, and buying committee sentiment maps.
4. **Human-in-the-Loop Feedback:** When an account executive corrects or downvotes a proposal, the correction is permanently committed into Hindsight memory so the mistake is **never repeated**.

---

## 🚀 Key Features & Architectural Highlights

```
                      ┌──────────────────────────────────────────────┐
                      │          ClientPulse AI Frontend             │
                      │  (React 18 + Tailwind + Framer Motion)       │
                      └──────────────────────┬───────────────────────┘
                                             │ REST API
                                             ▼
                      ┌──────────────────────────────────────────────┐
                      │          Express API & Orchestrator          │
                      └──────────────┬────────────────┬──────────────┘
                                     │                │
             ┌───────────────────────┴──────┐  ┌──────┴──────────────────────┐
             │ Vectorize Hindsight Cloud    │  │ Groq High-Speed LLM Engine   │
             │ Persistent Multi-Bank Memory │  │ (openai/gpt-oss-120b)        │
             │ • retain() • recall()        │  │ • Adaptive Brief Generation  │
             │ • reflect()                  │  │ • Zero-Latency Copilot Chat  │
             └──────────────────────────────┘  └─────────────────────────────┘
```

- **Interactive Executive Dashboard:**
  - 12-month deal pipeline analytics with target comparisons and hover inspection.
  - Multi-account portfolio health overview across 5 enterprise accounts with real deal valuations ($1.4M Acme Corp, $420k TechNova, $180k GreenGrid, $540k MediCare Plus, $720k FinEdge).
- **Deep Account Workspace:**
  - **Account Dossier:** Visualizes *"What Wins with This Account"* vs. *"What Provokes Rejection"*.
  - **Buying Committee Map:** Key stakeholder alignment, rapport scores, and internal approval gates (CTIO, Technical Review Board, Procurement).
  - **Touchpoint Ledger:** Real-time logging of client calls, emails, and meetings with automatic Hindsight retention.
  - **Hindsight Copilot:** Grounded relationship AI assistant that answers nuanced questions using retained memory without hallucination.
  - **Adaptive Meeting Brief:** Executive dossier with recommended talking points, traps to avoid, and live human feedback integration.
  - **Memory Bank Visualizer:** Direct inspection of memories stored in Vectorize Hindsight Cloud with memory strength, type, and bank IDs.
- **Collapsible Enterprise Sidebar:**
  - Zero-lag responsive collapse mechanism with quick account switcher.
  - Interactive Sarah Jenkins profile modal with live cloud connectivity status and one-click baseline data reset.

---

## 🎬 4-Step Hackathon Demo Scenario

Experience the hindsight learning loop in under 90 seconds:

| Step | Action | What Happens Under the Hood |
| :--- | :--- | :--- |
| **1. Baseline Risk** | Open **Acme Corp** Account Dossier | Notice Acme previously rejected a proposal due to generic boilerplate pricing. |
| **2. Memory Recall** | Ask Copilot: *"Why did Acme reject our previous proposal?"* | The Copilot performs a Hindsight `recall()` and accurately explains the rejection without hallucination. |
| **3. Pivot Ingestion** | Log Call: *"Acme urgently needs implementation within 90 days."* | System calls Hindsight `retain()` to permanently commit the 90-day requirement to memory. |
| **4. Adaptive Brief** | Click **Generate Meeting Brief** | The brief immediately adapts talking points and timelines to prioritize the 90-day window! |

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, TailwindCSS, Lucide Icons, Framer Motion, Vite |
| **Backend** | Node.js, Express, TypeScript, tsx |
| **Cognitive Memory** | Vectorize Hindsight SDK (`@vectorize-io/hindsight-client`) |
| **LLM Inference** | Groq SDK (`groq-sdk`), Model: `openai/gpt-oss-120b` / `llama-3.3-70b` |
| **Data Persistence** | Dual-tier store (Local atomic JSON store + Live Hindsight Cloud Banks) |

---

## ⚡ Quickstart & Local Setup

### Prerequisites
* **Node.js** v18+ installed
* **npm** or **pnpm** installed
* Free API keys from [Groq](https://groq.com) and [Vectorize Hindsight](https://ui.hindsight.vectorize.io)

### 1. Clone the Repository
```bash
git clone https://github.com/yerrakaushik/ClientPusle.git
cd ClientPusle
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory (or use `.env.example` as a template):
```bash
cp server/.env.example server/.env
```

Configure your API keys:
```env
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_key_here
HINDSIGHT_BANK_PREFIX=hok

LLM_API_KEY=your_groq_api_key_here
LLM_MODEL=openai/gpt-oss-120b

PORT=5000
```

### 3. Install Dependencies
```bash
# Install root, backend, and frontend dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 4. Run the Full-Stack Application
Start both the backend API and frontend dev server:
```bash
# In terminal 1 (Backend):
cd server
npm run dev

# In terminal 2 (Frontend):
cd client
npm run dev
```

Open **`http://localhost:3000`** in your browser to experience ClientPulse AI!

---

## 🚢 Where & How to Publish This Project

You can publish and host this project completely free using the following platforms:

### 1. Deploy the Frontend (Vercel / Netlify)
* **Platform:** [Vercel](https://vercel.com) (Recommended) or [Netlify](https://netlify.com)
* **Root Directory:** `client`
* **Build Command:** `npm run build`
* **Output Directory:** `dist`
* **Environment Variables:**
  * `VITE_API_URL`: Your deployed backend URL (or relative `/api` if using reverse proxy)

### 2. Deploy the Backend API (Render / Railway / Azure)
* **Platform Option A:** [Render](https://render.com) (Free Tier Web Service)
  * **Root Directory:** `server`
  * **Build Command:** `npm install && npm run build`
  * **Start Command:** `npm start`
* **Platform Option B:** [Railway](https://railway.app) (Fastest deployment)
  * Point directly to `server` folder with Node.js template.
* **Platform Option C:** [Azure App Service / Azure Container Apps](https://azure.microsoft.com)
  * Best for Microsoft Hackathon submissions.
* **Environment Variables to add in hosting dashboard:**
  * `HINDSIGHT_BASE_URL`: `https://api.hindsight.vectorize.io`
  * `HINDSIGHT_API_KEY`: Your Vectorize Hindsight Key
  * `HINDSIGHT_BANK_PREFIX`: `hok`
  * `LLM_API_KEY`: Your Groq API Key
  * `LLM_MODEL`: `openai/gpt-oss-120b`
  * `PORT`: `5000`

---

## 🏆 Hackathon Alignment (HackwithHyderabad 3.0)

| Hackathon Criterion | Weight | How ClientPulse AI Delivers |
| :--- | :---: | :--- |
| **Innovation & Vision** | **30%** | Replaces static CRM notes with an autonomous hindsight-learning agent that continuously evolves deal strategies from historical outcomes. |
| **Hindsight Memory Centrality** | **25%** | Hindsight is not an add-on; every brief, risk signal, and response is directly generated via `retain`, `recall`, and `reflect` primitives. |
| **Technical Robustness** | **20%** | Full TypeScript contracts, robust fallback gracefully handling network hiccups, zero mock placeholders, live Groq + Hindsight cloud integration. |
| **User Experience & WOW UI** | **15%** | Dark glassmorphism, fluid interactive 12-month analytics, reactive toast memory events, and guided step-by-step walkthroughs. |
| **Business Impact** | **10%** | Prevents multi-million dollar enterprise deal churn caused by repeating known pricing and timeline landmines. |

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
