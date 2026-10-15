import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Film,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  X,
  Minimize2,
  ArrowRight,
  Activity,
  Check,
  Loader2,
  AlertOctagon,
} from 'lucide-react';
import { AuditReport } from '../types/audit';
import { ExtractedFrame } from '../services/frameExtractor';

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

const ANALYSIS_STEPS = [
  { id: 1, label: 'Visual Ingest & Keyframe Extraction', desc: 'Decoding frame sequence and motion vectors' },
  { id: 2, label: 'Sex, Nudity & Adult Content Policy', desc: 'Screening for explicit material, porn, or exposure' },
  { id: 3, label: 'Child Safety & Physical Violence', desc: 'Checking for dangerous stunts, weapons, and harm' },
  { id: 4, label: 'Opening 7-Second Advertiser Rules', desc: 'Verifying vulgarity, shock value, and green dollar' },
  { id: 5, label: 'Final Strike & Monetization Verdict', desc: 'Computing platform risk score and safe cut timecodes' },
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

  useEffect(() => {
    if (!isOpen || extractedFrames.length === 0) return;
    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % extractedFrames.length);
    }, 600);
    return () => clearInterval(interval);
  }, [isOpen, extractedFrames.length]);

  if (!isOpen) return null;

  const currentStep =
    progressPercent < 20
      ? 1
      : progressPercent < 45
      ? 2
      : progressPercent < 70
      ? 3
      : progressPercent < 92
      ? 4
      : 5;

  const isCompleted = progressPercent >= 100;
  const isHighStrike = report?.safetyGrade === 'HIGH_STRIKE_RISK';
  const isAtRisk = report?.safetyGrade === 'MONETIZATION_AT_RISK';
  const isClean = report?.safetyGrade === 'SAFE_TO_UPLOAD';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Fullscreen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative flex flex-col w-full max-w-3xl max-h-[92vh] rounded-3xl border shadow-2xl overflow-hidden z-10 ${
            isLight
              ? 'bg-white border-slate-200 text-slate-900 shadow-slate-400/30'
              : 'bg-slate-900 border-slate-800 text-slate-100 shadow-slate-950/50'
          }`}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-2xl text-white shadow-sm shrink-0 ${
                  isCompleted && isHighStrike ? 'bg-red-600 animate-pulse' : 'bg-red-600'
                }`}
              >
                {isCompleted && isHighStrike ? (
                  <AlertOctagon className="h-5 w-5" />
                ) : (
                  <Film className="h-4.5 w-4.5" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-[11px] font-bold uppercase tracking-wider text-red-600">
                    Video Guidelines Audit
                  </span>
                  <span className="text-slate-400 hidden sm:inline">·</span>
                  <span className="font-sans text-[11px] text-slate-500 hidden sm:inline">
                    YouTube Strike & Adult Content Protection
                  </span>
                </div>
                <h2 className="font-display text-sm sm:text-base font-bold truncate max-w-md">
                  Analyzing: <span className="text-red-600">{videoTitle || 'Uploaded Video'}</span>
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
                className="rounded-xl p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Modal Main Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* Center Visual Progress Card */}
            <div
              className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 transition shadow-sm ${
                isCompleted && isHighStrike
                  ? 'border-red-500/50 bg-red-950/20 text-red-100 ring-2 ring-red-500/30'
                  : isLight
                  ? 'border-slate-200 bg-slate-50 text-slate-900'
                  : 'border-slate-800 bg-slate-950 text-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                {/* Left: Frame Thumbnail */}
                <div className="relative w-44 aspect-video rounded-2xl overflow-hidden border border-slate-700/60 shadow-md shrink-0 bg-black">
                  {extractedFrames.length > 0 ? (
                    <img
                      src={extractedFrames[activeFrameIndex]?.dataUrl}
                      alt="Analyzing keyframe"
                      className="h-full w-full object-cover transition-all duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-500">
                      <Film className="h-6 w-6 text-red-500" />
                      <span className="text-[10px] font-sans">Extracting Frame</span>
                    </div>
                  )}

                  {/* Timestamp badge */}
                  <div className="absolute bottom-1.5 left-1.5 rounded-md bg-black/80 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white">
                    {extractedFrames[activeFrameIndex]?.timestamp || '00:04'}
                  </div>

                  <div
                    className={`absolute top-1.5 right-1.5 rounded-full px-2 py-0.5 font-sans text-[9px] font-bold text-white ${
                      isCompleted
                        ? isHighStrike
                          ? 'bg-red-600 animate-pulse'
                          : 'bg-emerald-600'
                        : 'bg-indigo-600'
                    }`}
                  >
                    {isCompleted ? (isHighStrike ? 'Strike Hazard' : 'Verified') : 'Auditing'}
                  </div>
                </div>

                {/* Center: Live percentage & status message */}
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-sans text-[11px] font-bold uppercase ${
                        isCompleted
                          ? isHighStrike
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-red-500/10 text-red-600'
                      }`}
                    >
                      {isCompleted
                        ? isHighStrike
                          ? 'Critical Violations Found'
                          : 'Audit Complete'
                        : 'Auditing Guidelines'}
                    </span>
                    <span className="font-sans text-xs text-slate-400">
                      Step {currentStep} of 5
                    </span>
                  </div>

                  <div className="flex items-baseline justify-center sm:justify-start gap-2">
                    <span
                      className={`font-display text-4xl sm:text-5xl font-black tracking-tight ${
                        isCompleted && isHighStrike ? 'text-red-500' : ''
                      }`}
                    >
                      {progressPercent}%
                    </span>
                    <span className="font-sans text-xs text-slate-500 font-medium truncate">
                      {progressStatus}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-3.5 relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${isHighStrike ? 'bg-red-600' : 'bg-red-600'}`}
                      style={{ width: `${progressPercent}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{extractedFrames.length || 6} Keyframes Extracted</span>
                    <span>
                      {isCompleted
                        ? isHighStrike
                          ? 'Strike Alert ❌'
                          : isAtRisk
                          ? 'Monetization Caution ⚠️'
                          : 'Safe to Upload ✅'
                        : 'Testing platform policies...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Checklist Pipeline */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-red-500" />
                  <span>5-Point Platform Compliance Pipeline</span>
                </h3>
                <span className="font-sans text-xs text-slate-400 font-semibold">
                  {isCompleted ? '5 of 5 Analyzed' : `${currentStep - 1} of 5 Completed`}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {ANALYSIS_STEPS.map((step) => {
                  const isDone = isCompleted || step.id < currentStep;
                  const isCurrent = !isCompleted && step.id === currentStep;

                  // Check if this step failed in the final report
                  const isStepFlagged =
                    isCompleted &&
                    ((step.id === 2 && (report?.categoryScores?.sexualContent ?? 0) > 40) ||
                      (step.id === 3 &&
                        ((report?.categoryScores?.violenceGore ?? 0) > 40 ||
                          (report?.categoryScores?.childSafety ?? 0) > 40)) ||
                      (step.id === 4 && report?.first7SecondsStatus === 'FLAGGED') ||
                      (step.id === 5 && isHighStrike));

                  return (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: step.id * 0.04 }}
                      className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                        isStepFlagged
                          ? 'border-red-500/50 bg-red-950/20 text-red-200'
                          : isDone
                          ? isLight
                            ? 'border-emerald-200 bg-emerald-50/70 text-slate-900 shadow-2xs'
                            : 'border-emerald-500/30 bg-emerald-950/20 text-slate-100 shadow-2xs'
                          : isCurrent
                          ? isLight
                            ? 'border-red-300 bg-red-50/70 text-slate-900 ring-2 ring-red-500/20'
                            : 'border-red-500/40 bg-red-950/30 text-white ring-2 ring-red-500/20 shadow-sm'
                          : isLight
                          ? 'border-slate-200 bg-slate-50/50 text-slate-400'
                          : 'border-slate-800/60 bg-slate-950/40 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-xl font-bold text-xs shrink-0 transition-transform ${
                            isStepFlagged
                              ? 'bg-red-600 text-white shadow-sm'
                              : isDone
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : isCurrent
                              ? 'bg-red-600 text-white shadow-sm animate-pulse'
                              : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isStepFlagged ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : isDone ? (
                            <Check className="h-4 w-4 stroke-[3]" />
                          ) : isCurrent ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <span className="font-mono text-xs">{step.id}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <span className="font-sans font-bold text-xs sm:text-sm truncate block">
                            {step.label}
                          </span>
                          <p
                            className={`text-xs truncate mt-0.5 ${
                              isStepFlagged
                                ? 'text-red-400 font-medium'
                                : isDone
                                ? isLight
                                  ? 'text-slate-600'
                                  : 'text-slate-300'
                                : isCurrent
                                ? 'text-red-600 dark:text-red-400 font-medium'
                                : 'text-slate-400'
                            }`}
                          >
                            {isCurrent ? progressStatus : step.desc}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 ml-3">
                        {isStepFlagged ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-red-500/20 border border-red-500/40 text-red-500 font-sans text-xs font-bold px-2.5 py-1">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            <span>Strike Risk</span>
                          </span>
                        ) : isDone ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-sans text-xs font-bold px-2.5 py-1">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Passed</span>
                          </span>
                        ) : isCurrent ? (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-red-500/10 text-red-600 font-sans text-xs font-bold px-2.5 py-1">
                            <span>Checking...</span>
                          </span>
                        ) : (
                          <span className="font-sans text-xs text-slate-400">
                            Queued
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Completion Summary */}
            {isCompleted && report && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-2xl border p-5 sm:p-6 transition shadow-md ${
                  isClean
                    ? 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-slate-900 dark:text-slate-100'
                    : isHighStrike
                    ? 'border-red-500/60 bg-red-950/40 text-red-100 ring-2 ring-red-500/40'
                    : 'border-amber-500/40 bg-amber-950/20 text-amber-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 text-center sm:text-left">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm shrink-0 ${
                        isClean
                          ? 'bg-emerald-600 text-white'
                          : isHighStrike
                          ? 'bg-red-600 text-white animate-pulse'
                          : 'bg-amber-600 text-white'
                      }`}
                    >
                      {isClean ? (
                        <ShieldCheck className="h-7 w-7" />
                      ) : (
                        <ShieldAlert className="h-7 w-7" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-display text-sm sm:text-base font-bold">
                        {isClean
                          ? 'Safe to Publish to YouTube!'
                          : isHighStrike
                          ? `CRITICAL STRIKE RISK (${report.timelineViolations.length} Violations Flagged)`
                          : `Monetization Caution (${report.timelineViolations.length} Issues)`}
                      </h4>
                      <p className="font-sans text-xs text-slate-300 mt-0.5 line-clamp-2">
                        {report.summaryVerdictEn}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onViewResults?.();
                      onClose();
                    }}
                    className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl text-white px-5 py-2.5 font-sans text-xs font-bold transition shadow-sm cursor-pointer ${
                      isHighStrike
                        ? 'bg-red-600 hover:bg-red-700 shadow-red-600/30 ring-2 ring-red-400'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    <span>View Audit Report</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 text-xs font-sans">
            <span className="text-slate-500 truncate">
              {isCompleted
                ? isHighStrike
                  ? 'Severe policy violations detected. Do NOT publish directly to YouTube.'
                  : 'Guidelines audit finished.'
                : 'Auditing video file keyframes...'}
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onViewResults) onViewResults();
                  onClose();
                }}
                className={`rounded-xl px-4 py-1.5 font-bold transition cursor-pointer ${
                  isCompleted
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
                    : isLight
                    ? 'border border-slate-300 bg-white hover:bg-slate-100 text-slate-800'
                    : 'border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {isCompleted ? 'View Full Report' : 'Dismiss'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
