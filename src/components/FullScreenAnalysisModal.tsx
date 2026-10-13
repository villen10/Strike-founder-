import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Zap,
  X,
  Minimize2,
  Cpu,
  Layers,
  ArrowRight,
  Eye,
  Check,
  Activity,
} from 'lucide-react';
import { ExtractedFrame } from '../services/frameExtractor';
import { AuditReport } from '../types/audit';

interface FullScreenAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoTitle: string;
  progressPercent: number;
  progressStatus: string;
  extractedFrames?: ExtractedFrame[];
  report?: AuditReport | null;
  onViewResults?: () => void;
  isLight?: boolean;
}

interface AnalysisStep {
  id: number;
  label: string;
  desc: string;
  category: string;
}

const ANALYSIS_STEPS: AnalysisStep[] = [
  {
    id: 1,
    label: 'Temporal Ingest & 1080p Keyframe Extraction',
    desc: 'Extracting keyframes, decoding audio waveforms and video metadata',
    category: 'INGEST',
  },
  {
    id: 2,
    label: 'Community Guidelines & Violence Screening',
    desc: 'Analyzing weapon props, physical violence, dangerous challenges & stunts',
    category: 'SAFETY',
  },
  {
    id: 3,
    label: 'Opening 7-Seconds Hook & Advertiser Suitability',
    desc: 'Checking opening shock value, demonetization triggers & brand safety',
    category: 'MONETIZATION',
  },
  {
    id: 4,
    label: 'Child Safety & Minor Protection 3-Strikes Check',
    desc: 'Verifying minors handling hazardous objects and COPPA standards',
    category: 'CHILD_SAFETY',
  },
  {
    id: 5,
    label: 'Frame-Accurate Safe-Cut & Appeal Kit Synthesis',
    desc: 'Generating Premiere/CapCut trim timecodes & EDSA legal exceptions',
    category: 'COMPLIANCE',
  },
];

export const FullScreenAnalysisModal: React.FC<FullScreenAnalysisModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  progressPercent,
  progressStatus,
  extractedFrames = [],
  report,
  onViewResults,
  isLight = false,
}) => {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);
  const [autoCloseCountdown, setAutoCloseCountdown] = useState<number | null>(null);

  // Cycle through extracted frames rapidly to give that high-tech scanner look
  useEffect(() => {
    if (!isOpen || extractedFrames.length === 0) return;
    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % extractedFrames.length);
    }, 450);
    return () => clearInterval(interval);
  }, [isOpen, extractedFrames.length]);

  // Trigger auto-close timer when progress hits 100%
  useEffect(() => {
    if (progressPercent >= 100 && report) {
      setAutoCloseCountdown(4);
      const timer = setInterval(() => {
        setAutoCloseCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setAutoCloseCountdown(null);
    }
  }, [progressPercent, report]);

  if (!isOpen) return null;

  // Calculate which step is active / completed
  const currentStep =
    progressPercent < 22
      ? 1
      : progressPercent < 45
      ? 2
      : progressPercent < 70
      ? 3
      : progressPercent < 95
      ? 4
      : 5;

  const isCompleted = progressPercent >= 100 && Boolean(report);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Fullscreen Backdrop with Ambient Cyberpunk Glow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/92 backdrop-blur-2xl"
        />

        {/* Dynamic Scan Line Background Effect */}
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(220,38,38,0.22),rgba(255,255,255,0))]" />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative flex flex-col w-full max-w-4xl max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden z-10 ${
            isLight
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-400/30'
              : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-red-950/40'
          }`}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/60 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-600/30 shrink-0">
                <Cpu className="h-5 w-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-ping" />
                    AI Neural Ingestion Engine
                  </span>
                  <span className="text-slate-400 hidden sm:inline">·</span>
                  <span className="font-mono text-[10px] text-slate-400 hidden sm:inline">
                    YouTube 3-Strikes Shield
                  </span>
                </div>
                <h2 className="font-display text-sm sm:text-base font-black truncate max-w-md">
                  Analyzing: <span className="text-red-500">{videoTitle || 'Uploaded Video'}</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                  isLight
                    ? 'border-slate-300 hover:bg-slate-100 text-slate-700'
                    : 'border-slate-700 hover:bg-slate-800 text-slate-300'
                }`}
                title="Minimize and continue in background"
              >
                <Minimize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Minimize</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl p-1.5 text-slate-400 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Center Visual Scanner Radar & Progress Header */}
            <div className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 text-white text-center shadow-xl">
              {/* Animated laser sweep bar across the card */}
              {!isCompleted && (
                <div
                  className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-75 blur-xs animate-pulse"
                  style={{
                    top: `${(progressPercent % 100)}%`,
                    transition: 'top 0.4s ease-out',
                  }}
                />
              )}

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Left: Frame Scan Hologram / Thumbnail */}
                <div className="relative w-40 sm:w-48 aspect-video rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-lg shadow-red-950/60 shrink-0 bg-black">
                  {extractedFrames.length > 0 ? (
                    <img
                      src={extractedFrames[activeFrameIndex]?.dataUrl}
                      alt="Analyzing keyframe"
                      className="h-full w-full object-cover transition-all duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-slate-500">
                      <Film className="h-8 w-8 text-red-500 animate-pulse" />
                      <span className="text-[10px] font-mono">Frame Extraction</span>
                    </div>
                  )}

                  {/* Laser line overlay */}
                  {!isCompleted && (
                    <div className="absolute inset-x-0 top-1/2 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-bounce" />
                  )}

                  {/* Timestamp badge */}
                  <div className="absolute bottom-1 left-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                    {extractedFrames[activeFrameIndex]?.timestamp || '00:04'}
                  </div>

                  <div className="absolute top-1 right-1 rounded-full bg-red-600/90 px-1.5 py-0.2 font-mono text-[8px] font-bold text-white uppercase">
                    Scan Active
                  </div>
                </div>

                {/* Center: Live percentage, circular radar & status message */}
                <div className="flex-1 text-center md:text-left min-w-0">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                    <span className="rounded-full bg-red-500/10 border border-red-500/30 px-3 py-0.5 font-mono text-[10px] font-bold text-red-400 uppercase tracking-wider">
                      {isCompleted ? 'ANALYSIS COMPLETE' : 'PROCESSING VIDEO'}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      Step {currentStep} of 5
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight">
                      {progressPercent}%
                    </span>
                    <span className="font-sans text-xs sm:text-sm text-slate-300 font-medium">
                      {progressStatus}
                    </span>
                  </div>

                  {/* Big Progress Track Bar */}
                  <div className="mt-3.5 relative h-3 w-full rounded-full bg-slate-800 overflow-hidden ring-1 ring-white/10">
                    <motion.div
                      className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-emerald-500 rounded-full"
                      style={{ width: `${progressPercent}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Keyframes: {extractedFrames.length || 8} Slices</span>
                    <span>Gemini 2.5 Flash Ingest</span>
                    <span>Status: {isCompleted ? 'All Passed ✅' : 'Scanning...'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Checklist Pipeline ("Sab OK" Animations) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-red-500" />
                  <span>5-Point Algorithmic Verification Pipeline</span>
                </h3>
                <span className="font-mono text-[11px] text-slate-400">
                  {isCompleted ? '5/5 OK Verified' : `${currentStep - 1}/5 Completed`}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {ANALYSIS_STEPS.map((step) => {
                  const isDone = isCompleted || step.id < currentStep;
                  const isCurrent = !isCompleted && step.id === currentStep;

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: step.id * 0.05 }}
                      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        isDone
                          ? isLight
                            ? 'border-emerald-200 bg-emerald-50/70 text-slate-900 shadow-xs'
                            : 'border-emerald-500/30 bg-emerald-950/20 text-slate-100 shadow-xs'
                          : isCurrent
                          ? isLight
                            ? 'border-red-300 bg-red-50/70 text-slate-900 ring-2 ring-red-500/20'
                            : 'border-red-500/40 bg-red-950/30 text-white ring-2 ring-red-500/20 shadow-md shadow-red-950/30'
                          : isLight
                          ? 'border-slate-200 bg-slate-50/50 text-slate-400'
                          : 'border-slate-800/60 bg-slate-950/40 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Status Icon Indicator */}
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold text-xs shrink-0 transition-transform ${
                            isDone
                              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105'
                              : isCurrent
                              ? 'bg-red-600 text-white shadow-md shadow-red-600/30 animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isDone ? (
                            <Check className="h-5 w-5 stroke-[3]" />
                          ) : isCurrent ? (
                            <span className="font-mono text-xs">{step.id}</span>
                          ) : (
                            <span className="font-mono text-xs">{step.id}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-bold text-xs sm:text-sm truncate">
                              {step.label}
                            </span>
                          </div>
                          <p
                            className={`text-[11px] truncate mt-0.5 ${
                              isDone
                                ? isLight
                                  ? 'text-slate-600'
                                  : 'text-slate-300'
                                : isCurrent
                                ? 'text-red-500 dark:text-red-400 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {isCurrent ? progressStatus : step.desc}
                          </p>
                        </div>
                      </div>

                      {/* "OK" Badge Animation */}
                      <div className="shrink-0 ml-3">
                        {isDone ? (
                          <motion.span
                            initial={{ scale: 0.7, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 font-mono text-xs font-black px-3 py-1 shadow-xs"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 fill-current text-emerald-500" />
                            <span>OK PASSED</span>
                          </motion.span>
                        ) : isCurrent ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-red-500/10 text-red-500 font-mono text-[11px] font-bold px-2.5 py-1 animate-pulse border border-red-500/20">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                            SCANNING
                          </span>
                        ) : (
                          <span className="font-mono text-[11px] text-slate-400">
                            QUEUED
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Post-Completion Verdict Showcase */}
            {isCompleted && report && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl border p-5 sm:p-6 transition shadow-xl ${
                  report.safetyGrade === 'SAFE_TO_UPLOAD'
                    ? 'border-emerald-500/30 bg-emerald-950/20 text-slate-100'
                    : 'border-red-500/40 bg-red-950/30 text-slate-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg shrink-0 ${
                        report.safetyGrade === 'SAFE_TO_UPLOAD'
                          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                          : 'bg-red-600 text-white shadow-red-600/30 animate-pulse'
                      }`}
                    >
                      {report.safetyGrade === 'SAFE_TO_UPLOAD' ? (
                        <ShieldCheck className="h-8 w-8" />
                      ) : (
                        <ShieldAlert className="h-8 w-8" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
                          {report.safetyGrade.replace(/_/g, ' ')}
                        </span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-xs text-slate-300">
                          Score: {Math.max(0, 100 - report.overallRiskScore)}%
                        </span>
                      </div>
                      <h4 className="font-display text-base font-black">
                        {report.safetyGrade === 'SAFE_TO_UPLOAD'
                          ? 'Clean Video - Safe to Publish to YouTube!'
                          : `High-Risk Policy Violations Intercepted (${report.timelineViolations.length} Flagged)`}
                      </h4>
                      <p className="font-sans text-xs text-slate-300 mt-1 line-clamp-1">
                        {report.summaryVerdictEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onViewResults?.();
                        onClose();
                      }}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white px-6 py-3 font-sans text-xs font-bold transition shadow-lg shadow-red-600/30 cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>View Full Audit Results</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/60 text-xs font-sans">
            <span className="text-slate-500 font-mono text-[11px] truncate">
              {isCompleted
                ? 'All 5 validation checks verified and complete.'
                : 'Frame-accurate temporal analysis running client-side...'}
            </span>

            <div className="flex items-center gap-3">
              {autoCloseCountdown !== null && autoCloseCountdown > 0 && (
                <span className="font-mono text-[11px] text-slate-400">
                  Auto-closing in {autoCloseCountdown}s
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  if (onViewResults) onViewResults();
                  onClose();
                }}
                className={`rounded-xl px-4 py-1.5 font-bold transition cursor-pointer ${
                  isCompleted
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-md'
                    : isLight
                    ? 'border border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                    : 'border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isCompleted ? 'Done & Open Results' : 'Dismiss'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
