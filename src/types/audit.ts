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

export interface ReplacementFixDetail {
  actionRequired: 'REPLACE_AUDIO' | 'REPLACE_VIDEO_CLIP' | 'TRIM_SEGMENT' | 'BLUR_FACE_OR_OBJECT' | 'BLEEP_AUDIO';
  targetSegment: string; // e.g. "00:04 - 00:08 (4s)"
  specificAssetToReplace: string; // e.g. "Background soundtrack 'Trap Anthem #3'" or "Unlicensed TV broadcast clip"
  suggestedFreeAlternative: string; // e.g. "YouTube Audio Library: 'Sunny Horizons' (Free Commercial License) or CapCut Free Music #14"
  visualAlternativeSuggestion?: string; // e.g. "Insert royalty-free B-roll of abstract city skyline or apply 25% blur"
  editorSteps: {
    capcut: string;
    premiere: string;
    davinci: string;
  };
}

export interface EvidenceProof {
  reasonTitle: string; // e.g. "Algorithmic Content ID Fingerprint & Child Safety Proximity"
  algorithmicReason: string; // Detailed technical reason why YouTube's bot triggers
  rawEvidence: string; // Exact match hash, detected OCR text, acoustic dB burst, or frame bounding box
  evidenceType: 'VISUAL_BOUNDING_BOX' | 'ACOUSTIC_SPECTROGRAM' | 'OCR_TEXT' | 'CONTENT_ID_HASH' | 'METADATA';
  confidencePct: number; // 98
  confidenceLevel: ConfidenceLevel;
  consensusAgents: string[]; // ['VisionAgent-Alpha', 'AcousticAgent-Beta', 'PolicyConsensus-Omega']
}

export interface SceneAnalysisItem {
  sceneIndex: number;
  timestampStart: string;
  timestampEnd: string;
  secondsStart: number;
  secondsEnd: number;
  visualSummary: string;
  safetyStatus: 'SAFE' | 'CAUTION' | 'STRIKE_HAZARD';
  visualTags: string[];
  keyObjectsDetected: string[];
  flaggedRisk?: string;
  replacementAction?: string;
}

export interface AudioSegmentItem {
  segmentIndex: number;
  timestampStart: string;
  timestampEnd: string;
  secondsStart: number;
  secondsEnd: number;
  audioType: 'SPEECH' | 'BACKGROUND_MUSIC' | 'SOUND_EFFECT' | 'MIXED';
  soundtrackIdentified?: string;
  copyrightRisk: 'CLEAN_FREE' | 'CONTENT_ID_CLAIM' | 'STRIKE_RISK';
  profanityOrShockDetected: boolean;
  decibelSpikeDb?: number;
  transcriptionExcerpt?: string;
  safetyStatus: 'SAFE' | 'CAUTION' | 'STRIKE_HAZARD';
  suggestedAction?: string;
}

export interface CopyrightAnalysisResult {
  score: number; // 0-100 (100 = 100% clean)
  status: 'CLEAN' | 'CONTENT_ID_CLAIM_POSSIBLE' | 'DMCA_STRIKE_HAZARD';
  statusLabel: string;
  audioMatchesCount: number;
  visualMatchesCount: number;
  matches: Array<{
    type: 'AUDIO' | 'VISUAL' | 'REUSED_CONTENT';
    title: string;
    rightsHolder: string;
    timestamp: string;
    claimType: 'MONETIZATION_SHARE' | 'TAKEDOWN_STRIKE' | 'GEO_BLOCK';
    suggestedFix: string;
    replacementAudioOrClip?: string;
  }>;
  fairUseVerdict: 'STRONG_FAIR_USE' | 'WEAK_FAIR_USE' | 'NOT_FAIR_USE';
  fairUseReason: string;
}

export interface MonetizationAnalysisResult {
  score: number; // 0-100 (100 = full green dollar)
  dollarStatus: 'GREEN_DOLLAR' | 'YELLOW_DOLLAR' | 'RED_DOLLAR';
  statusLabel: string;
  first8SecondsClean: boolean;
  restrictedTopicsDetected: string[];
  advertiserSuitabilityTier: 'ALL_ADVERTISERS' | 'LIMITED_ADVERTISERS' | 'NO_ADS';
  recommendations: string[];
}

export interface CommunityStrikeResult {
  score: number; // 0-100 (100 = zero risk)
  strikeRisk: 'ZERO_RISK' | 'WARNING_ISSUED' | 'STRIKE_IMMINENT';
  statusLabel: string;
  flaggedCategories: string[];
  actionRequiredImmediately: boolean;
}

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
  replacementFix?: ReplacementFixDetail; // Specific audio or clip replacement instructions
  evidenceProof?: EvidenceProof; // Evidence, reason, and confidence proof
}

export interface DeepAuditPassResult {
  passNumber: 1 | 2 | 3;
  passName: string;
  passDescription: string;
  modelUsed: string;
  windowSizeSeconds: string;
  riskScore: number;
  strikeRisk: boolean;
  flaggedIssuesCount: number;
  keyFindings: string[];
  findingsUrdu: string;
  status: 'COMPLETED' | 'FLAGGED_ISSUES' | 'CLEAN';
}

export interface DeepAuditConsolidation {
  isDeepAuditEnabled: boolean;
  passes: DeepAuditPassResult[];
  consensusVerdict: 'STRIKE_CONFIRMED' | 'MONETIZATION_WARNING' | 'CLEAN_VERIFIED';
  falseNegativeCorrectionApplied: boolean;
  confidenceScore: number;
  summaryExplanationEn: string;
  summaryExplanationUrdu: string;
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
  deepAuditDetails?: DeepAuditConsolidation; // Multi-Pass Deep Audit Results
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
  // Enhanced Deep Video Analysis Fields
  sceneBreakdown?: SceneAnalysisItem[];
  audioSegmentBreakdown?: AudioSegmentItem[];
  copyrightAnalysis?: CopyrightAnalysisResult;
  monetizationAnalysis?: MonetizationAnalysisResult;
  communityStrikeResult?: CommunityStrikeResult;
  isPrivateScan?: boolean;
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


