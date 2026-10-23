import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  SlidersHorizontal,
  Settings,
  Bell,
  Check,
  Eye,
  EyeOff,
  Flame,
  ChevronRight,
  ChevronLeft,
  Search,
  CreditCard,
  Landmark,
  Fingerprint,
  HelpCircle,
  MessageSquare,
  Languages,
  X,
  Share2,
  CheckCheck,
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

type ActiveSheetModal =
  | 'settings'
  | 'plan'
  | 'badges'
  | 'linkedAccounts'
  | 'preferences'
  | 'privacy'
  | 'help'
  | 'feedback'
  | 'language'
  | 'proModal'
  | null;

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
  // Search query to filter settings rows
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Toggle state matching Image 1: "Enable finger Print/Face ID"
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true);

  // Active modal drawer for tapped settings rows
  const [activeModal, setActiveModal] = useState<ActiveSheetModal>(null);

  // Language state: English vs Urdu
  const [currentLanguage, setCurrentLanguage] = useState<'English' | 'Urdu'>('English');

  // In-page auth state for guests
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  // Strictness & preferences
  const [strictnessLevel, setStrictnessLevel] = useState<'STANDARD' | 'PARANOID'>('STANDARD');
  const [autoCloudBackup, setAutoCloudBackup] = useState(true);
  const [instantCutSheet, setInstantCutSheet] = useState(true);

  const avgCompliance =
    uploadHistory.length > 0
      ? Math.round(uploadHistory.reduce((a, b) => a + b.complianceScore, 0) / uploadHistory.length)
      : 96;

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
        setAuthError('Invalid credentials. You can also use 1-Click Instant Demo Login.');
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
          ? 'Google popup was blocked. Use 1-Click Instant Demo Login.'
          : err?.message || 'Google sign-in failed'
      );
    }
  };

  // Filter helper for rows
  const matchesSearch = (text: string) => {
    if (!searchQuery.trim()) return true;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="mx-auto max-w-xl sm:max-w-2xl px-2 sm:px-4 py-3 sm:py-6 space-y-4">
      {/* Top Bar Navigation (Directly matching Image 1: < Profile Q) */}
      <div className="flex items-center justify-between px-1 py-1">
        <button
          type="button"
          onClick={onNavigateScanner}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition cursor-pointer ${
            isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
          }`}
          title="Back to Ingest Scanner"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <h1 className="font-display text-lg sm:text-xl font-bold tracking-tight text-center">
          Profile
        </h1>

        <button
          type="button"
          onClick={() => setIsSearchActive(!isSearchActive)}
          className={`flex h-10 w-10 items-center justify-center rounded-full transition cursor-pointer ${
            isSearchActive
              ? isLight
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-900'
              : isLight
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-100'
          }`}
          title="Search profile settings"
        >
          <Search className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Search Input Bar (smoothly opens on Q click) */}
      <AnimatePresence>
        {isSearchActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className={`flex items-center gap-2 rounded-2xl border px-3.5 py-2.5 transition ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search settings, badges, subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-slate-400 font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Info Card (Directly matching Image 1: Avatar + Name + Email + >) */}
      <div
        onClick={() => {
          if (!currentUser) {
            onOpenAuth('login');
          } else {
            setActiveModal('settings');
          }
        }}
        className={`group rounded-2xl sm:rounded-3xl border p-4 sm:p-5 flex items-center justify-between gap-3 transition shadow-xs cursor-pointer ${
          isLight
            ? 'border-slate-100 bg-white hover:border-slate-200 text-slate-900 shadow-slate-200/50'
            : 'border-slate-800 bg-slate-900 hover:border-slate-700 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
          {/* Avatar with bright yellow/purple styling from Image 1 */}
          <div className="relative flex h-13 w-13 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-indigo-600 p-0.5 shadow-md shrink-0">
            {currentUser?.photoURL ? (
              <img
                src={currentUser.photoURL}
                alt={currentUser.displayName || 'Creator'}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-white font-bold text-lg sm:text-xl">
                {(currentUser?.displayName || currentUser?.email || 'K')[0].toUpperCase()}
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="font-display text-base sm:text-lg font-bold tracking-tight truncate">
              {currentUser?.displayName || (currentUser ? 'Studio Creator' : 'Keira (Guest Creator)')}
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              {currentUser?.email || 'johndeo@gmail.com'}
            </p>
            {currentUser?.isDemo && (
              <span className="inline-block mt-1 font-mono text-[10px] font-bold text-amber-600 dark:text-amber-400">
                ⚡ 1-Click Fast Access Active
              </span>
            )}
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition shrink-0" />
      </div>

      {/* Upgrade to Pro Card (Directly matching Image 1: Dark card + Sparkle + Upgrade > button) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#18181b] via-[#27272a] to-[#09090b] text-white p-4.5 sm:p-5 shadow-xl border border-zinc-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-start gap-3.5 min-w-0">
            {/* Sparkle Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 shrink-0 mt-0.5">
              <Sparkles className="h-5 w-5 fill-sky-400" />
            </div>

            <div className="min-w-0">
              <h3 className="font-display text-sm sm:text-base font-bold tracking-tight">
                Upgrade to Pro
              </h3>
              <p className="font-sans text-[11px] sm:text-xs text-zinc-300 mt-0.5 leading-relaxed line-clamp-2">
                Unlock 4K temporal AI scan, automated safe-cut EDL exports, receipt of compliance certificates, and unlimited cloud records.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('proModal')}
            className="flex items-center gap-1 shrink-0 rounded-full bg-zinc-800/90 hover:bg-zinc-700/90 text-white px-3.5 py-2 font-sans text-xs font-semibold border border-zinc-700 transition cursor-pointer active:scale-95"
          >
            <span>Upgrade</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Grouped Settings Lists (iOS Settings style divided containers from Image 1) */}

      {/* GROUP 1: Account, Plan, Badges, Bank/Channel, Biometric */}
      <div
        className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition shadow-2xs divide-y ${
          isLight
            ? 'border-slate-100 bg-white divide-slate-100 text-slate-900'
            : 'border-slate-800/90 bg-slate-900 divide-slate-800 text-slate-100'
        }`}
      >
        {matchesSearch('Settings') && (
          <button
            type="button"
            onClick={() => setActiveModal('settings')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Settings className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Settings</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {matchesSearch('Plan & Subscription') && (
          <button
            type="button"
            onClick={() => setActiveModal('plan')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <CreditCard className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Plan & Subscription</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {matchesSearch('Badges') && (
          <button
            type="button"
            onClick={() => setActiveModal('badges')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Award className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Badges</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {matchesSearch('Debit Cards Linked Banks Channel') && (
          <button
            type="button"
            onClick={() => setActiveModal('linkedAccounts')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Landmark className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">
                My Debit Cards & Linked Banks
              </span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {/* Enable finger Print/Face ID Row with Authentic Green iOS Switch from Image 1 */}
        {matchesSearch('Finger Print Face ID') && (
          <div className="w-full flex items-center justify-between p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Fingerprint className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">
                Enable finger Print/Face ID
              </span>
            </div>

            {/* iOS green toggle switch */}
            <button
              type="button"
              role="switch"
              aria-checked={isBiometricEnabled}
              onClick={() => setIsBiometricEnabled(!isBiometricEnabled)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-200 ease-in-out focus:outline-none ${
                isBiometricEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  isBiometricEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {/* GROUP 2: Preferences, Privacy Policy, Help & Support */}
      <div
        className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition shadow-2xs divide-y ${
          isLight
            ? 'border-slate-100 bg-white divide-slate-100 text-slate-900'
            : 'border-slate-800/90 bg-slate-900 divide-slate-800 text-slate-100'
        }`}
      >
        {matchesSearch('Preferences') && (
          <button
            type="button"
            onClick={() => setActiveModal('preferences')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <SlidersHorizontal className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Preferences</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {matchesSearch('Privacy Policy') && (
          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <ShieldCheck className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Privacy Policy</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {matchesSearch('Help & Support') && (
          <button
            type="button"
            onClick={() => setActiveModal('help')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <HelpCircle className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Help & Support</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* GROUP 3: Feedback, Language, Sign Out */}
      <div
        className={`rounded-2xl sm:rounded-3xl border overflow-hidden transition shadow-2xs divide-y ${
          isLight
            ? 'border-slate-100 bg-white divide-slate-100 text-slate-900'
            : 'border-slate-800/90 bg-slate-900 divide-slate-800 text-slate-100'
        }`}
      >
        {matchesSearch('Feedback') && (
          <button
            type="button"
            onClick={() => setActiveModal('feedback')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <MessageSquare className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Feedback</span>
            </div>
            <ChevronRight className="h-4 w-4 text-slate-400" />
          </button>
        )}

        {/* Language Row with "English >" from Image 1 */}
        {matchesSearch('Language') && (
          <button
            type="button"
            onClick={() => setActiveModal('language')}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-850 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <Languages className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-medium">Language</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 font-sans text-xs">
              <span>{currentLanguage}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </button>
        )}

        {currentUser && (
          <button
            type="button"
            onClick={onSignOut}
            className="w-full flex items-center justify-between p-3.5 sm:p-4 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition text-left cursor-pointer text-rose-600"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
                <LogOut className="h-4.5 w-4.5" />
              </div>
              <span className="font-sans text-xs sm:text-sm font-semibold">Sign Out</span>
            </div>
            <ChevronRight className="h-4 w-4 text-rose-400" />
          </button>
        )}
      </div>

      {/* Guest Mode: 1-Click Fast Instant Demo Access Card if not logged in */}
      {!currentUser && (
        <div
          className={`rounded-2xl sm:rounded-3xl border p-4.5 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left ${
            isLight ? 'border-amber-200 bg-amber-50/70' : 'border-amber-900/60 bg-amber-950/30'
          }`}
        >
          <div>
            <span className="font-display text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
              Visiting as Guest Creator?
            </span>
            <p className="font-sans text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
              Experience all verified audits, safe cuts, and cloud sync in 1 click without passwords.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onDemoLogin?.('Studio Creator', 'strikucloud@gmail.com')}
              className="flex items-center gap-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 font-sans text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>1-Click Test Access</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenAuth('login')}
              className="rounded-xl border border-amber-300 dark:border-amber-700 px-3 py-2 font-sans text-xs font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* INTERACTIVE MODAL DRAWERS FOR EACH TAPPED ROW */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className={`relative flex flex-col w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden z-10 ${
                isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-display text-base font-bold capitalize">
                  {activeModal === 'proModal'
                    ? 'Creator Shield Pro'
                    : activeModal === 'linkedAccounts'
                    ? 'Debit Cards & Linked Accounts'
                    : activeModal}
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Body Content */}
              <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4 font-sans text-xs sm:text-sm">
                {activeModal === 'proModal' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-gradient-to-r from-sky-500/10 to-indigo-500/10 border border-sky-500/30 p-4">
                      <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold mb-1">
                        <Sparkles className="h-4 w-4 fill-current" />
                        <span>Studio Pro Shield Subscription</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Unlimited video audits, automated CapCut EDL trimming, real-time copyright stem splitting, and direct appeal assistance.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                        <span className="font-semibold">Current Status</span>
                        <span className="font-mono text-emerald-600 font-bold">Active Shield Tier</span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="font-semibold">Next Renewal</span>
                        <span className="font-mono text-slate-500">Free Community Edition</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 py-3 font-bold transition"
                    >
                      Keep Shield Active
                    </button>
                  </div>
                )}

                {activeModal === 'settings' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-500">Configure your YouTube community guidelines ingestion engine preferences.</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="font-semibold block">Automatic Cloud Backup</span>
                          <span className="text-[11px] text-slate-500">Sync all audit verdicts to Firestore</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoCloudBackup}
                          onChange={(e) => setAutoCloudBackup(e.target.checked)}
                          className="h-4 w-4 accent-emerald-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div>
                          <span className="font-semibold block">Instant Safe-Cut Guide Generation</span>
                          <span className="text-[11px] text-slate-500">Synthesize trim timestamps automatically</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={instantCutSheet}
                          onChange={(e) => setInstantCutSheet(e.target.checked)}
                          className="h-4 w-4 accent-emerald-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'plan' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-sm">Creator Studio Free Tier</h4>
                      <p className="text-xs text-slate-500 mt-1">10 video audits/day, standard strictness filter, community guidelines encyclopedia.</p>
                      <div className="mt-3 flex items-center justify-between text-xs font-mono font-bold text-emerald-600">
                        <span>Current Plan</span>
                        <span>$0 / month</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'badges' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10">
                      <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-emerald-900 dark:text-emerald-200">Zero Strike Standing Badge</h4>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-300">Awarded for having 0 active YouTube community guidelines strikes.</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <Award className="h-6 w-6 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm">10-Upload Compliance Veteran</h4>
                        <p className="text-[11px] text-slate-500">Achieved an average compliance score above 85%.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeModal === 'linkedAccounts' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Landmark className="h-5 w-5 text-indigo-500" />
                        <div>
                          <span className="font-semibold block text-xs">Primary Channel Payout Account</span>
                          <span className="text-[11px] text-slate-500">YouTube Partner AdSense</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-emerald-600 font-bold">Connected</span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Cloud className="h-5 w-5 text-sky-500" />
                        <div>
                          <span className="font-semibold block text-xs">Firebase Cloud Vault</span>
                          <span className="text-[11px] text-slate-500">Automated Audit Sync</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-emerald-600 font-bold">Active</span>
                    </div>
                  </div>
                )}

                {activeModal === 'preferences' && (
                  <div className="space-y-3">
                    <span className="font-semibold block text-xs">Moderation Filter Strictness</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setStrictnessLevel('STANDARD')}
                        className={`p-3 rounded-xl border text-left transition ${
                          strictnessLevel === 'STANDARD'
                            ? 'border-emerald-500 bg-emerald-500/10 font-bold'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="block text-xs">Standard</span>
                        <span className="text-[10px] text-slate-500">Official YouTube Guidelines</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStrictnessLevel('PARANOID')}
                        className={`p-3 rounded-xl border text-left transition ${
                          strictnessLevel === 'PARANOID'
                            ? 'border-rose-500 bg-rose-500/10 font-bold'
                            : 'border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <span className="block text-xs">Zero-Risk</span>
                        <span className="text-[10px] text-slate-500">Aggressive Brand Safety</span>
                      </button>
                    </div>
                  </div>
                )}

                {activeModal === 'privacy' && (
                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p>All video frames are processed locally inside your browser session and verified against YouTube guidelines via autonomous multi-agent vision models.</p>
                    <p>No video files are stored permanently on third-party servers without your explicit consent.</p>
                  </div>
                )}

                {activeModal === 'help' && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-xs">What does Safe to Upload mean?</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Your video passed zero-tolerance checks for minor safety, extreme violence, and shock value.</p>
                    </div>
                    <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-xs">How do I use the Safe-Cut Sheet?</h4>
                      <p className="text-[11px] text-slate-500 mt-1">Import the exact timecodes into Adobe Premiere or CapCut and trim the flagged range.</p>
                    </div>
                  </div>
                )}

                {activeModal === 'feedback' && (
                  <div className="space-y-3">
                    {feedbackSent ? (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-center">
                        <CheckCheck className="mx-auto h-6 w-6 mb-1" />
                        <span className="font-bold text-xs">Feedback received! Thank you for helping improve Strike Founder.</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-slate-500">Help us make the YouTube compliance scanner even better:</p>
                        <textarea
                          rows={4}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Tell us what policies or video types you'd like improved..."
                          className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent p-3 text-xs outline-none focus:border-red-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (feedbackText.trim()) {
                              setFeedbackSent(true);
                              setTimeout(() => setActiveModal(null), 1800);
                            }
                          }}
                          className="w-full rounded-xl bg-red-600 text-white py-2.5 font-bold text-xs shadow-md transition hover:bg-red-700"
                        >
                          Submit Feedback
                        </button>
                      </>
                    )}
                  </div>
                )}

                {activeModal === 'language' && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentLanguage('English');
                        setActiveModal(null);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                        currentLanguage === 'English'
                          ? 'border-emerald-500 bg-emerald-500/10 font-bold'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>English</span>
                      {currentLanguage === 'English' && <Check className="h-4 w-4 text-emerald-600" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentLanguage('Urdu');
                        setActiveModal(null);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border transition ${
                        currentLanguage === 'Urdu'
                          ? 'border-emerald-500 bg-emerald-500/10 font-bold'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <span>اردو (Urdu)</span>
                      {currentLanguage === 'Urdu' && <Check className="h-4 w-4 text-emerald-600" />}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
