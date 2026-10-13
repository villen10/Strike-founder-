import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ShieldAlert, Film, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ExtractedFrame } from '../services/frameExtractor';
import { PolicyViolation } from '../types/audit';

interface FrameAnalysisProgressProps {
  frames: ExtractedFrame[];
  violations: PolicyViolation[];
  isScanning: boolean;
  scanProgress: { percent: number; status: string };
  isLight?: boolean;
}

export const FrameAnalysisProgress: React.FC<FrameAnalysisProgressProps> = ({
  frames,
  violations,
  isScanning,
  scanProgress,
  isLight = false,
}) => {
  if (frames.length === 0 && !isScanning) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 sm:p-5 transition shadow-xs ${
        isLight
          ? 'border-slate-200/90 bg-white text-slate-900'
          : 'border-slate-800/80 bg-slate-900/60 backdrop-blur-md text-slate-100'
      }`}
    >
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-red-600 animate-pulse" />
          <h3 className={`font-display text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Frame & 4s Snippet Analysis Stream
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold ${
              isScanning
                ? 'bg-red-500/10 text-red-500 border border-red-500/30 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
            }`}
          >
            {isScanning ? `Scanning... ${scanProgress.percent}%` : `${frames.length} Snippets Audited`}
          </span>
        </div>
      </div>

      {/* Frame Thumbnail Carousel / Grid */}
      <div className="relative overflow-x-auto pb-2 pt-1 scrollbar-thin">
        <div className="flex items-center gap-3 min-w-max">
          {frames.map((frame, index) => {
            // Check if this frame timestamp falls within any violation window
            const matchingViolation = violations.find(
              (v) => frame.seconds >= v.secondsStart && frame.seconds <= v.secondsEnd
            );
            const isFlagged = Boolean(matchingViolation);
            const isCritical = matchingViolation?.severity === 'CRITICAL_STRIKE';

            return (
              <motion.div
                key={`frame-${index}-${frame.timestamp}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`group relative flex flex-col overflow-hidden rounded-xl border transition-all ${
                  isFlagged
                    ? isCritical
                      ? 'border-red-600 bg-red-950/40 ring-1 ring-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                      : 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500/40'
                    : isLight
                    ? 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
                style={{ width: '130px' }}
              >
                {/* Thumbnail Image Box */}
                <div className="relative aspect-video w-full bg-black overflow-hidden">
                  {frame.dataUrl ? (
                    <img
                      src={frame.dataUrl}
                      alt={`Snippet at ${frame.timestamp}`}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-600">
                      <Film className="h-5 w-5" />
                    </div>
                  )}

                  {/* Timestamp Badge */}
                  <div className="absolute bottom-1 left-1 rounded bg-black/70 px-1.5 py-0.5 font-mono text-[9px] font-bold text-white backdrop-blur-xs">
                    {frame.timestamp}
                  </div>

                  {/* Safe or Flagged Marker Badge */}
                  <div className="absolute top-1 right-1">
                    {isFlagged ? (
                      <span
                        className={`flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[8px] font-bold text-white shadow-xs ${
                          isCritical ? 'bg-red-600' : 'bg-amber-600'
                        }`}
                        title={matchingViolation?.title || 'Flagged snippet'}
                      >
                        <AlertTriangle className="h-2.5 w-2.5" />
                        {isCritical ? 'Strike' : 'Warn'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 rounded bg-emerald-600/90 px-1.5 py-0.5 font-mono text-[8px] font-bold text-white shadow-xs">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Safe
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Snippet Info */}
                <div className="p-2">
                  <span className="block font-mono text-[10px] font-semibold text-slate-400">
                    4s Window #{index + 1}
                  </span>
                  <span
                    className={`block truncate font-body text-[10px] ${
                      isFlagged
                        ? isCritical
                          ? 'text-red-400 font-bold'
                          : 'text-amber-400 font-bold'
                        : isLight
                        ? 'text-slate-600'
                        : 'text-slate-300'
                    }`}
                  >
                    {matchingViolation ? matchingViolation.title : 'Pristine Ingestion'}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {frames.length === 0 && isScanning && (
            <div className="flex items-center justify-center p-6 w-full text-slate-400 font-mono text-xs">
              Extracting 4-second snippet windows and frame snapshots...
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
