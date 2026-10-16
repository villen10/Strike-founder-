import React from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  DollarSign,
  Scissors,
  FileText,
  Copy,
  Clock,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { AuditReport } from '../types/audit';

interface AuditSummaryCardProps {
  report: AuditReport;
  onOpenCutGuide: () => void;
  onOpenAppealModal: () => void;
  isLight?: boolean;
}

export const AuditSummaryCard: React.FC<AuditSummaryCardProps> = ({
  report,
  onOpenCutGuide,
  onOpenAppealModal,
  isLight = false,
}) => {
  const isSafe = report.safetyGrade === 'SAFE_TO_UPLOAD';
  const isWarning = report.safetyGrade === 'MONETIZATION_AT_RISK';
  const isCritical = report.safetyGrade === 'HIGH_STRIKE_RISK';

  const [copied, setCopied] = React.useState(false);

  const handleCopySummary = () => {
    const text = `Strike Founder Compliance Audit:
Video: ${report.videoTitle}
Status: ${report.safetyGrade}
Overall Risk Score: ${report.overallRiskScore}/100
Strike Probability: ${report.strikeProbabilityPct}%
Ad Monetization Probability: ${100 - report.demonetizationProbabilityPct}%
Issues Flagged: ${report.totalIssuesCount} (${report.criticalIssuesCount} critical, ${report.warningsCount} warnings)
Summary: ${report.summaryVerdictEn}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col gap-5 rounded-2xl border p-4 sm:p-6 transition shadow-xs ${
        isLight
          ? 'border-slate-200/90 bg-white text-slate-900'
          : 'border-slate-800/90 bg-slate-900/60 backdrop-blur-sm text-slate-100'
      }`}
    >
      {/* Top Banner: Verdict & Safety Grade */}
      <div
        className={`flex flex-col gap-4 rounded-2xl border p-4 sm:p-5 sm:flex-row sm:items-center sm:justify-between transition ${
          isSafe
            ? isLight
              ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
              : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-200'
            : isWarning
            ? isLight
              ? 'border-amber-200 bg-amber-50/70 text-amber-950'
              : 'border-amber-500/30 bg-amber-950/20 text-amber-200'
            : isLight
            ? 'border-red-200 bg-red-50/70 text-red-950'
            : 'border-rose-500/30 bg-rose-950/20 text-rose-200'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-xs ${
              isSafe
                ? isLight
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-emerald-500/20 text-emerald-400'
                : isWarning
                ? isLight
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-amber-500/20 text-amber-400'
                : isLight
                ? 'bg-red-100 text-red-700'
                : 'bg-rose-500/20 text-rose-400'
            }`}
          >
            {isSafe && <ShieldCheck className="h-6 w-6" />}
            {isWarning && <AlertTriangle className="h-6 w-6" />}
            {isCritical && <ShieldAlert className="h-6 w-6" />}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-sm sm:text-base font-black uppercase tracking-wider">
                {isSafe
                  ? 'Safe to Schedule & Monetize'
                  : isWarning
                  ? 'Monetization Caution (Limited Ads)'
                  : 'Critical Strike Hazard (Do Not Upload)'}
              </span>
              <span className="text-xs opacity-50">·</span>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10">
                Risk Score: {report.overallRiskScore}/100
              </span>
            </div>
            <p
              className={`mt-1 font-body text-xs sm:text-sm font-medium leading-relaxed ${
                isLight ? 'text-slate-800' : 'text-slate-200'
              }`}
            >
              {report.summaryVerdictEn}
            </p>
          </div>
        </div>

        {/* Action Buttons inside banner */}
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {report.totalIssuesCount > 0 && (
            <button
              onClick={onOpenCutGuide}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-body text-xs font-bold shadow-xs transition ${
                isLight
                  ? 'border-red-200 bg-white hover:bg-red-50 text-red-700'
                  : 'border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-white'
              }`}
            >
              <Scissors className="h-3.5 w-3.5 text-red-600" />
              <span>Safe Cut Sheet</span>
            </button>
          )}

          <button
            onClick={onOpenAppealModal}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 font-body text-xs font-bold transition ${
              isLight
                ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 shadow-xs'
                : 'border-indigo-700/50 bg-indigo-950/60 text-indigo-200 hover:bg-indigo-900/60'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>Appeal Kit</span>
          </button>

          <button
            onClick={handleCopySummary}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 font-body text-xs font-semibold transition ${
              isLight
                ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
            title="Copy audit summary to clipboard"
          >
            <Copy className="h-3.5 w-3.5 text-slate-500" />
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row: 4 Studio Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Metric 1: Strike Probability */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
            isLight
              ? 'border-slate-200/90 bg-slate-50/80 shadow-2xs'
              : 'border-slate-800/90 bg-slate-950/60'
          }`}
        >
          <div
            className={`flex items-center justify-between font-body text-xs font-semibold ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <span>Strike Probability</span>
            <ShieldAlert className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span
              className={`font-display text-2xl sm:text-3xl font-black ${
                report.strikeProbabilityPct > 50
                  ? 'text-red-600'
                  : report.strikeProbabilityPct > 20
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {report.strikeProbabilityPct}%
            </span>
            <span className="font-body text-[11px] font-semibold text-slate-500">
              {report.strikeProbabilityPct > 50
                ? 'Severe Hazard'
                : report.strikeProbabilityPct > 20
                ? 'Cautionary'
                : 'Pristine Safe'}
            </span>
          </div>
          <div
            className={`mt-2.5 h-1.5 w-full overflow-hidden rounded-full ${
              isLight ? 'bg-slate-200' : 'bg-slate-800'
            }`}
          >
            <div
              className={`h-full transition-all duration-500 ${
                report.strikeProbabilityPct > 50
                  ? 'bg-red-600'
                  : report.strikeProbabilityPct > 20
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${report.strikeProbabilityPct}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Monetization / Ad Suitability */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
            isLight
              ? 'border-slate-200/90 bg-slate-50/80 shadow-2xs'
              : 'border-slate-800/90 bg-slate-950/60'
          }`}
        >
          <div
            className={`flex items-center justify-between font-body text-xs font-semibold ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <span>Ad Monetization</span>
            <DollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span
              className={`font-display text-2xl sm:text-3xl font-black ${
                report.demonetizationProbabilityPct > 60
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {100 - report.demonetizationProbabilityPct}%
            </span>
            <span className="font-body text-[11px] font-semibold text-slate-500">
              {report.demonetizationProbabilityPct > 60
                ? 'Limited Ads (Yellow)'
                : 'Full Monetization (Green)'}
            </span>
          </div>
          <div
            className={`mt-2.5 h-1.5 w-full overflow-hidden rounded-full ${
              isLight ? 'bg-slate-200' : 'bg-slate-800'
            }`}
          >
            <div
              className={`h-full transition-all duration-500 ${
                report.demonetizationProbabilityPct > 60
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${100 - report.demonetizationProbabilityPct}%` }}
            />
          </div>
        </div>

        {/* Metric 3: First 7-Seconds Rule */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
            isLight
              ? 'border-slate-200/90 bg-slate-50/80 shadow-2xs'
              : 'border-slate-800/90 bg-slate-950/60'
          }`}
        >
          <div
            className={`flex items-center justify-between font-body text-xs font-semibold ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <span>First 7-Sec Hook</span>
            <Clock className="h-4 w-4 text-red-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span
              className={`font-display text-xl sm:text-2xl font-black uppercase ${
                report.first7SecondsStatus === 'FLAGGED'
                  ? 'text-red-600'
                  : report.first7SecondsStatus === 'CAUTION'
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {report.first7SecondsStatus === 'FLAGGED'
                ? 'Flagged'
                : report.first7SecondsStatus === 'CAUTION'
                ? 'Caution'
                : 'Compliant'}
            </span>
          </div>
          <p className="mt-2 font-body text-[11px] text-slate-500 leading-snug">
            {report.first7SecondsStatus === 'FLAGGED'
              ? 'Profanity or shock in opening 7s violates ad rules'
              : 'Opening hook meets advertiser standards'}
          </p>
        </div>

        {/* Metric 4: Issues Detected */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 transition ${
            isLight
              ? 'border-slate-200/90 bg-slate-50/80 shadow-2xs'
              : 'border-slate-800/90 bg-slate-950/60'
          }`}
        >
          <div
            className={`flex items-center justify-between font-body text-xs font-semibold ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            <span>Policy Flags</span>
            <Layers className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span
              className={`font-display text-2xl sm:text-3xl font-black ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {report.totalIssuesCount}
            </span>
            <span className="font-mono text-[11px] font-semibold text-slate-500">
              ({report.criticalIssuesCount} critical, {report.warningsCount} warnings)
            </span>
          </div>
          <p className="mt-2 font-body text-[11px] text-slate-500 leading-snug">
            {report.totalIssuesCount === 0
              ? 'Zero policy infractions detected'
              : 'Actionable trims listed on timeline below'}
          </p>
        </div>
      </div>

      {/* Policy Category Breakdown */}
      <div
        className={`rounded-2xl border p-4 ${
          isLight
            ? 'border-slate-200/90 bg-slate-50/50'
            : 'border-slate-800/80 bg-slate-950/40'
        }`}
      >
        <div className="flex items-center justify-between mb-2.5">
          <h4
            className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Official YouTube Policy Risk Scorecard
          </h4>
          <span className="font-body text-[11px] text-slate-400">
            Automated Ingest Algorithms
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <CategoryMiniMeter
            title="Child Safety"
            score={report.categoryScores.childSafety}
            isLight={isLight}
          />
          <CategoryMiniMeter
            title="Violence & Gore"
            score={report.categoryScores.violenceGore}
            isLight={isLight}
          />
          <CategoryMiniMeter
            title="Harmful Stunts"
            score={report.categoryScores.harmfulDangerous}
            isLight={isLight}
          />
          <CategoryMiniMeter
            title="Hate & Harassment"
            score={report.categoryScores.hateHarassment}
            isLight={isLight}
          />
          <CategoryMiniMeter
            title="Sexual / Nudity"
            score={report.categoryScores.sexualContent}
            isLight={isLight}
          />
          <CategoryMiniMeter
            title="Advertiser Suitability"
            score={report.categoryScores.advertiserSuitability}
            isLight={isLight}
          />
        </div>
      </div>
    </div>
  );
};

function CategoryMiniMeter({
  title,
  score,
  isLight = false,
}: {
  title: string;
  score: number;
  isLight?: boolean;
}) {
  const isHigh = score > 60;
  const isMed = score > 25;

  return (
    <div
      className={`flex flex-col justify-between rounded-xl border p-2.5 transition ${
        isLight
          ? 'border-slate-200 bg-white shadow-2xs'
          : 'border-slate-800/70 bg-slate-900/60'
      }`}
    >
      <div className="flex items-center justify-between text-xs">
        <span
          className={`line-clamp-1 font-body text-[11px] font-semibold ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}
        >
          {title}
        </span>
        <span
          className={`font-mono text-[10px] font-bold ${
            isHigh ? 'text-red-600' : isMed ? 'text-amber-600' : 'text-emerald-600'
          }`}
        >
          {score}%
        </span>
      </div>
      <div
        className={`mt-2 h-1.5 w-full overflow-hidden rounded-full ${
          isLight ? 'bg-slate-200' : 'bg-slate-800'
        }`}
      >
        <div
          className={`h-full transition-all duration-300 ${
            isHigh ? 'bg-red-600' : isMed ? 'bg-amber-500' : 'bg-emerald-500'
          }`}
          style={{ width: `${Math.max(4, score)}%` }}
        />
      </div>
    </div>
  );
}
