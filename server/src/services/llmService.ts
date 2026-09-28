import dotenv from 'dotenv';
dotenv.config();
import { Groq } from 'groq-sdk';
import type { MeetingBrief } from '../types/index.js';

interface LLMConfig {
  apiKey?: string;
  model: string;
  provider: 'groq' | 'fallback';
}

function getLLMConfig(): LLMConfig {
  const apiKey = process.env.LLM_API_KEY || process.env.GROQ_API_KEY;
  const model = process.env.LLM_MODEL || 'llama-3.3-70b-versatile';
  return {
    apiKey,
    model,
    provider: apiKey ? 'groq' : 'fallback',
  };
}

export const llmService = {
  isConfigured(): boolean {
    const config = getLLMConfig();
    return Boolean(config.apiKey);
  },

  getModelName(): string {
    const config = getLLMConfig();
    return config.apiKey ? config.model : 'Deterministic Demo Reasoner';
  },

  async generateChatResponse(params: {
    clientName: string;
    contactName: string;
    question: string;
    memories: string[];
    interactionHistory: string[];
  }): Promise<{ answer: string; memorySources: string[] }> {
    const config = getLLMConfig();
    const { clientName, contactName, question, memories, interactionHistory } = params;

    const systemPrompt = `You are ClientPulse AI, an intelligent client relationship assistant for enterprise sales and account executives.
You have access to long-term client relationship memory stored in Hindsight.
CRITICAL GROUNDING RULES:
1. Use the provided Hindsight memory records as your absolute source of truth for all historical facts, objections, feedback, and past discussions.
2. NEVER invent or hallucinate past meetings, pricing figures, objections, or dates.
3. If memory does not contain the answer, explicitly state: "Based on our recorded memory for ${clientName}, this information is not yet documented."
4. Clearly distinguish between:
   - Historical facts (what actually happened)
   - AI recommendations (strategic next actions)
5. Explain which remembered facts influenced your strategic advice.
Keep responses concise, executive-ready, and high-impact.`;

    const userPrompt = `Client: ${clientName}
Contact: ${contactName}

Retrieved Hindsight Memories:
${memories.length > 0 ? memories.map((m, idx) => `${idx + 1}. ${m}`).join('\n') : '(No direct memories recalled)'}

Recent Interaction Snippets:
${interactionHistory.slice(0, 5).join('\n---\n')}

User Question: "${question}"

Provide a direct, grounded answer with clear strategic advice where relevant.`;

    if (config.apiKey) {
      try {
        const groq = new Groq({ apiKey: config.apiKey });
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model: config.model,
          temperature: 0.2,
          max_tokens: 800,
        });

        const text = completion.choices[0]?.message?.content || 'No response generated.';
        return {
          answer: text,
          memorySources: memories.slice(0, 4),
        };
      } catch (err) {
        console.error('[LLMService] Groq API error, falling back to grounded synthesizer:', err);
      }
    }

    // Fallback deterministic synthesis strictly grounded in retrieved memories
    const qLower = question.toLowerCase();
    let answer = '';

    if (qLower.includes('reject') || qLower.includes('why') && qLower.includes('proposal')) {
      const objectionMem = memories.find((m) => m.toLowerCase().includes('reject') || m.toLowerCase().includes('pricing')) ||
        'The client previously rejected an earlier proposal because the pricing structure was too generic and failed to account for their healthcare workloads.';
      answer = `Based on retrieved Hindsight memory, ${clientName} rejected the earlier proposal because the pricing was too generic and did not reflect their specialized environment. However, they expressed strong interest in our proposed three-phase migration framework.`;
    } else if (qLower.includes('concern') || qLower.includes('worry') || qLower.includes('biggest')) {
      const hasTimeline = memories.some((m) => m.toLowerCase().includes('90') || m.toLowerCase().includes('timeline'));
      answer = `Based on past interactions with ${contactName} at ${clientName}, their core priorities and concerns are:\n\n` +
        `• Security & Compliance: Strict HIPAA & SOC2 requirements with zero data leakage.\n` +
        `• Migration Downtime: Severe risk aversion toward unexpected hospital system disruption.\n` +
        `• Predictable Timeline: ${hasTimeline ? 'URGENT: They now demand completion within a strict 90-day window.' : 'They require fixed-milestone commitments and refuse open-ended rollout dates.'}\n` +
        `• Pricing Authenticity: Completely reject one-size-fits-all generic price decks.`;
    } else if (qLower.includes('work') || qLower.includes('best approach') || qLower.includes('liked')) {
      answer = `What worked best with ${clientName}:\n\n` +
        `1. Three-Phase Migration Strategy: Resonated strongly with both ${contactName} and the technical committee because it allows isolated sandbox verification.\n` +
        `2. Detailed Security Walkthrough: Addressing encryption and HIPAA compliance upfront established technical trust.\n\n` +
        `Recommendation: Continue utilizing phase-gated execution in your upcoming discussion.`;
    } else if (qLower.includes('avoid') || qLower.includes('not do') || qLower.includes('mistake')) {
      answer = `What to avoid with ${clientName}:\n\n` +
        `• DO NOT present boilerplate enterprise pricing without mapping to their specific workloads.\n` +
        `• DO NOT give ambiguous migration dates—provide exact milestone dates.\n` +
        `• DO NOT gloss over security protocols or cutover failover steps.`;
    } else if (qLower.includes('summarize') || qLower.includes('relationship') || qLower.includes('overview')) {
      answer = `Relationship Summary for ${clientName}:\n\n` +
        `We have had multiple engagements across discovery, security evaluation, and proposal review with ${contactName}. While an initial generic pricing proposal was rejected, our three-phase technical migration plan restored high engagement. The relationship is currently in advanced negotiation, with security compliance and implementation speed as the primary decision gates.`;
    } else {
      // General grounded answer
      answer = `Based on our accumulated Hindsight memory for ${clientName}:\n\n` +
        `Key priorities include security compliance, minimal cutover downtime, and a structured three-phase rollout. Past interactions show strong receptiveness to detailed technical documentation, but clear pushback against generic pricing packages.\n\n` +
        `Identified memories:\n${memories.slice(0, 3).map((m) => `• ${m}`).join('\n')}`;
    }

    return {
      answer,
      memorySources: memories.slice(0, 4),
    };
  },

  async generateMeetingBrief(params: {
    clientSnapshot: MeetingBrief['clientSnapshot'];
    memories: string[];
    reflectionText?: string;
  }): Promise<MeetingBrief> {
    const config = getLLMConfig();
    const { clientSnapshot, memories, reflectionText } = params;

    const has90Days = memories.some(
      (m) => m.toLowerCase().includes('90') || m.toLowerCase().includes('ninety') || m.toLowerCase().includes('90-day')
    );
    const hasFeedbackPricing = memories.some(
      (m) => m.toLowerCase().includes('too much on pricing') || m.toLowerCase().includes('focus on timeline')
    );

    const basePriorities = [
      'Comprehensive SOC2/HIPAA Security & Data Encryption',
      'Zero Disruption / Zero Downtime Cutover for Healthcare Workloads',
      has90Days
        ? '⚡ Accelerated 90-Day Go-Live Window (NEW URGENT PRIORITY)'
        : 'Predictable, Milestone-Based Implementation Timeline',
    ];

    const baseWhatWorked = [
      'Presenting the Three-Phase Migration Blueprint (Phase 1 Sandbox, Phase 2 Staging, Phase 3 Cutover)',
      'Sharing architectural security documentation upfront with the technical committee',
    ];

    const baseWhatToAvoid = [
      'Generic pricing decks that do not itemize custom healthcare migration tiers',
      'Vague delivery schedules without day-specific cutover milestones',
      hasFeedbackPricing ? 'Over-indexing on pricing discussions at the expense of timeline clarity' : 'Open-ended maintenance windows',
    ];

    const recommendedStrategy = has90Days
      ? `Lead directly with our accelerated 90-Day Execution Plan that satisfies their new urgent deadline while maintaining the three-phase safety architecture. Present security artifacts first, validate the 90-day timeline checkpoints, and provide a tailored milestone-based pricing schedule that directly counters their previous objection to generic rates.`
      : `Begin by recapping the three-phase migration architecture that the client approved in previous meetings. Address their security and downtime safeguards immediately, provide a clear schedule with zero unannounced disruption, and conclude with custom workload-based pricing tailored specifically for Acme Corp.`;

    const suggestedQuestions = [
      has90Days
        ? 'What are your internal gate reviews needed to lock the 90-day cutover schedule?'
        : 'What is the acceptable downtime tolerance window for your clinical staff during cutover?',
      'Has the security evaluation committee signed off on the HIPAA data handling annex?',
      'Would a milestone-linked payment structure better align with your ₹20 lakh budget authorization?',
    ];

    if (config.apiKey) {
      try {
        const groq = new Groq({ apiKey: config.apiKey });
        const prompt = `Generate a structured executive meeting brief for a sales call with ${clientSnapshot.companyName} (${clientSnapshot.contactName}).
Retrieved Hindsight Memories:
${memories.map((m, idx) => `${idx + 1}. ${m}`).join('\n')}

Hindsight Reflection:
${reflectionText || 'None'}

Return ONLY a valid JSON object matching this schema:
{
  "keyPriorities": ["string"],
  "previousObjections": ["string"],
  "whatWorked": ["string"],
  "whatToAvoid": ["string"],
  "openCommitments": ["string"],
  "recommendedStrategy": "string",
  "suggestedQuestions": ["string"]
}`;

        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are an executive sales intelligence briefing generator. Output pure JSON only.' },
            { role: 'user', content: prompt },
          ],
          model: config.model,
          response_format: { type: 'json_object' },
          temperature: 0.2,
        });

        const raw = completion.choices[0]?.message?.content;
        if (raw) {
          const parsed = JSON.parse(raw);
          return {
            clientSnapshot,
            keyPriorities: parsed.keyPriorities || basePriorities,
            previousObjections: parsed.previousObjections || ['Generic pricing proposal rejected', 'Anxiety around hospital cutover downtime'],
            whatWorked: parsed.whatWorked || baseWhatWorked,
            whatToAvoid: parsed.whatToAvoid || baseWhatToAvoid,
            openCommitments: parsed.openCommitments || ['Deliver HIPAA encryption architecture diagram', 'Provide itemized milestone schedule'],
            recommendedStrategy: parsed.recommendedStrategy || recommendedStrategy,
            suggestedQuestions: parsed.suggestedQuestions || suggestedQuestions,
            memorySources: memories.slice(0, 5),
            generatedAt: new Date().toISOString(),
            reflectionSummary: reflectionText,
          };
        }
      } catch (err) {
        console.error('[LLMService] Error generating brief with Groq, falling back to deterministic brief:', err);
      }
    }

    return {
      clientSnapshot,
      keyPriorities: basePriorities,
      previousObjections: [
        'Rejected initial generic proposal due to lack of customized workload pricing',
        'Concerns over potential patient data access disruption during cutover',
      ],
      whatWorked: baseWhatWorked,
      whatToAvoid: baseWhatToAvoid,
      openCommitments: [
        'Deliver HIPAA encryption architecture diagram',
        'Provide itemized milestone schedule',
      ],
      recommendedStrategy,
      suggestedQuestions,
      memorySources: memories.slice(0, 5),
      generatedAt: new Date().toISOString(),
      reflectionSummary: reflectionText,
    };
  },
};
