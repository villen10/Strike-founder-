import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  MoreVertical,
  Play,
  Clock,
  FileVideo,
  FileText,
  AlertCircle,
  Layers,
  Activity,
  Check,
  CheckCircle2,
  Loader2,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  AlertTriangle,
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

export const FullScreenAnalysisModal: React.FC<FullScreenAnalysisModalProps> = ({
  isOpen,
  onClose,
  videoTitle,
  progressPercent,
  progressStatus,
  extractedFrames = [],
  report,
  onViewResults,
}) => {
  const [activeFrameIndex, setActiveFrameIndex] = useState(0);

  // Cycle through extracted frames rapidly to create a live studio inspection feed
  useEffect(() => {
    if (!isOpen || extractedFrames.length === 0) return;
    const interval = setInterval(() => {
      setActiveFrameIndex((prev) => (prev + 1) % extractedFrames.length);
    }, 450);
    return () => clearInterval(interval);
  }, [isOpen, extractedFrames.length]);

  if (!isOpen) return null;

  const currentStep =
    progressPercent < 35
      ? 1
      : progressPercent < 70
      ? 2
      : 3;

  const isCompleted = progressPercent >= 100;
  const isHighStrike = report?.safetyGrade === 'HIGH_STRIKE_RISK';
  const isCaution = report?.safetyGrade === 'MONETIZATION_AT_RISK';
  const isClean = report?.safetyGrade === 'SAFE_TO_UPLOAD';

  const currentFrame = extractedFrames[activeFrameIndex] || extractedFrames[0];
  const durationText = report?.durationFormatted || currentFrame?.timestamp || '00:41';

  // SVG Radial Ring Calculations (Radius: 46px -> Circumference ~289.02)
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (Math.min(100, Math.max(5, progressPercent)) / 100) * circumference;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Fullscreen Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#070b14]/90 backdrop-blur-md"
        />

        {/* Modal Main Frame matching user reference image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative flex flex-col w-full max-w-[440px] sm:max-w-[480px] rounded-[28px] border border-[#1c2638] bg-[#0b101b] text-white shadow-2xl shadow-black/80 overflow-hidden z-10 my-auto"
        >
          {/* 1. Header Bar: [←] [Logo] Striku / Video Analysis [...] */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
                title="Back / Close"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2.5">
                {/* Red Shield Logo */}
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-600 to-red-700 shadow-md shadow-red-900/40 shrink-0">
                  <Play className="h-4 w-4 fill-white text-white ml-0.5" />
                </div>
                <div>
                  <h1 className="font-display text-base font-bold text-white tracking-tight leading-tight">
                    Striku
                  </h1>
                  <p className="font-sans text-[11px] text-slate-400 font-medium">
                    Video Analysis
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
              title="Options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>

          {/* Main Scrollable Body */}
          <div className="px-4 pb-4 space-y-3.5 overflow-y-auto max-h-[82vh] scrollbar-thin">
            {/* 2. Video Preview Card */}
            <div className="rounded-[22px] border border-[#1b263a] bg-[#101726] p-3.5 flex items-center gap-3.5 shadow-sm">
              {/* Thumbnail Container */}
              <div className="relative w-36 sm:w-40 aspect-[16/10] rounded-xl overflow-hidden bg-black shrink-0 border border-slate-700/60 shadow-inner">
                {currentFrame?.dataUrl ? (
                  <img
                    src={currentFrame.dataUrl}
                    alt="Active Frame"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500 bg-slate-900">
                    <FileVideo className="h-6 w-6 text-red-500" />
                  </div>
                )}

                {/* Bottom Left Duration Pill: ▶ 00:41 */}
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-md bg-black/85 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-xs">
                  <Play className="h-2.5 w-2.5 fill-white text-white" />
                  <span>{durationText}</span>
                </div>
              </div>

              {/* Video Info Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-rose-600 to-red-500 shadow-xs shrink-0">
                    <FileVideo className="h-3.5 w-3.5 text-white" />
                  </div>
                  <h3
                    className="font-display text-sm font-bold text-white truncate max-w-[160px] sm:max-w-[180px]"
                    title={videoTitle}
                  >
                    {videoTitle || 'Uploaded Video.mp4'}
                  </h3>
                </div>

                {/* Meta details: Clock, MP4, HD */}
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    <span>{durationText}</span>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3 text-slate-400" />
                    <span>MP4</span>
                  </span>
                  <span className="rounded border border-slate-700 px-1 py-0.1 text-[9px] font-bold text-slate-400">
                    HD
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Main Inspection & Radial Progress Card */}
            <div className="rounded-[22px] border border-[#1b263a] bg-[#101726] p-4 sm:p-5 shadow-sm">
              <div className="flex items-center gap-4 sm:gap-5">
                {/* SVG Radial Ring */}
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 104 104">
                    {/* Background Track */}
                    <circle
                      cx="52"
                      cy="52"
                      r={radius}
                      stroke="#182335"
                      strokeWidth="9"
                      fill="none"
                    />
                    {/* Active Progress Gradient Stroke */}
                    <defs>
                      <linearGradient id="multiAgentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#ff0055" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="52"
                      cy="52"
                      r={radius}
                      stroke="url(#multiAgentGrad)"
                      strokeWidth="9"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      fill="none"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>

                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-display text-2xl font-black text-white leading-tight">
                      {progressPercent}%
                    </span>
                    <span className="font-sans text-[10px] text-slate-400 -mt-0.5">
                      Match
                    </span>
                  </div>
                </div>

                {/* Right Details */}
                <div className="flex-1 min-w-0">
                  {/* Status Pill: ! MULTI-AGENT INSPECTION */}
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 mb-1.5">
                    <AlertCircle className="h-3 w-3 text-rose-400 shrink-0" />
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-rose-300">
                      Multi-Agent Inspection
                    </span>
                  </div>

                  {/* Pass Title */}
                  <h3 className="font-display text-xl font-black text-white tracking-tight">
                    {isCompleted ? 'Pass 3/3' : `Pass ${currentStep}/3`}
                  </h3>

                  {/* Subtitle */}
                  <p className="font-sans text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {isCompleted
                      ? isHighStrike
                        ? 'Strike hazard detected in consensus audit'
                        : 'Content verified for YouTube compliance'
                      : progressStatus || 'Analyzing content for policy compliance...'}
                  </p>

                  {/* Gradient Horizontal Bar */}
                  <div className="mt-2.5 relative h-2 w-full rounded-full bg-[#182335] overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#f43f5e] via-[#fb7185] to-[#f59e0b]"
                      style={{ width: `${Math.max(6, progressPercent)}%` }}
                      transition={{ ease: 'easeOut', duration: 0.3 }}
                    />
                  </div>

                  {/* Bottom Stats: 7 Key Frames • Neural Consensus Sync */}
                  <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <Layers className="h-3.5 w-3.5 text-rose-500" />
                      <span>{extractedFrames.length || 7} Key Frames</span>
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="truncate">Neural Consensus Sync</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Section: Multi-Agent Neural Pipeline */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-rose-500" />
                  <h3 className="font-display text-sm font-bold text-white tracking-tight">
                    Multi-Agent Neural Pipeline
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>
                    {isCompleted ? 'All Agents Complete' : `Agent ${currentStep} of 3 Active`}
                  </span>
                </div>
              </div>

              {/* Stage Cards (Pass 1, Pass 2, Pass 3) */}
              <div className="space-y-2">
                {/* PASS 1: AGENT ALPHA */}
                <div
                  className={`rounded-[18px] border p-3 sm:p-3.5 flex items-center justify-between transition-all ${
                    isCompleted || currentStep > 1
                      ? 'border-[#064e3b]/80 bg-[#0d2223] text-emerald-100 shadow-xs'
                      : currentStep === 1
                      ? 'border-rose-500/60 bg-[#22121e] text-rose-100 shadow-xs ring-1 ring-rose-500/30'
                      : 'border-[#1b263a] bg-[#101726] text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Circle Icon */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-white shrink-0 ${
                        isCompleted || currentStep > 1
                          ? 'bg-[#059669]'
                          : currentStep === 1
                          ? 'bg-rose-600 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted || currentStep > 1 ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : currentStep === 1 ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="font-mono text-xs">1</span>
                      )}
                    </div>

                    {/* Pass Badge Box */}
                    <div
                      className={`rounded-xl px-2.5 py-1 text-center shrink-0 border ${
                        isCompleted || currentStep > 1
                          ? 'bg-[#064e3b]/80 border-emerald-500/30 text-emerald-400'
                          : 'bg-[#182335] border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="font-mono text-[9px] font-bold tracking-wider uppercase">
                        PASS 1
                      </div>
                      <div className="font-display text-[10.5px] font-bold text-white tracking-tight">
                        AGENT ALPHA
                      </div>
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <h4 className="font-display text-xs sm:text-sm font-bold text-white truncate">
                        4-Second Temporal Analysis
                      </h4>
                      <p className="font-sans text-[11px] text-slate-400 truncate">
                        Splitting timeline into 4s intervals...
                      </p>
                    </div>
                  </div>

                  {/* Right Status Pill */}
                  <div className="shrink-0 ml-2">
                    {isCompleted || currentStep > 1 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-[#064e3b]/60 px-3 py-1 font-sans text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-[#4c0519]/60 px-3 py-1 font-sans text-xs font-bold text-rose-300 animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Analyzing...</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* PASS 2: AGENT BETA */}
                <div
                  className={`rounded-[18px] border p-3 sm:p-3.5 flex items-center justify-between transition-all ${
                    isCompleted || currentStep > 2
                      ? 'border-[#064e3b]/80 bg-[#0d2223] text-emerald-100 shadow-xs'
                      : currentStep === 2
                      ? 'border-rose-500/60 bg-[#22121e] text-rose-100 shadow-xs ring-1 ring-rose-500/30'
                      : 'border-[#1b263a] bg-[#101726] text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-white shrink-0 ${
                        isCompleted || currentStep > 2
                          ? 'bg-[#059669]'
                          : currentStep === 2
                          ? 'bg-rose-600 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted || currentStep > 2 ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : currentStep === 2 ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <span className="font-mono text-xs">2</span>
                      )}
                    </div>

                    <div
                      className={`rounded-xl px-2.5 py-1 text-center shrink-0 border ${
                        currentStep === 2
                          ? 'bg-[#4c0519]/80 border-rose-500/30 text-rose-400'
                          : isCompleted || currentStep > 2
                          ? 'bg-[#064e3b]/80 border-emerald-500/30 text-emerald-400'
                          : 'bg-[#182335] border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="font-mono text-[9px] font-bold tracking-wider uppercase">
                        PASS 2
                      </div>
                      <div className="font-display text-[10.5px] font-bold text-white tracking-tight">
                        AGENT BETA
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-display text-xs sm:text-sm font-bold text-white truncate">
                        Fine Cutaways & Context
                      </h4>
                      <p className="font-sans text-[11px] text-slate-400 truncate">
                        Cross-checking visual and audio cues...
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isCompleted || currentStep > 2 ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-[#064e3b]/60 px-3 py-1 font-sans text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : currentStep === 2 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-[#4c0519]/60 px-3 py-1 font-sans text-xs font-bold text-rose-300 animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Analyzing...</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-sans text-xs font-medium text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>Queued</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* PASS 3: AGENT OMEGA */}
                <div
                  className={`rounded-[18px] border p-3 sm:p-3.5 flex items-center justify-between transition-all ${
                    isCompleted && isHighStrike
                      ? 'border-red-500/70 bg-[#261019] text-red-100 shadow-xs'
                      : isCompleted && isClean
                      ? 'border-[#064e3b]/80 bg-[#0d2223] text-emerald-100 shadow-xs'
                      : currentStep === 3
                      ? 'border-rose-500/60 bg-[#22121e] text-rose-100 shadow-xs ring-1 ring-rose-500/30'
                      : 'border-[#1b263a] bg-[#101726] text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-white shrink-0 ${
                        isCompleted && isHighStrike
                          ? 'bg-red-600 shadow-sm'
                          : isCompleted && isClean
                          ? 'bg-[#059669]'
                          : currentStep === 3
                          ? 'bg-rose-600 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted && isHighStrike ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : isCompleted && isClean ? (
                        <Check className="h-4 w-4 stroke-[3]" />
                      ) : currentStep === 3 ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Cpu className="h-4 w-4 text-slate-400" />
                      )}
                    </div>

                    <div
                      className={`rounded-xl px-2.5 py-1 text-center shrink-0 border ${
                        isCompleted && isHighStrike
                          ? 'bg-red-950/80 border-red-500/40 text-red-400'
                          : isCompleted && isClean
                          ? 'bg-[#064e3b]/80 border-emerald-500/30 text-emerald-400'
                          : currentStep === 3
                          ? 'bg-[#4c0519]/80 border-rose-500/30 text-rose-400'
                          : 'bg-[#182335] border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="font-mono text-[9px] font-bold tracking-wider uppercase">
                        PASS 3
                      </div>
                      <div className="font-display text-[10.5px] font-bold text-white tracking-tight">
                        AGENT OMEGA
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-display text-xs sm:text-sm font-bold text-white truncate">
                        Policy & Safety Check
                      </h4>
                      <p className="font-sans text-[11px] text-slate-400 truncate">
                        Consolidating cross-agent findings...
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {isCompleted && isHighStrike ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-red-500/40 bg-red-950/60 px-3 py-1 font-sans text-xs font-bold text-red-400">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>Strike Risk</span>
                      </span>
                    ) : isCompleted && isClean ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-[#064e3b]/60 px-3 py-1 font-sans text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : currentStep === 3 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-[#4c0519]/60 px-3 py-1 font-sans text-xs font-bold text-rose-300 animate-pulse">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Analyzing...</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1 font-sans text-xs font-medium text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>Queued</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Completion Result Callout (When audit finishes) */}
            {isCompleted && report && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-[20px] border p-4 sm:p-4.5 transition-all shadow-lg flex flex-col gap-2.5 ${
                  isHighStrike
                    ? 'border-red-600/70 bg-gradient-to-b from-red-950/50 to-[#101726] text-red-100 ring-1 ring-red-500/30'
                    : isClean
                    ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 to-[#101726] text-emerald-100'
                    : 'border-amber-500/40 bg-gradient-to-b from-amber-950/40 to-[#101726] text-amber-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl shrink-0 mt-0.5 text-white ${
                      isHighStrike
                        ? 'bg-red-600 shadow-md shadow-red-900/50 animate-pulse'
                        : isClean
                        ? 'bg-emerald-600 shadow-md shadow-emerald-900/40'
                        : 'bg-amber-600'
                    }`}
                  >
                    {isHighStrike ? (
                      <ShieldAlert className="h-5 w-5" />
                    ) : (
                      <ShieldCheck className="h-5 w-5" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider mb-1 ${
                        isHighStrike
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {isHighStrike ? 'Strike Hazard Detected' : 'Verified 100% Safe'}
                    </span>

                    <h4 className="font-display text-sm font-bold text-white leading-snug">
                      {report.mainIssueHeadline || 'YouTube Guidelines Audit Verdict'}
                    </h4>

                    <p className="font-sans text-xs text-slate-300 mt-1 leading-relaxed">
                      {report.mainIssueDetail || report.summaryVerdictEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 6. Bottom Bar: 3-Pass neural inspection active... / Dismiss or View Full Report */}
            <div className="rounded-[18px] border border-[#1b263a] bg-[#101726] px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2 text-slate-400 font-sans text-xs truncate">
                <Activity className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span className="truncate">
                  {isCompleted
                    ? 'Consensus analysis complete'
                    : '3-Pass neural inspection active...'}
                </span>
              </div>

              {isCompleted ? (
                <button
                  type="button"
                  onClick={() => {
                    onViewResults?.();
                    onClose();
                  }}
                  className="rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-display text-xs font-bold px-4 py-1.5 transition shadow-md shadow-red-900/30 cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <span>View Full Report</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-display text-xs font-semibold px-4 py-1 transition cursor-pointer shrink-0"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
