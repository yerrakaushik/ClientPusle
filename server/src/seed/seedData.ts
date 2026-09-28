import { db } from '../data/store.js';
import { hindsightService } from '../services/hindsightService.js';

async function runSeed() {
  console.log('[Seed] Initializing seed data for ClientPulse AI...');
  db.resetToDefault();

  const acmeInteractions = db.getInteractions('acme-corp');
  console.log(`[Seed] Found ${acmeInteractions.length} historical interactions for Acme Corp. Storing in Hindsight...`);

  for (const int of acmeInteractions) {
    const memory = `Client: Acme Corp\n` +
      `Contact: Rahul Sharma (Healthcare Technology)\n` +
      `Type: ${int.type.toUpperCase()}\n` +
      `Date: ${int.date}\n` +
      `Title: ${int.title}\n` +
      `Content: ${int.content}`;

    const res = await hindsightService.retain('acme-corp', memory, {
      timestamp: int.date,
      tags: [int.type, 'historical-seed'],
    });

    console.log(`  -> Retained "${int.title}" (mode: ${res.mode})`);
  }

  console.log('[Seed] Seed completed successfully!');
}

runSeed().catch((err) => {
  console.error('[Seed] Error during seeding:', err);
  process.exit(1);
});
