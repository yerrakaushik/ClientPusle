import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import clientRoutes from './routes/clientRoutes.js';
import { hindsightService } from './services/hindsightService.js';
import { llmService } from './services/llmService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server dir or root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', clientRoutes);

// Root greeting & status
app.get('/', (req, res) => {
  res.json({
    app: 'ClientPulse AI API',
    tagline: 'Your AI client relationship memory.',
    version: '1.0.0',
    hindsight: hindsightService.getStatus(),
    llm: {
      configured: llmService.isConfigured(),
      model: llmService.getModelName(),
    },
    documentation: 'See README.md for endpoint specifications',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Server Error]:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 ClientPulse AI Server running on http://localhost:${PORT}`);
  console.log(`🧠 Hindsight Status: ${hindsightService.getStatus().isLive ? 'LIVE CLOUD' : 'DEMO/FALLBACK MODE'}`);
  console.log(`🤖 LLM Provider: ${llmService.isConfigured() ? `Groq (${llmService.getModelName()})` : 'Deterministic Grounded Mode'}`);
  console.log(`====================================================`);
});
