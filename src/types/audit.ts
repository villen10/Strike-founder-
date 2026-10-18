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
  | 'SEXUAL_CONTENT'
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

export type ConfidenceLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'BORDERLINE';

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
  confidencePct: number; // e.g. 96 (0-100)
  confidenceLevel: ConfidenceLevel; // 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'BORDERLINE'
  detectionReasoning?: string; // Clear explanation of why the model flagged this segment
  detectionMechanism?: string; // e.g. "Neural Vision Ingest", "Acoustic Spectral Analysis", "Kinetic Motion Vector"
  primaryIssueBoldText?: string; // Bold clear English summary in very few punchy words
  actionableFix: ActionableFix;
}

export interface AuditReport {
  id: string;
  videoTitle: string;
  aiGeneratedTitle?: string; // Smart descriptive AI title given to the video
  originalFileName?: string; // Real uploaded filename (e.g. "IMG_8291.mp4")
  videoExpiresAt?: number; // Auto-deletion timestamp (12h or 24h retention)
  isVideoDeleted?: boolean; // Video blob deleted to save storage, results kept
  retentionHours?: 12 | 24;
  videoDurationSec: number;
  durationFormatted: string;
  overallRiskScore: number; // 0-100 (higher = more danger)
  averageConfidencePct?: number; // Average detection confidence across flagged violations
  confidenceSummary?: {
    veryHighCount: number;
    highCount: number;
    mediumCount: number;
    borderlineCount: number;
  };
  safetyGrade: 'SAFE_TO_UPLOAD' | 'MONETIZATION_AT_RISK' | 'HIGH_STRIKE_RISK';
  strikeProbabilityPct: number;
  demonetizationProbabilityPct: number;
  first7SecondsStatus: 'COMPLIANT' | 'CAUTION' | 'FLAGGED';
  totalIssuesCount: number;
  criticalIssuesCount: number;
  warningsCount: number;
  summaryVerdictEn: string;
  summaryVerdictUrdu: string;
  primaryIssueBoldText?: string; // Bold easy English summary of the main violation
  mainIssueHeadline?: string; // 1 concise punchy line highlighting the main issue
  mainIssueDetail?: string; // 1-2 short clear lines explaining the finding
  mainIssueSeverity?: 'CLEAN' | 'MINOR_WARNING' | 'CRITICAL_STRIKE';
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

export type QueueTaskStatus = 'QUEUED' | 'EXTRACTING' | 'AUDITING' | 'COMPLETED' | 'ERROR';

export interface QueuedVideoTask {
  id: string;
  file?: File;
  sampleId?: string;
  title: string;
  originalFileName?: string;
  aiGeneratedTitle?: string;
  fileSizeFormatted?: string;
  videoUrl: string | null;
  videoExpiresAt?: number;
  isVideoDeleted?: boolean;
  retentionHours?: 12 | 24;
  durationSec: number;
  durationFormatted: string;
  status: QueueTaskStatus;
  progressPercent: number;
  progressStatus: string;
  extractedFrames: Array<{
    timestamp: string;
    seconds: number;
    dataUrl: string;
    clipIndex: number;
  }>;
  report?: AuditReport;
  error?: string;
  addedAt: number;
  completedAt?: number;
}


