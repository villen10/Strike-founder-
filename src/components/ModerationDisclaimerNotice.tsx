import React, { useState } from 'react';
import { ShieldCheck, Info, ChevronDown, Sparkles, Cpu, AlertCircle } from 'lucide-react';

interface ModerationDisclaimerNoticeProps {
  isLight?: boolean;
  compact?: boolean;
}

export const ModerationDisclaimerNotice: React.FC<ModerationDisclaimerNoticeProps> = ({
  isLight = false,
  compact = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`rounded-2xl border transition shadow-2xs font-public-sans ${
        isLight
          ? 'border-indigo-100 bg-gradient-to-r from-indigo-50/60 via-slate-50 to-blue-50/40 text-slate-800'
          : 'border-indigo-900/40 bg-gradient-to-r from-indigo-950/30 via-slate-900/80 to-slate-950 text-slate-200'
      } ${compact ? 'p-3 text-xs' : 'p-3.5 sm:p-4 text-xs'}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-start sm:items-center gap-2.5">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${
              isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-300'
            }`}
          >
            <Info className="h-4 w-4" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`font-satoshi text-xs font-black tracking-tight ${
                isLight ? 'text-slate-950' : 'text-white'
              }`}
            >
              Pre-Upload Advisory &amp; Accuracy Transparency
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/15 border border-indigo-500/30 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
              <Cpu className="h-3 w-3" />
              <span>85% – 90% YouTube Bot Alignment</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-1 text-[11px] font-mono font-semibold transition cursor-pointer self-end sm:self-auto ${
            isLight ? 'text-indigo-600 hover:text-indigo-800' : 'text-indigo-400 hover:text-indigo-300'
          }`}
        >
          <span>{isExpanded ? 'Less Details' : 'Read Notice'}</span>
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
      </div>

      {/* Main Core Notice (Always visible in clean concise font) */}
      <p
        className={`mt-2 font-public-sans leading-relaxed text-[11px] sm:text-xs ${
          isLight ? 'text-slate-600' : 'text-slate-300'
        }`}
      >
        YouTube continuously updates its automated detection algorithms and ingestion moderation bots. While Striku analyzes your video through <strong>3 powerful neural agents</strong> (visual, acoustic &amp; contextual) with an <strong>85%–90% alignment</strong> to YouTube&apos;s bots, no third-party system can guarantee 100% certainty. Striku is the best pre-upload safety check to guide what to trim or keep before publishing, while YouTube retains final platform authority.
      </p>

      {/* Expanded Technical Disclosure (Toggled) */}
      {isExpanded && (
        <div
          className={`mt-3 pt-3 border-t text-[11px] leading-relaxed space-y-2 ${
            isLight ? 'border-indigo-100 text-slate-600' : 'border-indigo-900/60 text-slate-400'
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="text-indigo-500 font-bold">•</span>
            <span>
              <strong>3-Pass Multi-Agent Consensus:</strong> Agent Alpha scans keyframe visual hazards, Agent Beta indexes acoustic profanity and soundbites, and Agent Omega synthesizes community guideline precedent.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-500 font-bold">•</span>
            <span>
              <strong>Why Not 100%?:</strong> YouTube uses dynamic regional review rules, advertiser brand-suitability thresholds, and periodic bot updates that can adjust enforcement weights after upload.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-500 font-bold">•</span>
            <span>
              <strong>Recommended Action:</strong> Follow our second-by-second CapCut safe cut instructions on any flagged segment to minimize your strike risk before making the video public.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
