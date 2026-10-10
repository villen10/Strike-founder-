export type ColorThemeId = 'YOUTUBE_STUDIO_LIGHT' | 'CRIMSON_SLATE' | 'EMERALD_OBSIDIAN' | 'SKY_NAVY';

export interface ColorTheme {
  id: ColorThemeId;
  nameEn: string;
  nameUrdu: string;
  isLight: boolean;
  bgClass: string;
  surfaceClass: string;
  borderClass: string;
  textClass: string;
  textMutedClass: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  primaryGlow: string;
  ringClass: string;
}

export type RiskSeverity = 'CRITICAL_STRIKE' | 'DEMONETIZATION_WARNING' | 'MILD_CAUTION' | 'CLEAN';

export type PolicyCategory =
  | 'CHILD_SAFETY'
  | 'DANGEROUS_CONTENT'
  | 'VIOLENCE_GRAPHIC'
  | 'HATE_SPEECH_HARASSMENT'
  | 'SEXUAL_NUDITY'
  | 'SUICIDE_SELF_HARM'
  | 'MISINFORMATION'
  | 'ADVERTISER_FRIENDLY'
  | 'COPYRIGHT_FAIR_USE';

export interface ActionableFix {
  actionType: 'TRIM_CLIP' | 'BLUR_AREA' | 'MUTE_AUDIO' | 'ADD_DISCLAIMER' | 'AGE_GATE' | 'NONE';
  instructionsEn: string;
  instructionsUrdu: string;
  suggestedCut: string;
}

export interface PolicyViolation {
  id: string;
  timestampStart: string; // e.g. "00:04"
  timestampEnd: string;   // e.g. "00:07"
  secondsStart: number;
  secondsEnd: number;
  severity: RiskSeverity;
  category: PolicyCategory;
  categoryLabel: string;
  title: string;
  youtubePolicyRef: string;
  descriptionEn: string;
  descriptionUrdu: string;
  frameSnapshot?: string;
  actionableFix: ActionableFix;
}

export interface AuditReport {
  id: string;
  videoTitle: string;
  videoDurationSec: number;
  durationFormatted: string;
  overallRiskScore: number; // 0-100 (higher = more danger)
  safetyGrade: 'SAFE_TO_UPLOAD' | 'MONETIZATION_AT_RISK' | 'HIGH_STRIKE_RISK';
  strikeProbabilityPct: number;
  demonetizationProbabilityPct: number;
  first7SecondsStatus: 'COMPLIANT' | 'CAUTION' | 'FLAGGED';
  totalIssuesCount: number;
  criticalIssuesCount: number;
  warningsCount: number;
  summaryVerdictEn: string;
  summaryVerdictUrdu: string;
  timelineViolations: PolicyViolation[];
  categoryScores: {
    childSafety: number;
    violenceGore: number;
    harmfulDangerous: number;
    hateHarassment: number;
    sexualContent: number;
    advertiserSuitability: number;
  };
  recommendedActionsList: string[];
  safeCutSummary: {
    originalDuration: string;
    safeDurationAfterCuts: string;
    removedSecondsTotal: number;
  };
  scannedAt: string;
  strictnessMode: 'STANDARD' | 'PARANOID_ZERO_RISK';
}

export interface SampleVideoOption {
  id: string;
  title: string;
  category: string;
  durationSec: number;
  durationFormatted: string;
  expectedResult: RiskSeverity;
  shortDesc: string;
  videoUrl?: string;
  thumbnailPlaceholderColor: string;
  mockReport: AuditReport;
}

