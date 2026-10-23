import React from 'react';
import {
  ShieldCheck,
  Menu,
  Bell,
  Search,
  Sparkles,
  Lock,
  Building2,
  Zap,
} from 'lucide-react';
import { ColorThemeId } from '../types/audit';
import { COLOR_THEMES } from '../services/themeConfig';
import { SubscriptionTier } from '../services/subscriptionManager';

export interface HeaderUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

interface HeaderProps {
  currentTheme: ColorThemeId;
  currentUser?: HeaderUser | null;
  currentTier?: SubscriptionTier;
  remainingFreeScans?: number;
  onOpenPricing?: () => void;
  onNavigateProfile?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  currentUser,
  currentTier = 'free',
  remainingFreeScans = 5,
  onOpenPricing,
  onNavigateProfile,
  onToggleMobileSidebar,
}) => {
  const theme = COLOR_THEMES[currentTheme];
  const isLight = theme.isLight;

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 ${
        isLight
          ? 'border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.02)] text-slate-900'
          : 'border-b border-slate-800/90 bg-slate-950/95 backdrop-blur-md text-slate-100 shadow-sm'
      }`}
    >
      <div className="flex w-full items-center justify-between px-2 sm:px-4 py-2">
        {/* Left Side: Sidebar Toggle Button (At the absolute top-left edge) */}
        <div className="flex items-center shrink-0">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:border-slate-300'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:border-slate-700'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Right Side: Plan Badge, Quota, Notifications, Avatar */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Subscription Tier Button / Quota Pill */}
          {onOpenPricing && (
            currentTier === 'free' ? (
              <button
                type="button"
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-gradient-to-r from-red-600/15 to-rose-600/15 hover:border-rose-500 px-3 py-1 text-xs font-semibold text-rose-400 transition cursor-pointer shadow-xs active:scale-95"
                title="View Subscription Plans"
              >
                <Sparkles className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                <span className="hidden xs:inline">
                  {remainingFreeScans > 0 ? `${remainingFreeScans}/5 Free Scans` : '0/5 Free Left'}
                </span>
                <span className="rounded-full bg-rose-600 text-white px-2 py-0.5 text-[10px] font-bold">
                  Upgrade
                </span>
              </button>
            ) : currentTier === 'pro' ? (
              <button
                type="button"
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 rounded-full border border-rose-500/60 bg-rose-950/40 hover:bg-rose-900/40 px-3 py-1 text-xs font-bold text-rose-300 transition cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-rose-400 fill-current" />
                <span className="font-mono text-[11px]">CREATOR PRO</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 rounded-full border border-amber-500/60 bg-amber-950/40 hover:bg-amber-900/40 px-3 py-1 text-xs font-bold text-amber-300 transition cursor-pointer shadow-xs"
              >
                <Building2 className="h-3.5 w-3.5 text-amber-400" />
                <span className="font-mono text-[11px]">AGENCY $80</span>
              </button>
            )
          )}

          {/* Active Protection Chip */}
          <div
            className={`hidden md:flex items-center gap-1.5 rounded-full px-3 py-1 border text-xs font-semibold ${
              isLight
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-emerald-800/80 bg-emerald-950/50 text-emerald-300'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Neural Shield</span>
          </div>

          {/* Quick Notification Bell */}
          <button
            type="button"
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
              isLight
                ? 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
            }`}
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Quick Creator Avatar (Click to go to Profile) */}
          {currentUser && onNavigateProfile && (
            <button
              type="button"
              onClick={onNavigateProfile}
              className="flex items-center gap-2 rounded-full transition hover:opacity-90 cursor-pointer"
              title="View Creator Profile"
            >
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'User'}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-red-500"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-red-600 to-indigo-600 text-white font-bold text-xs ring-2 ring-red-500/30">
                  {(currentUser.displayName || currentUser.email || 'C')[0].toUpperCase()}
                </div>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
