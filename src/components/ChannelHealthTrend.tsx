import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  History,
  CheckCircle2,
  MoreHorizontal,
  ChevronLeft,
  Droplets,
  HeartPulse,
  Timer,
  Scale,
} from 'lucide-react';

export interface HistoricalUploadRecord {
  id: string;
  index: number;
  date: string;
  title: string;
  complianceScore: number; // 0 to 100 (100 is fully compliant/safe)
  status: 'SAFE_TO_UPLOAD' | 'MONETIZATION_AT_RISK' | 'HIGH_STRIKE_RISK';
  issuesCount: number;
}

interface ChannelHealthTrendProps {
  history: HistoricalUploadRecord[];
  isLight?: boolean;
}

export const ChannelHealthTrend: React.FC<ChannelHealthTrendProps> = ({
  history,
  isLight = false,
}) => {
  // Take last 10 uploads
  const data = history.slice(-10);

  // Compute average compliance score
  const avgScore =
    data.length > 0
      ? Math.round(data.reduce((acc, curr) => acc + curr.complianceScore, 0) / data.length)
      : 100;

  // Calculate clean pass rate
  const safeUploadsCount = data.filter((d) => d.status === 'SAFE_TO_UPLOAD').length;
  const passRate = data.length > 0 ? Math.round((safeUploadsCount / data.length) * 100) : 100;

  // Compare first 3 vs last 3 to determine trend
  const firstHalfAvg =
    data.slice(0, 3).reduce((acc, curr) => acc + curr.complianceScore, 0) /
    Math.max(1, data.slice(0, 3).length);
  const secondHalfAvg =
    data.slice(-3).reduce((acc, curr) => acc + curr.complianceScore, 0) /
    Math.max(1, data.slice(-3).length);
  const trendDiff = Math.round(secondHalfAvg - firstHalfAvg);

  const isHealthy = avgScore >= 75;
  const isModerate = avgScore >= 50 && avgScore < 75;

  return (
    <div className="flex flex-col gap-6">
      {/* SECTION: Clean Mobile-Style Statistic Screen (Directly modeled on Image 2 Right Screen) */}
      <div
        className={`rounded-3xl border p-5 sm:p-7 transition shadow-xs ${
          isLight ? 'border-slate-100 bg-white text-slate-900 shadow-slate-200/50' : 'border-slate-800 bg-slate-900 text-slate-100'
        }`}
      >
        {/* Top Header Row with < Back, Title "Statistic", More options ··· */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-base sm:text-lg font-bold">Statistic</span>
          </div>
          <button
            type="button"
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition cursor-pointer ${
              isLight
                ? 'border-slate-200 text-slate-600 hover:bg-slate-100'
                : 'border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* Big Headline Metric: "Average Compliance 88%" + Target */}
        <div className="mb-6">
          <span className="font-sans text-xs text-slate-500 block">Average Compliance</span>
          <div className="flex items-baseline gap-3 mt-1">
            <span className="font-display text-3xl sm:text-4xl font-black text-slate-950 dark:text-white">
              {avgScore}%
            </span>
            <span className="font-sans text-xs font-semibold text-slate-500">
              Target: <strong className="text-emerald-600 font-bold">75% Safe Benchmark</strong>
            </span>
          </div>
        </div>

        {/* 7-Day Vertical Bar Chart with percentages directly above each bar (from Image 2) */}
        <div className="flex items-end justify-between gap-2 sm:gap-4 h-48 sm:h-56 pt-6 pb-2 px-1 border-b border-slate-100 dark:border-slate-800">
          {[
            { day: 'Mon', val: 44, isHigh: false },
            { day: 'Tue', val: 34, isHigh: false },
            { day: 'Wed', val: 98, isHigh: true, highlightTag: '110%' },
            { day: 'Thu', val: 47, isHigh: false },
            { day: 'Fri', val: 32, isHigh: false },
            { day: 'Sat', val: 79, isHigh: false },
            { day: 'Sun', val: 24, isHigh: false },
          ].map((bar) => (
            <div key={bar.day} className="flex-1 flex flex-col items-center justify-end h-full group">
              {/* Floating percentage label on top of bar */}
              <span
                className={`font-mono text-[10px] sm:text-[11px] font-bold mb-1.5 transition-transform group-hover:scale-110 ${
                  bar.isHigh ? 'text-emerald-600 dark:text-lime-400 font-black' : 'text-slate-400'
                }`}
              >
                {bar.highlightTag || `${bar.val}%`}
              </span>

              {/* Vertical Bar Capsule */}
              <div className="w-full max-w-[28px] sm:max-w-[34px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex items-end h-full">
                <div
                  style={{ height: `${Math.min(100, bar.val)}%` }}
                  className={`w-full rounded-full transition-all duration-700 ${
                    bar.isHigh
                      ? 'bg-[#a3e635] shadow-md shadow-lime-500/30'
                      : 'bg-emerald-100/90 dark:bg-emerald-950/40 border border-emerald-300/40 dark:border-emerald-800/40'
                  }`}
                />
              </div>

              {/* Day Label */}
              <span
                className={`font-sans text-[11px] sm:text-xs mt-2 font-medium ${
                  bar.isHigh ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-400'
                }`}
              >
                {bar.day}
              </span>
            </div>
          ))}
        </div>

        {/* 2x2 Metric Cards Grid (Directly matching Exercise, BPM, Weight, Water in Image 2) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-5">
          {/* Card 1: Scan Time */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight ? 'border-slate-100 bg-slate-50/60' : 'border-slate-800 bg-slate-950/60'
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <Timer className="h-4 w-4" />
              <span className="font-sans text-xs font-semibold text-slate-600 dark:text-slate-300">
                Scan Duration
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg sm:text-xl font-bold">2.4 hours</span>
              <div className="flex items-end gap-0.5 h-4">
                <span className="h-2 w-1 bg-emerald-400 rounded-xs" />
                <span className="h-3 w-1 bg-emerald-500 rounded-xs" />
                <span className="h-4 w-1 bg-emerald-600 rounded-xs" />
                <span className="h-2.5 w-1 bg-emerald-400 rounded-xs" />
              </div>
            </div>
          </div>

          {/* Card 2: Ingest Pulse (BPM Heartbeat) */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight ? 'border-slate-100 bg-slate-50/60' : 'border-slate-800 bg-slate-950/60'
            }`}
          >
            <div className="flex items-center gap-2 text-rose-500 mb-2">
              <HeartPulse className="h-4 w-4" />
              <span className="font-sans text-xs font-semibold text-slate-600 dark:text-slate-300">
                Algorithmic BPM
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg sm:text-xl font-bold">86 bpm</span>
              {/* Mini red pulse waveform */}
              <svg className="w-12 h-4 text-rose-500" viewBox="0 0 48 16" fill="none">
                <path
                  d="M0 8h12l3-6 4 12 4-8 3 4h12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Card 3: Strike Weight / Risk */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight ? 'border-slate-100 bg-slate-50/60' : 'border-slate-800 bg-slate-950/60'
            }`}
          >
            <div className="flex items-center gap-2 text-orange-500 mb-2">
              <Scale className="h-4 w-4" />
              <span className="font-sans text-xs font-semibold text-slate-600 dark:text-slate-300">
                Risk Weight
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg sm:text-xl font-bold">14.2%</span>
              <span className="font-mono text-[10px] text-emerald-600 font-bold">Low Risk</span>
            </div>
          </div>

          {/* Card 4: Retention */}
          <div
            className={`p-4 rounded-2xl border ${
              isLight ? 'border-slate-100 bg-slate-50/60' : 'border-slate-800 bg-slate-950/60'
            }`}
          >
            <div className="flex items-center gap-2 text-sky-500 mb-2">
              <Droplets className="h-4 w-4" />
              <span className="font-sans text-xs font-semibold text-slate-600 dark:text-slate-300">
                Clean Retention
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-display text-lg sm:text-xl font-bold">92%</span>
              <span className="font-mono text-[10px] text-sky-600 font-bold">Passing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Details & Charts */}
      <div
        className={`flex flex-col gap-4 rounded-3xl border p-5 sm:p-7 transition shadow-2xs ${
          isLight
            ? 'border-slate-100 bg-white text-slate-900 shadow-slate-200/50'
            : 'border-slate-800 bg-slate-900 text-slate-100'
        }`}
      >
      {/* Top Header */}
      <div
        className={`flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b pb-4 ${
          isLight ? 'border-slate-100' : 'border-slate-800/80'
        }`}
      >
        <div>
          <div
            className={`flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            <Activity className="h-4 w-4 text-emerald-600" />
            <span>Channel Health & Compliance Record</span>
            <span className="text-slate-400">·</span>
            <span className="font-normal normal-case text-slate-500">
              Last 10 Uploads Tracking
            </span>
          </div>
          <h3
            className={`mt-1 font-display text-base sm:text-xl font-black ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}
          >
            Average Compliance Score Over Last 10 Uploads
          </h3>
          <p className={`font-body text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Continuous temporal tracking of your channel safety trajectory against automated YouTube moderation bots
          </p>
        </div>

        {/* Channel Standing Indicator */}
        <div
          className={`flex items-center gap-2.5 rounded-2xl border px-3.5 py-2 ${
            isHealthy
              ? isLight
                ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                : 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300'
              : isModerate
              ? isLight
                ? 'border-amber-200 bg-amber-50 text-amber-900'
                : 'border-amber-500/30 bg-amber-950/30 text-amber-300'
              : isLight
              ? 'border-red-200 bg-red-50 text-red-900'
              : 'border-rose-500/30 bg-rose-950/30 text-rose-300'
          }`}
        >
          {isHealthy ? (
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          ) : isModerate ? (
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          ) : (
            <ShieldAlert className="h-5 w-5 text-red-600" />
          )}
          <div>
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider block ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Channel Standing
            </span>
            <span className="font-body text-xs font-bold">
              {isHealthy
                ? 'Active & Good Standing (0 Strikes)'
                : isModerate
                ? 'Monetization Caution (Ad Warnings)'
                : 'At-Risk Standing (Strike Danger)'}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Metric Summary Boxes */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Metric 1: 10-Upload Average Compliance */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 ${
            isLight
              ? 'border-slate-200/90 bg-slate-50/80 text-slate-900 shadow-2xs'
              : 'border-slate-800 bg-slate-950/60 text-slate-100'
          }`}
        >
          <span className={`font-body text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            10-Upload Average Score
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`font-display text-2xl sm:text-3xl font-black ${
                isHealthy
                  ? 'text-emerald-600'
                  : isModerate
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}
            >
              {avgScore}%
            </span>
            <span className="font-mono text-xs text-slate-500">/ 100%</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-body text-[11px] text-slate-500">
            {trendDiff >= 0 ? (
              <>
                <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-mono text-emerald-600 font-bold">+{trendDiff}%</span>
                <span>improvement vs earlier uploads</span>
              </>
            ) : (
              <>
                <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                <span className="font-mono text-red-600 font-bold">{trendDiff}%</span>
                <span>recent compliance dip</span>
              </>
            )}
          </div>
        </div>

        {/* Metric 2: Safe Pass Rate */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 ${
            isLight
              ? 'border-slate-200/90 bg-slate-50/80 text-slate-900 shadow-2xs'
              : 'border-slate-800 bg-slate-950/60 text-slate-100'
          }`}
        >
          <span className={`font-body text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Clean Pass Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`font-display text-2xl sm:text-3xl font-black ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}
            >
              {passRate}%
            </span>
            <span className="font-mono text-xs text-slate-500">
              ({safeUploadsCount}/{data.length} clean)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-body text-[11px] text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>
              {safeUploadsCount} zero-strike verified videos
            </span>
          </div>
        </div>

        {/* Metric 3: YouTube Community Guidelines Compliance Threshold */}
        <div
          className={`flex flex-col justify-between rounded-2xl border p-4 ${
            isLight
              ? 'border-slate-200/90 bg-slate-50/80 text-slate-900 shadow-2xs'
              : 'border-slate-800 bg-slate-950/60 text-slate-100'
          }`}
        >
          <span className={`font-body text-xs font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Platform Safe Benchmark
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-2xl sm:text-3xl font-black text-emerald-600">&gt; 75%</span>
            <span className="font-mono text-xs text-slate-500">Target</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 font-body text-[11px] text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span>Scores above 75% safeguard monetization and protect account standing</span>
          </div>
        </div>
      </div>

      {/* Small Recharts Line Chart: 10-Upload Compliance Trajectory */}
      <div
        className={`rounded-2xl border p-4 sm:p-5 ${
          isLight ? 'border-slate-200/90 bg-slate-50/70' : 'border-slate-800 bg-slate-950/70'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Activity className="h-3.5 w-3.5" />
              <span>Mini Trajectory Line Chart (10 Uploads)</span>
            </div>
            <h4 className="font-display text-sm font-bold mt-0.5">
              Compliance Score Improvement & Decline Slope
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 font-mono text-xs font-bold border ${
                trendDiff >= 0
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {trendDiff >= 0 ? (
                <>
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+{trendDiff}% Trajectory Improvement</span>
                </>
              ) : (
                <>
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>{trendDiff}% Trajectory Decline</span>
                </>
              )}
            </span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke={isLight ? '#e2e8f0' : '#1e293b'} vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} />
              <YAxis domain={[0, 100]} ticks={[0, 50, 75, 100]} stroke="#64748b" fontSize={10} fontFamily="JetBrains Mono" tickLine={false} tickFormatter={(v) => `${v}%`} />
              <ReferenceLine y={75} stroke="#10b981" strokeDasharray="3 3" strokeOpacity={0.7} />
              <Tooltip content={<CustomTooltip isLight={isLight} />} />
              <Line
                type="monotone"
                dataKey="complianceScore"
                stroke={trendDiff >= 0 ? '#10b981' : '#f43f5e'}
                strokeWidth={3}
                dot={(props: any) => {
                  const { cx, cy, payload } = props;
                  const isSafe = payload.complianceScore >= 80;
                  const isCaution = payload.complianceScore >= 50 && payload.complianceScore < 80;
                  const dotColor = isSafe ? '#10b981' : isCaution ? '#f59e0b' : '#ef4444';
                  return (
                    <circle
                      key={`dot-${cx}-${cy}`}
                      cx={cx}
                      cy={cy}
                      r={4.5}
                      fill={dotColor}
                      stroke="#ffffff"
                      strokeWidth={1.5}
                    />
                  );
                }}
                activeDot={{ r: 7, strokeWidth: 2, stroke: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={isLight ? 0.35 : 0.4} />
                <stop offset="70%" stopColor="#10b981" stopOpacity={isLight ? 0.05 : 0.08} />
                <stop offset="95%" stopColor={isLight ? '#ffffff' : '#0f172a'} stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isLight ? '#f1f5f9' : '#1e293b'}
              vertical={false}
            />

            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={{ stroke: isLight ? '#cbd5e1' : '#334155' }}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              stroke="#64748b"
              fontSize={11}
              fontFamily="JetBrains Mono"
              tickLine={false}
              axisLine={{ stroke: isLight ? '#cbd5e1' : '#334155' }}
              tickFormatter={(val) => `${val}%`}
            />

            <ReferenceLine
              y={75}
              stroke="#d97706"
              strokeDasharray="4 4"
              strokeOpacity={0.8}
              label={{
                value: 'Safe Benchmark (75%)',
                fill: isLight ? '#b45309' : '#eab308',
                fontSize: 10,
                fontFamily: 'JetBrains Mono',
                position: 'insideTopRight',
              }}
            />

            <Tooltip content={<CustomTooltip isLight={isLight} />} />

            <Area
              type="monotone"
              dataKey="complianceScore"
              stroke="#10b981"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#scoreGradient)"
              activeDot={{
                r: 6,
                fill: '#10b981',
                stroke: '#ffffff',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Timeline Footnote & Legend */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-[11px] ${
          isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-500'
        }`}
      >
        <div className="flex items-center gap-4 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            <span>Safe Upload (90-100%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Ad Caution (60-89%)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            <span>Strike Hazard (&lt;60%)</span>
          </div>
        </div>

        <div className={`flex items-center gap-1 font-body text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <History className="h-3 w-3 text-slate-400" />
          <span>Auto-synchronized after every completed video audit</span>
        </div>
      </div>
    </div>
  </div>
  );
};

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  isLight?: boolean;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, isLight = false }) => {
  if (active && payload && payload.length) {
    const data: HistoricalUploadRecord = payload[0].payload;
    const isSafe = data.status === 'SAFE_TO_UPLOAD';
    const isCaution = data.status === 'MONETIZATION_AT_RISK';

    return (
      <div
        className={`rounded-xl border p-3.5 shadow-xl backdrop-blur-md text-xs ${
          isLight
            ? 'border-slate-200 bg-white text-slate-900 shadow-slate-200/50'
            : 'border-slate-700 bg-slate-900/95 text-slate-100'
        }`}
      >
        <div
          className={`flex items-center justify-between gap-3 border-b pb-1.5 ${
            isLight ? 'border-slate-200' : 'border-slate-800'
          }`}
        >
          <span className="font-mono text-[10px] text-slate-500">{data.date}</span>
          <span
            className={`flex items-center gap-1 font-mono font-bold text-[10px] ${
              isSafe ? 'text-emerald-600' : isCaution ? 'text-amber-600' : 'text-red-600'
            }`}
          >
            {isSafe ? (
              <ShieldCheck className="h-3 w-3" />
            ) : isCaution ? (
              <AlertTriangle className="h-3 w-3" />
            ) : (
              <ShieldAlert className="h-3 w-3" />
            )}
            <span>{isSafe ? 'Safe' : isCaution ? 'Ad Warning' : 'Strike Risk'}</span>
          </span>
        </div>

        <p
          className={`mt-1.5 font-display font-bold line-clamp-1 max-w-[200px] ${
            isLight ? 'text-slate-900' : 'text-slate-200'
          }`}
        >
          {data.title}
        </p>

        <div className="mt-2 flex items-baseline justify-between gap-4 font-body">
          <span className="text-[11px] text-slate-500">Compliance Score:</span>
          <span
            className={`font-mono text-sm font-black ${
              isSafe ? 'text-emerald-600' : isCaution ? 'text-amber-600' : 'text-red-600'
            }`}
          >
            {data.complianceScore}%
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
          <span>Policy Flags:</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{data.issuesCount} issues</span>
        </div>
      </div>
    );
  }
  return null;
};
