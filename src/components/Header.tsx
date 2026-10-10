import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Palette,
  Check,
  Sun,
  Moon,
  Cloud,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { ColorThemeId } from '../types/audit';
import { COLOR_THEMES } from '../services/themeConfig';
import type { User } from '../services/firebase';

interface HeaderProps {
  strictnessMode: 'STANDARD' | 'PARANOID_ZERO_RISK';
  onToggleStrictness: (mode: 'STANDARD' | 'PARANOID_ZERO_RISK') => void;
  onOpenKnowledgeBase?: () => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (theme: ColorThemeId) => void;
  currentUser?: User | null;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  strictnessMode,
  onToggleStrictness,
  currentTheme,
  onSelectTheme,
  currentUser,
  onSignIn,
  onSignOut,
}) => {
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const theme = COLOR_THEMES[currentTheme];
  const isLight = theme.isLight;

  const toggleLightDark = () => {
    if (isLight) {
      onSelectTheme('CRIMSON_SLATE');
    } else {
      onSelectTheme('YOUTUBE_STUDIO_LIGHT');
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isLight
          ? 'border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-slate-900'
          : 'border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md text-slate-100 shadow-sm'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6">
        {/* Brand Identity (Responsive, No Overflow) */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div
            className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl p-0.5 shadow-xs transition-transform hover:scale-105 shrink-0 ${
              isLight
                ? 'bg-red-600 text-white shadow-red-500/20'
                : 'bg-gradient-to-br from-rose-500 to-indigo-600 text-white shadow-rose-950/40'
            }`}
          >
            <div
              className={`flex h-full w-full items-center justify-center rounded-[10px] ${
                isLight ? 'bg-red-600' : 'bg-slate-950'
              }`}
            >
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1
                className={`font-display text-base sm:text-lg font-black tracking-tight ${
                  isLight ? 'text-slate-950' : 'text-white'
                }`}
              >
                StrikeGuard <span className={theme.accentText}>AI</span>
              </h1>
              <span
                className={`font-mono hidden sm:inline-block rounded px-1.5 py-0.2 text-[9px] font-bold tracking-wider uppercase ring-1 ring-inset ${
                  isLight
                    ? 'bg-red-50 text-red-700 ring-red-200/80'
                    : 'bg-rose-950/90 text-rose-300 ring-rose-500/30'
                }`}
              >
                STUDIO SHIELD
              </span>
            </div>
            <p className={`font-sans hidden md:block text-[11px] font-normal ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              YouTube Algorithmic Strike Pre-Auditor & Ingestion Shield
            </p>
          </div>
        </div>

        {/* Right side controls (Clean, Minimalist, No Crowding) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Strictness Mode Segmented Control */}
          <div
            className={`flex items-center rounded-xl border p-0.5 text-xs ${
              isLight
                ? 'border-slate-200 bg-slate-100/80'
                : 'border-slate-800 bg-slate-900/90'
            }`}
          >
            <button
              onClick={() => onToggleStrictness('STANDARD')}
              className={`rounded-lg px-2 sm:px-2.5 py-1 font-sans text-[11px] sm:text-xs transition ${
                strictnessMode === 'STANDARD'
                  ? isLight
                    ? 'bg-white text-slate-950 shadow-xs font-bold'
                    : 'bg-slate-800 text-white shadow-xs font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 font-medium'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
              title="Standard YouTube algorithm threshold"
            >
              Standard
            </button>
            <button
              onClick={() => onToggleStrictness('PARANOID_ZERO_RISK')}
              className={`flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 font-sans text-[11px] sm:text-xs transition ${
                strictnessMode === 'PARANOID_ZERO_RISK'
                  ? isLight
                    ? 'bg-red-50 text-red-700 shadow-xs font-bold ring-1 ring-red-200'
                    : 'bg-rose-950 text-rose-200 shadow-xs ring-1 ring-rose-800/40 font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 font-medium'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
              title="Paranoid Zero-Risk: 20% strict buffer for guaranteed safety"
            >
              <ShieldAlert className="h-3 w-3 text-red-500" />
              <span>Zero-Risk</span>
            </button>
          </div>

          {/* Quick Light / Dark Mode Toggle */}
          <button
            onClick={toggleLightDark}
            className={`flex h-8 w-8 sm:w-auto items-center justify-center gap-1.5 rounded-xl border sm:px-2.5 font-sans text-xs font-semibold transition ${
              isLight
                ? 'border-slate-200 bg-slate-100 hover:bg-slate-200/80 text-slate-800'
                : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Studio White'}
          >
            {isLight ? (
              <>
                <Moon className="h-3.5 w-3.5 text-slate-600" />
                <span className="hidden md:inline text-[11px]">Dark</span>
              </>
            ) : (
              <>
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px]">White</span>
              </>
            )}
          </button>

          {/* Theme Palette Picker Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className={`flex h-8 w-8 sm:w-auto items-center justify-center gap-1.5 rounded-xl border sm:px-2.5 font-sans text-xs font-semibold transition ${
                isLight
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  : 'border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300'
              }`}
              title="Select UI Palette"
            >
              <Palette className="h-3.5 w-3.5 text-red-500" />
              <span className="hidden md:inline font-mono text-[11px]">Palette</span>
            </button>

            {isThemeMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-60 rounded-2xl border p-2 shadow-xl z-50 backdrop-blur-md ${
                  isLight
                    ? 'border-slate-200 bg-white text-slate-900'
                    : 'border-slate-800 bg-slate-900 text-slate-100'
                }`}
              >
                <div
                  className={`px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider border-b mb-1 ${
                    isLight ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  Select Color Theme
                </div>
                {Object.values(COLOR_THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left font-sans text-xs transition ${
                      currentTheme === t.id
                        ? isLight
                          ? 'bg-slate-100 text-slate-950 font-bold'
                          : 'bg-slate-800 text-white font-semibold'
                        : isLight
                        ? 'text-slate-700 hover:bg-slate-50'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${t.accentBg}`} />
                      <span className="font-medium text-xs">{t.nameEn}</span>
                    </div>
                    {currentTheme === t.id && (
                      <Check className={`h-3.5 w-3.5 ${theme.accentText}`} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Firebase Authentication & Cloud Sync */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex h-8 items-center gap-2 rounded-xl border px-2 font-sans text-xs font-semibold transition ${
                  isLight
                    ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200'
                }`}
                title={currentUser.email || 'Cloud Account'}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-300"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden lg:inline text-xs truncate max-w-[100px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" title="Firebase Online" />
              </button>

              {isUserMenuOpen && (
                <div
                  className={`absolute right-0 mt-2 w-64 rounded-2xl border p-3 shadow-xl z-50 backdrop-blur-md ${
                    isLight
                      ? 'border-slate-200 bg-white text-slate-900'
                      : 'border-slate-800 bg-slate-900 text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-200/80 dark:border-slate-800">
                    {currentUser.photoURL ? (
                      <img
                        src={currentUser.photoURL}
                        alt="User"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs">
                        {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col truncate">
                      <span className="font-sans font-bold text-xs truncate">
                        {currentUser.displayName || 'Creator'}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 truncate">
                        {currentUser.email}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-sans text-slate-500">
                      <span className="flex items-center gap-1">
                        <Cloud className="h-3 w-3 text-emerald-500" />
                        Firebase Cloud
                      </span>
                      <span className="font-mono text-[10px] text-emerald-600 font-semibold">
                        Connected
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onSignOut?.();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left font-sans text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition mt-1 font-semibold"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 font-sans text-xs font-semibold shadow-xs transition ${
                isLight
                  ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-slate-100'
                  : 'border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100'
              }`}
              title="Sign in with Google to sync scans to Firebase"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="hidden sm:inline text-xs">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
