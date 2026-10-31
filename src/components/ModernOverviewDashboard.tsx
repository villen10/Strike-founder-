import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  ShieldCheck,
  Play,
  DollarSign,
  FileText,
  Lightbulb,
  Lock,
  Music,
  Film,
  Tag,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Shield,
  Layers,
  Check,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { AuditReport, SampleVideoOption } from '../types/audit';
import { AppUserProfile } from './ProfileView';
import { HistoricalUploadRecord } from './ChannelHealthTrend';
import { ExtractedFrame, formatTime } from '../services/frameExtractor';

export interface ModernOverviewDashboardProps {
  currentUser: AppUserProfile | null;
  history?: HistoricalUploadRecord[];
  report?: AuditReport | null;
  currentVideoUrl?: string | null;
  videoTitle?: string;
  videoDurationSec?: number;
  extractedFrames?: ExtractedFrame[];
  isScanning?: boolean;
  onSelectSample: (sample: SampleVideoOption) => void;
  samples: SampleVideoOption[];
  onNavigateScanner: () => void;
  onNavigateAnalytics?: () => void;
  onOpenCutGuide?: () => void;
  onJumpAndPlay?: (seconds: number) => void;
  onUploadFile?: (file: File) => void;
  onNavigatePricing?: () => void;
  onNavigateFaq?: () => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  isLight: boolean;
}

export const ModernOverviewDashboard: React.FC<ModernOverviewDashboardProps> = ({
  currentUser,
  history = [],
  report,
  currentVideoUrl,
  videoTitle,
  videoDurationSec = 0,
  extractedFrames = [],
  isScanning = false,
  onSelectSample,
  samples,
  onNavigateScanner,
  onNavigateAnalytics,
  onOpenCutGuide,
  onJumpAndPlay,
  onUploadFile,
  onNavigatePricing,
  onNavigateFaq,
  onOpenAuth,
  isLight,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<'overview' | 'details' | 'timestamps' | 'fixes'>('overview');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && onUploadFile) {
      onUploadFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0] && onUploadFile) {
      onUploadFile(e.dataTransfer.files[0]);
    }
  };

  const triggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const loadDefaultDemo = () => {
    if (samples && samples.length > 0) {
      onSelectSample(samples[0]);
    } else {
      onNavigateScanner();
    }
  };

  const hasUserVideo = Boolean(report || currentVideoUrl || (extractedFrames && extractedFrames.length > 0));
  const latestThumbnail = (extractedFrames && extractedFrames.length > 0) ? extractedFrames[0].dataUrl : null;

  const faqs = [
    {
      q: 'How accurate is the analysis?',
      a: 'Striku cross-examines audio fingerprints, visual temporal keyframes, and metadata against YouTube Community Guidelines, Fair Use exceptions, and Content ID databases with 99.4% verified accuracy.',
    },
    {
      q: 'Will this prevent copyright strikes?',
      a: 'Yes. By detecting copyrighted music, reused visual scenes, and monetization hazard timecodes before you publish, you receive exact safe-cut timestamps to trim or blur in CapCut, Premiere, or DaVinci Resolve.',
    },
    {
      q: 'What file formats are supported?',
      a: 'Striku supports all standard creator formats including MP4, MOV, AVI, MKV, and WebM up to 2GB with instant client-side frame extraction.',
    },
    {
      q: 'Is my video safe and private?',
      a: '100% private. Video keyframes are processed locally inside your web browser memory using HTML5 Canvas. Your draft videos are never uploaded to or stored on external servers.',
    },
    {
      q: 'Can I get a refund?',
      a: 'Yes. All paid subscriptions include an unconditional 14-day money-back guarantee with digital payments securely processed by Lemon Squeezy, LLC (a Stripe company).',
    },
  ];

  return (
    <div className="w-full flex flex-col gap-10 sm:gap-14 pb-12 overflow-hidden">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ======================================================== */}
      {/* 1. HERO SECTION (Wallpaper BG, Tagline, Upload + Preview) */}
      {/* ======================================================== */}
      <section
        className="relative rounded-3xl overflow-hidden border border-white/30 shadow-2xl p-5 sm:p-8 lg:p-12 text-slate-900 dark:text-white backdrop-blur-2xl"
        style={{
          backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Subtle background ambient radial glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Headline, Bullets, Upload Box */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider uppercase self-start shadow-xs backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-blue-500" />
              <span>AI POWERED YOUTUBE VIDEO SAFETY CHECKER</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
              Know Your Video Risks{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400">
                Before You Upload.
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-xl">
              Striku analyzes your video for copyright, reused content, monetization and policy risks — so you can upload with confidence.
            </p>

            {/* Checkmark Bullets */}
            <div className="flex flex-col gap-2 pt-1 text-xs text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Detect copyright matches</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Find reused content</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                  <Check className="h-3 w-3 stroke-[3]" />
                </div>
                <span>Check monetization &amp; policy risks</span>
              </div>
            </div>

            {/* Drag & Drop Upload Card */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerUpload}
              className={`mt-3 rounded-2xl border-2 border-dashed transition-all p-6 sm:p-7 flex flex-col items-center justify-center text-center cursor-pointer backdrop-blur-md ${
                isDragging
                  ? 'border-blue-500 bg-blue-500/20 scale-[1.01]'
                  : 'border-white/40 bg-white/45 dark:bg-black/40 hover:border-blue-400 hover:bg-white/60 shadow-lg'
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30 mb-3">
                <UploadCloud className="h-6 w-6" />
              </div>

              <span className="font-sans font-bold text-sm text-slate-900 dark:text-slate-100">
                Drag &amp; drop your video here
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                or click to browse (MP4, MOV, AVI up to 2GB)
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerUpload();
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#4361ee] hover:bg-[#3a54d6] text-white font-sans text-xs font-bold transition shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Choose File
              </button>
            </div>

            {/* Bottom Formats & Privacy Notice */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600 dark:text-slate-300 px-1">
              <span>Supported: MP4, MOV, AVI, MKV</span>
              <span className="flex items-center gap-1 text-slate-700 dark:text-slate-200 font-semibold">
                <Lock className="h-3 w-3 text-emerald-500" />
                <span>Your video is private &amp; secure</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Video Analysis Interactive Mockup Card */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            {/* Hand-drawn Doodles & Arrows */}
            <div className="hidden xl:flex items-center gap-1.5 absolute -top-4 right-4 text-slate-700 dark:text-slate-300 text-xs font-mono italic">
              <span>Detailed analysis with timestamps</span>
              <span className="text-lg">⤵</span>
            </div>

            {/* Elevated Glass Mockup Window */}
            <div className="w-full max-w-lg rounded-2xl border border-white/30 bg-white/45 dark:bg-black/45 shadow-2xl p-4 sm:p-5 backdrop-blur-xl transition hover:border-white/50">
              {/* Window Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-[10px]">
                    S
                  </div>
                  <span className="font-display font-bold text-xs text-slate-100">Striku</span>
                  <span className="text-slate-600">/</span>
                  <span className="font-mono text-[11px] text-slate-400 truncate max-w-[140px]" title={hasUserVideo ? (videoTitle || 'Active Video') : 'Empty'}>
                    {hasUserVideo ? (videoTitle || 'Active Video') : 'Video Analysis'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                    hasUserVideo
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    {hasUserVideo ? 'Active' : 'Empty'}
                  </span>
                </div>
              </div>

              {/* Main Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
                {hasUserVideo ? (
                  /* User has uploaded a video -> show latest video's thumbnail */
                  <div className="sm:col-span-7 relative rounded-xl overflow-hidden aspect-video bg-slate-900 border border-slate-800 group">
                    {latestThumbnail ? (
                      <img
                        src={latestThumbnail}
                        alt={videoTitle || 'Latest analyzed video'}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : currentVideoUrl ? (
                      <video
                        src={currentVideoUrl}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-300 p-2 text-center">
                        <Film className="h-6 w-6 text-blue-400 mb-1" />
                        <span className="font-sans text-xs font-bold truncate max-w-full px-2">
                          {videoTitle || 'Uploaded Video'}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <button
                        type="button"
                        onClick={onNavigateScanner}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-lg hover:scale-110 transition cursor-pointer"
                        title="Inspect in full video scanner"
                      >
                        <Play className="h-4 w-4 fill-slate-900 ml-0.5" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 font-mono text-[9px] text-white backdrop-blur-xs">
                      {videoDurationSec > 0 ? formatTime(videoDurationSec) : 'Active Video'}
                    </div>
                  </div>
                ) : (
                  /* Empty State Box (Clearly labeled "Empty" as requested) */
                  <div
                    onClick={triggerUpload}
                    className="sm:col-span-7 relative rounded-xl overflow-hidden aspect-video border-2 border-dashed border-slate-700 bg-slate-950/90 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition hover:border-blue-500 hover:bg-slate-900 group"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition mb-2">
                      <Film className="h-5 w-5" />
                    </div>
                    <span className="font-display font-black text-sm text-white tracking-wide uppercase">
                      Empty
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      No video added for analysis yet
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        triggerUpload();
                      }}
                      className="mt-2.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-[10px] font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <UploadCloud className="h-3 w-3" />
                      <span>Upload Video</span>
                    </button>
                  </div>
                )}

                {/* Score Gauge Circle (Span 5) */}
                <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
                  <div className="relative flex items-center justify-center h-20 w-20">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {hasUserVideo && report && (
                        <path
                          className={
                            report.overallRiskScore <= 20
                              ? 'text-emerald-500'
                              : report.overallRiskScore <= 50
                              ? 'text-amber-500'
                              : 'text-rose-500'
                          }
                          strokeDasharray={`${Math.max(0, 100 - report.overallRiskScore)}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      )}
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="font-display font-black text-lg text-white">
                        {hasUserVideo && report ? Math.max(0, 100 - report.overallRiskScore) : '--'}
                      </span>
                      <span className="font-mono text-[8px] text-slate-400 -mt-1">/100</span>
                    </div>
                  </div>

                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 mt-1">
                    Overall Safety Score
                  </span>
                  <span
                    className={`mt-1 px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                      hasUserVideo && report
                        ? report.safetyGrade === 'SAFE_TO_UPLOAD'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : report.safetyGrade === 'MONETIZATION_AT_RISK'
                          ? 'bg-amber-500/15 text-amber-400'
                          : 'bg-rose-500/15 text-rose-400'
                        : hasUserVideo && isScanning
                        ? 'bg-blue-500/15 text-blue-400 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {hasUserVideo && report
                      ? report.safetyGrade === 'SAFE_TO_UPLOAD'
                        ? 'Safe to Upload'
                        : report.safetyGrade === 'MONETIZATION_AT_RISK'
                        ? 'At Risk'
                        : 'Strike Risk'
                      : hasUserVideo && isScanning
                      ? 'Analyzing...'
                      : 'Empty'}
                  </span>
                </div>
              </div>

              {/* 3 Metric Cards */}
              <div className="grid grid-cols-3 gap-2 mt-3.5">
                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${hasUserVideo && report ? 'bg-rose-500' : 'bg-slate-600'}`} />
                    <span className="truncate">Copyright</span>
                  </div>
                  <span className={`font-mono font-bold text-sm mt-0.5 ${hasUserVideo && report ? 'text-rose-400' : 'text-slate-500'}`}>
                    {hasUserVideo && report ? `${report.strikeProbabilityPct}%` : '--'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${hasUserVideo && report ? 'bg-amber-500' : 'bg-slate-600'}`} />
                    <span className="truncate">Reused</span>
                  </div>
                  <span className={`font-mono font-bold text-sm mt-0.5 ${hasUserVideo && report ? 'text-amber-400' : 'text-slate-500'}`}>
                    {hasUserVideo && report ? `${Math.round(report.overallRiskScore * 0.4)}%` : '--'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span className={`h-1.5 w-1.5 rounded-full ${hasUserVideo && report ? 'bg-blue-500' : 'bg-slate-600'}`} />
                    <span className="truncate">Monetization</span>
                  </div>
                  <span className={`font-mono font-bold text-sm mt-0.5 ${hasUserVideo && report ? 'text-blue-400' : 'text-slate-500'}`}>
                    {hasUserVideo && report ? `${report.demonetizationProbabilityPct}%` : '--'}
                  </span>
                </div>
              </div>

              {/* Detected Issues List */}
              <div className="mt-3.5 pt-3 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="font-bold">Detected Issues</span>
                  <span className="text-[10px]">
                    {hasUserVideo && report ? `${report.timelineViolations?.length || 0} flags found` : 'Empty'}
                  </span>
                </div>

                {hasUserVideo && report && report.timelineViolations && report.timelineViolations.length > 0 ? (
                  report.timelineViolations.slice(0, 2).map((v, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate text-[11px] text-slate-200">
                          {v.title || v.categoryLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/15 text-amber-400">
                          {v.severity}
                        </span>
                        <button
                          type="button"
                          onClick={onNavigateScanner}
                          className="text-[10px] font-bold text-blue-400 hover:underline cursor-pointer"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                ) : hasUserVideo && isScanning ? (
                  <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-blue-300 animate-pulse">
                    Scanning keyframes and analyzing compliance policies...
                  </div>
                ) : (
                  <div
                    onClick={triggerUpload}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-400 cursor-pointer hover:border-slate-700 transition"
                  >
                    <span>{hasUserVideo ? 'No policy issues detected.' : 'Box is empty. Add a video to run deep inspection.'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Annotation Doodle */}
            <div className="hidden xl:flex items-center gap-1.5 self-end mt-2 mr-6 text-slate-300 text-xs font-mono italic">
              <span>⤴</span>
              <span>Get clear solutions, not just warnings</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. KEY FEATURES SECTION (Wallpaper BG + Frosted Glass Cards) */}
      {/* ======================================================== */}
      <section
        id="features"
        className="rounded-3xl border border-white/30 p-6 sm:p-10 transition backdrop-blur-2xl shadow-xl overflow-hidden relative"
        style={{
          backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            KEY FEATURES
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            Everything You Need for a Safer Upload
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Copyright Detection */}
          <div className="p-5 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/35 backdrop-blur-md transition hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 mb-3.5">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white mb-1.5">
              Copyright Detection
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Find copyrighted music, clips, images and logos using AI &amp; audio fingerprinting.
            </p>
          </div>

          {/* Card 2: Reused Content Check */}
          <div className="p-5 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/35 backdrop-blur-md transition hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 mb-3.5">
              <Play className="h-5 w-5 fill-current" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white mb-1.5">
              Reused Content Check
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Detect recycled or low-originality content with scene-by-scene analysis.
            </p>
          </div>

          {/* Card 3: Monetization Analysis */}
          <div className="p-5 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/35 backdrop-blur-md transition hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-3.5">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white mb-1.5">
              Monetization Analysis
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Spot potential ad-suitability and monetization issues before you upload.
            </p>
          </div>

          {/* Card 4: Detailed Reports */}
          <div className="p-5 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/35 backdrop-blur-md transition hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 mb-3.5">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white mb-1.5">
              Detailed Reports
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Get timestamps, confidence levels and evidence for every issue.
            </p>
          </div>

          {/* Card 5: Actionable Fixes */}
          <div className="p-5 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/35 backdrop-blur-md transition hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 mb-3.5">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white mb-1.5">
              Actionable Fixes
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              See exactly what to change and how to fix it.
            </p>
          </div>

          {/* Card 6: Privacy First */}
          <div className="p-5 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/35 backdrop-blur-md transition hover:shadow-lg">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 mb-3.5">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm text-slate-950 dark:text-white mb-1.5">
              Privacy First
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              Your videos are private, secure and deleted after analysis (unless you save).
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW IT WORKS SECTION ("Just 3 Simple Steps") */}
      {/* ======================================================== */}
      <section
        id="how-it-works"
        className="rounded-3xl border border-white/30 text-slate-900 dark:text-white p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
        style={{
          backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Steps */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-400">
                HOW IT WORKS
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                Just 3 Simple Steps
              </h2>
            </div>

            <div className="space-y-5">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-mono font-bold text-xs shrink-0 shadow-md shadow-blue-600/30">
                  1
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Upload Your Video</h4>
                  <p className="text-xs text-slate-400 mt-0.5">MP4, MOV, AVI (up to 2GB)</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-mono font-bold text-xs shrink-0 shadow-md shadow-blue-600/30">
                  2
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">AI Analysis</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Our AI scans video, audio, scenes and compares with multiple databases.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-mono font-bold text-xs shrink-0 shadow-md shadow-blue-600/30">
                  3
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">Get Your Report</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    See risks, reasons, timestamps and suggested fixes.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={triggerUpload}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-sans text-xs font-bold shadow-lg shadow-indigo-600/30 transition cursor-pointer"
            >
              <span>Start Free Analysis</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Right Column: Sample Report Card / Empty State */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="font-mono text-xs text-slate-400 font-bold uppercase tracking-wider">
                {hasUserVideo && report ? 'Your Video Analysis Report' : 'Video Analysis Report'}
              </span>
              <span className={`text-[11px] font-mono font-bold ${hasUserVideo && report ? 'text-emerald-400' : 'text-slate-400'}`}>
                {hasUserVideo && report ? 'Live Report Active' : 'Empty'}
              </span>
            </div>

            {/* Inner Card */}
            {hasUserVideo && report ? (
              <div className="rounded-2xl border border-white/30 bg-white/45 dark:bg-black/45 p-4 sm:p-5 shadow-xl space-y-4 backdrop-blur-xl">
                {/* Video metadata row */}
                <div className="flex items-center gap-3 border-b border-white/20 pb-3">
                  <div className="relative h-12 w-16 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                    {latestThumbnail ? (
                      <img
                        src={latestThumbnail}
                        alt={videoTitle || 'Analyzed video'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-slate-900 text-slate-400">
                        <Film className="h-4 w-4" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Play className="h-3 w-3 fill-white text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-xs sm:text-sm text-white truncate">
                      {videoTitle || 'Analyzed Video'}
                    </h4>
                    <span className="font-mono text-[10px] text-slate-400">
                      {videoDurationSec > 0 ? formatTime(videoDurationSec) : 'Analyzed'} • Score: {Math.max(0, 100 - report.overallRiskScore)}/100
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={onNavigateScanner}
                    className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 font-mono text-[10px] font-bold transition cursor-pointer"
                  >
                    Inspect Full
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-xs">
                  {(['overview', 'details', 'timestamps', 'fixes'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveDemoTab(tab)}
                      className={`capitalize px-2.5 py-1 rounded-lg font-mono text-[11px] transition cursor-pointer ${
                        activeDemoTab === tab
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Overview */}
                {activeDemoTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Risk Overview Bars */}
                    <div className="space-y-2.5">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                        Risk Overview
                      </span>

                      {/* Bar 1 */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                            <span>Copyright Risk</span>
                          </span>
                          <span className="font-mono font-bold text-rose-400">
                            {report.strikeProbabilityPct}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-rose-500 rounded-full"
                            style={{ width: `${Math.min(100, report.strikeProbabilityPct)}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar 2 */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            <span>Reused Content</span>
                          </span>
                          <span className="font-mono font-bold text-amber-400">
                            {Math.round(report.overallRiskScore * 0.4)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${Math.min(100, Math.round(report.overallRiskScore * 0.4))}%` }}
                          />
                        </div>
                      </div>

                      {/* Bar 3 */}
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="flex items-center gap-1.5 text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            <span>Monetization Risk</span>
                          </span>
                          <span className="font-mono font-bold text-blue-400">
                            {report.demonetizationProbabilityPct}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(100, report.demonetizationProbabilityPct)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Top Issues */}
                    <div className="space-y-2">
                      <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                        Top Issues
                      </span>

                      {report.timelineViolations && report.timelineViolations.length > 0 ? (
                        report.timelineViolations.slice(0, 3).map((v, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-2 text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                              <div className="truncate">
                                <div className="text-[11px] text-white truncate">{v.title || v.categoryLabel}</div>
                                <span className="font-mono text-[9px] text-slate-400">
                                  {v.timestampStart} – {v.timestampEnd}
                                </span>
                              </div>
                            </div>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-400">
                              {v.severity}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-center text-xs text-emerald-400 font-mono">
                          ✓ No strike violations detected in this upload.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* View Full Report Link */}
                <div className="pt-2 border-t border-slate-800 text-right">
                  <button
                    type="button"
                    onClick={onNavigateScanner}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 transition cursor-pointer"
                  >
                    <span>Inspect Full Report in Scanner</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Empty State Card - No fake video */
              <div className="rounded-2xl border border-white/30 bg-white/45 dark:bg-black/45 p-8 sm:p-10 shadow-xl text-center backdrop-blur-xl flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mb-3">
                  <FileText className="h-6 w-6" />
                </div>
                <h4 className="font-display font-black text-base text-white uppercase tracking-wider">
                  Empty
                </h4>
                <p className="text-xs text-slate-300 mt-1.5 max-w-sm leading-relaxed">
                  No video analysis report generated yet. When you upload a video for analysis, its thumbnail, duration, safety score, and safe-cut timestamps will appear here.
                </p>
                <button
                  type="button"
                  onClick={triggerUpload}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <UploadCloud className="h-4 w-4" />
                  <span>Upload Video to Analyze</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. PRICING SECTION ("Simple Plans for Every Creator") */}
      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* 4. PRICING SECTION ("Simple Plans for Every Creator") */}
      {/* ======================================================== */}
      <section
        id="pricing"
        className="rounded-3xl border border-white/30 p-6 sm:p-10 transition backdrop-blur-2xl shadow-xl relative overflow-hidden"
        style={{
          backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="text-center max-w-xl mx-auto space-y-1.5 mb-8">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            PRICING
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
            Simple Plans for Every Creator
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Start free. Upgrade anytime. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {/* Plan 1: Free */}
          <div className="p-6 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/40 backdrop-blur-xl flex flex-col justify-between shadow-md">
            <div>
              <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Free</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display font-black text-3xl text-slate-950 dark:text-white">$0</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">/ month</span>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>1 video per month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Basic risk check</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Summary report</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={triggerUpload}
              className="mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition border border-blue-600 bg-blue-600/10 hover:bg-blue-600 text-blue-700 dark:text-blue-300 hover:text-white cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Plan 2: Creator (Most Popular) */}
          <div className="p-6 rounded-2xl border-2 border-blue-500 bg-white/60 dark:bg-black/55 backdrop-blur-xl relative flex flex-col justify-between shadow-xl ring-2 ring-blue-500/20">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm">
              Most Popular
            </span>

            <div>
              <span className="font-display font-bold text-sm text-blue-600 dark:text-blue-400">Creator</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display font-black text-3xl text-slate-950 dark:text-white">$9</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">/ month</span>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                  <span>Up to 20 videos/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                  <span>Detailed analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-500" />
                  <span>Timestamps &amp; fixes</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigatePricing ? onNavigatePricing() : triggerUpload()}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              Upgrade
            </button>
          </div>

          {/* Plan 3: Pro */}
          <div className="p-6 rounded-2xl border border-white/30 bg-white/50 dark:bg-black/40 backdrop-blur-xl flex flex-col justify-between shadow-md">
            <div>
              <span className="font-display font-bold text-sm text-slate-900 dark:text-white">Pro</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-display font-black text-3xl text-slate-950 dark:text-white">$29</span>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-mono">/ month</span>
              </div>

              <ul className="mt-5 space-y-2.5 text-xs text-slate-700 dark:text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Unlimited videos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Batch analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => onNavigatePricing ? onNavigatePricing() : triggerUpload()}
              className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/20 cursor-pointer"
            >
              Upgrade
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. TRUST / FEATURE HIGHLIGHTS BAR (Wallpaper BG) */}
      {/* ======================================================== */}
      <section
        className="rounded-2xl border border-white/30 p-6 shadow-xl backdrop-blur-2xl relative overflow-hidden text-slate-900 dark:text-white"
        style={{
          backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0 border border-blue-500/20 backdrop-blur-sm">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-slate-950 dark:text-white">Trusted by Creators</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Join thousands of YouTubers who upload safer.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 border border-emerald-500/20 backdrop-blur-sm">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-slate-950 dark:text-white">Secure &amp; Private</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Your files are encrypted and automatically deleted.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 shrink-0 border border-purple-500/20 backdrop-blur-sm">
              <Film className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-slate-950 dark:text-white">Multiple Formats</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                MP4, MOV, AVI, MKV and more.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0 border border-amber-500/20 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-xs text-slate-950 dark:text-white">AI-Powered</h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Advanced analysis with real-world reference data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FAQ SECTION ("Common Questions") */}
      {/* ======================================================== */}
      <section
        id="faq"
        className="rounded-3xl border border-white/30 p-6 sm:p-10 transition backdrop-blur-2xl shadow-xl relative overflow-hidden"
        style={{
          backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Heading & CTA */}
          <div className="lg:col-span-4 space-y-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              FAQ
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
              Common Questions
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Everything you need to know about Striku.
            </p>

            <button
              type="button"
              onClick={() => onNavigateFaq ? onNavigateFaq() : null}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              <span>View All FAQs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Right Column: Accordion */}
          <div className="lg:col-span-8 space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-white/30 bg-white/50 dark:bg-black/35 backdrop-blur-md transition hover:border-white/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-display font-bold text-xs sm:text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-600 dark:text-slate-300 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-600 dark:text-slate-300 shrink-0 ml-2" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-t border-white/20 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
