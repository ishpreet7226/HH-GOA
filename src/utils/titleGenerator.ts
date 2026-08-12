// Deterministic builder title generator
// Maps role/stack keywords → fun HH Goa builder titles

const titleMap: { keywords: string[]; title: string; sub: string }[] = [
  { keywords: ['ai engineer', 'ml engineer', 'machine learning', 'llm', 'model'], title: 'THE MODEL WHISPERER', sub: 'Tamer of Tensors' },
  { keywords: ['full stack', 'fullstack', 'full-stack'], title: 'THE SHIP-IT MACHINE', sub: 'Builder of Worlds' },
  { keywords: ['ai', 'artificial intelligence', 'agent', 'agents', 'agentic'], title: 'AGENT ARCHITECT', sub: 'Orchestrator of Chaos' },
  { keywords: ['design', 'designer', 'ui', 'ux', 'ui/ux', 'figma', 'product design'], title: 'PIXEL ALCHEMIST', sub: 'Sorcerer of Screens' },
  { keywords: ['frontend', 'front end', 'front-end', 'react', 'vue', 'svelte', 'nextjs'], title: 'DOM SORCERER', sub: 'Wizard of the Web' },
  { keywords: ['backend', 'back end', 'back-end', 'api', 'server', 'infrastructure', 'devops', 'platform'], title: 'THE PLUMBER OF THE FUTURE', sub: 'Keeper of Uptime' },
  { keywords: ['founder', 'ceo', 'co-founder', 'cofounder', 'startup', 'entrepreneur'], title: 'THE ZERO-TO-ONE RIDER', sub: 'Builder of Empires' },
  { keywords: ['product', 'pm', 'product manager', 'product management'], title: 'THE ROADMAP REBEL', sub: 'Prioritiser of Dreams' },
  { keywords: ['data', 'data scientist', 'data science', 'analyst', 'analytics'], title: 'THE SIGNAL HUNTER', sub: 'Tamer of Datasets' },
  { keywords: ['blockchain', 'web3', 'crypto', 'solidity', 'defi'], title: 'CHAIN APOSTLE', sub: 'Heretic of Consensus' },
  { keywords: ['security', 'hacker', 'pen test', 'pentest', 'cybersecurity', 'infosec'], title: 'THE GHOST IN THE SHELL', sub: 'Keeper of Secrets' },
  { keywords: ['mobile', 'ios', 'android', 'flutter', 'react native', 'swift', 'kotlin'], title: 'APP WHISPERER', sub: 'Conjuror of Apps' },
  { keywords: ['hardware', 'embedded', 'iot', 'robotics', 'electronics', 'firmware'], title: 'CIRCUIT BENDER', sub: 'Sculptor of Electrons' },
  { keywords: ['game', 'gaming', 'unity', 'unreal', 'game dev'], title: 'THE LEVEL ARCHITECT', sub: 'Cartographer of Worlds' },
  { keywords: ['student', 'intern', 'junior', 'fresher', 'learning', 'newbie'], title: 'THE HORIZON CHASER', sub: 'First of Many Ships' },
  { keywords: ['researcher', 'phd', 'science', 'scientist'], title: 'THE PAPER BURNER', sub: 'Archivist of Ideas' },
  { keywords: ['marketing', 'growth', 'seo', 'content', 'brand'], title: 'THE NARRATIVE CRAFTER', sub: 'Spinner of Stories' },
];

const fallbackTitles = [
  { title: 'THE MIDNIGHT BUILDER', sub: 'Forger of Tomorrow' },
  { title: 'THE SERIAL SHIPPER', sub: 'Launcher of Things' },
  { title: 'THE CODE SURFER', sub: 'Rider of Waves' },
  { title: 'THE GOA DISRUPTOR', sub: 'Chaos Agent at Large' },
  { title: 'THE SILENT KILLER', sub: 'Builder of Legends' },
];

function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit int
  }
  return Math.abs(hash);
}

export function generateBuilderTitle(role: string, name: string = ''): { title: string; sub: string } {
  const input = (role + name).toLowerCase().trim();
  const roleLower = role.toLowerCase().trim();

  // Find best match
  for (const entry of titleMap) {
    for (const kw of entry.keywords) {
      if (roleLower.includes(kw)) {
        return { title: entry.title, sub: entry.sub };
      }
    }
  }

  // Deterministic fallback based on hash
  const hash = djb2Hash(input || 'builder');
  const idx = hash % fallbackTitles.length;
  return fallbackTitles[idx];
}

export function generateFrameId(name: string, role: string): string {
  const hash = djb2Hash((name + role + Date.now()).slice(0, 20));
  const id = hash.toString(36).toUpperCase().slice(0, 6);
  return `GOA-${id}`;
}
