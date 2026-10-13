import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { YOUTUBE_MASTER_KNOWLEDGE_BASE } from '../src/services/youtubeMasterKnowledgeBase';

dotenv.config();

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({ apiKey });
}

export interface FramePayload {
  timestamp: string;
  seconds: number;
  dataUrl: string;
}

export async function runGeminiVideoAudit(params: {
  videoTitle: string;
  durationSec: number;
  durationFormatted: string;
  strictnessMode: 'STANDARD' | 'PARANOID_ZERO_RISK';
  frames: FramePayload[];
}) {
  const ai = getAiClient();

  const policyContext = YOUTUBE_MASTER_KNOWLEDGE_BASE.map(
    (p) => `[${p.category} - ${p.title}]: ${p.shortSummary}. Detection heuristics: ${p.detectionMechanisms.join(' ')}. Ingestion rule: ${p.publicVsUnlistedVsPrivateBehavior}. Rules: ${p.fullPolicyRules.join(' ')}`
  ).join('\n\n');

  const promptText = `
You are the world's most advanced YouTube Algorithmic Content Moderation & Nudity/Strike Prevention Auditor.
You analyze video content 10x deeper than YouTube's internal automated classifier bot.

COMPREHENSIVE AUDIT POLICY REPOSITORY:
${policyContext}

VIDEO AUDIT TASK:
Video Title: "${params.videoTitle}"
Duration: ${params.durationFormatted} (${params.durationSec} seconds)
Strictness Setting: ${
    params.strictnessMode === 'PARANOID_ZERO_RISK'
      ? 'PARANOID ZERO-RISK (+20% strict buffer: proactively flag borderline frames, ambiguous props, and opening profanity to ensure 100% channel safety)'
      : 'STANDARD YOUTUBE INGESTION MODERATION'
  }

EVALUATION & MODERATION RULES:
1. Ingestion Protocol: YouTube algorithms inspect 100% of uploaded files instantly, even in draft, Unlisted, or Private modes.
2. Sexual Content & Nudity Inspection: Zero tolerance for explicit sexual content, nudity, unclothed bodies (boys or girls showing private parts like breasts, genitalia, or explicit exposure). Any frame showing bare private areas without educational/artistic context must be marked as CRITICAL_STRIKE under YouTube's Nudity and Sexual Content Policy.
3. Child Safety: Zero tolerance for minors near sharp cutlery, flame, high-elevation drops, or distress pranks.
4. First 7-Second Rule: Opening hook (00:00 - 00:07) must be completely free of vulgar profanity, intense blood, or shock value to maintain advertiser monetization (Green Dollar).
5. Provide EXACT timeline cut/blur recommendations for video editing suites (CapCut, Premiere Pro, DaVinci Resolve).

Sequential Overlapping 2-5s Clip Frames Analyzed:
${params.frames.map((f, i) => `Frame ${i + 1} at timestamp ${f.timestamp}`).join(', ')}

Return a strict JSON response adhering EXACTLY to this schema:
{
  "overallRiskScore": <number 0-100, where 0 is 100% pristine safe and 100 is immediate severe strike hazard>,
  "safetyGrade": <"SAFE_TO_UPLOAD" | "MONETIZATION_AT_RISK" | "HIGH_STRIKE_RISK">,
  "strikeProbabilityPct": <number 0-100>,
  "demonetizationProbabilityPct": <number 0-100>,
  "first7SecondsStatus": <"COMPLIANT" | "CAUTION" | "FLAGGED">,
  "totalIssuesCount": <number>,
  "criticalIssuesCount": <number>,
  "warningsCount": <number>,
  "summaryVerdictEn": "<2 crisp professional English sentences summarizing the automated ingestion verdict and risk standing>",
  "summaryVerdictUrdu": "<Same 2 sentences in clear professional English>",
  "timelineViolations": [
    {
      "id": "viol-1",
      "timestampStart": "<e.g. 00:04>",
      "timestampEnd": "<e.g. 00:08>",
      "secondsStart": <number>,
      "secondsEnd": <number>,
      "severity": "<CRITICAL_STRIKE" | "DEMONETIZATION_WARNING" | "MILD_CAUTION">,
      "category": "<CHILD_SAFETY" | "SEXUAL_CONTENT" | "DANGEROUS_CONTENT" | "VIOLENCE_GRAPHIC" | "HATE_SPEECH_HARASSMENT" | "ADVERTISER_FRIENDLY">,
      "categoryLabel": "<Category display title, e.g. Sexual Content & Nudity Policy>",
      "title": "<Concise issue title, e.g. Unclothed Exposure / Private Parts Violation>",
      "youtubePolicyRef": "<Official YouTube guideline policy name>",
      "descriptionEn": "<Detailed explanation of why YouTube automated bots flag this scene>",
      "descriptionUrdu": "<Same detailed explanation in English>",
      "actionableFix": {
        "actionType": "<TRIM_CLIP" | "BLUR_AREA" | "MUTE_AUDIO" | "ADD_DISCLAIMER" | "AGE_GATE">,
        "instructionsEn": "<Exact steps to remediate in video editor, e.g. Blur or trim 00:04 to 00:08>",
        "instructionsUrdu": "<Same exact steps in English>",
        "suggestedCut": "<e.g. Cut 00:04 - 00:08 (4 seconds)>"
      }
    }
  ],
  "categoryScores": {
    "childSafety": <0-100>,
    "violenceGore": <0-100>,
    "harmfulDangerous": <0-100>,
    "hateHarassment": <0-100>,
    "sexualContent": <0-100>,
    "advertiserSuitability": <0-100>
  },
  "recommendedActionsList": [
    "<Concise actionable remediation point 1 in English>",
    "<Concise actionable remediation point 2 in English>"
  ],
  "safeCutSummary": {
    "originalDuration": "${params.durationFormatted}",
    "safeDurationAfterCuts": "<Estimated safe duration after recommended trims, e.g. 00:24>",
    "removedSecondsTotal": <number of seconds recommended to cut>
  }
}
`;

  const contents: any[] = [{ text: promptText }];

  for (const f of params.frames.slice(0, 10)) {
    if (f.dataUrl) {
      const base64Data = f.dataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
      contents.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Data,
        },
      });
    }
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.15,
    },
  });

  const rawText = response.text || '{}';
  const parsed = JSON.parse(rawText);
  return parsed;
}

export async function runGeminiAppealGenerator(params: {
  videoTitle: string;
  channelNiche?: string;
  allegedViolation: string;
  contextDescription: string;
  timestamps: string;
}) {
  const ai = getAiClient();

  const prompt = `
You are a senior YouTube Partner Support & Policy Operations legal specialist.
Generate an official, high-conviction, professional YouTube Community Guidelines Counter-Appeal Letter in pure English for submission inside YouTube Studio.

CASE DETAILS:
Video Title: "${params.videoTitle}"
Channel Category: "${params.channelNiche || 'General Creator'}"
Alleged Policy Infraction: "${params.allegedViolation}"
Creator's Factual Defense: "${params.contextDescription}"
Flagged Timestamp Range: "${params.timestamps}"

APPEAL PRINCIPLES:
1. Ground the argument in YouTube's official EDSA (Educational, Documentary, Scientific, or Artistic) Exception Framework (EDSA Section 4).
2. Adhere strictly to the YouTube Studio 800-character description limit so it can be pasted directly into the appeal form.
3. Use a respectful, policy-fluent, formal tone that addresses the Trust & Safety manual review team.
4. Point out the specific false-positive classifier heuristic that was triggered and why the scene is safe.

Format output as a ready-to-copy appeal statement in English under 800 characters, followed by key evidence points.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      temperature: 0.2,
    },
  });

  return {
    appealText: response.text || '',
  };
}
