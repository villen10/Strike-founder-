import React, { useState } from 'react';
import {
  LayoutDashboard,
  FileVideo,
  Activity,
  AlertTriangle,
  FileText,
  BookOpen,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  User,
  Scan,
  Zap,
  Moon,
  Sun,
  Palette,
  LogOut,
  Sparkles,
  Lock,
  X,
  Check,
  Menu,
} from 'lucide-react';
import { ColorTheme, ColorThemeId } from '../types/audit';
import { COLOR_THEMES } from '../services/themeConfig';

export type NavView = 'overview' | 'scanner' | 'analytics' | 'violations' | 'appeal' | 'knowledge' | 'profile';

export interface SidebarUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  tier?: string;
}

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  theme: ColorTheme;
  violationsCount: number;
  avgComplianceScore: number;
  pendingQueueCount?: number;
  strictnessMode: 'STANDARD' | 'PARANOID_ZERO_RISK';
  onToggleStrictness: (mode: 'STANDARD' | 'PARANOID_ZERO_RISK') => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (theme: ColorThemeId) => void;
  currentUser?: SidebarUser | null;
  onSignIn?: () => void;
  onRegister?: () => void;
  onSignOut?: () => void;
  onScanNewVideo?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
  theme,
  violationsCount,
  avgComplianceScore,
  pendingQueueCount = 0,
  strictnessMode,
  onToggleStrictness,
  currentTheme,
  onSelectTheme,
  currentUser,
  onSignIn,
  onRegister,
  onSignOut,
  onScanNewVideo,
}) => {
  const isLight = theme.isLight;
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const toggleLightDark = () => {
    if (isLight) {
      onSelectTheme('CRIMSON_SLATE');
    } else {
      onSelectTheme('YOUTUBE_STUDIO_LIGHT');
    }
  };

  const navItems = [
    {
      id: 'overview' as NavView,
      label: 'Studio Dashboard',
      description: 'Overall compliance verdict',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'scanner' as NavView,
      label: 'Video Scanner',
      description: 'Frame-by-frame audit engine',
      icon: FileVideo,
      badge: pendingQueueCount > 0 ? `${pendingQueueCount} queued` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'analytics' as NavView,
      label: 'Channel Health',
      description: '10-upload trend line',
      icon: Activity,
      badge: `${avgComplianceScore}%`,
      badgeColor: isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-emerald-300',
    },
    {
      id: 'violations' as NavView,
      label: 'Policy Flags & Cuts',
      description: 'Timecode cut sheet',
      icon: AlertTriangle,
      badge: violationsCount > 0 ? `${violationsCount}` : null,
      badgeColor: 'bg-red-600 text-white',
    },
    {
      id: 'appeal' as NavView,
      label: 'Strike Appeal Kit',
      description: 'Legal counter-appeal',
      icon: FileText,
      badge: null,
    },
    {
      id: 'knowledge' as NavView,
      label: 'Policy Encyclopedia',
      description: 'YouTube community rules',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'profile' as NavView,
      label: 'Creator Profile',
      description: 'Cloud scans & account',
      icon: User,
      badge: currentUser ? 'PRO' : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    },
  ];

  const handleItemClick = (id: NavView) => {
    onSelectView(id);
    if (isOpenMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const sidebarContent = (isDrawer = false) => (
    <div className="flex flex-col h-full justify-between">
      {/* Top Header inside Sidebar */}
      <div>
        <div
          className={`flex items-center justify-between p-3.5 border-b ${
            isLight ? 'border-slate-200/80 bg-white' : 'border-slate-800/80 bg-slate-950'
          }`}
        >
          {(!isCollapsed || isDrawer) ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-xl p-0.5 shadow-xs shrink-0 ${
                  isLight
                    ? 'bg-red-600 text-white shadow-red-500/20'
                    : 'bg-gradient-to-br from-rose-500 to-indigo-600 text-white shadow-rose-950/40'
                }`}
              >
                <ShieldCheck className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="flex flex-col truncate">
                <span className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white">
                  StrikeGuard <span className={theme.accentText}>AI</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                  Creator Navigation
                </span>
              </div>
            </div>
          ) : (
            <div
              className={`flex h-8 w-8 mx-auto items-center justify-center rounded-xl p-0.5 shadow-xs ${
                isLight ? 'bg-red-600 text-white' : 'bg-rose-600 text-white'
              }`}
            >
              <ShieldCheck className="h-4.5 w-4.5 text-white" />
            </div>
          )}

          {isDrawer ? (
            <button
              onClick={onCloseMobile}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400'
              }`}
              title="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onToggleCollapse}
              className={`flex h-7 w-7 items-center justify-center rounded-lg border transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400'
              }`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3.5 w-3.5" />
              ) : (
                <ChevronLeft className="h-3.5 w-3.5" />
              )}
            </button>
          )}
        </div>

        {/* PRIMARY ACTION BUTTON: Scan New Video (Moved from top buttons) */}
        {(!isCollapsed || isDrawer) ? (
          <div className="p-3">
            <button
              type="button"
              onClick={() => {
                if (onScanNewVideo) {
                  onScanNewVideo();
                } else {
                  handleItemClick('scanner');
                }
              }}
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-600 hover:from-red-500 hover:to-indigo-500 text-white font-sans text-xs font-bold py-2.5 px-3 shadow-md shadow-red-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Scan className="h-4 w-4" />
              <span>Audit New Video</span>
            </button>
          </div>
        ) : (
          <div className="p-2 flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (onScanNewVideo) onScanNewVideo();
                else handleItemClick('scanner');
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-md shadow-red-500/20 hover:scale-105 transition cursor-pointer"
              title="Audit New Video"
            >
              <Scan className="h-4.5 w-4.5" />
            </button>
          </div>
        )}

        {/* Navigation Items List */}
        <nav className="p-2.5 flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-420px)] sm:max-h-[calc(100vh-380px)]">
          {(!isCollapsed || isDrawer) && (
            <div className="px-2 pb-1 font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
              Main Menu
            </div>
          )}

          {navItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 font-body text-xs font-semibold transition relative group cursor-pointer ${
                  isActive
                    ? isLight
                      ? 'bg-red-50 text-red-700 shadow-xs ring-1 ring-red-200 font-bold'
                      : 'bg-rose-950/60 text-white shadow-xs ring-1 ring-rose-500/40 font-bold'
                    : isLight
                    ? 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-950'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                }`}
                title={item.label}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive
                      ? isLight
                        ? 'text-red-600'
                        : 'text-rose-400'
                      : isLight
                      ? 'text-slate-500 group-hover:text-slate-900'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {(!isCollapsed || isDrawer) && (
                  <div className="flex-1 text-left truncate flex flex-col">
                    <span className="truncate">{item.label}</span>
                  </div>
                )}

                {(!isCollapsed || isDrawer) && item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                      item.badgeColor ||
                      (isLight ? 'bg-slate-100 text-slate-800' : 'bg-slate-800 text-slate-300')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <div
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-md ${
                      isLight ? 'bg-red-600' : 'bg-rose-500'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* BOTTOM CONTROLS SECTION: Strictness + Appearance + Account (All moved from top to here!) */}
      <div
        className={`p-3 border-t flex flex-col gap-2.5 ${
          isLight
            ? 'border-slate-200/80 bg-slate-50/70 text-slate-800'
            : 'border-slate-800/80 bg-slate-950/90 text-slate-200'
        }`}
      >
        {/* Strictness Mode Selector */}
        {(!isCollapsed || isDrawer) ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              <span>Strictness Engine</span>
              <span className={strictnessMode === 'PARANOID_ZERO_RISK' ? 'text-red-500 font-bold' : 'text-slate-500'}>
                {strictnessMode === 'PARANOID_ZERO_RISK' ? 'Zero-Risk' : 'Standard'}
              </span>
            </div>
            <div
              className={`grid grid-cols-2 p-1 rounded-xl border text-[11px] font-medium ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <button
                type="button"
                onClick={() => onToggleStrictness('STANDARD')}
                className={`py-1 rounded-lg text-center font-sans transition cursor-pointer ${
                  strictnessMode === 'STANDARD'
                    ? isLight
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-800 text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => onToggleStrictness('PARANOID_ZERO_RISK')}
                className={`py-1 rounded-lg text-center font-sans flex items-center justify-center gap-1 transition cursor-pointer ${
                  strictnessMode === 'PARANOID_ZERO_RISK'
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-red-500'
                }`}
              >
                <ShieldAlert className="h-3 w-3" />
                <span>Zero-Risk</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() =>
                onToggleStrictness(
                  strictnessMode === 'STANDARD' ? 'PARANOID_ZERO_RISK' : 'STANDARD'
                )
              }
              className={`h-8 w-8 rounded-xl flex items-center justify-center border transition cursor-pointer ${
                strictnessMode === 'PARANOID_ZERO_RISK'
                  ? 'bg-red-600 text-white border-red-500'
                  : isLight
                  ? 'border-slate-200 bg-white text-slate-700'
                  : 'border-slate-800 bg-slate-900 text-slate-400'
              }`}
              title={`Strictness Mode: ${strictnessMode}`}
            >
              <ShieldAlert className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Theme & Display Quick Selector */}
        {(!isCollapsed || isDrawer) ? (
          <div className="flex items-center justify-between gap-1.5 pt-1">
            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleLightDark}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
            >
              {isLight ? (
                <>
                  <Moon className="h-3.5 w-3.5 text-slate-600" />
                  <span className="text-[11px]">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[11px]">Studio White</span>
                </>
              )}
            </button>

            {/* Theme Palette Dropdown Toggle */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className={`flex h-8 items-center justify-center gap-1 px-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isLight
                    ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                }`}
                title="Theme Colors"
              >
                <Palette className="h-3.5 w-3.5 text-red-500" />
              </button>

              {isThemePickerOpen && (
                <div
                  className={`absolute bottom-10 left-0 sm:left-auto sm:right-0 w-48 rounded-2xl border p-2 shadow-2xl z-50 backdrop-blur-md ${
                    isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-800 bg-slate-900 text-slate-100'
                  }`}
                >
                  <div className="px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                    Accent Color
                  </div>
                  {Object.values(COLOR_THEMES).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme(t.id);
                        setIsThemePickerOpen(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left text-xs transition cursor-pointer ${
                        currentTheme === t.id
                          ? isLight
                            ? 'bg-slate-100 text-slate-950 font-bold'
                            : 'bg-slate-800 text-white font-bold'
                          : isLight
                          ? 'text-slate-600 hover:bg-slate-50'
                          : 'text-slate-300 hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${t.accentBg}`} />
                        <span className="text-[11px] truncate">{t.nameEn}</span>
                      </div>
                      {currentTheme === t.id && (
                        <Check className={`h-3 w-3 ${theme.accentText}`} />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={toggleLightDark}
              className={`h-8 w-8 rounded-xl flex items-center justify-center border transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-white text-slate-700'
                  : 'border-slate-800 bg-slate-900 text-slate-300'
              }`}
              title={isLight ? 'Switch to Dark Mode' : 'Switch to Studio White'}
            >
              {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
            </button>
          </div>
        )}

        {/* Creator Account Card / Auth (Moved from top to here!) */}
        {(!isCollapsed || isDrawer) ? (
          currentUser ? (
            <div
              className={`rounded-2xl border p-2.5 flex items-center justify-between gap-2 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div
                onClick={() => handleItemClick('profile')}
                className="flex items-center gap-2 overflow-hidden cursor-pointer flex-1"
                title="View Creator Profile"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white font-bold text-xs shrink-0">
                    {(currentUser.displayName || currentUser.email || 'C')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col truncate">
                  <span className="font-sans font-bold text-xs truncate text-slate-900 dark:text-white">
                    {currentUser.displayName || 'Creator'}
                  </span>
                  <span className="font-mono text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Pro Shield
                  </span>
                </div>
              </div>

              {onSignOut && (
                <button
                  type="button"
                  onClick={onSignOut}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div
              className={`rounded-2xl border p-2.5 flex flex-col gap-2 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-body text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Creator Portal
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                  Guest
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={onSignIn}
                  className={`py-1.5 px-2 rounded-xl border text-center font-sans text-xs font-semibold transition cursor-pointer ${
                    isLight
                      ? 'border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800'
                      : 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={onRegister}
                  className="py-1.5 px-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-center font-sans text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Register
                </button>
              </div>
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => handleItemClick('profile')}
              className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs cursor-pointer ${
                currentUser
                  ? 'bg-red-600 text-white'
                  : isLight
                  ? 'bg-slate-200 text-slate-700'
                  : 'bg-slate-800 text-slate-300'
              }`}
              title={currentUser ? currentUser.displayName || 'Profile' : 'Creator Profile'}
            >
              {currentUser ? (currentUser.displayName || 'C')[0].toUpperCase() : <User className="h-4 w-4" />}
            </button>
          </div>
        )}

        {/* Channel Standing Indicator */}
        {(!isCollapsed || isDrawer) && (
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="font-body text-slate-500 text-[10px]">
              Channel Standing:
            </span>
            <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" />
              0 Strikes (Safe)
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Left Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all duration-200 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] z-30 ${
          isCollapsed ? 'w-18' : 'w-64'
        } ${
          isLight
            ? 'border-slate-200/80 bg-white text-slate-800'
            : 'border-slate-800/80 bg-slate-950 text-slate-200'
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* 2. Mobile Drawer Overlay (Opens when hamburger button is clicked) */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Blur */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <div
            className={`relative w-4/5 max-w-xs h-full border-r shadow-2xl flex flex-col z-10 transition-transform ${
              isLight ? 'border-slate-200 bg-white text-slate-900' : 'border-slate-800 bg-slate-950 text-slate-100'
            }`}
          >
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

interface MobileBottomNavProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  theme: ColorTheme;
  violationsCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  theme,
  violationsCount,
}) => {
  const isLight = theme.isLight;

  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto pointer-events-none">
      <nav
        className={`pointer-events-auto rounded-3xl border shadow-2xl backdrop-blur-2xl px-2.5 py-1.5 flex items-center justify-between transition-colors duration-200 ${
          isLight
            ? 'border-slate-200/90 bg-white/95 text-slate-800 shadow-slate-300/50'
            : 'border-slate-800/90 bg-slate-950/95 text-slate-200 shadow-black/80'
        }`}
      >
        {/* Item 1: Home / Overview */}
        <button
          type="button"
          onClick={() => onSelectView('overview')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-2xl transition cursor-pointer relative ${
            currentView === 'overview'
              ? isLight
                ? 'text-slate-950 font-bold'
                : 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <LayoutDashboard className="h-5 w-5" />
            {currentView === 'overview' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-slate-900 dark:bg-white" />
            )}
          </div>
          <span className="font-body text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Item 2: Health / Statistics (Matching Image 2 Progress Tab) */}
        <button
          type="button"
          onClick={() => onSelectView('analytics')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-2xl transition cursor-pointer relative ${
            currentView === 'analytics'
              ? isLight
                ? 'text-slate-950 font-bold'
                : 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <Activity className="h-5 w-5" />
            {currentView === 'analytics' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-slate-900 dark:bg-white" />
            )}
          </div>
          <span className="font-body text-[10px] mt-0.5 tracking-tight">Progress</span>
        </button>

        {/* Item 3: ELEVATED CENTER FAB BUTTON (Directly matching Image 2 & Image 3 Center FAB Style 06) */}
        <div className="relative flex flex-col items-center justify-center px-1.5">
          <button
            type="button"
            onClick={() => onSelectView('scanner')}
            className="flex h-12 w-12 -mt-5 items-center justify-center rounded-2xl bg-gradient-to-tr from-lime-400 via-emerald-500 to-teal-500 text-slate-950 font-black shadow-lg shadow-emerald-500/35 ring-4 ring-white dark:ring-slate-950 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Scan & Ingest Video"
          >
            <Scan className="h-6 w-6 stroke-[2.4]" />
          </button>
          <span className="font-body text-[9px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
            Scan
          </span>
        </div>

        {/* Item 4: Flags & Cuts */}
        <button
          type="button"
          onClick={() => onSelectView('violations')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-2xl transition cursor-pointer relative ${
            currentView === 'violations'
              ? isLight
                ? 'text-slate-950 font-bold'
                : 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <AlertTriangle className="h-5 w-5" />
            {violationsCount > 0 && (
              <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 font-mono text-[8px] font-bold text-white shadow-xs">
                {violationsCount}
              </span>
            )}
            {currentView === 'violations' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-slate-900 dark:bg-white" />
            )}
          </div>
          <span className="font-body text-[10px] mt-0.5 tracking-tight">Flags</span>
        </button>

        {/* Item 5: Creator Profile (Matching Image 1 & 2 Profile Tab) */}
        <button
          type="button"
          onClick={() => onSelectView('profile')}
          className={`flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-2xl transition cursor-pointer relative ${
            currentView === 'profile'
              ? isLight
                ? 'text-slate-950 font-bold'
                : 'text-white font-bold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium'
          }`}
        >
          <div className="relative">
            <User className="h-5 w-5" />
            {currentView === 'profile' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-slate-900 dark:bg-white" />
            )}
          </div>
          <span className="font-body text-[10px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </nav>
    </div>
  );
};
