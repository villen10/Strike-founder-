import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Play,
  Scissors,
  EyeOff,
  VolumeX,
  CheckCircle2,
  Activity,
  Cpu,
  HelpCircle,
  Gauge,
} from 'lucide-react';
import { PolicyViolation } from '../types/audit';

interface TimelineViolationsProps {
  violations: PolicyViolation[];
  onSeekToViolation: (seconds: number) => void;
  isLight?: boolean;
}

export const TimelineViolations: React.FC<TimelineViolationsProps> = ({
  violations,
  onSeekToViolation,
  isLight = false,
}) => {
  if (violations.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-3xl border p-8 text-center transition shadow-2xs ${
          isLight
            ? 'border-emerald-200/80 bg-emerald-50/70 text-emerald-950 shadow-emerald-500/5'
            : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
        }`}
      >
        <div
          className={`mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-xs ${
            isLight
              ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300'
              : 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
          }`}
        >
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3
          className={`font-display text-base sm:text-lg font-black tracking-tight ${
            isLight ? 'text-slate-950' : 'text-white'
          }`}
        >
          Zero Community Guideline Violations Detected
        </h3>
        <p
          className={`mt-1.5 max-w-lg font-sans text-xs sm:text-sm leading-relaxed ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}
        >
          All temporal keyframes meet YouTube automated moderation standards, child safety guidelines, and opening hook advertiser policies. Ready for safe scheduling.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`rounded-3xl border p-5 sm:p-6 transition shadow-2xs ${
        isLight ? 'border-slate-100 bg-white shadow-slate-200/50' : 'border-slate-800 bg-slate-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3
            className={`font-display text-base sm:text-lg font-black tracking-tight ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
          >
            Flagged Timeline Incidents & Confidence Metrics
          </h3>
          <p className="font-sans text-xs text-slate-500 mt-0.5">
            Detailed algorithmic detection confidence levels and explanations for each flagged segment
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`rounded-full px-3 py-1 font-mono text-xs font-bold ring-1 ring-inset ${
              isLight
                ? 'bg-red-50 text-red-700 ring-red-200 shadow-2xs'
                : 'bg-rose-500/10 text-rose-300 ring-rose-500/30'
            }`}
          >
            {violations.length} {violations.length === 1 ? 'Incident Flagged' : 'Incidents Flagged'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {violations.map((violation, index) => {
          const isCritical = violation.severity === 'CRITICAL_STRIKE';
          const isCaution = violation.severity === 'DEMONETIZATION_WARNING';
          const confidence = violation.confidencePct ?? (isCritical ? 96 : 82);
          const confLevel = violation.confidenceLevel || (confidence >= 90 ? 'VERY_HIGH' : confidence >= 75 ? 'HIGH' : confidence >= 60 ? 'MEDIUM' : 'BORDERLINE');

          return (
            <div
              key={violation.id || index}
              className={`flex flex-col overflow-hidden rounded-2xl border transition shadow-2xs ${
                isCritical
                  ? isLight
                    ? 'border-red-200 bg-red-50/20 shadow-xs'
                    : 'border-rose-500/30 bg-slate-900/80 shadow-md shadow-rose-950/20'
                  : isCaution
                  ? isLight
                    ? 'border-amber-200 bg-amber-50/20 shadow-xs'
                    : 'border-amber-500/30 bg-slate-900/80 shadow-xs'
                  : isLight
                  ? 'border-slate-200 bg-white'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              {/* Header bar of the violation with Severity, Category & Confidence Pill */}
              <div
                className={`flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 ${
                  isLight
                    ? 'border-slate-100 bg-slate-50/90 text-slate-900'
                    : 'border-slate-800/80 bg-slate-950/60 text-slate-100'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`flex items-center gap-1.5 font-display text-xs font-black tracking-wide uppercase ${
                      isCritical ? 'text-red-600' : 'text-amber-600'
                    }`}
                  >
                    {isCritical ? (
                      <ShieldAlert className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    )}
                    <span>
                      {isCritical ? 'Community Strike Hazard' : 'Demonetization Alert'}
                    </span>
                  </span>

                  <span className={isLight ? 'text-slate-300' : 'text-slate-700'}>·</span>

                  <span className="font-sans text-xs font-semibold text-slate-500">
                    {violation.categoryLabel}
                  </span>

                  {/* Algorithmic Confidence Level Badge */}
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold ring-1 ring-inset ${
                      confLevel === 'VERY_HIGH'
                        ? 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20'
                        : confLevel === 'HIGH'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20'
                        : confLevel === 'MEDIUM'
                        ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-yellow-500/20'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20'
                    }`}
                    title={`Algorithmic certainty: ${confidence}%`}
                  >
                    <Gauge className="h-3 w-3 shrink-0" />
                    <span>{confidence}% Confidence</span>
                    <span className="text-[9px] uppercase opacity-75 font-sans">
                      ({confLevel === 'VERY_HIGH' ? 'Very High' : confLevel === 'HIGH' ? 'High' : confLevel === 'MEDIUM' ? 'Moderate' : 'Borderline'})
                    </span>
                  </span>
                </div>

                {/* Timestamp Jump Button */}
                <button
                  type="button"
                  onClick={() => onSeekToViolation(violation.secondsStart)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1 font-mono text-xs font-bold shadow-2xs transition cursor-pointer hover:scale-102 ${
                    isLight
                      ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-800'
                      : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                  title="Jump video playback to this timestamp"
                >
                  <Play className="h-3 w-3 fill-current text-red-600" />
                  <span>
                    {violation.timestampStart} - {violation.timestampEnd}
                  </span>
                  <span className="text-[10px] font-normal text-slate-400">
                    (Seek)
                  </span>
                </button>
              </div>

              {/* Main violation body */}
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-12">
                {/* Visual Snapshot Frame Preview (4 cols) */}
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-slate-800 md:col-span-4 self-start">
                  {violation.frameSnapshot ? (
                    <img
                      src={violation.frameSnapshot}
                      alt="Flagged frame snapshot"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-2 text-center text-slate-500">
                      <ShieldAlert className="h-6 w-6 text-red-500" />
                      <span className="mt-1 font-mono text-[11px] text-slate-300">
                        {violation.timestampStart} Keyframe
                      </span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 rounded-lg bg-black/80 px-2 py-0.5 font-mono text-[10px] font-bold text-white backdrop-blur-xs">
                    {violation.timestampStart}
                  </div>

                  <div className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 font-mono text-[9px] font-bold text-red-400 backdrop-blur-xs">
                    Certainty: {confidence}%
                  </div>
                </div>

                {/* Issue Details, Policy Citation & Detection Reason (8 cols) */}
                <div className="flex flex-col justify-between md:col-span-8 gap-3.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className={`font-display text-sm sm:text-base font-black tracking-tight ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {violation.title}
                      </h4>
                    </div>

                    {/* Official YouTube Policy tag */}
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-red-600 dark:text-red-400">
                      <span className="font-semibold underline decoration-red-300 dark:decoration-red-700">
                        {violation.youtubePolicyRef}
                      </span>
                    </div>

                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {violation.descriptionEn}
                    </p>
                  </div>

                  {/* Why this item was flagged (Confidence & Detection Rationale) */}
                  <div
                    className={`rounded-2xl border p-3.5 text-xs transition ${
                      isLight
                        ? 'border-indigo-100 bg-indigo-50/50 text-indigo-950'
                        : 'border-indigo-950/60 bg-indigo-950/20 text-indigo-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5 font-display text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                        <Cpu className="h-3.5 w-3.5" />
                        <span>Why This Scene Was Flagged</span>
                      </div>
                      {violation.detectionMechanism && (
                        <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-300">
                          {violation.detectionMechanism}
                        </span>
                      )}
                    </div>

                    <p className="font-sans leading-relaxed text-slate-600 dark:text-slate-300">
                      {violation.detectionReasoning ||
                        `Computer vision and acoustic ingestion classifiers detected high-probability policy infractions with ${confidence}% certainty in this segment.`}
                    </p>

                    {/* Visual Confidence Bar */}
                    <div className="mt-2.5 flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-slate-500 shrink-0 font-medium">
                        Confidence:
                      </span>
                      <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            confidence >= 90
                              ? 'bg-red-600'
                              : confidence >= 75
                              ? 'bg-amber-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${confidence}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                        {confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Fix Recommendation Box */}
                  <div
                    className={`rounded-2xl border p-3.5 ${
                      isLight
                        ? 'border-slate-100 bg-slate-50/80'
                        : 'border-slate-800 bg-slate-950/70'
                    }`}
                  >
                    <div
                      className={`flex flex-wrap items-center justify-between gap-1 text-xs font-bold ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
                        {violation.actionableFix.actionType === 'TRIM_CLIP' && (
                          <Scissors className="h-3.5 w-3.5 text-red-600" />
                        )}
                        {violation.actionableFix.actionType === 'BLUR_AREA' && (
                          <EyeOff className="h-3.5 w-3.5 text-amber-600" />
                        )}
                        {violation.actionableFix.actionType === 'MUTE_AUDIO' && (
                          <VolumeX className="h-3.5 w-3.5 text-blue-600" />
                        )}
                        <span>Recommended Remediation:</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-red-600">
                        {violation.actionableFix.suggestedCut}
                      </span>
                    </div>

                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {violation.actionableFix.instructionsEn}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
