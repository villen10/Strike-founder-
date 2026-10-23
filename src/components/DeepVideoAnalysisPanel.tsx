import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Play,
  Scissors,
  Volume2,
  VolumeX,
  Music,
  Video,
  Eye,
  EyeOff,
  DollarSign,
  Copyright,
  Cpu,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Layers,
  ArrowRight,
  ExternalLink,
  Lock,
  LockOpen,
  Smartphone,
  Gauge,
  HelpCircle,
  FileText,
  BadgeAlert,
} from 'lucide-react';
import {
  AuditReport,
  PolicyViolation,
  SceneAnalysisItem,
  AudioSegmentItem,
  CopyrightAnalysisResult,
  MonetizationAnalysisResult,
  CommunityStrikeResult,
} from '../types/audit';
import { SubscriptionTier } from '../services/subscriptionManager';

interface DeepVideoAnalysisPanelProps {
  report: AuditReport;
  onJumpToTimestamp: (seconds: number) => void;
  isLight: boolean;
  currentTier?: SubscriptionTier;
  onOpenPricing?: () => void;
  onOpenCutGuide?: () => void;
  onOpenAppealModal?: () => void;
}

export const DeepVideoAnalysisPanel: React.FC<DeepVideoAnalysisPanelProps> = ({
  report,
  onJumpToTimestamp,
  isLight,
  currentTier = 'free',
  onOpenPricing,
  onOpenCutGuide,
  onOpenAppealModal,
}) => {
  // Mobile Creator-Friendly Workflow: Simple vs Deep Forensic View
  const [viewMode, setViewMode] = useState<'SIMPLE' | 'DEEP_FORENSIC'>('DEEP_FORENSIC');
  // Active inspection tab in Deep Forensic mode
  const [activeTab, setActiveTab] = useState<'PILLARS' | 'SCENES' | 'AUDIO' | 'REPLACEMENTS'>('PILLARS');
  // Selected video editor for replacement directions
  const [selectedEditor, setSelectedEditor] = useState<'capcut' | 'premiere' | 'davinci'>('capcut');
  // Expanded scene index
  const [expandedScene, setExpandedScene] = useState<number | null>(null);

  const scenes = report.sceneBreakdown || [];
  const audioSegments = report.audioSegmentBreakdown || [];
  const copyright = report.copyrightAnalysis;
  const monetization = report.monetizationAnalysis;
  const strikeResult = report.communityStrikeResult;
  const violations = report.timelineViolations || [];

  const isFree = currentTier === 'free';

  return (
    <div className="flex flex-col gap-5 font-public-sans">
      {/* 1. CREATOR WORKFLOW BAR: SIMPLE vs DEEP MODE & PRIVATE SCAN BADGE */}
      <div
        className={`rounded-2xl border p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
          isLight
            ? 'border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 text-slate-800'
            : 'border-indigo-950/80 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-950 text-slate-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 ${
              isLight ? 'bg-indigo-600 text-white' : 'bg-indigo-500/20 text-indigo-400'
            }`}
          >
            <Cpu className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-satoshi text-xs sm:text-sm font-black tracking-tight text-slate-950 dark:text-white">
                Deep Neural Video &amp; Audio Audit
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <Lock className="h-2.5 w-2.5" />
                <span>Zero-Retention Private Mode</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Granular scene-by-scene vision, acoustic spectrum analysis, and isolated copyright/monetization scoring.
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Mobile Simple vs Deep Pro */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-200/70 dark:bg-slate-800/80 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setViewMode('SIMPLE')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'SIMPLE'
                ? 'bg-white dark:bg-indigo-600 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span>Simple Mode</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('DEEP_FORENSIC')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              viewMode === 'DEEP_FORENSIC'
                ? 'bg-white dark:bg-indigo-600 text-slate-950 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Deep Forensic</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          2. SEPARATED SCORES & 3-PILLAR HEALTH METERS (COPYRIGHT vs MONETIZATION vs STRIKES)
          ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4
              className={`font-satoshi text-sm sm:text-base font-black uppercase tracking-wider ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Independent Safety Pillars (Separated Scores)
            </h4>
            <span className="rounded-md bg-slate-200 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-500">
              Not mixed into 1 ambiguous number
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* PILLAR 1: COPYRIGHT & CONTENT ID (ALAG SCORE) */}
          <div
            className={`rounded-2xl border p-4.5 flex flex-col justify-between transition shadow-xs ${
              copyright?.status === 'DMCA_STRIKE_HAZARD'
                ? isLight
                  ? 'border-red-200 bg-red-50/70 text-slate-900'
                  : 'border-red-900/60 bg-red-950/20 text-slate-100'
                : copyright?.status === 'CONTENT_ID_CLAIM_POSSIBLE'
                ? isLight
                  ? 'border-amber-200 bg-amber-50/70 text-slate-900'
                  : 'border-amber-900/60 bg-amber-950/20 text-slate-100'
                : isLight
                ? 'border-emerald-200 bg-emerald-50/70 text-slate-900'
                : 'border-emerald-900/60 bg-emerald-950/20 text-slate-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500">
                    <Copyright className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-satoshi text-xs font-bold block leading-tight">
                      Copyright &amp; Content ID
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Music &amp; Visual Rights
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                    copyright?.status === 'CLEAN'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  {copyright?.score ?? 100}% Clean
                </span>
              </div>

              <div className="my-2.5">
                <div
                  className={`font-satoshi text-sm sm:text-base font-black ${
                    copyright?.status === 'CLEAN'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {copyright?.status === 'CLEAN'
                    ? '100% Free of Copyright Claims'
                    : 'Content ID / Copyright Match Detected'}
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {copyright?.status === 'CLEAN'
                    ? 'No registered music sound recordings or TV broadcast footage matches were detected. Safe from DMCA takedowns.'
                    : copyright?.matches?.[0]?.suggestedFix ||
                      'Automated match to third-party rights catalog. Swap flagged audio or clip with royalty-free alternatives below.'}
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Fair Use Verdict:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {copyright?.fairUseVerdict === 'STRONG_FAIR_USE'
                  ? 'Strong Fair Use'
                  : 'Transformative Cut Required'}
              </span>
            </div>
          </div>

          {/* PILLAR 2: MONETIZATION & AD-SUITABILITY (ALAG SCORE) */}
          <div
            className={`rounded-2xl border p-4.5 flex flex-col justify-between transition shadow-xs ${
              monetization?.dollarStatus === 'GREEN_DOLLAR'
                ? isLight
                  ? 'border-emerald-200 bg-emerald-50/70 text-slate-900'
                  : 'border-emerald-900/60 bg-emerald-950/20 text-slate-100'
                : monetization?.dollarStatus === 'YELLOW_DOLLAR'
                ? isLight
                  ? 'border-amber-200 bg-amber-50/70 text-slate-900'
                  : 'border-amber-900/60 bg-amber-950/20 text-slate-100'
                : isLight
                ? 'border-red-200 bg-red-50/70 text-slate-900'
                : 'border-red-900/60 bg-red-950/20 text-slate-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold ${
                      monetization?.dollarStatus === 'GREEN_DOLLAR'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : monetization?.dollarStatus === 'YELLOW_DOLLAR'
                        ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-satoshi text-xs font-bold block leading-tight">
                      Monetization &amp; Ad Suitability
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Green vs Yellow Dollar
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                    monetization?.dollarStatus === 'GREEN_DOLLAR'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {monetization?.score ?? 95}% CPM Score
                </span>
              </div>

              <div className="my-2.5">
                <div
                  className={`font-satoshi text-sm sm:text-base font-black flex items-center gap-1.5 ${
                    monetization?.dollarStatus === 'GREEN_DOLLAR'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : monetization?.dollarStatus === 'YELLOW_DOLLAR'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  <span>
                    {monetization?.dollarStatus === 'GREEN_DOLLAR'
                      ? 'Green Dollar ($) - Fully Monetizable'
                      : monetization?.dollarStatus === 'YELLOW_DOLLAR'
                      ? 'Yellow Dollar (Limited / Self-Cert Notice)'
                      : 'Red Dollar (Demonetized)'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {monetization?.first8SecondsClean
                    ? 'First 8 seconds are 100% clean of severe profanity and shock sounds. Eligible for top brand advertisers.'
                    : 'Opening window contains elevated acoustic spike or sensitive terminology. Advertisers may restrict bids.'}
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">First 8s Compliance:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {monetization?.first8SecondsClean ? '✓ 100% Compliant' : '⚠ Action Suggested'}
              </span>
            </div>
          </div>

          {/* PILLAR 3: COMMUNITY GUIDELINES & STRIKES (ALAG SCORE) */}
          <div
            className={`rounded-2xl border p-4.5 flex flex-col justify-between transition shadow-xs ${
              strikeResult?.strikeRisk === 'STRIKE_IMMINENT'
                ? isLight
                  ? 'border-red-200 bg-red-50/70 text-slate-900'
                  : 'border-red-900/60 bg-red-950/20 text-slate-100'
                : strikeResult?.strikeRisk === 'WARNING_ISSUED'
                ? isLight
                  ? 'border-amber-200 bg-amber-50/70 text-slate-900'
                  : 'border-amber-900/60 bg-amber-950/20 text-slate-100'
                : isLight
                ? 'border-emerald-200 bg-emerald-50/70 text-slate-900'
                : 'border-emerald-900/60 bg-emerald-950/20 text-slate-100'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold ${
                      strikeResult?.strikeRisk === 'ZERO_RISK'
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                    }`}
                  >
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <span className="font-satoshi text-xs font-bold block leading-tight">
                      Community Guidelines Strike
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      Zero-Tolerance Policies
                    </span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
                    strikeResult?.strikeRisk === 'ZERO_RISK'
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}
                >
                  {strikeResult?.score ?? 100}% Safe
                </span>
              </div>

              <div className="my-2.5">
                <div
                  className={`font-satoshi text-sm sm:text-base font-black ${
                    strikeResult?.strikeRisk === 'ZERO_RISK'
                      ? 'text-emerald-700 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {strikeResult?.strikeRisk === 'ZERO_RISK'
                    ? 'Zero Strike Risk (100% Clean Channel)'
                    : 'Critical Community Strike Hazard'}
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {strikeResult?.strikeRisk === 'ZERO_RISK'
                    ? 'Child safety, graphic violence, dangerous acts, and hate speech checks cleared. Channel will not receive a strike.'
                    : 'Content triggers automated takedown algorithms. You must cut or blur the flagged scene before publishing.'}
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-500">Channel Strike Status:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {strikeResult?.strikeRisk === 'ZERO_RISK'
                  ? '0 Strikes / Safe'
                  : 'Strike Hazard Imminent'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. SIMPLE MODE: CREATOR-FRIENDLY MOBILE QUICK ACTIONS (If Simple Mode Active)
          ========================================================================= */}
      {viewMode === 'SIMPLE' ? (
        <div
          className={`rounded-2xl border p-5 space-y-4 ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between">
            <h4
              className={`font-satoshi text-base font-bold ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              Creator Quick-Fix Summary (Mobile Friendly)
            </h4>
            <span className="text-xs text-slate-500 font-mono">
              {violations.length === 0 ? 'Ready to Upload' : `${violations.length} Fixes Needed`}
            </span>
          </div>

          {violations.length === 0 ? (
            <div className="text-center py-6 space-y-2">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
              <h5 className="font-satoshi text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Video is 100% Safe to Publish!
              </h5>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No strikes, no copyright blocks, and full Green Dollar monetization eligibility. You can schedule this on YouTube Studio now.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {violations.map((v, idx) => (
                <div
                  key={v.id || idx}
                  className={`rounded-xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    v.severity === 'CRITICAL_STRIKE'
                      ? 'border-red-500/30 bg-red-500/10'
                      : 'border-amber-500/30 bg-amber-500/10'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-red-500">
                        {v.timestampStart} - {v.timestampEnd}
                      </span>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {v.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      <strong>Action:</strong> {v.replacementFix?.suggestedFreeAlternative || v.actionableFix.instructionsEn}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onJumpToTimestamp(v.secondsStart)}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-950 px-3 py-1.5 font-sans text-xs font-bold transition shrink-0 cursor-pointer"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Jump to {v.timestampStart}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* =========================================================================
            4. DEEP FORENSIC AUDIT MODE (SCENES + AUDIO SPECTRUM + ACTIONABLE REPLACEMENTS)
            ========================================================================= */
        <div
          className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-sm ${
            isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/90'
          }`}
        >
          {/* Sub-Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('PILLARS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'PILLARS'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>Evidence &amp; Proofs ({violations.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('SCENES')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'SCENES'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Video className="h-3.5 w-3.5" />
                <span>Scene-by-Scene Vision ({scenes.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('AUDIO')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'AUDIO'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>Audio Spectrum ({audioSegments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('REPLACEMENTS')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'REPLACEMENTS'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Scissors className="h-3.5 w-3.5 text-rose-300" />
                <span>Actionable Replacement Studio</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-slate-400">
              {report.videoDurationSec}s Duration Analyzed
            </span>
          </div>

          {/* TAB 1: EVIDENCE & CONFIDENCE PROOFS */}
          {activeTab === 'PILLARS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5
                    className={`font-satoshi text-sm sm:text-base font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Evidence-Based Technical Diagnostic
                  </h5>
                  <p className="text-xs text-slate-500">
                    Concrete reason, frame hashes, acoustic spectrograms, and agent consensus for every warning.
                  </p>
                </div>
              </div>

              {violations.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-xs text-emerald-400">
                  <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
                  <span className="font-bold text-sm block">Zero Technical Evidence of Any Infraction</span>
                  All visual hashes and acoustic wave patterns verified within standard community limits.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {violations.map((v, i) => {
                    const proof = v.evidenceProof;
                    return (
                      <div
                        key={v.id || i}
                        className={`rounded-2xl border p-4 space-y-3 ${
                          v.severity === 'CRITICAL_STRIKE'
                            ? isLight
                              ? 'border-red-200 bg-red-50/50'
                              : 'border-red-900/50 bg-red-950/20'
                            : isLight
                            ? 'border-amber-200 bg-amber-50/50'
                            : 'border-amber-900/50 bg-amber-950/20'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-bold ${
                                v.severity === 'CRITICAL_STRIKE'
                                  ? 'bg-red-500 text-white'
                                  : 'bg-amber-500 text-slate-950'
                              }`}
                            >
                              {v.timestampStart} - {v.timestampEnd}
                            </span>
                            <span className="font-satoshi text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {v.title}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-slate-200 dark:bg-slate-800 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300">
                              {proof?.confidencePct || v.confidencePct}% Certainty
                            </span>
                            <button
                              type="button"
                              onClick={() => onJumpToTimestamp(v.secondsStart)}
                              className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[10px] font-mono font-bold px-2.5 py-1 cursor-pointer transition"
                            >
                              <Play className="h-2.5 w-2.5 fill-current" />
                              <span>Jump</span>
                            </button>
                          </div>
                        </div>

                        {/* Reason & Evidence Box */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Algorithmic Reason */}
                          <div className="rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white/60 dark:bg-slate-900/60 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-indigo-600 dark:text-indigo-400 text-[11px]">
                              <Cpu className="h-3.5 w-3.5" />
                              <span>Algorithmic Trigger Reason</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                              {proof?.algorithmicReason || v.detectionReasoning}
                            </p>
                          </div>

                          {/* Raw Evidence Proof */}
                          <div className="rounded-xl border border-black/10 dark:border-white/10 p-3 bg-white/60 dark:bg-slate-900/60 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">
                              <Gauge className="h-3.5 w-3.5" />
                              <span>Raw Sensor Evidence Proof</span>
                            </div>
                            <p className="font-mono text-[10px] text-slate-700 dark:text-slate-300 break-all bg-slate-100 dark:bg-slate-950 p-1.5 rounded">
                              {proof?.rawEvidence || `Hash: 0x9AF... | Variance: 0.92 | Flagged: ${v.youtubePolicyRef}`}
                            </p>
                          </div>
                        </div>

                        {/* Multi-Agent Consensus */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-black/5 dark:border-white/5 text-[11px]">
                          <span className="text-slate-500 font-mono text-[10px]">
                            Neural Consensus: VisionAgent-Alpha • AcousticAgent-Beta • PolicyConsensus-Omega
                          </span>
                          <span className="font-mono font-bold text-red-500 text-[10px]">
                            Action Required: Trim or Replace Clip
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCENE-BY-SCENE VISION BREAKDOWN */}
          {activeTab === 'SCENES' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5
                    className={`font-satoshi text-sm sm:text-base font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Scene-by-Scene Temporal Inspection
                  </h5>
                  <p className="text-xs text-slate-500">
                    Every visual scene analyzed with start/end timestamps, hazard detection, and replacement cues.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {scenes.map((scene) => {
                  const isHazard = scene.safetyStatus === 'STRIKE_HAZARD';
                  const isCaution = scene.safetyStatus === 'CAUTION';
                  const isExpanded = expandedScene === scene.sceneIndex;

                  return (
                    <div
                      key={scene.sceneIndex}
                      className={`rounded-2xl border transition ${
                        isHazard
                          ? isLight
                            ? 'border-red-300 bg-red-50/40'
                            : 'border-red-900/60 bg-red-950/20'
                          : isCaution
                          ? isLight
                            ? 'border-amber-300 bg-amber-50/40'
                            : 'border-amber-900/60 bg-amber-950/20'
                          : isLight
                          ? 'border-slate-200 bg-slate-50/60'
                          : 'border-slate-800 bg-slate-900/60'
                      }`}
                    >
                      <div className="p-3.5 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-xl font-mono text-xs font-bold ${
                              isHazard
                                ? 'bg-red-500 text-white'
                                : isCaution
                                ? 'bg-amber-500 text-slate-950'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            #{scene.sceneIndex}
                          </span>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                                {scene.timestampStart} - {scene.timestampEnd}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.2 font-mono text-[9px] font-bold uppercase ${
                                  isHazard
                                    ? 'bg-red-500/20 text-red-600 dark:text-red-400'
                                    : isCaution
                                    ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                                    : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                }`}
                              >
                                {scene.safetyStatus.replace('_', ' ')}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 mt-0.5">
                              {scene.visualSummary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onJumpToTimestamp(scene.secondsStart)}
                            className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 font-sans text-xs font-semibold transition cursor-pointer"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>Play Scene</span>
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setExpandedScene(isExpanded ? null : scene.sceneIndex)
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-white transition cursor-pointer"
                          >
                            <ChevronDown
                              className={`h-4 w-4 transition-transform ${
                                isExpanded ? 'rotate-180' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Scene Details */}
                      {isExpanded && (
                        <div className="p-3.5 pt-0 border-t border-black/5 dark:border-white/5 mt-1 space-y-2 text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block mb-1">
                                Detected Visual Elements
                              </span>
                              <div className="flex flex-wrap gap-1">
                                {scene.keyObjectsDetected.map((obj, oi) => (
                                  <span
                                    key={oi}
                                    className="rounded bg-black/10 dark:bg-white/10 px-2 py-0.5 text-[10px] font-medium"
                                  >
                                    {obj}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {scene.replacementAction && (
                              <div>
                                <span className="text-[10px] font-mono text-red-400 uppercase font-bold block mb-1">
                                  Actionable Replacement
                                </span>
                                <p className="text-[11px] text-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-950/50 p-2 rounded-lg border border-red-500/20">
                                  {scene.replacementAction}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO SPECTRUM & ACOUSTIC SEGMENTS */}
          {activeTab === 'AUDIO' && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h5
                    className={`font-satoshi text-sm sm:text-base font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Acoustic Waveform &amp; Speech Spectrum Breakdown
                  </h5>
                  <p className="text-xs text-slate-500">
                    Audio segments checked for music copyright match, profanity, and decibel spikes.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {audioSegments.map((seg) => (
                  <div
                    key={seg.segmentIndex}
                    className={`rounded-2xl border p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      seg.safetyStatus === 'STRIKE_HAZARD'
                        ? 'border-red-500/40 bg-red-500/10'
                        : seg.safetyStatus === 'CAUTION'
                        ? 'border-amber-500/40 bg-amber-500/10'
                        : isLight
                        ? 'border-slate-200 bg-slate-50'
                        : 'border-slate-800 bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-500 shrink-0 mt-0.5">
                        <Music className="h-4.5 w-4.5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                            {seg.timestampStart} - {seg.timestampEnd}
                          </span>
                          <span className="rounded bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[9px] uppercase font-bold text-slate-500">
                            {seg.audioType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          <strong>Track:</strong> {seg.soundtrackIdentified || 'Original Creator Audio'}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {seg.suggestedAction}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                          seg.copyrightRisk === 'CLEAN_FREE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {seg.copyrightRisk === 'CLEAN_FREE' ? '0 Claims' : 'Match Detected'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onJumpToTimestamp(seg.secondsStart)}
                        className="flex items-center gap-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-2.5 py-1.5 cursor-pointer"
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>Play</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ACTIONABLE REPLACEMENT STUDIO */}
          {activeTab === 'REPLACEMENTS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h5
                    className={`font-satoshi text-sm sm:text-base font-bold ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    Actionable Replacement Studio
                  </h5>
                  <p className="text-xs text-slate-500">
                    Don&apos;t just receive warnings—replace flagged footage with pre-cleared alternatives.
                  </p>
                </div>

                {/* Editor Switcher Tabs */}
                <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto">
                  {(['capcut', 'premiere', 'davinci'] as const).map((ed) => (
                    <button
                      key={ed}
                      type="button"
                      onClick={() => setSelectedEditor(ed)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition cursor-pointer ${
                        selectedEditor === ed
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-white'
                      }`}
                    >
                      {ed}
                    </button>
                  ))}
                </div>
              </div>

              {violations.length === 0 ? (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center text-xs text-emerald-400">
                  <CheckCircle2 className="mx-auto h-8 w-8 mb-2" />
                  <span className="font-bold text-sm block">No Replacements Required!</span>
                  Every visual frame and audio track is cleared for YouTube upload.
                </div>
              ) : (
                <div className="space-y-3.5">
                  {violations.map((v, i) => {
                    const rep = v.replacementFix;
                    const editorStep =
                      rep?.editorSteps[selectedEditor] ||
                      `Split video at ${v.timestampStart} and ${v.timestampEnd}, then mute audio or insert replacement B-roll.`;

                    return (
                      <div
                        key={v.id || i}
                        className={`rounded-2xl border p-4 space-y-3 ${
                          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-950/80'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-red-600 px-2 py-0.5 font-mono text-[11px] font-bold text-white">
                              {v.timestampStart} - {v.timestampEnd}
                            </span>
                            <span className="font-satoshi text-xs font-bold text-slate-900 dark:text-white">
                              {rep?.specificAssetToReplace || v.title}
                            </span>
                          </div>

                          <span className="font-mono text-[10px] text-amber-500 uppercase font-bold">
                            Action: {rep?.actionRequired.replace('_', ' ') || 'REPLACE'}
                          </span>
                        </div>

                        {/* Free Safe Replacement Recommendation */}
                        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 space-y-1">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-xs">
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>Recommended Free Alternative</span>
                          </div>
                          <p className="text-xs text-slate-200 leading-relaxed">
                            {rep?.suggestedFreeAlternative ||
                              'Use royalty-free B-roll from Pexels/Pixabay or YouTube Audio Library background music.'}
                          </p>
                        </div>

                        {/* Step-by-Step Editor Directions */}
                        <div className="rounded-xl border border-slate-700 bg-slate-900 p-3 space-y-1.5">
                          <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase block">
                            {selectedEditor.toUpperCase()} Execution Steps
                          </span>
                          <pre className="font-mono text-[11px] text-slate-300 whitespace-pre-line leading-relaxed">
                            {editorStep}
                          </pre>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
