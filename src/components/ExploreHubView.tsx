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
  Cpu,
  Layers,
  Film,
  X,
} from 'lucide-react';
import { HistoricalUploadRecord } from './ChannelHealthTrend';
import { AuditReport, SampleVideoOption } from '../types/audit';
import { AppUserProfile } from './ProfileView';

interface ExploreHubViewProps {
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

export const ExploreHubView: React.FC<ExploreHubViewProps> = ({
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
  const [selectedDayIndex, setSelectedDayIndex] = useState(3);

  const daysOfWeek = [
    { day: 'S', date: '07', full: 'Sun Oct 07' },
    { day: 'M', date: '08', full: 'Mon Oct 08' },
    { day: 'T', date: '09', full: 'Tue Oct 09' },
    { day: 'W', date: '10', full: 'Wed Oct 10' },
    { day: 'T', date: '11', full: 'Thu Oct 11' },
    { day: 'F', date: '12', full: 'Fri Oct 12' },
    { day: 'S', date: '13', full: 'Sat Oct 13' },
  ];

  const avgScore =
    history.length > 0
      ? Math.round(history.reduce((acc, curr) => acc + curr.complianceScore, 0) / history.length)
      : 96;

  const safeCount = history.filter((h) => h.status === 'SAFE_TO_UPLOAD').length;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-16">
      {/* Explore Header */}
      <div className={`rounded-3xl border p-6 sm:p-8 relative overflow-hidden transition ${
        isLight
          ? 'border-slate-200 bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/40 shadow-sm'
          : 'border-slate-800 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 text-white'
      }`}>
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 font-mono text-[11px] font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Creator Explore Hub &amp; Ingest Analytics</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Explore Channel Ingest Metrics, Past Audits &amp; Benchmarks
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Review your weekly ingest health, historical upload compliance scores, recent sample videos, and YouTube moderation impact comparisons.
          </p>
        </div>
      </div>

      {/* Hero Card: Weekly Progress */}
      <div className={`relative overflow-hidden rounded-3xl p-5 sm:p-6 transition shadow-sm ${
        isLight
          ? 'bg-gradient-to-br from-[#d9f99d]/90 via-[#bef264]/80 to-[#a3e635]/70 text-slate-900 border border-lime-300/60'
          : 'bg-gradient-to-br from-emerald-950/70 via-slate-900 to-lime-950/60 text-slate-100 border border-emerald-800/60'
      }`}>
        <div className="flex items-center justify-between gap-4">
          <div className="max-w-md">
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

          <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-white/40 dark:text-slate-800"
                strokeWidth="3.6"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
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
      </div>

      {/* 2-Column Quick Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
          isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
        }`}>
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

        <div className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex flex-col justify-between transition shadow-2xs ${
          isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
        }`}>
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
      </div>

      {/* Date Carousel */}
      <div className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-5 transition shadow-2xs ${
        isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
      }`}>
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h4 className="font-display text-sm sm:text-base font-bold">October 2026 Calendar</h4>
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

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {daysOfWeek.map((d, idx) => {
            const isSelected = selectedDayIndex === idx;

            return (
              <button
                key={d.full}
                type="button"
                onClick={() => {
                  setSelectedDayIndex(idx);
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
      </div>

      {/* Recent Upload Audits Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-display text-sm sm:text-base font-bold">Recent Upload Audits Feed</h4>
          <span className="font-mono text-xs text-slate-500">Live Ingest Feed</span>
        </div>

        <div className="space-y-2.5">
          {samples.slice(0, 3).map((sample, idx) => {
            const isSafe = sample.mockReport.safetyGrade === 'SAFE_TO_UPLOAD';

            return (
              <div
                key={sample.id}
                className={`rounded-2xl sm:rounded-3xl border p-3.5 sm:p-4 flex items-center justify-between gap-3 transition shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 ${
                  isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
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
                    </div>
                  </div>
                </div>

                <button
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
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comparative Impact */}
      <div className={`rounded-3xl border p-5 sm:p-6 transition shadow-xs ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'
      }`}>
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
            </ul>
          </div>

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
                <span>One-click CapCut/Premiere safe cut instruction (trim 3 seconds or apply blur).</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
