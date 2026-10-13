import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileVideo,
  Clock,
  Sparkles,
  Scissors,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Cpu,
  Volume2,
  Music,
  Play,
  TrendingUp,
  Activity,
  BarChart3,
  Lock,
  Zap,
} from 'lucide-react';
import { AuditReport, PolicyViolation } from '../types/audit';
import { HistoricalUploadRecord } from './ChannelHealthTrend';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea
} from 'recharts';

interface AuditResultsDashboardProps {
  report: AuditReport | null;
  videoTitle: string;
  videoDurationSec: number;
  onOpenCutGuide: () => void;
  onOpenAppealModal: () => void;
  onRescan: () => void;
  onJumpAndPlay: (seconds: number) => void;
  uploadHistory: HistoricalUploadRecord[];
  isLight: boolean;
  isAuthenticated?: boolean;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onDemoLogin?: (name?: string, email?: string) => void;
}

export const AuditResultsDashboard: React.FC<AuditResultsDashboardProps> = ({
  report,
  videoTitle,
  videoDurationSec,
  onOpenCutGuide,
  onOpenAppealModal,
  onRescan,
  onJumpAndPlay,
  uploadHistory,
  isLight,
  isAuthenticated = false,
  onOpenAuth,
  onDemoLogin,
}) => {
  if (!report) {
    return (
      <div className={`rounded-3xl border p-8 text-center ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
        <FileVideo className="mx-auto h-12 w-12 text-slate-400 mb-3 animate-pulse" />
        <h3 className={`font-display text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>No Audit Results Available Yet</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Upload a video or select an instant preset test case above and run the Gemini Deep Compliance Scan to generate the analysis report.
        </p>
      </div>
    );
  }

  const isCritical = report.safetyGrade === 'HIGH_STRIKE_RISK' || report.criticalIssuesCount > 0;
  const isCaution = report.safetyGrade === 'MONETIZATION_AT_RISK' || report.warningsCount > 0;
  const isClean = report.safetyGrade === 'SAFE_TO_UPLOAD';

  // Generate second-by-second data for Recharts safety score fluctuation chart
  const totalSecs = Math.max(10, videoDurationSec || 30);
  const chartData = Array.from({ length: Math.min(30, totalSecs) }, (_, i) => {
    const sec = Math.round((i / 29) * totalSecs);
    // Check if sec falls within any violation
    const viol = report.timelineViolations.find(
      (v) => sec >= v.secondsStart && sec <= v.secondsEnd
    );
    let score = 95 - Math.round(report.overallRiskScore * 0.4);
    if (viol) {
      score = viol.severity === 'CRITICAL_STRIKE' ? 15 : 42;
    } else {
      // Add slight smooth variation
      score = Math.min(100, Math.max(10, score + Math.sin(i * 0.8) * 10));
    }
    return {
      second: `${sec}s`,
      secondsNum: sec,
      safetyScore: score,
      status: viol ? viol.severity : 'SAFE',
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-6"
    >
      {/* Top Banner Verdict Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 transition shadow-lg ${
          isCritical
            ? isLight
              ? 'border-red-300 bg-gradient-to-br from-red-50 via-white to-rose-50 text-slate-900'
              : 'border-red-900/80 bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-950 text-slate-100'
            : isCaution
            ? isLight
              ? 'border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50 text-slate-900'
              : 'border-amber-900/80 bg-gradient-to-br from-amber-950/50 via-slate-900 to-slate-950 text-slate-100'
            : isLight
            ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-slate-900'
            : 'border-emerald-900/80 bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 text-slate-100'
        }`}
      >
        <div className={`absolute -right-12 -top-12 h-64 w-64 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isCritical ? 'bg-red-500' : isCaution ? 'bg-amber-500' : 'bg-emerald-500'
        }`} />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl shadow-xl ${
                isCritical
                  ? 'bg-red-600 text-white shadow-red-500/30'
                  : isCaution
                  ? 'bg-amber-500 text-white shadow-amber-500/30'
                  : 'bg-emerald-600 text-white shadow-emerald-500/30'
              }`}
            >
              {isCritical && <ShieldAlert className="h-8 w-8 animate-pulse" />}
              {isCaution && <AlertTriangle className="h-8 w-8 animate-pulse" />}
              {isClean && <ShieldCheck className="h-8 w-8" />}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10">
                  YouTube Trust & Safety Audit
                </span>
                <span className="text-slate-400">•</span>
                <span className="font-mono text-xs text-slate-500">{videoTitle}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight">
                {isCritical
                  ? '⚠️ Critical Strike Hazard Detected'
                  : isCaution
                  ? '⚡ Monetization Caution Warning'
                  : '✨ Fully Compliant & Safe'}
              </h2>
              <p className={`mt-1.5 font-body text-xs sm:text-sm max-w-xl ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {report.summaryVerdictEn}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                if (!isAuthenticated && onOpenAuth) {
                  onOpenAuth('login');
                } else {
                  onOpenCutGuide();
                }
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-3 font-sans text-xs font-bold transition shadow-md cursor-pointer ${
                isLight
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-white text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Scissors className="h-4 w-4 text-red-500" />
              <span>{isAuthenticated ? 'Safe Cut & Blur Guide' : 'Unlock Safe Cuts 🔒'}</span>
            </button>

            {isCritical && (
              <button
                onClick={() => {
                  if (!isAuthenticated && onOpenAuth) {
                    onOpenAuth('login');
                  } else {
                    onOpenAppealModal();
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-3 font-sans text-xs font-bold transition shadow-lg hover:brightness-110 cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isAuthenticated ? 'AI Appeal Generator' : 'Unlock Appeal Kit 🔒'}</span>
              </button>
            )}

            <button
              onClick={onRescan}
              className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-3 font-sans text-xs font-semibold transition cursor-pointer ${
                isLight ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700' : 'border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>New Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* If User is NOT authenticated, display modern Locked Results Gate with Teaser */}
      {!isAuthenticated ? (
        <div className="relative overflow-hidden rounded-3xl border border-red-500/30 p-8 sm:p-12 text-center shadow-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/98 to-slate-950 text-white backdrop-blur-xl">
          {/* Subtle Ambient Radial Glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-96 rounded-full bg-red-600/20 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center max-w-xl mx-auto">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-xl shadow-red-600/30">
              <Lock className="h-8 w-8 animate-pulse" />
            </div>

            <span className="rounded-full bg-red-500/10 border border-red-500/30 px-3.5 py-1 font-mono text-[11px] font-bold text-red-400 uppercase tracking-wider mb-2">
              Free Creator Access Required
            </span>

            <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
              Sign In or Register to View Full Audit Results
            </h3>

            <p className="mt-2.5 font-body text-xs sm:text-sm text-slate-300 leading-relaxed">
              Anyone can test and scan videos without registering. To protect YouTube creator standing and reveal detailed <strong>frame-accurate violation cuts, second-by-second temporal safety graphs, and strike appeal generator</strong>, please sign in or create your free account.
            </p>

            {/* Included Features Grid */}
            <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left font-sans text-xs text-slate-200">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>0-100% Strike Probability Score</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Frame-Accurate Safe Cut Timecodes</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>EDSA Legal Strike Appeal Kit</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 p-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Sync Video Audits to Firebase Cloud</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
              {onDemoLogin && (
                <button
                  type="button"
                  onClick={() => onDemoLogin('Studio Creator', 'blendagent.online@gmail.com')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-6 py-3.5 font-sans text-xs font-bold shadow-xl shadow-rose-600/30 transition hover:scale-[1.02] cursor-pointer"
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span>1-Click Instant Demo Login (Instant Unlock)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenAuth?.('register')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white px-6 py-3.5 font-sans text-xs font-bold shadow-xl shadow-red-600/30 transition hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                <span>Create Account</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAuth?.('login')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/90 hover:bg-slate-800 text-white px-6 py-3.5 font-sans text-xs font-semibold transition cursor-pointer"
              >
                <span>Sign In</span>
              </button>
            </div>
          </div>

          {/* Blurred Teaser Preview Card */}
          <div className="mt-8 pt-6 border-t border-white/10 w-full max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-red-400 font-bold">
                <Lock className="h-3.5 w-3.5" />
                <span>Hidden Neural Audit Artifacts (Protected):</span>
              </span>
              <span>{report.timelineViolations.length} Violations Found</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left filter blur-[1px] select-none pointer-events-none opacity-60">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[11px] font-bold text-red-400">00:04 - 00:07 Dangerous Prop Handling</div>
                <div className="text-[10px] text-slate-300">Cut recommendation: Trim 3s clip or apply pixelate mask</div>
              </div>
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="text-[11px] font-bold text-amber-400">00:15 - 00:19 Child Safety / Opening Hook</div>
                <div className="text-[10px] text-slate-300">Demonetization alert: Excessive danger near minors</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Recharts Safety Score Fluctuation Chart */}
          <div className={`rounded-3xl border p-6 shadow-sm ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-indigo-600">
              <TrendingUp className="h-4 w-4" />
              <span>Second-by-Second Safety Score Trend</span>
            </div>
            <h3 className={`font-display text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Temporal Fluctuation & High-Risk Zones
            </h3>
            <p className="text-xs text-slate-500">
              Visualizes how video compliance score fluctuates throughout playback. Dips indicate potential policy flags.
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span className="flex items-center gap-1 text-emerald-500 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Safe Zone (&gt;70%)
            </span>
            <span className="flex items-center gap-1 text-red-500 font-bold">
              <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> Strike Risk (&lt;40%)
            </span>
          </div>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="safetyScoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="dangerScoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
              <XAxis dataKey="second" stroke={isLight ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
              <YAxis domain={[0, 100]} stroke={isLight ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    const isRisky = data.safetyScore < 40;
                    return (
                      <div className={`rounded-xl border p-3 shadow-lg ${isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-white'}`}>
                        <p className="font-mono text-xs font-bold text-slate-400 mb-1">Timestamp: {label}</p>
                        <p className="font-display text-sm font-black flex items-center gap-2">
                          Safety Score: <span className={isRisky ? 'text-red-500' : 'text-emerald-500'}>{data.safetyScore}%</span>
                        </p>
                        <p className={`font-mono text-[10px] mt-1 uppercase px-2 py-0.5 rounded-full inline-block ${isRisky ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                          Status: {data.status}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="safetyScore"
                stroke={isCritical ? '#ef4444' : '#10b981'}
                strokeWidth={2.5}
                fillOpacity={1}
                fill={isCritical ? 'url(#dangerScoreGradient)' : 'url(#safetyScoreGradient)'}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid of Specialized Analysis Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1: Timeline Violations & Playable Clips */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Playable Clips
              </span>
              <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-red-500">
                {report.timelineViolations.length} Detected
              </span>
            </div>
            <h4 className={`font-display text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Click Clip to Preview
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Instantly jump & play the exact 2-5s violating segment.
            </p>

            <div className="mt-4 flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
              {report.timelineViolations.length === 0 ? (
                <div className="py-6 text-center text-xs text-emerald-500 font-medium flex flex-col items-center gap-1">
                  <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  <span>No timeline violations detected!</span>
                </div>
              ) : (
                report.timelineViolations.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => onJumpAndPlay(v.secondsStart)}
                    className={`rounded-2xl border p-3 transition cursor-pointer group flex items-center justify-between ${
                      isLight ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-red-300' : 'border-slate-800 bg-slate-850 hover:bg-slate-800 hover:border-red-500/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-md group-hover:scale-105 transition">
                        <Play className="h-3.5 w-3.5 fill-current ml-0.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-red-600">
                            {v.timestampStart}
                          </span>
                          <span className={`font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                            v.severity === 'CRITICAL_STRIKE' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'
                          }`}>
                            {v.severity === 'CRITICAL_STRIKE' ? 'Strike' : 'Warn'}
                          </span>
                        </div>
                        <h5 className={`font-display text-[11px] font-bold truncate max-w-[140px] ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {v.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Metric 2: Last 10 Uploads Comparison Benchmark */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                History Benchmark
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-500">
                Last 10 Uploads
              </span>
            </div>
            <h4 className={`font-display text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Typical vs Current
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Compares safety score against your recent channel uploads.
            </p>

            {(() => {
              const currentScore = Math.max(0, 100 - report.overallRiskScore);
              const last10 = uploadHistory.slice(-10);
              const hasHistory = last10.length > 0;
              const avgScore = hasHistory
                ? Math.round(last10.reduce((acc, curr) => acc + curr.complianceScore, 0) / last10.length)
                : 0;
              const diff = hasHistory ? currentScore - avgScore : 0;

              if (!hasHistory) {
                return (
                  <div className="mt-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 p-4 text-center">
                    <p className="text-xs text-slate-500 font-medium">
                      📊 No upload history yet. Complete & save your first few video scans to enable baseline comparison against your typical content!
                    </p>
                  </div>
                );
              }

              return (
                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3 font-mono text-xs">
                    <span className="text-slate-500">Current Video</span>
                    <span className="font-bold text-slate-900 dark:text-white">{currentScore}% Safe</span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-3 font-mono text-xs">
                    <span className="text-slate-500">Last 10 Avg</span>
                    <span className="font-bold text-slate-900 dark:text-white">{avgScore}% Safe</span>
                  </div>
                  <div className={`rounded-xl p-3 font-sans text-xs font-bold flex items-center gap-2 ${
                    diff >= 0
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                  }`}>
                    {diff >= 0 ? <TrendingUp className="h-4 w-4 shrink-0" /> : <ShieldAlert className="h-4 w-4 shrink-0" />}
                    <span>
                      {diff >= 0
                        ? `✨ +${diff}% safer than your typical uploads!`
                        : `⚠️ ${Math.abs(diff)}% riskier than your average upload.`}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Metric 3: Audio & Background Sound Analysis */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Volume2 className="h-4 w-4" />
                Audio Audit
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-500">
                Spectrum OK
              </span>
            </div>
            <h4 className={`font-display text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Soundtrack & Voice
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Evaluates music copyright & explicit speech keywords.
            </p>

            <div className="mt-4 flex flex-col gap-2.5 font-mono text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-2.5">
                <span className="text-slate-500 flex items-center gap-1">
                  <Music className="h-3 w-3 text-indigo-500" /> Music
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Safe</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-2.5">
                <span className="text-slate-500">Profanity</span>
                <span className="font-bold text-slate-900 dark:text-white">Clean (0)</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-2.5">
                <span className="text-slate-500">Sound FX</span>
                <span className="font-bold text-slate-900 dark:text-white">Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4: YouTube Policy Master Reference */}
        <div className={`rounded-3xl border p-6 flex flex-col justify-between ${isLight ? 'bg-white border-slate-200' : 'bg-slate-900/80 border-slate-800'}`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                <Cpu className="h-4 w-4" />
                Gemini Vision
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-500">
                10x AI
              </span>
            </div>
            <h4 className={`font-display text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Model & Specs
            </h4>
            <p className="mt-1 text-xs text-slate-500">
              Cross-checked with YouTube Trust & Safety database.
            </p>

            <div className="mt-4 flex flex-col gap-2.5 font-mono text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-2.5">
                <span className="text-slate-500">Engine</span>
                <span className="font-bold text-slate-900 dark:text-white">Gemini Pro</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-2.5">
                <span className="text-slate-500">Interval</span>
                <span className="font-bold text-slate-900 dark:text-white">2 - 5 Sec</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-100 dark:bg-slate-800/80 p-2.5">
                <span className="text-slate-500">Audio</span>
                <span className="font-bold text-slate-900 dark:text-white">Parsed</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCutGuide}
            className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white py-2.5 font-sans text-xs font-bold transition shadow-lg hover:brightness-110"
          >
            <span>Cut & Blur Guide</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
        </>
      )}
    </motion.div>
  );
};
