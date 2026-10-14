import React from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Play,
  Scissors,
  EyeOff,
  VolumeX,
  CheckCircle2,
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className={`font-display text-base sm:text-lg font-black tracking-tight ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}
          >
            Flagged Timeline Incidents (Actionable Fixes)
          </h3>
          <p className="font-sans text-xs text-slate-500 mt-0.5">
            Click any timestamp to seek video playback directly to the exact violation timecode
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 font-mono text-xs font-bold ring-1 ring-inset ${
            isLight
              ? 'bg-red-50 text-red-700 ring-red-200 shadow-2xs'
              : 'bg-rose-500/10 text-rose-300 ring-rose-500/30'
          }`}
        >
          {violations.length} {violations.length === 1 ? 'Incident' : 'Incidents'}
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {violations.map((violation, index) => {
          const isCritical = violation.severity === 'CRITICAL_STRIKE';
          const isCaution = violation.severity === 'DEMONETIZATION_WARNING';

          return (
            <div
              key={violation.id || index}
              className={`flex flex-col overflow-hidden rounded-2xl border transition shadow-2xs ${
                isCritical
                  ? isLight
                    ? 'border-red-200/80 bg-red-50/20'
                    : 'border-rose-500/30 bg-slate-900/80 shadow-md shadow-rose-950/20'
                  : isCaution
                  ? isLight
                    ? 'border-amber-200/80 bg-amber-50/20'
                    : 'border-amber-500/30 bg-slate-900/80'
                  : isLight
                  ? 'border-slate-200/80 bg-white'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              {/* Header bar of the violation */}
              <div
                className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5 ${
                  isLight
                    ? 'border-slate-100 bg-slate-50/80 text-slate-900'
                    : 'border-slate-800/80 bg-slate-950/60 text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex items-center gap-1.5 font-display text-xs font-black tracking-wide uppercase ${
                      isCritical ? 'text-red-600' : 'text-amber-600'
                    }`}
                  >
                    {isCritical ? (
                      <ShieldAlert className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    <span>
                      {isCritical ? 'Community Strike Risk' : 'Demonetization Warning'}
                    </span>
                  </span>

                  <span className={isLight ? 'text-slate-300' : 'text-slate-600'}>·</span>

                  <span className="font-sans text-xs font-medium text-slate-500">
                    {violation.categoryLabel}
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
                  title="Jump to video time"
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
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black ring-1 ring-slate-800 md:col-span-4">
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
                </div>

                {/* Issue Details & Official Policy citation (8 cols) */}
                <div className="flex flex-col justify-between md:col-span-8">
                  <div>
                    <h4
                      className={`font-display text-sm sm:text-base font-black tracking-tight ${
                        isLight ? 'text-slate-900' : 'text-white'
                      }`}
                    >
                      {violation.title}
                    </h4>

                    {/* Official YouTube Policy tag */}
                    <div className="mt-1 flex items-center gap-1.5 font-mono text-xs text-red-600">
                      <span className="font-semibold underline decoration-red-300">
                        {violation.youtubePolicyRef}
                      </span>
                    </div>

                    <p className="mt-1.5 font-sans text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {violation.descriptionEn}
                    </p>
                  </div>

                  {/* Fix Recommendation Box */}
                  <div
                    className={`mt-3.5 rounded-2xl border p-3.5 ${
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
