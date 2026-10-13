import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Cloud,
  Clock,
  Award,
  FileVideo,
  ExternalLink,
  CheckCircle2,
  LogOut,
  Sparkles,
  Zap,
  Mail,
  Lock,
  ArrowRight,
  Sliders,
  Settings,
  Bell,
  Check,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react';
import type { CloudAuditRecord } from '../services/firebase';
import { HistoricalUploadRecord } from './ChannelHealthTrend';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../services/firebase';

export interface AppUserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  channelName?: string;
  tier?: 'Free' | 'Pro Shield';
  isDemo?: boolean;
}

interface ProfileViewProps {
  currentUser: AppUserProfile | null;
  cloudReports: CloudAuditRecord[];
  uploadHistory: HistoricalUploadRecord[];
  isLight: boolean;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onDemoLogin?: (name?: string, email?: string) => void;
  onSignOut?: () => void;
  onNavigateScanner?: () => void;
  onLoadAudit?: (videoTitle: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  cloudReports,
  uploadHistory,
  isLight,
  onOpenAuth,
  onDemoLogin,
  onSignOut,
  onNavigateScanner,
  onLoadAudit,
}) => {
  // In-page auth tab for non-logged in users
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile preferences
  const [autoCloudSave, setAutoCloudSave] = useState(true);
  const [strictAlerts, setStrictAlerts] = useState(true);

  // If user is NOT logged in: Show the dedicated Creator Sign In / Register Page
  if (!currentUser) {
    const handleInPageSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError(null);
      setIsSubmitting(true);
      try {
        if (authMode === 'register') {
          if (!displayName.trim()) {
            throw new Error('Please enter your creator channel name');
          }
          await signUpWithEmail(email, password, displayName);
        } else {
          await signInWithEmail(email, password);
        }
        setIsSubmitting(false);
      } catch (err: any) {
        setIsSubmitting(false);
        const msg = err?.message || 'Authentication failed. Please check credentials.';
        if (msg.includes('auth/invalid-credential')) {
          setAuthError('Invalid email or password. You can also try 1-Click Demo Login below.');
        } else {
          setAuthError(msg);
        }
      }
    };

    const handleInPageGoogle = async () => {
      setAuthError(null);
      setIsSubmitting(true);
      try {
        await signInWithGoogle();
        setIsSubmitting(false);
      } catch (err: any) {
        setIsSubmitting(false);
        setAuthError(
          err?.message?.includes('popup')
            ? 'Google popup blocked. Use Instant 1-Click Test Login below.'
            : err?.message || 'Google sign-in failed'
        );
      }
    };

    return (
      <div className="mx-auto max-w-4xl py-4 sm:py-8 space-y-6">
        {/* Welcome Banner */}
        <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 ${
          isLight
            ? 'border-slate-200 bg-gradient-to-br from-red-50 via-white to-slate-50 text-slate-900 shadow-sm'
            : 'border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100 shadow-xl'
        }`}>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 bg-red-500/10 text-red-600 font-mono text-[11px] font-bold mb-3 border border-red-500/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>CREATOR PORTAL & CLOUD SHIELD</span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                Creator Account & Neural Audits
              </h1>
              <p className={`mt-2 font-sans text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Sign in to inspect full algorithmic strike verdicts, unlock frame-accurate CapCut trims, and preserve your 10-upload compliance track record in the cloud.
              </p>

              {/* 1-Click Fast Instant Test Button */}
              <div className="mt-5 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => onDemoLogin?.('Studio Creator', 'blendagent.online@gmail.com')}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-5 py-3 font-sans text-xs font-bold shadow-lg shadow-rose-500/20 transition cursor-pointer"
                >
                  <Zap className="h-4 w-4 fill-current" />
                  <span>1-Click Instant Demo Login (Instant Access)</span>
                </button>
              </div>
            </div>

            {/* In-page Login / Register Box */}
            <div className={`w-full max-w-sm rounded-3xl border p-5 sm:p-6 shadow-xl ${
              isLight ? 'border-slate-200/90 bg-white' : 'border-slate-800 bg-slate-900/90'
            }`}>
              {/* Tab Selector */}
              <div className={`flex rounded-2xl border p-1 mb-4 text-xs font-bold ${
                isLight ? 'border-slate-200 bg-slate-100' : 'border-slate-800 bg-slate-950'
              }`}>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(null); }}
                  className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
                    authMode === 'login'
                      ? isLight ? 'bg-white text-slate-950 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(null); }}
                  className={`flex-1 rounded-xl py-2 transition cursor-pointer ${
                    authMode === 'register'
                      ? isLight ? 'bg-white text-slate-950 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                  }`}
                >
                  Register
                </button>
              </div>

              {authError && (
                <div className="mb-3 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-[11px] text-red-500">
                  {authError}
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                onClick={handleInPageGoogle}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2.5 rounded-2xl border py-2.5 px-3 text-xs font-bold transition cursor-pointer mb-3.5 ${
                  isLight
                    ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
                    : 'border-slate-700 bg-slate-800 hover:bg-slate-750 text-slate-100'
                }`}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <form onSubmit={handleInPageSubmit} className="space-y-3">
                {authMode === 'register' && (
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="Channel Name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={`w-full rounded-xl border py-2 px-3 text-xs outline-none transition ${
                        isLight
                          ? 'border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white'
                          : 'border-slate-800 bg-slate-950 focus:border-rose-500 focus:bg-slate-900 text-white'
                      }`}
                    />
                  </div>
                )}
                <div>
                  <input
                    type="email"
                    required
                    placeholder="creator@youtube.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border py-2 px-3 text-xs outline-none transition ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white'
                        : 'border-slate-800 bg-slate-950 focus:border-rose-500 focus:bg-slate-900 text-white'
                    }`}
                  />
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border py-2 pl-3 pr-8 text-xs outline-none transition ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white'
                        : 'border-slate-800 bg-slate-950 focus:border-rose-500 focus:bg-slate-900 text-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white py-2.5 font-sans text-xs font-bold transition shadow-md shadow-red-500/20 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Processing...' : authMode === 'login' ? 'Sign In & View Results' : 'Create Free Account'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Feature Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`rounded-2xl border p-4.5 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-3">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm">3-Strikes Pre-Audit</h3>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Evaluates child safety, violence, and opening 7-second advertiser rules before ingestion.
            </p>
          </div>
          <div className={`rounded-2xl border p-4.5 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 mb-3">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm">Frame-Accurate Cuts</h3>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Exact second-by-second timecodes for Premiere Pro and CapCut to sanitize risky clips.
            </p>
          </div>
          <div className={`rounded-2xl border p-4.5 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/60'}`}>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 mb-3">
              <Cloud className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-sm">Firebase Cloud Sync</h3>
            <p className="font-sans text-xs text-slate-500 mt-1">
              Securely preserves your channel standing and compliance records across all devices.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN: Render full Creator Profile Experience
  const avgCompliance =
    uploadHistory.length > 0
      ? Math.round(uploadHistory.reduce((a, b) => a + b.complianceScore, 0) / uploadHistory.length)
      : 96;

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Profile Header Card */}
      <div className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 ${
        isLight ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-800 bg-slate-900 shadow-xl'
      }`}>
        <div className="flex items-center gap-4 sm:gap-5 w-full md:w-auto">
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt={currentUser.displayName || 'Creator'}
              className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl object-cover ring-2 ring-red-500/30 shadow-md shrink-0"
            />
          ) : (
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white font-black text-2xl shadow-xl shadow-red-500/30 shrink-0">
              {(currentUser.displayName || currentUser.email || 'C')[0].toUpperCase()}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight truncate">
                {currentUser.displayName || 'YouTube Creator Studio'}
              </h1>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 font-mono text-[10px] px-2.5 py-0.5 font-bold border border-emerald-500/20">
                Verified Creator
              </span>
              {currentUser.isDemo && (
                <span className="rounded-full bg-amber-500/10 text-amber-600 font-mono text-[10px] px-2 py-0.5 font-bold">
                  Demo Session
                </span>
              )}
            </div>
            <p className={`font-mono text-xs truncate ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {currentUser.email || 'creator@youtube.studio'}
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2.5 text-xs">
              <span className="flex items-center gap-1.5 font-sans font-semibold text-emerald-600">
                <Cloud className="h-3.5 w-3.5" />
                Firebase Cloud Sync Active
              </span>
              <span className={`flex items-center gap-1.5 font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                <Clock className="h-3 w-3" />
                ID: {currentUser.uid.slice(0, 10)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto">
          <div className={`rounded-2xl border p-3 sm:p-4 text-center ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950'}`}>
            <span className={`block font-mono text-[10px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Cloud Audits
            </span>
            <span className="font-display text-xl sm:text-2xl font-black">{cloudReports.length}</span>
          </div>

          <div className={`rounded-2xl border p-3 sm:p-4 text-center ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950'}`}>
            <span className={`block font-mono text-[10px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Compliance
            </span>
            <span className={`font-display text-xl sm:text-2xl font-black ${avgCompliance >= 85 ? 'text-emerald-500' : 'text-amber-500'}`}>
              {avgCompliance}%
            </span>
          </div>

          <div className={`rounded-2xl border p-3 sm:p-4 text-center ${isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-950'}`}>
            <span className={`block font-mono text-[10px] uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Standing
            </span>
            <span className="font-display text-base sm:text-lg font-bold text-emerald-600">0 Strikes</span>
          </div>
        </div>
      </div>

      {/* Settings & Preferences */}
      <div className={`rounded-3xl border p-5 sm:p-7 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'}`}>
        <div className="flex items-center justify-between mb-4 border-b pb-3 border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-red-600" />
            <h2 className="font-display text-base font-bold tracking-tight">Channel Protection Settings</h2>
          </div>
          <span className="font-mono text-xs text-slate-500">Autonomous Ingest Guard</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className={`rounded-2xl border p-4 flex items-center justify-between ${
            isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-950/70'
          }`}>
            <div>
              <p className="font-sans text-xs font-bold text-slate-900 dark:text-white">Auto-Sync Audits to Firebase</p>
              <p className="font-sans text-[11px] text-slate-500 mt-0.5">Persist video scan outcomes automatically to Firestore database</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoCloudSave(!autoCloudSave)}
              className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
                autoCloudSave ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                autoCloudSave ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>

          <div className={`rounded-2xl border p-4 flex items-center justify-between ${
            isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-slate-950/70'
          }`}>
            <div>
              <p className="font-sans text-xs font-bold text-slate-900 dark:text-white">High-Risk Instant Sound Alerts</p>
              <p className="font-sans text-[11px] text-slate-500 mt-0.5">Play audio warning when critical strike timecode is detected</p>
            </div>
            <button
              type="button"
              onClick={() => setStrictAlerts(!strictAlerts)}
              className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
                strictAlerts ? 'bg-red-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                strictAlerts ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800">
          {onNavigateScanner && (
            <button
              onClick={onNavigateScanner}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-sans text-xs font-bold transition shadow-md shadow-red-600/20 cursor-pointer"
            >
              <FileVideo className="h-4 w-4" />
              <span>Launch Video Scanner</span>
            </button>
          )}

          {onSignOut && (
            <button
              onClick={onSignOut}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 font-sans text-xs font-semibold transition cursor-pointer ${
                isLight ? 'border-slate-300 hover:bg-slate-100 text-slate-700' : 'border-slate-700 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out Account</span>
            </button>
          )}
        </div>
      </div>

      {/* Cloud Saved Audit Reports */}
      <div className={`rounded-3xl border p-5 sm:p-7 ${isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold tracking-tight">Saved Cloud Audit Reports</h2>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Stored securely in Firebase Firestore
            </p>
          </div>
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-full bg-red-500/10 text-red-600">
            {cloudReports.length} Reports
          </span>
        </div>

        {cloudReports.length === 0 ? (
          <div className={`rounded-2xl border border-dashed p-8 text-center ${isLight ? 'border-slate-300 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
            <FileVideo className="mx-auto h-10 w-10 text-slate-400 mb-2 opacity-60" />
            <p className="text-sm font-semibold">No audit reports saved to cloud yet.</p>
            <p className="text-xs text-slate-400 mt-1">Scan a video in the scanner dashboard and click "Save to Cloud" to sync reports.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {cloudReports.map((report) => (
              <div
                key={report.id}
                className={`flex items-center justify-between rounded-2xl border p-3.5 transition ${
                  isLight ? 'border-slate-200 bg-slate-50/60 hover:bg-slate-50' : 'border-slate-800 bg-slate-950/70 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                    report.safetyGrade === 'SAFE_TO_UPLOAD'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : report.safetyGrade === 'MONETIZATION_AT_RISK'
                      ? 'bg-amber-500/10 text-amber-600'
                      : 'bg-red-500/10 text-red-600'
                  }`}>
                    {Math.max(0, 100 - report.overallRiskScore)}%
                  </div>
                  <div className="truncate">
                    <h3 className="font-sans text-xs sm:text-sm font-bold truncate">{report.videoTitle}</h3>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                      <span>Flags: {report.totalIssuesCount}</span>
                      <span>·</span>
                      <span>{report.strictnessMode}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {onLoadAudit && (
                    <button
                      onClick={() => onLoadAudit(report.videoTitle)}
                      className={`rounded-xl border px-3 py-1.5 font-sans text-xs font-semibold transition cursor-pointer ${
                        isLight ? 'border-slate-300 bg-white hover:bg-slate-100' : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      Inspect Audit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
