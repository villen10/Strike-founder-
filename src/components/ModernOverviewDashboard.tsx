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
  Activity,
  Flame,
  Scissors,
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

      {/* 2. Hero Card: Weekly Progress (Directly matching Image 2 lime-green banner card) */}
      <div
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
      </div>

      {/* 3. 2-Column Quick Metric Cards Grid (Directly matching Image 2 "Step to walk" & "Drink Water") */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
      </div>

      {/* 4. Horizontal Date / Weekday Carousel Scroller (Directly matching Image 2 "August 2025" scroller) */}
      <div
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
      </div>

      {/* 5. Recent Ingest Audits Feed (Directly matching Breakfast & Lunch time cards in Image 2) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="font-display text-sm sm:text-base font-bold">Recent Upload Audits</h4>
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
                    <div className="flex items-center gap-2 mt-0.5 font-sans text-[11px] text-slate-500">
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

                {/* Inspect '+' button from Image 2 */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectSample(sample);
                    onNavigateScanner();
                  }}
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl border transition cursor-pointer hover:scale-105 active:scale-95 ${
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
    </div>
  );
};
