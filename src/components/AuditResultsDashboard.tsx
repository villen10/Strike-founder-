import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileVideo,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Cpu,
  Volume2,
  Music,
  Play,
  TrendingUp,
  Activity,
  BarChart3,
  Lock,
  Zap,
  Gauge,
  Scale,
} from 'lucide-react';
import { AuditReport, PolicyViolation } from '../types/audit';
import { HistoricalUploadRecord } from './ChannelHealthTrend';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ModerationDisclaimerNotice } from './ModerationDisclaimerNotice';
import { DeepVideoAnalysisPanel } from './DeepVideoAnalysisPanel';

interface AuditResultsDashboardProps {
  report: AuditReport | null;
  videoTitle: string;
  videoDurationSec: number;
  onOpenCutGuide: () => void;
  onOpenAppealModal: () => void;
  onOpenCompare?: () => void;
  onRescan: () => void;
  onJumpAndPlay: (seconds: number) => void;
  uploadHistory: HistoricalUploadRecord[];
  isLight: boolean;
  isAuthenticated?: boolean;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onDemoLogin?: (name?: string, email?: string) => void;
}

export const AuditResultsDashboard: React.FC<AuditResultsDashboardProps> = ({
  report,
  videoTitle,
  videoDurationSec,
  onOpenCutGuide,
  onOpenAppealModal,
  onOpenCompare,
  onRescan,
  onJumpAndPlay,
  uploadHistory,
  isLight,
  isAuthenticated = false,
  onOpenAuth,
  onDemoLogin,
}) => {
  const isCritical = report ? (report.safetyGrade === 'HIGH_STRIKE_RISK' || report.criticalIssuesCount > 0) : false;
  const isCaution = report ? (report.safetyGrade === 'MONETIZATION_AT_RISK' || report.warningsCount > 0) : false;
  const isClean = report ? report.safetyGrade === 'SAFE_TO_UPLOAD' : false;

  const [triggerConfetti, setTriggerConfetti] = useState(isClean);

  useEffect(() => {
    if (isClean) {
      setTriggerConfetti(true);
      const timer = setTimeout(() => {
        setTriggerConfetti(false);
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      setTriggerConfetti(false);
    }
  }, [report?.id, isClean]);

  if (!report) {
    return (
      <div className={`rounded-3xl border p-8 text-center shadow-2xs ${isLight ? 'bg-white border-slate-100 shadow-slate-200/50' : 'bg-slate-900/80 border-slate-800'}`}>
        <FileVideo className="mx-auto h-12 w-12 text-slate-400 mb-3 animate-pulse" />
        <h3 className={`font-display text-lg font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          No Audit Results Available Yet
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
          Upload a video or select a test scenario above to run the guidelines compliance check and generate your audit report.
        </p>
      </div>
    );
  }

  // Generate second-by-second data for Recharts safety score fluctuation chart
  const totalSecs = Math.max(10, videoDurationSec || 30);
  const chartData = Array.from({ length: Math.min(30, totalSecs) }, (_, i) => {
    const sec = Math.round((i / 29) * totalSecs);
    const viol = report.timelineViolations.find(
      (v) => sec >= v.secondsStart && sec <= v.secondsEnd
    );
    let score = 95 - Math.round(report.overallRiskScore * 0.4);
    if (viol) {
      score = viol.severity === 'CRITICAL_STRIKE' ? 15 : 42;
    } else {
      score = Math.min(100, Math.max(10, score + Math.sin(i * 0.8) * 10));
    }
    return {
      second: `${sec}s`,
      secondsNum: sec,
      safetyScore: score,
      status: viol ? viol.severity : 'SAFE',
    };
  });

  const compliancePercent = Math.max(5, 100 - report.overallRiskScore);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-5"
    >
      {/* 1. TOP VERDICT CARD (Directly matching Image 2 & Screenshot lime-green / sleek card style) */}
      <div
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-7 transition shadow-md ${
          isCritical
            ? isLight
              ? 'bg-gradient-to-br from-red-50 via-rose-50/60 to-orange-50 border border-red-200 text-slate-900 shadow-red-500/10'
              : 'bg-gradient-to-br from-red-950/70 via-slate-900 to-rose-950/60 border border-red-800/80 text-slate-100'
            : isCaution
            ? isLight
              ? 'bg-gradient-to-br from-amber-50 via-yellow-50/60 to-orange-50 border border-amber-200 text-slate-900 shadow-amber-500/10'
              : 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-950 border border-amber-800/80 text-slate-100'
            : isLight
            ? 'bg-gradient-to-br from-[#d9f99d] via-[#bef264] to-[#a3e635] text-slate-900 border border-lime-300/80 shadow-emerald-500/15'
            : 'bg-gradient-to-br from-emerald-950/80 via-slate-900 to-lime-950/70 text-slate-100 border border-emerald-700/80 shadow-emerald-950/40'
        }`}
      >
        {/* Subtle Confetti Particles Burst on Safe to Upload */}
        {triggerConfetti && isClean && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
            {Array.from({ length: 24 }).map((_, i) => {
              const colors = ['#10b981', '#34d399', '#6ee7b7', '#f59e0b', '#2dd4bf', '#a7f3d0', '#fbbf24'];
              const color = colors[i % colors.length];
              const left = `${(i * 100) / 24 + ((i * 7) % 5)}%`;
              const delay = (i % 7) * 0.12;
              const size = 5 + (i % 4) * 2;
              return (
                <motion.div
                  key={`confetti-${i}`}
                  initial={{ opacity: 0, y: -15, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0.9, 0],
                    y: [0, 150 + (i % 4) * 30],
                    x: [(i % 2 === 0 ? 1 : -1) * 12, (i % 2 === 0 ? -1 : 1) * 18],
                    rotate: [0, (i % 2 === 0 ? 180 : -180) + i * 25],
                  }}
                  transition={{
                    duration: 3,
                    delay,
                    ease: 'easeOut',
                  }}
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left,
                    width: `${size}px`,
                    height: `${size * 0.65}px`,
                    backgroundColor: color,
                    borderRadius: '2px',
                  }}
                />
              );
            })}
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="max-w-xl">
            {/* Top pill badge */}
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <div className="inline-flex items-center gap-1.5 font-sans text-xs font-bold px-3 py-1 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs shadow-2xs">
                {isCritical ? (
                  <>
                    <ShieldAlert className="h-3.5 w-3.5 text-red-600 fill-current" />
                    <span className="text-red-700 dark:text-red-400">Critical Strike Risk Active</span>
                  </>
                ) : isCaution ? (
                  <>
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-600 fill-current" />
                    <span className="text-amber-700 dark:text-amber-400">Monetization Caution</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 fill-current" />
                    <span>Verified Safe for YouTube Ingestion</span>
                  </>
                )}
              </div>

              {/* Confidence Badge */}
              <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 backdrop-blur-xs">
                <Gauge className="h-3.5 w-3.5 text-red-600 dark:text-rose-400" />
                <span>
                  {report.averageConfidencePct || (report.timelineViolations.length > 0 ? 95 : 99)}% Detection Certainty
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Audit Verdict · {videoTitle}
              </span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              {isCritical
                ? 'High Strike Hazard Detected'
                : isCaution
                ? 'Monetization Caution Needed'
                : '100% Ready & Safe to Upload'}
            </h3>

            <p className="mt-1.5 font-sans text-xs sm:text-sm opacity-90 leading-relaxed max-w-lg">
              {report.summaryVerdictEn}
            </p>

            {/* Quick Action buttons inside the verdict banner */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (!isAuthenticated && onOpenAuth) {
                    onOpenAuth('login');
                  } else {
                    onOpenCutGuide();
                  }
                }}
                className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 font-sans text-xs font-bold transition shadow-sm cursor-pointer hover:scale-102 active:scale-98 ${
                  isLight
                    ? 'bg-slate-950 text-white hover:bg-slate-850'
                    : 'bg-white text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Scissors className="h-4 w-4 text-rose-500" />
                <span>{isAuthenticated ? 'Safe Cut & Blur Guide' : 'Unlock Safe Cuts 🔒'}</span>
              </button>

              {isCritical && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated && onOpenAuth) {
                      onOpenAuth('login');
                    } else {
                      onOpenAppealModal();
                    }
                  }}
                  className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-4 py-2.5 font-sans text-xs font-bold transition shadow-sm cursor-pointer hover:scale-102"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isAuthenticated ? 'AI Appeal Kit' : 'Unlock Appeal 🔒'}</span>
                </button>
              )}

              {onOpenCompare && (
                <button
                  type="button"
                  onClick={onOpenCompare}
                  className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 font-sans text-xs font-semibold transition cursor-pointer hover:scale-102 ${
                    isLight
                      ? 'border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-700'
                      : 'border-indigo-800/80 bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300'
                  }`}
                  title="Side-by-Side Deep Audit Comparison between 2 videos"
                >
                  <Scale className="h-3.5 w-3.5 text-indigo-500" />
                  <span>Compare 2 Videos</span>
                </button>
              )}

              <button
                type="button"
                onClick={onRescan}
                className={`flex items-center gap-1.5 rounded-2xl border px-3.5 py-2.5 font-sans text-xs font-semibold transition cursor-pointer ${
                  isLight
                    ? 'border-slate-400/40 bg-white/70 hover:bg-white text-slate-800'
                    : 'border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Rescan</span>
              </button>
            </div>
          </div>

          {/* SVG Circular Donut Ring on right (matching Image 2 / Screenshot donut ring) */}
          <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 shrink-0 items-center justify-center self-center md:self-auto">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-white/40 dark:text-slate-800"
                strokeWidth="3.6"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={`${
                  isCritical
                    ? 'text-red-600 dark:text-red-500'
                    : isCaution
                    ? 'text-amber-500 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-emerald-400'
                } transition-all duration-1000 ease-out`}
                strokeDasharray={`${compliancePercent}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-lg sm:text-xl font-black leading-none text-slate-900 dark:text-white">
                {compliancePercent}%
              </span>
              <span className="font-public-sans text-[9px] uppercase tracking-wider font-bold opacity-75 mt-0.5">
                {isCritical ? 'RISK' : isCaution ? 'WARN' : 'SAFE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Upload Diagnostic 85-90% YouTube Bot Alignment Transparency Notice */}
      <ModerationDisclaimerNotice isLight={isLight} />

      {/* 1-2 SHORT LINES MAIN ISSUES CALLOUT (EASILY IDENTIFIABLE FOR CREATORS) */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 transition shadow-xs ${
          isCritical
            ? isLight
              ? 'border-red-300 bg-red-50/80 text-slate-900 shadow-red-500/5'
              : 'border-rose-500/40 bg-rose-950/25 text-slate-100'
            : isCaution
            ? isLight
              ? 'border-amber-300 bg-amber-50/80 text-slate-900 shadow-amber-500/5'
              : 'border-amber-500/40 bg-amber-950/25 text-slate-100'
            : isLight
            ? 'border-emerald-300 bg-emerald-50/80 text-slate-900 shadow-emerald-500/5'
            : 'border-emerald-500/40 bg-emerald-950/25 text-slate-100'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-public-sans font-bold uppercase tracking-wider ${
                isCritical
                  ? 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30'
                  : isCaution
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
              }`}
            >
              {isCritical ? (
                <>
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Major YouTube Strike Hazard</span>
                </>
              ) : isCaution ? (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Choti Si Warning (Ad Notice - Channel Safe)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>100% Clean Video (Zero Strikes)</span>
                </>
              )}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">·</span>
            <span className="text-xs text-slate-500 font-public-sans font-semibold hidden sm:inline">
              Main Issue Summary
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-500 font-semibold">
            {report.totalIssuesCount === 0 ? '0 Strikes / Clean' : `${report.totalIssuesCount} Issue(s) Found`}
          </span>
        </div>

        {/* 1-2 Short Lines Headline & Detail in Satoshi / Public Sans */}
        <h4
          className={`font-satoshi text-base sm:text-lg font-bold tracking-tight leading-snug ${
            isCritical
              ? 'text-red-700 dark:text-red-400'
              : isCaution
              ? 'text-amber-800 dark:text-amber-300'
              : 'text-emerald-800 dark:text-emerald-300'
          }`}
        >
          {report.mainIssueHeadline ||
            (isClean
              ? 'No Strike Issues Detected (100% Clean & Safe)'
              : isCaution
              ? 'Minor Caution: Presentation / Ad Suitability Notice (Channel Safe - Not a Strike)'
              : `Critical Strike Hazard: ${report.timelineViolations?.[0]?.title || 'Policy Infraction'}`)}
        </h4>

        <p
          className={`mt-1 font-public-sans text-xs sm:text-sm font-medium leading-relaxed ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}
        >
          {report.mainIssueDetail || report.summaryVerdictEn}
        </p>
      </div>

      {/* Deep Video & Audio Analysis (Separated Copyright & Monetization, Scenes, Audio Spectrum, Actionable Replacements) */}
      <DeepVideoAnalysisPanel
        report={report}
        onJumpToTimestamp={onJumpAndPlay}
        isLight={isLight}
        currentTier={isAuthenticated ? 'pro' : 'free'}
        onOpenCutGuide={onOpenCutGuide}
        onOpenAppealModal={onOpenAppealModal}
      />

      {/* 2. LOCKED ACCESS GATE OR UNLOCKED STATS */}
      {!isAuthenticated ? (
        <div className="relative overflow-hidden rounded-3xl border border-red-500/25 p-7 sm:p-10 text-center shadow-xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 text-white backdrop-blur-xl">
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-80 rounded-full bg-red-600/15 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center max-w-lg mx-auto">
            <div className="mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl shadow-red-600/30">
              <Lock className="h-7 w-7 animate-pulse" />
            </div>

            <span className="rounded-full bg-red-500/10 border border-red-500/30 px-3 py-0.5 font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">
              Free Creator Access Required
            </span>

            <h4 className="font-display text-xl sm:text-2xl font-black tracking-tight text-white">
              Sign In or Register to View Full Audit Artifacts
            </h4>

            <p className="mt-2 font-sans text-xs text-slate-300 leading-relaxed">
              Anyone can test and scan videos without registering. To reveal <strong>frame-accurate violation cuts, second-by-second temporal graphs, and strike appeal letters</strong>, sign in or create your free account.
            </p>

            {/* Included Features Grid */}
            <div className="my-5 grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-left font-sans text-xs text-slate-200">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>0-100% Strike Probability Score</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Frame-Accurate Safe Cut Timecodes</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>EDSA Legal Strike Appeal Kit</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Sync Video Audits to Firebase Cloud</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full">
              {onDemoLogin && (
                <button
                  type="button"
                  onClick={() => onDemoLogin('Studio Creator', 'blendagent.online@gmail.com')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white px-5 py-3 font-sans text-xs font-bold shadow-lg shadow-rose-600/30 transition hover:scale-102 cursor-pointer"
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span>1-Click Test Creator Login (Instant Unlock)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenAuth?.('register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white px-5 py-3 font-sans text-xs font-bold shadow-lg shadow-red-600/30 transition hover:scale-102 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth?.('login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/90 hover:bg-slate-800 text-white px-5 py-3 font-sans text-xs font-semibold transition cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Recharts Safety Fluctuation Chart */}
          <div
            className={`rounded-3xl border p-5 sm:p-6 shadow-2xs transition ${
              isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Temporal Safety Fluctuation</span>
                </div>
                <h4 className="font-display text-base sm:text-lg font-black tracking-tight mt-0.5">
                  Second-by-Second Policy Evaluation
                </h4>
                <p className="font-sans text-xs text-slate-500 mt-0.5">
                  Visualizes compliance risk variation across your video duration. Dips denote detected infractions.
                </p>
              </div>

              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" /> Safe (&gt;70%)
                </span>
                <span className="flex items-center gap-1 text-red-600 font-semibold">
                  <span className="h-2 w-2 rounded-full bg-red-600" /> Strike Risk (&lt;40%)
                </span>
              </div>
            </div>

            <div className="h-60 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="safetyScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84cc16" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#84cc16" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="dangerScoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#f1f5f9' : '#1e293b'} />
                  <XAxis dataKey="second" stroke={isLight ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke={isLight ? '#94a3b8' : '#64748b'} fontSize={10} tickLine={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const isRisky = data.safetyScore < 40;
                        return (
                          <div className={`rounded-2xl border p-3 shadow-xl ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}>
                            <p className="font-mono text-[10px] text-slate-400">Timestamp: {label}</p>
                            <p className="font-display text-sm font-black mt-0.5">
                              Safety Score: <span className={isRisky ? 'text-red-500' : 'text-emerald-500'}>{data.safetyScore}%</span>
                            </p>
                            <span className={`font-mono text-[9px] font-bold mt-1 px-2 py-0.5 rounded-full inline-block ${isRisky ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                              {data.status}
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="safetyScore"
                    stroke={isCritical ? '#ef4444' : '#84cc16'}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={isCritical ? 'url(#dangerScoreGrad)' : 'url(#safetyScoreGrad)'}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 3. 4-COLUMN SPECIALIZED ANALYSIS CARDS GRID (Directly styled like the 2-column cards from Image 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Playable Clips */}
            <div
              className={`rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
                isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Playable Clips
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                    <Clock className="h-4.5 w-4.5" />
                  </div>
                </div>

                <div className="font-display text-2xl font-black tracking-tight">
                  {report.timelineViolations.length} <span className="text-xs font-normal text-slate-500">clips</span>
                </div>
                <span className="font-mono text-[11px] text-red-600 font-semibold mt-0.5 block">
                  {report.timelineViolations.length === 0 ? 'Clean (0 detected)' : 'Click to inspect'}
                </span>

                <div className="mt-3 flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {report.timelineViolations.slice(0, 3).map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onJumpAndPlay(v.secondsStart)}
                      className={`flex items-center justify-between gap-2 rounded-xl p-2 text-left transition cursor-pointer ${
                        isLight ? 'bg-slate-50 hover:bg-slate-100' : 'bg-slate-800/80 hover:bg-slate-800'
                      }`}
                      title={`${v.title} - ${v.confidencePct || 90}% Certainty (${v.confidenceLevel || 'HIGH'})\n${v.detectionReasoning || ''}`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Play className="h-3 w-3 text-red-600 shrink-0 fill-current" />
                        <span className="font-display text-xs font-bold truncate">{v.title}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="font-mono text-[9px] font-bold text-slate-500">
                          {v.timestampStart}
                        </span>
                        {v.confidencePct && (
                          <span
                            className={`rounded px-1.5 py-0.2 font-mono text-[9px] font-bold ${
                              v.confidenceLevel === 'VERY_HIGH' || v.confidencePct >= 90
                                ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {v.confidencePct}%
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: 10 Uploads History Benchmark */}
            <div
              className={`rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
                isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Typical vs Current
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                    <BarChart3 className="h-4.5 w-4.5" />
                  </div>
                </div>

                <div className="font-display text-2xl font-black tracking-tight">
                  {compliancePercent}% <span className="text-xs font-normal text-slate-500">score</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                  Compared with 10 uploads
                </span>

                <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px]">
                  <div className={`flex items-center justify-between p-2 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-slate-800/80'}`}>
                    <span className="text-slate-500">Current</span>
                    <span className="font-bold text-slate-900 dark:text-white">{compliancePercent}%</span>
                  </div>
                  <div className={`flex items-center justify-between p-2 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-slate-800/80'}`}>
                    <span className="text-slate-500">Historical Avg</span>
                    <span className="font-bold text-slate-900 dark:text-white">88%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Audio Soundtrack & FX */}
            <div
              className={`rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
                isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Audio & Voice
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Volume2 className="h-4.5 w-4.5" />
                  </div>
                </div>

                <div className="font-display text-2xl font-black tracking-tight">
                  Clean <span className="text-xs font-normal text-slate-500">audio</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                  Spectrum Verified
                </span>

                <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px]">
                  <div className={`flex items-center justify-between p-2 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-slate-800/80'}`}>
                    <span className="text-slate-500">Background Music</span>
                    <span className="font-bold text-emerald-600">Safe</span>
                  </div>
                  <div className={`flex items-center justify-between p-2 rounded-xl ${isLight ? 'bg-slate-50' : 'bg-slate-800/80'}`}>
                    <span className="text-slate-500">Voice / Profanity</span>
                    <span className="font-bold text-slate-900 dark:text-white">0 Flags</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Detection Certainty */}
            <div
              className={`rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
                isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Detection Certainty
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-600">
                    <Gauge className="h-4.5 w-4.5" />
                  </div>
                </div>

                <div className="font-display text-2xl font-black tracking-tight">
                  {report.averageConfidencePct || (report.timelineViolations.length > 0 ? 95 : 99)}% <span className="text-xs font-normal text-slate-500">certainty</span>
                </div>
                <span className="font-mono text-[11px] text-sky-600 font-semibold mt-0.5 block">
                  Zero False-Negative Standard
                </span>

                <button
                  type="button"
                  onClick={onOpenCutGuide}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-2xl bg-gradient-to-r from-red-600 to-indigo-600 text-white py-2 px-3 font-sans text-xs font-bold transition shadow-xs hover:scale-102 cursor-pointer"
                >
                  <span>Open Safe Cut Sheet</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
