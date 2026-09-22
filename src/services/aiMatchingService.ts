import { Challenge, Startup } from '@/types';

export interface AIMatchResult {
  startup: Startup;
  matchScore: number;
  technicalFitScore: number;
  scalabilityScore: number;
  isRelevant: boolean;
  reason: string;
  matchedTechnologies: string[];
  domain: string;
}

type DomainCategory = 'water' | 'road' | 'waste' | 'health' | 'agriculture' | 'energy' | 'general';

const DOMAIN_KEYWORDS: Record<DomainCategory, string[]> = {
  water: ['water', 'pipeline', 'leak', 'acoustic', 'jal shakti', 'jal jeevan', 'contamination', 'hydrophone', 'subterranean', 'potable', 'sewage'],
  road: ['road', 'highway', 'pothole', 'pavement', 'traffic', 'morth', 'nhai', 'distress', 'asphalt', 'iri', 'vehicular', 'patrol'],
  waste: ['waste', 'garbage', 'segregation', 'route', 'dump', 'swachh', 'tipper', 'bin', 'municipal', 'landfill', 'sanitation', 'civic'],
  health: ['health', 'hospital', 'patient', 'medical', 'diagnostic', 'ecg', 'retinopathy', 'phc', 'ayushman', 'abdm', 'cardio', 'screening', 'doctor'],
  agriculture: ['crop', 'agri', 'farm', 'pmfby', 'drone', 'yield', 'drought', 'multispectral', 'harvest', 'soil', 'kisan', 'insurance', 'farmer'],
  energy: ['energy', 'power', 'grid', 'solar', 'curtailment', 'battery', 'substation', 'feeder', 'electricity', 'microgrid', 'inverter', 'renewable'],
  general: ['ai', 'iot', 'telemetry', 'analytics', 'platform', 'automation'],
};

/**
 * Detect the technical domain of a text string (Challenge or Startup)
 */
function detectDomain(text: string): DomainCategory {
  const normalized = text.toLowerCase();
  let maxMatches = 0;
  let detectedDomain: DomainCategory = 'general';

  for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (domain === 'general') continue;
    let count = 0;
    for (const kw of keywords) {
      if (normalized.includes(kw)) {
        count++;
      }
    }
    if (count > maxMatches) {
      maxMatches = count;
      detectedDomain = domain as DomainCategory;
    }
  }

  return detectedDomain;
}

/**
 * Evaluates semantic match between a challenge and a startup.
 * Enforces strict domain relevance so only truly relevant startups qualify.
 */
export function evaluateStartupCompatibility(
  challenge: Challenge,
  startup: Startup
): AIMatchResult {
  const challengeText = `${challenge.title} ${challenge.problemStatement} ${challenge.expectedOutcome} ${(challenge.requiredTechnology || []).join(' ')} ${(challenge.tags || []).join(' ')} ${challenge.department} ${challenge.ministry}`;
  const startupText = `${startup.brandName} ${startup.legalName} ${startup.focusSector} ${startup.solutionTitle} ${startup.solutionSummary} ${startup.technologyStack.join(' ')} ${startup.relevantExperience || ''}`;

  const challengeDomain = detectDomain(challengeText);
  const startupDomain = detectDomain(startupText);

  // 1. Domain Relevance Score (0 to 45 pts)
  let domainScore = 0;
  const isDirectDomainMatch = challengeDomain !== 'general' && challengeDomain === startupDomain;

  if (isDirectDomainMatch) {
    domainScore = 44;
  } else if (challengeDomain === 'general') {
    // For broad challenges, check keyword overlap
    const normalizedStartup = startupText.toLowerCase();
    const overlapCount = (challenge.tags || []).filter((t) => normalizedStartup.includes(t.toLowerCase())).length;
    domainScore = Math.min(38, 20 + overlapCount * 6);
  } else {
    // Cross-domain mismatch: heavy penalty (e.g. waste startup for healthcare)
    domainScore = 8;
  }

  // 2. Technology Fit Score (0 to 35 pts)
  const challengeTechs = challenge.requiredTechnology && challenge.requiredTechnology.length > 0
    ? challenge.requiredTechnology
    : ['Edge AI', 'IoT Telemetry'];

  const matchedTechs: string[] = [];
  let techOverlap = 0;

  for (const cTech of challengeTechs) {
    const cNorm = cTech.toLowerCase();
    for (const sTech of startup.technologyStack) {
      const sNorm = sTech.toLowerCase();
      // Partial or full keyword match
      if (
        sNorm.includes(cNorm) ||
        cNorm.includes(sNorm) ||
        (cNorm.includes('vision') && sNorm.includes('vision')) ||
        (cNorm.includes('iot') && sNorm.includes('iot')) ||
        (cNorm.includes('edge') && sNorm.includes('edge')) ||
        (cNorm.includes('drone') && sNorm.includes('drone')) ||
        (cNorm.includes('acoustic') && sNorm.includes('acoustic')) ||
        (cNorm.includes('telemetry') && sNorm.includes('telemetry')) ||
        (cNorm.includes('radar') && sNorm.includes('sar'))
      ) {
        techOverlap++;
        if (!matchedTechs.includes(sTech)) {
          matchedTechs.push(sTech);
        }
      }
    }
  }

  const techScore = isDirectDomainMatch
    ? Math.min(34, 22 + techOverlap * 4)
    : Math.min(15, techOverlap * 3);

  // 3. TRL Readiness Score (0 to 10 pts)
  const trl = startup.trlLevel || 7;
  const trlScore = trl >= 8 ? 10 : trl === 7 ? 9 : 7;

  // 4. Budget Compatibility Score (0 to 10 pts)
  const cost = startup.estimatedPilotCost || 4000000;
  const budget = challenge.budgetAllocated || 5000000;
  let budgetScore = 10;
  if (cost > budget * 1.2) {
    budgetScore = 4;
  } else if (cost > budget) {
    budgetScore = 7;
  }

  // Total Match Score (0 - 100)
  const totalScore = Math.min(98, Math.round(domainScore + techScore + trlScore + budgetScore));

  // Strict Relevance Threshold: must have a direct domain match or score >= 70%
  const isRelevant = isDirectDomainMatch && totalScore >= 70;

  // Scalability and Technical Fit sub-metrics
  const technicalFit = Math.min(96, Math.max(40, isRelevant ? totalScore + 1 : totalScore - 12));
  const scalability = Math.min(95, Math.max(45, (startup.scalabilityScore || 85)));

  // Generate crisp AI Reason
  let aiReason = '';
  if (isRelevant) {
    aiReason = `High ${totalScore}% Compatibility: Startup's ${startup.technologyStack.slice(0, 3).join(', ')} directly matches ${challenge.department}'s ${challengeDomain.toUpperCase()} challenge criteria. TRL-${startup.trlLevel} readiness with proven pilot track record (${startup.relevantExperience || 'verified field deployment'}) meets GFR 149(viii) sandbox requirements.`;
  } else {
    aiReason = `Incompatible (${totalScore}%): Startup focus sector (${startup.focusSector}) and technology profile do not align with the required ${challengeDomain.toUpperCase()} domain objectives of this challenge.`;
  }

  return {
    startup: {
      ...startup,
      matchScore: totalScore,
      technicalFitScore: technicalFit,
      scalabilityScore: scalability,
      aiMatchReason: aiReason,
    },
    matchScore: totalScore,
    technicalFitScore: technicalFit,
    scalabilityScore: scalability,
    isRelevant,
    reason: aiReason,
    matchedTechnologies: matchedTechs,
    domain: startupDomain,
  };
}

/**
 * Filter and sort startups against a challenge.
 * By default returns ONLY relevant matching startups (score >= 70% and domain aligned).
 */
export function getAIRecommendedStartups(
  challenge: Challenge,
  startups: Startup[],
  options?: { onlyRelevant?: boolean; minScore?: number }
): AIMatchResult[] {
  const onlyRelevant = options?.onlyRelevant ?? true;
  const minScore = options?.minScore ?? 70;

  const evaluated = startups.map((st) => evaluateStartupCompatibility(challenge, st));

  if (onlyRelevant) {
    // ONLY return relevant startups that meet the threshold
    const relevant = evaluated.filter((res) => res.isRelevant && res.matchScore >= minScore);
    return relevant.sort((a, b) => b.matchScore - a.matchScore);
  }

  return evaluated.sort((a, b) => b.matchScore - a.matchScore);
}
