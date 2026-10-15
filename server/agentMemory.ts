import fs from 'fs';
import path from 'path';

interface MemoryProfile {
  totalAuditsRun: number;
  falseNegativeCorrections: number;
  policyConfidenceWeights: Record<string, number>;
  acquiredHeuristicSkills: string[];
  lastCalibratedAt: string;
}

const MEMORY_FILE_PATH = path.join(process.cwd(), 'server', '.agent_memory_profile.json');

export function loadAgentMemory(): MemoryProfile {
  try {
    if (fs.existsSync(MEMORY_FILE_PATH)) {
      const raw = fs.readFileSync(MEMORY_FILE_PATH, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load agent memory profile:', e);
  }

  return {
    totalAuditsRun: 0,
    falseNegativeCorrections: 0,
    policyConfidenceWeights: {
      SEXUAL_CONTENT: 0.99,
      DANGEROUS_CONTENT: 0.95,
      VIOLENCE_GRAPHIC: 0.92,
      CHILD_SAFETY: 0.99,
      ADVERTISER_FRIENDLY: 0.88,
    },
    acquiredHeuristicSkills: [
      'Multi-window temporal chunking (1-3s, 3-6s, 6-9s)',
      'Overlapping transition frame analysis (2-4s, 4-6s)',
      'Skin-tone density clustering & adult platform fingerprinting',
    ],
    lastCalibratedAt: new Date().toISOString(),
  };
}

export function saveAgentMemory(profile: MemoryProfile): void {
  try {
    fs.writeFileSync(MEMORY_FILE_PATH, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save agent memory profile:', e);
  }
}

/**
 * Self-calibration engine: Inspects audit telemetry and dynamically updates private backend weights and skills
 */
export function selfCalibrateAgent(auditResult: {
  videoTitle: string;
  overallRiskScore: number;
  safetyGrade: string;
  violationsCount: number;
}) {
  const memory = loadAgentMemory();
  memory.totalAuditsRun += 1;

  // If a high-risk video title contains obfuscated adult keywords but risk score was borderline, self-correct
  const lowerTitle = (auditResult.videoTitle || '').toLowerCase();
  const adultKeywords = ['xhamster', 'pornhub', 'leak', 'nsfw', 'ganda', 'adult', 'private'];
  const isObfuscatedAdult = adultKeywords.some((w) => lowerTitle.includes(w));

  if (isObfuscatedAdult && auditResult.overallRiskScore < 80) {
    memory.falseNegativeCorrections += 1;
    memory.policyConfidenceWeights.SEXUAL_CONTENT = Math.min(1.0, memory.policyConfidenceWeights.SEXUAL_CONTENT + 0.01);
    if (!memory.acquiredHeuristicSkills.includes('Obfuscated adult title & screen recording detection boost')) {
      memory.acquiredHeuristicSkills.push('Obfuscated adult title & screen recording detection boost');
    }
  }

  memory.lastCalibratedAt = new Date().toISOString();
  saveAgentMemory(memory);
  return memory;
}
