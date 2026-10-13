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
export interface HeaderUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface HeaderProps {
  strictnessMode: 'STANDARD' | 'PARANOID_ZERO_RISK';
  onToggleStrictness: (mode: 'STANDARD' | 'PARANOID_ZERO_RISK') => void;
  onOpenKnowledgeBase?: () => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (theme: ColorThemeId) => void;
  currentUser?: HeaderUser | null;
  onSignIn?: () => void;
  onRegister?: () => void;
  onNavigateProfile?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  strictnessMode,
  onToggleStrictness,
  currentTheme,
  onSelectTheme,
  currentUser,
  onSignIn,
  onRegister,
  onNavigateProfile,
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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2.5 sm:px-6">
        {/* Brand Identity */}
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

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Quick Profile button on desktop if logged in */}
          {currentUser && onNavigateProfile && (
            <button
              onClick={onNavigateProfile}
              className={`hidden sm:flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <UserIcon className="h-3.5 w-3.5 text-red-600" />
              <span>Profile</span>
            </button>
          )}

          {/* Strictness Mode Segmented Control */}
          <div
            className={`hidden sm:flex items-center rounded-xl border p-0.5 text-xs ${
              isLight
                ? 'border-slate-200 bg-slate-100/80'
                : 'border-slate-800 bg-slate-900/90'
            }`}
          >
            <button
              onClick={() => onToggleStrictness('STANDARD')}
              className={`rounded-lg px-2 sm:px-2.5 py-1 font-sans text-[11px] transition cursor-pointer ${
                strictnessMode === 'STANDARD'
                  ? isLight
                    ? 'bg-white text-slate-950 shadow-xs font-bold'
                    : 'bg-slate-800 text-white shadow-xs font-bold'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 font-medium'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              Standard
            </button>
            <button
              onClick={() => onToggleStrictness('PARANOID_ZERO_RISK')}
              className={`flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1 font-sans text-[11px] transition cursor-pointer ${
                strictnessMode === 'PARANOID_ZERO_RISK'
                  ? 'bg-red-600 text-white shadow-xs font-bold'
                  : 'text-slate-500 hover:text-red-500 font-medium'
              }`}
            >
              <ShieldAlert className="h-3 w-3" />
              <span>Zero-Risk</span>
            </button>
          </div>

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleLightDark}
            className={`flex h-8 w-8 items-center justify-center rounded-xl border transition cursor-pointer ${
              isLight
                ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Studio White'}
          >
            {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>

          {/* Color Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className={`flex h-8 items-center justify-center gap-1.5 rounded-xl border px-2 font-sans text-xs font-semibold transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
              title="Select studio accent theme"
            >
              <Palette className="h-3.5 w-3.5 text-red-500" />
              <span className="hidden lg:inline text-[11px]">{theme.nameEn}</span>
            </button>

            {isThemeMenuOpen && (
              <div
                className={`absolute right-0 mt-2 w-52 rounded-2xl border p-2 shadow-xl z-50 backdrop-blur-md ${
                  isLight
                    ? 'border-slate-200 bg-white/95 text-slate-900'
                    : 'border-slate-800 bg-slate-900/95 text-slate-100'
                }`}
              >
                <div className="px-2.5 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Select Theme
                </div>
                {Object.values(COLOR_THEMES).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTheme(t.id);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-left font-sans text-xs transition cursor-pointer ${
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

          {/* Authentication & Profile Status */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`flex h-8 items-center gap-2 rounded-xl border px-2 font-sans text-xs font-semibold transition cursor-pointer ${
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
                    {onNavigateProfile && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onNavigateProfile();
                        }}
                        className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left font-sans text-xs font-semibold transition cursor-pointer ${
                          isLight ? 'hover:bg-slate-100 text-slate-800' : 'hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <UserIcon className="h-3.5 w-3.5 text-red-600" />
                        <span>View Creator Profile</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between text-[11px] font-sans text-slate-500 px-2.5 py-1">
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
                    className="flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left font-sans text-xs text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition mt-1 font-semibold cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={onSignIn}
                className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 font-sans text-xs font-semibold shadow-xs transition cursor-pointer ${
                  isLight
                    ? 'border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-slate-100'
                    : 'border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-100'
                }`}
                title="Sign in to your account"
              >
                <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                <span>Sign In</span>
              </button>

              <button
                onClick={onRegister}
                className="flex h-8 items-center gap-1 rounded-xl bg-red-600 hover:bg-red-700 text-white px-2.5 font-sans text-xs font-bold shadow-xs transition cursor-pointer"
                title="Register a free creator account"
              >
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
