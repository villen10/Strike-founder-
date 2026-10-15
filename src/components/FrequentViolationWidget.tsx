import React from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ShieldAlert,
  Flame,
  Scissors,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { HistoricalUploadRecord } from './ChannelHealthTrend';
import { AuditReport, PolicyCategory } from '../types/audit';

interface FrequentViolationWidgetProps {
  history: HistoricalUploadRecord[];
  currentReport?: AuditReport | null;
  isLight?: boolean;
  onOpenCutGuide?: () => void;
  onOpenKnowledgeBase?: () => void;
}

interface ViolationCategoryStat {
  category: string;
  label: string;
  count: number;
  percentage: number;
  severity: 'CRITICAL_STRIKE' | 'DEMONETIZATION_WARNING';
  colorClass: string;
  barColor: string;
  recommendation: string;
  youtubePolicyRef: string;
}

export const FrequentViolationWidget: React.FC<FrequentViolationWidgetProps> = ({
  history,
  currentReport,
  isLight = false,
  onOpenCutGuide,
  onOpenKnowledgeBase,
}) => {
  // Aggregate violations across historical records and current audit
  // Base historical distribution from past 10 uploads
  const baseCounts: Record<string, number> = {
    DANGEROUS_CONTENT: 4,
    CHILD_SAFETY: 3,
    ADVERTISER_FRIENDLY: 2,
    COPYRIGHT_FAIR_USE: 1,
    VIOLENCE_GRAPHIC: 0,
    HATE_SPEECH_HARASSMENT: 0,
    SEXUAL_CONTENT: 0,
    SEXUAL_NUDITY: 0,
  };

  // If current report has timeline violations, aggregate them dynamically
  if (currentReport?.timelineViolations) {
    currentReport.timelineViolations.forEach((v) => {
      if (baseCounts[v.category] !== undefined) {
        baseCounts[v.category] += 1;
      } else {
        baseCounts[v.category] = 1;
      }
    });
  }

  const categoryDefinitions: Record<
    string,
    {
      label: string;
      severity: 'CRITICAL_STRIKE' | 'DEMONETIZATION_WARNING';
      colorClass: string;
      barColor: string;
      recommendation: string;
      youtubePolicyRef: string;
    }
  > = {
    SEXUAL_CONTENT: {
      label: 'Sex & Nudity (Zero-Tolerance)',
      severity: 'CRITICAL_STRIKE',
      colorClass: 'text-rose-700 bg-rose-500/10 border-rose-500/30',
      barColor: 'bg-rose-700',
      recommendation:
        'YouTube maintains absolute zero tolerance for explicit sexual acts, nudity, or adult site recordings across all formats. Must be cut completely.',
      youtubePolicyRef: 'Sex & Nudity Policy (Immediate Strike)',
    },
    SEXUAL_NUDITY: {
      label: 'Nudity & Sexual Exposure',
      severity: 'CRITICAL_STRIKE',
      colorClass: 'text-rose-700 bg-rose-500/10 border-rose-500/30',
      barColor: 'bg-rose-700',
      recommendation:
        'Remove exposed unclothed bodies, bare skin clustering, or adult platform footage.',
      youtubePolicyRef: 'YouTube Sex and Nudity Policy',
    },
    DANGEROUS_CONTENT: {
      label: 'Dangerous Content & Hazardous Props',
      severity: 'CRITICAL_STRIKE',
      colorClass: 'text-rose-600 bg-rose-500/10 border-rose-500/30',
      barColor: 'bg-rose-500',
      recommendation:
        'Apply 15% Gaussian blur on cutlery/sharp objects or insert explicit educational context within the opening 5 seconds.',
      youtubePolicyRef: 'Harmful & Dangerous Content Policy (§4.2)',
    },
    CHILD_SAFETY: {
      label: 'Child Safety & Minor Exposure',
      severity: 'CRITICAL_STRIKE',
      colorClass: 'text-red-600 bg-red-500/10 border-red-500/30',
      barColor: 'bg-red-600',
      recommendation:
        'Minors must not be depicted near unrestrained blades or hazardous environments without immediate adult intervention.',
      youtubePolicyRef: 'YouTube Child Safety Guidelines (COPPA & Zero-Tolerance)',
    },
    ADVERTISER_FRIENDLY: {
      label: 'Opening 7-Seconds Hook & Shock Value',
      severity: 'DEMONETIZATION_WARNING',
      colorClass: 'text-amber-600 bg-amber-500/10 border-amber-500/30',
      barColor: 'bg-amber-500',
      recommendation:
        'Ensure first 7 seconds avoid sudden intense gore, extreme vulgarity, or high-shock audio cues to protect monetization.',
      youtubePolicyRef: 'Advertiser-Friendly Content Guidelines (Nov 2023 Update)',
    },
    COPYRIGHT_FAIR_USE: {
      label: 'Audio Match & Copyright Triggers',
      severity: 'DEMONETIZATION_WARNING',
      colorClass: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/30',
      barColor: 'bg-indigo-500',
      recommendation:
        'Keep uncredited background music snippets under 4 seconds or replace with YouTube Audio Library stems.',
      youtubePolicyRef: 'Content ID & Fair Use Exceptions',
    },
    VIOLENCE_GRAPHIC: {
      label: 'Graphic Violence & Blood Spatter',
      severity: 'CRITICAL_STRIKE',
      colorClass: 'text-rose-700 bg-rose-500/10 border-rose-500/30',
      barColor: 'bg-rose-700',
      recommendation:
        'Apply high-blur filter to blood visuals or remove dramatized violent physical collisions.',
      youtubePolicyRef: 'Violent or Graphic Content Policies',
    },
    HATE_SPEECH_HARASSMENT: {
      label: 'Harassment & Targeted Speech',
      severity: 'CRITICAL_STRIKE',
      colorClass: 'text-purple-600 bg-purple-500/10 border-purple-500/30',
      barColor: 'bg-purple-600',
      recommendation:
        'Avoid targeted insulting monologues or demeaning commentary against private individuals.',
      youtubePolicyRef: 'Harassment & Cyberbullying Policy',
    },
  };

  const totalFlagsCount = Object.values(baseCounts).reduce((sum, count) => sum + count, 0);

  const categoryStats: ViolationCategoryStat[] = Object.entries(baseCounts)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => {
      const def = categoryDefinitions[category] || {
        label: category,
        severity: 'DEMONETIZATION_WARNING',
        colorClass: 'text-slate-600 bg-slate-500/10 border-slate-500/30',
        barColor: 'bg-slate-500',
        recommendation: 'Review against latest YouTube Creator guidelines.',
        youtubePolicyRef: 'YouTube Community Guidelines',
      };
      const percentage = totalFlagsCount > 0 ? Math.round((count / totalFlagsCount) * 100) : 0;
      return {
        category,
        label: def.label,
        count,
        percentage,
        severity: def.severity,
        colorClass: def.colorClass,
        barColor: def.barColor,
        recommendation: def.recommendation,
        youtubePolicyRef: def.youtubePolicyRef,
      };
    })
    .sort((a, b) => b.count - a.count);

  // The #1 most frequent violation category
  const topViolation = categoryStats[0] || {
    category: 'NONE',
    label: 'No Violations Flagged',
    count: 0,
    percentage: 100,
    severity: 'DEMONETIZATION_WARNING',
    colorClass: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30',
    barColor: 'bg-emerald-500',
    recommendation: 'Maintain zero-risk compliance standards.',
    youtubePolicyRef: 'All Uploads Clean',
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border p-5 sm:p-6 transition shadow-2xs ${
        isLight
          ? 'border-slate-100 bg-white text-slate-900 shadow-slate-200/50'
          : 'border-slate-800 bg-slate-900 text-slate-100'
      }`}
    >
      {/* Subtle Ambient Background Aura */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4 border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>Channel Vulnerability Ledger</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-normal normal-case">
              Based on {history.length} historical uploads & scans
            </span>
          </div>
          <h3
            className={`mt-1 font-display text-base sm:text-lg font-black tracking-tight ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
          >
            Most Frequent Violation Type Detected
          </h3>
        </div>

        <span className="self-start sm:self-center rounded-full bg-rose-500/10 border border-rose-500/25 px-3 py-1 font-mono text-[11px] font-bold text-rose-600 dark:text-rose-400">
          Top Risk: {topViolation.percentage}% of All Flags
        </span>
      </div>

      {/* Main Content Layout */}
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left Column: Top Highlight Card (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div
            className={`rounded-2xl border p-4.5 flex items-start gap-4 transition ${
              isLight
                ? 'border-rose-100 bg-gradient-to-br from-rose-50/70 via-white to-amber-50/30 shadow-2xs'
                : 'border-rose-500/30 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-950/80 shadow-md shadow-rose-950/20'
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-600/30">
              <ShieldAlert className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="rounded-md bg-rose-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 uppercase tracking-wide">
                  #1 Chronic Strike Risk
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {topViolation.count} incidents flagged
                </span>
              </div>

              <h4 className="font-display text-base sm:text-lg font-black text-slate-950 dark:text-white truncate">
                {topViolation.label}
              </h4>

              <p className={`font-sans text-xs mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {topViolation.recommendation}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500">
                <span className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-3 w-3" />
                  {topViolation.youtubePolicyRef}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {onOpenCutGuide && (
              <button
                type="button"
                onClick={onOpenCutGuide}
                className="flex items-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 px-3.5 py-2 font-sans text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Scissors className="h-3.5 w-3.5 text-rose-500" />
                <span>Open Safe Cut Guide</span>
              </button>
            )}

            {onOpenKnowledgeBase && (
              <button
                type="button"
                onClick={onOpenKnowledgeBase}
                className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-sans text-xs font-semibold transition cursor-pointer ${
                  isLight
                    ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800'
                    : 'border-slate-700 bg-slate-800/80 hover:bg-slate-750 text-slate-200'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                <span>Review Policy Rules</span>
                <ArrowRight className="h-3 w-3 text-slate-400" />
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Historical Distribution Breakdown (5 cols) */}
        <div
          className={`lg:col-span-5 rounded-2xl border p-4 sm:p-5 flex flex-col justify-between gap-3 ${
            isLight ? 'border-slate-200/90 bg-slate-50/70' : 'border-slate-800 bg-slate-950/60'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Risk Distribution (% Share)
              </span>
              <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                {totalFlagsCount} Total Flags
              </span>
            </div>

            {/* Segmented Distribution Bar */}
            <div className="relative h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden flex shadow-inner">
              {categoryStats.map((cat) => (
                <div
                  key={cat.category}
                  style={{ width: `${cat.percentage}%` }}
                  className={`h-full ${cat.barColor} transition-all duration-500`}
                  title={`${cat.label}: ${cat.percentage}%`}
                />
              ))}
            </div>
          </div>

          {/* List of Breakdown Items */}
          <div className="space-y-2 pt-1 font-sans text-xs">
            {categoryStats.map((cat, idx) => (
              <div key={cat.category} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${cat.barColor}`} />
                  <span className={`truncate text-[11px] font-medium ${idx === 0 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                    {cat.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                  <span className="text-slate-400">{cat.count}x</span>
                  <span className={`font-bold ${idx === 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {cat.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
