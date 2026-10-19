import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Sparkles,
  Zap,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  isLight: boolean;
  onDemoLogin?: (name?: string, email?: string) => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  isLight,
  onDemoLogin,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync mode if initialMode changes
  React.useEffect(() => {
    setMode(initialMode);
    setError(null);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      if (mode === 'register') {
        if (!displayName.trim()) {
          throw new Error('Please enter your creator channel name');
        }
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      setIsLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      // Helpful friendly message if popup blocked or standard firebase error
      const msg = err?.message || 'Authentication failed. Please check your credentials.';
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/user-not-found')) {
        setError('Invalid email or password. You can also use 1-Click Demo Login below.');
      } else if (msg.includes('auth/email-already-in-use')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(msg);
      }
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await signInWithGoogle();
      setIsLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      setError(
        err?.message?.includes('popup')
          ? 'Google popup was blocked or closed. You can use 1-Click Demo Login to unlock immediately.'
          : err?.message || 'Google sign-in failed.'
      );
    }
  };

  const handleQuickDemo = () => {
    if (onDemoLogin) {
      onDemoLogin('YouTube Creator', 'blendagent.online@gmail.com');
    }
    onSuccess?.();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md"
        />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`relative w-full max-w-md rounded-3xl border p-5 sm:p-7 shadow-2xl z-10 my-auto ${
            isLight
              ? 'bg-white border-slate-200/90 text-slate-900 shadow-slate-300/40'
              : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/90'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-xl p-2 transition cursor-pointer ${
              isLight ? 'hover:bg-slate-100 text-slate-400 hover:text-slate-700' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
            aria-label="Close"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="flex h-11 w-11 items-center justify-center shrink-0">
              <img
                src="https://lh3.googleusercontent.com/d/10zb1xIfnKDUAaGkwY3G8HTkmZFsuupNM"
                alt="Striku Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-display text-lg sm:text-xl font-black tracking-tight">
                  {mode === 'login' ? 'Creator Sign In' : 'Create Free Account'}
                </h2>
                <span className="rounded-md bg-red-500/10 text-red-600 font-mono text-[9px] font-bold px-1.5 py-0.5">
                  PRO SHIELD
                </span>
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                Unlock full strike reports, safe cut sheets & cloud audits
              </p>
            </div>
          </div>

          {/* Quick Demo Instant Access Banner */}
          <div className="mb-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-red-500/10 to-rose-500/10 p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-slate-950 shrink-0 font-bold">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <div className="min-w-0">
                <p className="font-sans text-xs font-bold truncate text-slate-900 dark:text-white">
                  Fast 1-Click Creator Access
                </p>
                <p className={`text-[11px] truncate ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Instant unlock without email verification
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemo}
              className="shrink-0 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-3 py-1.5 font-sans text-xs font-bold shadow-md transition cursor-pointer flex items-center gap-1"
            >
              <span>Instant Test</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className={`flex rounded-2xl border p-1 mb-4 text-xs font-semibold ${
            isLight ? 'border-slate-200 bg-slate-100/90' : 'border-slate-800 bg-slate-950/90'
          }`}>
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 rounded-xl py-2 transition cursor-pointer font-bold ${
                mode === 'login'
                  ? isLight ? 'bg-white text-slate-950 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(null); }}
              className={`flex-1 rounded-xl py-2 transition cursor-pointer font-bold ${
                mode === 'register'
                  ? isLight ? 'bg-white text-slate-950 shadow-xs' : 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
              }`}
            >
              Register Free
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-500 animate-fadeIn">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span className="flex-1 leading-snug">{error}</span>
            </div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 rounded-2xl border py-2.5 px-4 text-xs font-bold transition cursor-pointer ${
              isLight
                ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs'
                : 'border-slate-700 bg-slate-800/90 hover:bg-slate-800 text-slate-100'
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

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className={`w-full border-t ${isLight ? 'border-slate-200' : 'border-slate-800'}`} />
            </div>
            <span className={`relative px-3 text-[11px] font-mono uppercase tracking-wider ${
              isLight ? 'bg-white text-slate-400' : 'bg-slate-900 text-slate-500'
            }`}>
              or creator credentials
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                  Channel / Creator Name
                </label>
                <div className="relative">
                  <UserIcon className={`absolute left-3.5 top-2.5 h-4 w-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    required
                    placeholder="My YouTube Channel"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition ${
                      isLight
                        ? 'border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-slate-900'
                        : 'border-slate-800 bg-slate-950 focus:border-rose-500 focus:bg-slate-900 text-slate-100'
                    }`}
                  />
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3.5 top-2.5 h-4 w-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type="email"
                  required
                  placeholder="creator@youtube.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-4 text-xs font-sans outline-none transition ${
                    isLight
                      ? 'border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-slate-900'
                      : 'border-slate-800 bg-slate-950 focus:border-rose-500 focus:bg-slate-900 text-slate-100'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3.5 top-2.5 h-4 w-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full rounded-2xl border py-2.5 pl-10 pr-10 text-xs font-sans outline-none transition ${
                    isLight
                      ? 'border-slate-200 bg-slate-50 focus:border-red-500 focus:bg-white text-slate-900'
                      : 'border-slate-800 bg-slate-950 focus:border-rose-500 focus:bg-slate-900 text-slate-100'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-2.5 p-0.5 text-xs transition cursor-pointer ${
                    isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-red-600 hover:bg-red-700 text-white py-3 px-4 font-sans text-xs font-bold transition shadow-lg shadow-red-500/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Processing...' : mode === 'login' ? 'Sign In to Unlock Results' : 'Create Free Account & Unlock'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Privacy Note */}
          <div className="mt-4 text-center">
            <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
              Safe & Private · YouTube API Compliant · No Spam
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
