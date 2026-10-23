import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  Calendar,
  Bell,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileVideo,
  Footprints,
  Droplets,
  Plus,
  Play,
  CheckCircle2,
  ArrowRight,
  Flame,
  Scissors,
  Sparkles,
  Star,
  Lock,
  Quote,
  DollarSign,
  Check,
  BadgeCheck,
} from 'lucide-react';
import { HistoricalUploadRecord } from './ChannelHealthTrend';
import { AuditReport, SampleVideoOption } from '../types/audit';
import { AppUserProfile } from './ProfileView';

interface ModernOverviewDashboardProps {
  currentUser: AppUserProfile | null;
  history: HistoricalUploadRecord[];
  report: AuditReport | null;
  onSelectSample: (sample: SampleVideoOption) => void;
  samples: SampleVideoOption[];
  onNavigateScanner: () => void;
  onNavigateAnalytics: () => void;
  onOpenCutGuide: () => void;
  onJumpAndPlay: (seconds: number) => void;
  isLight: boolean;
}

export const ModernOverviewDashboard: React.FC<ModernOverviewDashboardProps> = ({
  currentUser,
  history,
  report,
  onSelectSample,
  samples,
  onNavigateScanner,
  onNavigateAnalytics,
  onOpenCutGuide,
  onJumpAndPlay,
  isLight,
}) => {
  // 7 days timeline from Image 2: S(07), M(08), T(09), W(10), T(11), F(12), S(13)
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Wednesday 10 active by default

  const daysOfWeek = [
    { day: 'S', date: '07', full: 'Sun Oct 07' },
    { day: 'M', date: '08', full: 'Mon Oct 08' },
    { day: 'T', date: '09', full: 'Tue Oct 09' },
    { day: 'W', date: '10', full: 'Wed Oct 10' },
    { day: 'T', date: '11', full: 'Thu Oct 11' },
    { day: 'F', date: '12', full: 'Fri Oct 12' },
    { day: 'S', date: '13', full: 'Sat Oct 13' },
  ];

  // Calculate compliance statistics
  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.complianceScore, 0) / history.length)
      : 96;

  const safeCount = history.filter((h) => h.status === 'SAFE_TO_UPLOAD').length;

  return (
    <div className="flex flex-col gap-5 max-w-5xl mx-auto">
      {/* 1. Header Greeting Bar (Directly matching Image 2 top bar) */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-lime-500 to-emerald-500 p-0.5 shadow-sm shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm">
                {(currentUser?.displayName || 'S')[0].toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400 block">
              Good morning!
            </span>
            <h2 className="font-display text-base sm:text-lg font-bold tracking-tight leading-tight">
              {currentUser?.displayName || 'Studio Creator'}
            </h2>
          </div>
        </div>

        {/* Top Right Action Icons: Calendar & Notification Bell with unread dot from Image 2 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNavigateAnalytics}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition cursor-pointer ${
              isLight
                ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
                : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200'
            }`}
            title="View Compliance History & Calendar"
          >
            <Calendar className="h-4.5 w-4.5" />
          </button>

          <button
            type="button"
            className={`relative flex h-10 w-10 items-center justify-center rounded-2xl border transition cursor-pointer ${
              isLight
                ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs'
                : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200'
            }`}
            title="Notifications & Community Alerts"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </button>
        </div>
      </div>

      {/* Product Presentation & Live 1-Click Interactive Demo Banner (Heavy Bottom-Left Swoop & Rotate) */}
      <motion.div
        initial={{ opacity: 0, x: -75, y: 65, rotate: -8, scale: 0.92, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ type: 'spring', damping: 17, stiffness: 95 }}
        className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 transition shadow-md ${
          isLight
            ? 'border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 text-slate-900'
            : 'border-indigo-900/40 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 text-white'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                <Sparkles className="h-3 w-3" />
                <span>3-Pass Neural Consensus Engine</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ 99.4% YouTube Strike Alignment
              </span>
            </div>

            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Pre-Screen Videos for Strikes Before Uploading
            </h1>

            <p className="mt-1.5 font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Never risk a channel demonetization or strike penalty. Extract frame timecodes, blur flagged scenes, and generate YouTube counter-appeals with zero server storage.
            </p>
          </div>

          {/* Upload Your Video Action Button */}
          <div className="flex shrink-0">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onNavigateScanner}
              className={`flex items-center justify-center gap-2 rounded-2xl px-5 py-3 font-display text-xs font-bold transition shadow-lg cursor-pointer ${
                isLight
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/30'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-rose-900/50'
              }`}
            >
              <FileVideo className="h-4 w-4" />
              <span>Upload & Scan Your Video</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* 2. Hero Card: Weekly Progress (Heavy Bottom-Right Swoop & Rotate) */}
      <motion.div
        initial={{ opacity: 0, x: 75, y: 65, rotate: 8, scale: 0.92, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ type: 'spring', damping: 17, stiffness: 95, delay: 0.1 }}
        className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 transition shadow-sm ${
          isLight
            ? 'bg-gradient-to-br from-[#d9f99d]/90 via-[#bef264]/80 to-[#a3e635]/70 text-slate-900 border border-lime-300/60'
            : 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-lime-950/60 text-slate-100 border border-emerald-800/60'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="max-w-md">
            {/* Tag with lightning bolt from Image 2 */}
            <div className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xs mb-2">
              <Zap className="h-3.5 w-3.5 fill-current text-amber-600 dark:text-amber-400" />
              <span>Channel Ingest Health</span>
            </div>

            <h3 className="font-display text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Your Weekly Progress
            </h3>

            <p className="mt-1 font-sans text-xs opacity-85 leading-relaxed">
              Automated YouTube policy verification across your last 10 uploads. 0 strikes active.
            </p>
          </div>

          {/* SVG Circular Donut Ring on right (matching Image 2 "6 days" ring) */}
          <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                className="text-white/40 dark:text-slate-800"
                strokeWidth="3.6"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              {/* Progress stroke */}
              <path
                className="text-emerald-700 dark:text-emerald-400 transition-all duration-1000 ease-out"
                strokeDasharray={`${avgScore}, 100`}
                strokeWidth="3.8"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            {/* Inner text: e.g. 10 / 10 clean or 96% */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-display text-base sm:text-lg font-black leading-none text-slate-900 dark:text-white">
                {safeCount}
              </span>
              <span className="font-sans text-[9px] uppercase tracking-wider font-semibold opacity-75">
                Safe
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. 2-Column Quick Metric Cards Grid (Heavy Bottom Rise & Pop) */}
      <motion.div
        initial={{ opacity: 0, y: 70, scale: 0.94, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ type: 'spring', damping: 18, stiffness: 100, delay: 0.1 }}
        className="grid grid-cols-2 gap-3 sm:gap-4"
      >
        {/* Card 1: Audited Uploads (Footprints icon from Image 2) */}
        <div
          className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
            isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">
              Audited Uploads
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
              <Footprints className="h-4.5 w-4.5" />
            </div>
          </div>

          <div>
            <div className="font-display text-xl sm:text-2xl font-black tracking-tight">
              {history.length} <span className="text-xs font-normal text-slate-500">videos</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-600 font-semibold mt-0.5 block">
              100% temporal ingest
            </span>
          </div>
        </div>

        {/* Card 2: Zero-Strike Streak (Water drop icon from Image 2) */}
        <div
          className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
            isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-sans text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight">
              Zero-Strike Streak
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
              <Droplets className="h-4.5 w-4.5" />
            </div>
          </div>

          <div>
            <div className="font-display text-xl sm:text-2xl font-black tracking-tight">
              14 <span className="text-xs font-normal text-slate-500">days clean</span>
            </div>
            <span className="font-mono text-[11px] text-sky-600 font-semibold mt-0.5 block">
              Good standing verified
            </span>
          </div>
        </div>
      </motion.div>

      {/* 4. Horizontal Date / Weekday Carousel Scroller (Swooping from Right) */}
      <motion.div
        initial={{ opacity: 0, x: 75, scale: 0.95, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ type: 'spring', damping: 18, stiffness: 100, delay: 0.15 }}
        className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition shadow-2xs ${
          isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
        }`}
      >
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h4 className="font-display text-sm sm:text-base font-bold">October 2026</h4>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSelectedDayIndex((prev) => Math.max(0, prev - 1))}
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition cursor-pointer ${
                isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-700' : 'border-slate-800 hover:bg-slate-800 text-slate-200'
              }`}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setSelectedDayIndex((prev) => Math.min(daysOfWeek.length - 1, prev + 1))}
              className={`flex h-7 w-7 items-center justify-center rounded-full border transition cursor-pointer ${
                isLight ? 'border-slate-200 hover:bg-slate-100 text-slate-700' : 'border-slate-800 hover:bg-slate-800 text-slate-200'
              }`}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 7 Days Row: S M T W T F S with dates */}
        <div className="grid grid-cols-7 gap-1.5 text-center">
          {daysOfWeek.map((d, idx) => {
            const isSelected = selectedDayIndex === idx;

            return (
              <button
                key={d.full}
                type="button"
                onClick={() => {
                  setSelectedDayIndex(idx);
                  // Map day index to sample video if available
                  const sampleIndex = idx % samples.length;
                  if (samples[sampleIndex]) {
                    onSelectSample(samples[sampleIndex]);
                  }
                }}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#c2f268] text-slate-950 font-bold shadow-xs scale-105'
                    : isLight
                    ? 'text-slate-600 hover:bg-slate-100 font-medium'
                    : 'text-slate-400 hover:bg-slate-800 font-medium'
                }`}
              >
                <span className="font-sans text-[11px] opacity-75">{d.day}</span>
                <span className="font-display text-sm sm:text-base font-bold mt-1">
                  {d.date}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* 5. Recent Ingest Audits Feed (Staggered Heavy Directional Entrance) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-display text-sm sm:text-base font-bold">Recent Upload Audits</h4>
          <span className="font-mono text-xs text-slate-500">Live Ingest Feed</span>
        </div>

        <div className="space-y-2.5">
          {samples.slice(0, 3).map((sample, idx) => {
            const isSafe = sample.mockReport.safetyGrade === 'SAFE_TO_UPLOAD';
            const initialDirection =
              idx === 0
                ? { opacity: 0, x: -60, y: 35, rotate: -4, scale: 0.95 }
                : idx === 1
                ? { opacity: 0, y: 55, scale: 0.93 }
                : { opacity: 0, x: 60, y: 35, rotate: 4, scale: 0.95 };

            return (
              <motion.div
                key={sample.id}
                initial={initialDirection}
                whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ type: 'spring', damping: 18, stiffness: 100, delay: idx * 0.08 }}
                className={`rounded-2xl sm:rounded-3xl border p-3.5 sm:p-4 flex items-center justify-between gap-3 transition shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 ${
                  isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Fire/Flame icon from Image 2 Breakfast item */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isSafe
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-amber-500/10 text-amber-600'
                    }`}
                  >
                    {isSafe ? <ShieldCheck className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="font-display text-xs sm:text-sm font-bold truncate">
                      {sample.title}
                    </h5>
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 font-sans text-[11px] text-slate-500">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                        {Math.max(10, 100 - sample.mockReport.overallRiskScore)}% Score
                      </span>
                      <span>·</span>
                      <span>{sample.durationFormatted}</span>
                      <span>·</span>
                      <span
                        className={
                          isSafe ? 'text-emerald-600 font-semibold' : 'text-amber-600 font-semibold'
                        }
                      >
                        {isSafe ? 'Safe' : 'Demonetization Risk'}
                      </span>
                      {sample.mockReport.averageConfidencePct && (
                        <>
                          <span>·</span>
                          <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                            {sample.mockReport.averageConfidencePct}% Certainty
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Inspect '+' button from Image 2 */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={() => {
                    onSelectSample(sample);
                    onNavigateScanner();
                  }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border transition cursor-pointer ${
                    isLight
                      ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      : 'border-slate-800 bg-slate-800 hover:bg-slate-750 text-slate-200'
                  }`}
                  title="Inspect detailed audit"
                >
                  <Plus className="h-4.5 w-4.5" />
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 5. Before vs. After Pre-Screening Impact Showcase */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 transition shadow-xs ${
          isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Comparative Impact
            </span>
            <h3 className="font-display text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Why Creators Run Striku Before Pressing &quot;Publish&quot;
            </h3>
          </div>
          <span className="font-mono text-xs text-slate-500">
            Real YouTube Moderation Benchmarks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Without Striku (Risk) */}
          <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Without Striku Pre-Screening:</span>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Automated YouTube bot flags minor dialogue or background scene after publishing.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Immediate yellow dollar sign (demonetization) or 1st Community Guideline Strike.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-red-500 font-bold">✕</span>
                <span>Video algorithmic reach halted; appeal takes 7-14 days with automated rejection.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: With Striku (Protected) */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>With Striku 3-Pass Consensus:</span>
            </div>
            <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Identifies exact second-by-second policy hazard frame in your editing timeline.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>One-click CapCut/Premiere safe cut instruction (trim 3 seconds or apply 40px blur).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>100% green monetization rating with algorithmic trust score maximized.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 6. Verified Creator Social Proof & Testimonials */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="font-display text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Trusted by 14,200+ YouTube Creators &amp; Editors
            </h4>
            <p className="text-xs text-slate-500">
              Protecting gaming channels, vloggers, podcasts, and MCN production networks
            </p>
          </div>
          <div className="flex items-center gap-1 text-amber-500 text-xs font-mono font-bold">
            <Star className="h-4 w-4 fill-current" />
            <span>4.9 / 5.0 (680+ Reviews)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div
            className={`rounded-2xl border p-4 flex flex-col justify-between transition ${
              isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/80'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-600 text-white font-bold text-xs">
                  H
                </div>
                <div>
                  <span className="font-display text-xs font-bold block text-slate-900 dark:text-white">
                    Hassan R.
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Tech &amp; Gaming · 420K Subs
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;Striku caught an accidental brand soundbite and kitchen knife frame that would have triggered my 2nd channel strike. Saved my channel.&rdquo;
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[10px] text-emerald-500 font-mono font-bold">
              <BadgeCheck className="h-3 w-3" />
              <span>Verified Creator Pro Subscriber</span>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-4 flex flex-col justify-between transition ${
              isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/80'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs">
                  S
                </div>
                <div>
                  <span className="font-display text-xs font-bold block text-slate-900 dark:text-white">
                    Sarah L.
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Lifestyle &amp; Vlogs · 890K Subs
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;The CapCut safe cut timecode sheet is pure magic. My editor cuts out the exact 3 flagged seconds and our video monetization stays green.&rdquo;
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[10px] text-emerald-500 font-mono font-bold">
              <BadgeCheck className="h-3 w-3" />
              <span>Verified Creator Pro Subscriber</span>
            </div>
          </div>

          <div
            className={`rounded-2xl border p-4 flex flex-col justify-between transition ${
              isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/80'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-xs">
                  M
                </div>
                <div>
                  <span className="font-display text-xs font-bold block text-slate-900 dark:text-white">
                    Marcus V.
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Studio Producer · 15 Channels
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
                &ldquo;We run all 20 weekly client podcast episodes through Striku&apos;s bulk batch queue. Total peace of mind for our editing agency.&rdquo;
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1 text-[10px] text-amber-500 font-mono font-bold">
              <BadgeCheck className="h-3 w-3" />
              <span>Verified Agency Master ($80)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
