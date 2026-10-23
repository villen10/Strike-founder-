import React, { useState } from 'react';
import { X, Scissors, Copy, Check, Film, Clock, Download, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { AuditReport } from '../types/audit';
import { SubscriptionTier, isFeatureUnlocked } from '../services/subscriptionManager';

interface SafeCutGuideModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  report: AuditReport;
  isEmbedded?: boolean;
  isLight?: boolean;
  currentTier?: SubscriptionTier;
  onOpenPricing?: () => void;
}

export const SafeCutGuideModal: React.FC<SafeCutGuideModalProps> = ({
  isOpen = true,
  onClose,
  report,
  isEmbedded = false,
  isLight = false,
  currentTier = 'free',
  onOpenPricing,
}) => {
  if (!isEmbedded && !isOpen) return null;

  const [copied, setCopied] = useState(false);
  const isLocked = currentTier === 'free';

  const cutSheetText = `STRIKE FOUNDER - VIDEO EDITING CUT SHEET
Video Title: ${report.videoTitle}
Original Length: ${report.durationFormatted}
Safe Target Length: ${report.safeCutSummary.safeDurationAfterCuts}
Total Seconds to Remove: ${report.safeCutSummary.removedSecondsTotal}s

EXACT CUTS TO PERFORM IN CAPCUT / PREMIERE PRO:
${report.timelineViolations
  .map(
    (v, i) =>
      `${i + 1}. [${v.timestampStart} - ${v.timestampEnd}] -> ${v.actionableFix.actionType}: ${v.actionableFix.instructionsEn}`
  )
  .join('\n')}

Result after trims: 100% YouTube Community Guidelines Compliant.`;

  const handleCopy = () => {
    if (isLocked) {
      onOpenPricing?.();
      return;
    }
    navigator.clipboard.writeText(cutSheetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const modalContent = (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-3xl border transition ${
        isEmbedded
          ? isLight
            ? 'border-slate-100 bg-white text-slate-900 shadow-2xs'
            : 'border-slate-800 bg-slate-900 text-slate-100 shadow-xl'
          : isLight
          ? 'max-h-[90vh] max-w-lg border-slate-100 bg-white text-slate-900 shadow-2xl'
          : 'max-h-[90vh] max-w-lg border-slate-800 bg-slate-900 text-slate-100 shadow-2xl'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b px-5 py-4 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-slate-800 bg-slate-900'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl shadow-xs ${
              isLight ? 'bg-red-50 text-red-600 ring-1 ring-red-200' : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40'
            }`}
          >
            <Scissors className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3
                className={`font-display text-sm font-bold sm:text-base ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}
              >
                Video Editor Safe Cut Sheet
              </h3>
              {isLocked ? (
                <span className="flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-rose-300">
                  <Lock className="h-2.5 w-2.5" />
                  <span>TIMECODES LOCKED</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
                  <span>UNLOCKED</span>
                </span>
              )}
            </div>
            <p className={`font-body text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Exact second-by-second timecodes to trim in CapCut, Premiere Pro, or DaVinci Resolve
            </p>
          </div>
        </div>
        {onClose && !isEmbedded && (
          <button
            onClick={onClose}
            className={`rounded-xl p-1.5 transition ${
              isLight
                ? 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 text-xs">
        <div className="flex flex-col gap-4">
          {/* Quick Stats Summary */}
          <div
            className={`grid grid-cols-3 gap-2 rounded-2xl border p-3.5 text-center ${
              isLight
                ? 'border-slate-200/90 bg-slate-50/80 shadow-2xs'
                : 'border-slate-800 bg-slate-950'
            }`}
          >
            <div>
              <span className={`font-body text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Original Runtime
              </span>
              <p
                className={`font-mono text-xs sm:text-sm font-bold mt-0.5 ${
                  isLight ? 'text-slate-900' : 'text-slate-200'
                }`}
              >
                {report.durationFormatted}
              </p>
            </div>
            <div className={`border-x ${isLight ? 'border-slate-200' : 'border-slate-800'}`}>
              <span className={`font-body text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Total Trim Time
              </span>
              <p
                className={`font-mono text-xs sm:text-sm font-bold mt-0.5 ${
                  isLocked ? 'blur-xs text-rose-400 select-none' : isLight ? 'text-red-600' : 'text-rose-400'
                }`}
              >
                {isLocked ? '-••s' : `-${report.safeCutSummary.removedSecondsTotal}s`}
              </p>
            </div>
            <div>
              <span className={`font-body text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Target Safe Runtime
              </span>
              <p className={`font-mono text-xs sm:text-sm font-bold mt-0.5 ${isLocked ? 'blur-xs text-emerald-400 select-none' : 'text-emerald-500'}`}>
                {isLocked ? '••:••' : report.safeCutSummary.safeDurationAfterCuts}
              </p>
            </div>
          </div>

          {/* List of Cuts with Lock Overlay on Free Tier */}
          <div className="relative flex flex-col gap-2">
            <h4
              className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Required Timeline Edits:
            </h4>

            {report.timelineViolations.map((v, i) => (
              <div
                key={v.id}
                className={`flex items-start gap-2.5 rounded-xl border p-3 ${
                  isLight
                    ? 'border-slate-200 bg-slate-50/70'
                    : 'border-slate-800/90 bg-slate-950/70'
                }`}
              >
                <div
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold ${
                    isLight ? 'bg-red-100 text-red-700' : 'bg-slate-800 text-rose-400'
                  }`}
                >
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-mono text-xs font-bold ${
                        isLocked ? 'filter blur-[3px] select-none text-rose-400' : isLight ? 'text-red-700' : 'text-rose-400'
                      }`}
                    >
                      {isLocked ? '00:14 - 00:28' : `${v.timestampStart} - ${v.timestampEnd}`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold uppercase ${
                          isLight
                            ? 'bg-slate-200 text-slate-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {v.actionableFix.actionType}
                      </span>
                    </div>
                  </div>
                  <p
                    className={`mt-1 font-body text-xs leading-relaxed ${
                      isLocked ? 'filter blur-[2.5px] select-none' : isLight ? 'text-slate-700' : 'text-slate-300'
                    }`}
                  >
                    {isLocked ? 'Trim exact 14 seconds from timeline to remove copyright audio stem and avoid strike.' : v.actionableFix.instructionsEn}
                  </p>
                </div>
              </div>
            ))}

            {/* Lock Overlay on Free Tier */}
            {isLocked && (
              <div className="absolute inset-0 top-6 flex flex-col items-center justify-center bg-slate-950/85 backdrop-blur-[2px] rounded-2xl border border-rose-500/40 p-4 text-center z-10">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-900/50 mb-2">
                  <Lock className="h-5 w-5" />
                </div>
                <h4 className="font-display font-bold text-sm text-white">
                  Exact Safe-Cut Timecodes Locked
                </h4>
                <p className="font-sans text-xs text-slate-300 max-w-xs mt-1 leading-relaxed">
                  You know your video has policy risks! To see the exact second-by-second CapCut/Premiere cut timestamps, upgrade your plan.
                </p>
                <button
                  type="button"
                  onClick={onOpenPricing}
                  className="mt-3 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-4 py-2 font-display text-xs font-bold text-white shadow-lg shadow-red-900/40 transition cursor-pointer active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Unlock Exact Timecodes ($19/mo)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Copy Cut Sheet Button */}
          <button
            onClick={handleCopy}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-display text-xs font-bold transition shadow-xs active:scale-[0.99] cursor-pointer ${
              isLocked
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                : isLight
                ? 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/20'
                : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500'
            }`}
          >
            {isLocked ? (
              <>
                <Lock className="h-4 w-4 text-rose-400" />
                <span>Upgrade to Copy Safe-Cut Sheet ($19)</span>
              </>
            ) : copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-300" />
                <span>Cut Sheet Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Cut Sheet for Editor</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Footer */}
      {onClose && !isEmbedded && (
        <div
          className={`border-t px-5 py-3 ${
            isLight ? 'border-slate-200 bg-slate-50/60' : 'border-slate-800 bg-slate-950/60'
          }`}
        >
          <button
            onClick={onClose}
            className={`w-full rounded-xl py-2 font-body text-xs font-semibold transition ${
              isLight
                ? 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                : 'border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );

  if (isEmbedded) {
    return modalContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      {modalContent}
    </div>
  );
};
