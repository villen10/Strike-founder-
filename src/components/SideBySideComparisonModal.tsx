import React, { useState } from 'react';
import {
  X,
  Scale,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Layers,
  Sparkles,
  FileText,
  Clock,
  Flame,
  CheckCircle2,
  ChevronDown,
} from 'lucide-react';
import { AuditReport } from '../types/audit';

interface SideBySideComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableReports: AuditReport[];
  defaultVideoAId?: string;
  defaultVideoBId?: string;
  isLight?: boolean;
}

export const SideBySideComparisonModal: React.FC<SideBySideComparisonModalProps> = ({
  isOpen,
  onClose,
  availableReports,
  defaultVideoAId,
  defaultVideoBId,
  isLight = false,
}) => {
  if (!isOpen) return null;

  // Ensure we have at least 2 reports to compare
  const reports = availableReports.length > 0 ? availableReports : [];

  const [selectedIdA, setSelectedIdA] = useState<string>(
    defaultVideoAId || (reports[0]?.id || '')
  );
  const [selectedIdB, setSelectedIdB] = useState<string>(
    defaultVideoBId || (reports[1]?.id || reports[0]?.id || '')
  );

  const videoA = reports.find((r) => r.id === selectedIdA) || reports[0];
  const videoB = reports.find((r) => r.id === selectedIdB) || reports[1] || reports[0];

  // Calculate common policy trends
  const getConsistentTrends = () => {
    if (!videoA || !videoB) return [];
    const trends: Array<{
      category: string;
      level: 'CRITICAL' | 'WARNING' | 'CLEAR';
      titleEn: string;
      titleUrdu: string;
      descEn: string;
      descUrdu: string;
    }> = [];

    // Check Copyright / Reused Content trend
    const aCopy = videoA.timelineViolations?.some((v) => v.category === 'COPYRIGHT_FAIR_USE' || v.categoryLabel?.toLowerCase().includes('copyright')) || videoA.mainIssueHeadline?.toLowerCase().includes('copyright') || videoA.mainIssueHeadline?.toLowerCase().includes('broadcast');
    const bCopy = videoB.timelineViolations?.some((v) => v.category === 'COPYRIGHT_FAIR_USE' || v.categoryLabel?.toLowerCase().includes('copyright')) || videoB.mainIssueHeadline?.toLowerCase().includes('copyright') || videoB.mainIssueHeadline?.toLowerCase().includes('broadcast');

    if (aCopy && bCopy) {
      trends.push({
        category: 'Copyright & Reused Media',
        level: 'CRITICAL',
        titleEn: 'Persistent Broadcast / Copyright Reused Media Trend',
        titleUrdu: 'دونوں ویڈیوز میں کاپی رائٹ اور ٹی وی نشریات کا مستقل مسئلہ موجود ہے',
        descEn: 'Both analyzed videos trigger Content ID and broadcast reuse infractions. Repeated violations in this niche carry severe risk of multiple channel copyright strikes.',
        descUrdu: 'دونوں ویڈیوز میں تیسرے فریق کا مواد استعمال ہوا ہے۔ اس سے یوٹیوب چینل ٹرمینیٹ ہونے کا شدید خطرہ پیدا ہوتا ہے۔',
      });
    }

    // Check Dangerous Content / Stunts
    const aDanger = (videoA.categoryScores?.harmfulDangerous ?? 0) > 40 || videoA.mainIssueHeadline?.toLowerCase().includes('dangerous') || videoA.mainIssueHeadline?.toLowerCase().includes('stunt');
    const bDanger = (videoB.categoryScores?.harmfulDangerous ?? 0) > 40 || videoB.mainIssueHeadline?.toLowerCase().includes('dangerous') || videoB.mainIssueHeadline?.toLowerCase().includes('stunt');

    if (aDanger && bDanger) {
      trends.push({
        category: 'Dangerous Content & Harmful Activities',
        level: 'CRITICAL',
        titleEn: 'Consistent Dangerous Stunt / Harmful Conduct Habit',
        titleUrdu: 'خطرناک اسٹنٹ اور پالیسی خلاف ورزی کا تسلسل پایا گیا',
        descEn: 'Both videos feature high-risk physical stunts, dangerous maneuvers, or harmful acts. YouTube Community Guidelines apply zero-tolerance strikes.',
        descUrdu: 'دونوں ویڈیوز میں خطرناک اسٹنٹس کی نشاندہی ہوئی ہے جس پر یوٹیوب کی سخت اسٹرائیک آتی ہے۔',
      });
    }

    // Check Adult / Nudity
    const aAdult = (videoA.categoryScores?.sexualContent ?? 0) > 30 || videoA.mainIssueHeadline?.toLowerCase().includes('adult') || videoA.mainIssueHeadline?.toLowerCase().includes('nudity');
    const bAdult = (videoB.categoryScores?.sexualContent ?? 0) > 30 || videoB.mainIssueHeadline?.toLowerCase().includes('adult') || videoB.mainIssueHeadline?.toLowerCase().includes('nudity');

    if (aAdult && bAdult) {
      trends.push({
        category: 'Sex & Nudity Exposure',
        level: 'CRITICAL',
        titleEn: 'Recurring Adult Exposure / Sensational Framing',
        titleUrdu: 'غیر اخلاقی یا نامناسب مواد کا بار بار دہرایا جانا',
        descEn: 'Visual frame inspection detected high skin tone concentration or suggestive framing across both uploads.',
        descUrdu: 'دونوں ویڈیوز میں غیر مناسب فریمز کا تسلسل پایا گیا ہے۔',
      });
    }

    // Check Opening Hook / First 7 Seconds
    const aHook = videoA.first7SecondsStatus === 'FLAGGED' || videoA.first7SecondsStatus === 'CAUTION';
    const bHook = videoB.first7SecondsStatus === 'FLAGGED' || videoB.first7SecondsStatus === 'CAUTION';

    if (aHook && bHook) {
      trends.push({
        category: 'Opening Hook & Advertiser Suitability',
        level: 'WARNING',
        titleEn: 'Consistent Opening 7-Second Sensitivity Trend',
        titleUrdu: 'پہلے 7 سیکنڈز میں بار بار وارننگ کا رحجان',
        descEn: 'Both videos risk advertiser demonetization (Yellow Dollar) due to sudden visual cuts or sensitive opening audio hooks.',
        descUrdu: 'دونوں ویڈیوز کے ابتدائی 7 سیکنڈز میں مونیٹائزیشن کا خطرہ ہے۔',
      });
    }

    // If no negative trends
    if (trends.length === 0) {
      const bothClean = videoA.safetyGrade === 'SAFE_TO_UPLOAD' && videoB.safetyGrade === 'SAFE_TO_UPLOAD';
      trends.push({
        category: 'General Compliance',
        level: bothClean ? 'CLEAR' : 'WARNING',
        titleEn: bothClean ? 'High Channel Consistency: Clean Content Portfolio' : 'Isolated Violations: No Systemic Channel Habit',
        titleUrdu: bothClean ? 'چینل کا مواد بہترین اور یکساں طور پر محفوظ ہے' : 'کوئی مستقل پیٹرن نہیں ملا، انفرادی کٹس کی ضرورت ہے',
        descEn: bothClean
          ? 'Both videos adhere cleanly to YouTube Community Guidelines with minimal platform risk.'
          : 'Violations appear isolated rather than a systemic habit. Address individual flagged cuts before publishing.',
        descUrdu: bothClean
          ? 'دونوں ویڈیوز تمام یوٹیوب گائیڈ لائنز کے مطابق محفوظ ہیں۔'
          : 'پالیسی کی خلاف ورزی مستقل نہیں ہے۔ مخصوص حصوں کو ایڈٹ کریں۔',
      });
    }

    return trends;
  };

  const trends = getConsistentTrends();

  const renderVideoCard = (video: AuditReport | undefined, label: 'Video A' | 'Video B', currentId: string, onSelect: (id: string) => void) => {
    if (!video) {
      return (
        <div className={`rounded-3xl border p-6 text-center ${isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
          No video selected for comparison
        </div>
      );
    }

    const isStrike = video.safetyGrade === 'HIGH_STRIKE_RISK';
    const isWarning = video.safetyGrade === 'MONETIZATION_AT_RISK';

    return (
      <div className={`flex flex-col gap-5 rounded-3xl border p-5 sm:p-6 transition-all ${
        isStrike
          ? isLight
            ? 'border-red-300 bg-red-50/40 shadow-xs'
            : 'border-red-900/60 bg-red-950/20 shadow-xs'
          : isWarning
          ? isLight
            ? 'border-amber-300 bg-amber-50/40 shadow-xs'
            : 'border-amber-900/60 bg-amber-950/20 shadow-xs'
          : isLight
          ? 'border-emerald-300 bg-emerald-50/40 shadow-xs'
          : 'border-emerald-900/60 bg-emerald-950/20 shadow-xs'
      }`}>
        {/* Selector & Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className={`rounded-xl px-2.5 py-1 text-xs font-mono font-bold ${
              label === 'Video A' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
            }`}>
              {label}
            </span>
            <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
              {video.durationFormatted} ({video.videoDurationSec}s)
            </span>
          </div>

          {/* Video Switcher Dropdown */}
          <div className="relative">
            <select
              value={currentId}
              onChange={(e) => onSelect(e.target.value)}
              className={`rounded-xl border px-3 py-1.5 font-sans text-xs font-semibold cursor-pointer outline-none transition ${
                isLight
                  ? 'border-slate-300 bg-white text-slate-800 hover:border-slate-400'
                  : 'border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-600'
              }`}
            >
              {reports.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.videoTitle.length > 28 ? r.videoTitle.substring(0, 25) + '...' : r.videoTitle}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Title & Snapshot */}
        <div className="flex items-start gap-3">
          <div className="flex h-14 w-24 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            {video.timelineViolations?.[0]?.frameSnapshot ? (
              <img
                src={video.timelineViolations[0].frameSnapshot}
                alt="Frame"
                className="h-full w-full object-cover"
              />
            ) : (
              <Layers className="h-6 w-6 text-slate-600" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className={`font-display text-sm sm:text-base font-bold line-clamp-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {video.videoTitle}
            </h4>
            <p className="font-mono text-xs text-slate-500 mt-0.5">
              Audited: {video.scannedAt || 'Recent'}
            </p>
          </div>
        </div>

        {/* Grade & Score Card */}
        <div className={`grid grid-cols-2 gap-3 rounded-2xl p-3 border ${
          isLight ? 'bg-white/80 border-slate-200' : 'bg-slate-900/80 border-slate-800'
        }`}>
          <div>
            <p className="font-sans text-[11px] font-semibold text-slate-500">Platform Verdict</p>
            <div className="flex items-center gap-1.5 mt-1">
              {isStrike ? (
                <ShieldAlert className="h-4 w-4 text-red-600" />
              ) : isWarning ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              )}
              <span className={`font-display text-xs font-bold uppercase ${
                isStrike ? 'text-red-600 dark:text-red-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {video.safetyGrade.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div>
            <p className="font-sans text-[11px] font-semibold text-slate-500">Overall Risk Score</p>
            <p className={`font-mono text-lg font-black mt-0.5 ${
              video.overallRiskScore > 60 ? 'text-red-600 dark:text-red-400' : video.overallRiskScore > 20 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {video.overallRiskScore}/100
            </p>
          </div>
        </div>

        {/* Probabilities & Main Issue */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between font-mono text-xs text-slate-500">
            <span>Strike Probability:</span>
            <span className={`font-bold ${video.strikeProbabilityPct > 50 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {video.strikeProbabilityPct}%
            </span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-slate-500">
            <span>Demonetization Probability:</span>
            <span className={`font-bold ${video.demonetizationProbabilityPct > 50 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
              {video.demonetizationProbabilityPct}%
            </span>
          </div>
          <div className="flex items-center justify-between font-mono text-xs text-slate-500">
            <span>Flagged Issues Count:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {video.totalIssuesCount} violations
            </span>
          </div>
        </div>

        {/* 3-Pass Deep Audit Consensus Badge */}
        {video.deepAuditDetails && (
          <div className={`flex flex-col gap-2 rounded-2xl p-3 border text-xs ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">3-Pass Deep Audit Consensus</span>
            <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
              <div className={`rounded p-1 ${video.deepAuditDetails.passes[0]?.strikeRisk ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-emerald-500/20 text-emerald-400'}`}>
                Pass 1 (4s)
              </div>
              <div className={`rounded p-1 ${video.deepAuditDetails.passes[1]?.strikeRisk ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-emerald-500/20 text-emerald-400'}`}>
                Pass 2 (2-3s)
              </div>
              <div className={`rounded p-1 ${video.deepAuditDetails.passes[2]?.strikeRisk ? 'bg-red-500/20 text-red-400 font-bold' : 'bg-emerald-500/20 text-emerald-400'}`}>
                Pass 3 (Consensus)
              </div>
            </div>
          </div>
        )}

        {/* Primary Issue Headline */}
        <div className={`rounded-2xl p-3 border ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <p className="font-sans text-[11px] font-bold text-slate-500">Primary Finding</p>
          <p className="font-sans text-xs font-semibold mt-1 text-slate-800 dark:text-slate-200">
            {video.mainIssueHeadline || 'No policy strike cues found.'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className={`relative flex flex-col w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-5 border-b ${
          isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-950/50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold">
                Deep Audit Side-by-Side Video Comparator
              </h2>
              <p className="font-sans text-xs text-slate-500">
                Compare multi-pass audit outputs across two uploads to detect consistent policy violation habits
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`flex h-9 w-9 items-center justify-center rounded-2xl border transition cursor-pointer ${
              isLight
                ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
                : 'border-slate-800 bg-slate-800/80 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-6 p-6 max-h-[80vh] overflow-y-auto">
          {/* Side-by-Side Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {renderVideoCard(videoA, 'Video A', selectedIdA, setSelectedIdA)}
            {renderVideoCard(videoB, 'Video B', selectedIdB, setSelectedIdB)}
          </div>

          {/* Consistent Policy Violation Trends Analyzer */}
          <div className={`flex flex-col gap-4 rounded-3xl border p-5 sm:p-6 ${
            isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-slate-950/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <h3 className="font-display text-sm sm:text-base font-bold">
                  Consistent Policy Violation Trends Identified
                </h3>
              </div>
              <span className="font-mono text-[11px] font-bold text-slate-500">
                Channel Habit Diagnostic
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {trends.map((trend, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col gap-2 rounded-2xl border p-4 transition-all ${
                    trend.level === 'CRITICAL'
                      ? isLight
                        ? 'border-red-200 bg-red-50 text-red-900'
                        : 'border-red-900/60 bg-red-950/30 text-red-200'
                      : trend.level === 'WARNING'
                      ? isLight
                        ? 'border-amber-200 bg-amber-50 text-amber-900'
                        : 'border-amber-900/60 bg-amber-950/30 text-amber-200'
                      : isLight
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-emerald-900/60 bg-emerald-950/30 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-xs sm:text-sm font-bold flex items-center gap-1.5">
                      {trend.level === 'CRITICAL' ? (
                        <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                      ) : trend.level === 'WARNING' ? (
                        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      <span>{trend.titleEn}</span>
                    </span>
                    <span className="font-mono text-[10px] font-bold uppercase rounded px-2 py-0.5 bg-black/10 dark:bg-white/10">
                      {trend.category}
                    </span>
                  </div>

                  <p className="font-sans text-xs opacity-90">
                    {trend.descEn}
                  </p>

                  <p className="font-sans text-xs font-semibold opacity-90 border-t border-black/10 dark:border-white/10 pt-2 text-right dir-rtl">
                    {trend.titleUrdu}: {trend.descUrdu}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Channel-Wide Remediation Strategy */}
          <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl border p-5 ${
            isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-indigo-950/30 border-indigo-900/60 text-indigo-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-xs sm:text-sm font-bold">
                  Recommended Channel-Wide Action
                </h4>
                <p className="font-sans text-xs opacity-90 mt-0.5">
                  Eliminating consistent strike triggers protects your channel standing and ensures active monetization eligibility.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto shrink-0 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 font-sans text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
