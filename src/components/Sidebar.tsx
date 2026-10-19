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
  Search,
  Plus,
  X,
  Check,
  Lock,
  Youtube,
} from 'lucide-react';
import { ColorTheme, ColorThemeId } from '../types/audit';
import { COLOR_THEMES } from '../services/themeConfig';

export type NavView = 'overview' | 'scanner' | 'channels' | 'analytics' | 'violations' | 'appeal' | 'knowledge' | 'profile';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);

  const toggleLightDark = () => {
    if (isLight) {
      onSelectTheme('CRIMSON_SLATE');
    } else {
      onSelectTheme('YOUTUBE_STUDIO_LIGHT');
    }
  };

  const handleItemClick = (id: NavView) => {
    onSelectView(id);
    if (isOpenMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const overviewItems = [
    {
      id: 'overview' as NavView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'scanner' as NavView,
      label: 'Video Scanner',
      icon: FileVideo,
      badge: pendingQueueCount > 0 ? `${pendingQueueCount}` : null,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'channels' as NavView,
      label: 'Channel Tracker',
      icon: Youtube,
      badge: '24h/7d',
      badgeColor: 'bg-red-600 text-white',
    },
    {
      id: 'analytics' as NavView,
      label: 'Channel Health',
      icon: Activity,
      badge: `${avgComplianceScore}%`,
      badgeColor: isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-950 text-emerald-300',
    },
  ];

  const connectionItems = [
    {
      id: 'violations' as NavView,
      label: 'Policy Flags & Cuts',
      icon: AlertTriangle,
      badge: violationsCount > 0 ? `${violationsCount}` : null,
      badgeColor: 'bg-red-600 text-white',
    },
    {
      id: 'appeal' as NavView,
      label: 'Strike Appeal Kit',
      icon: FileText,
      badge: null,
    },
  ];

  const moreItems = [
    {
      id: 'knowledge' as NavView,
      label: 'Policy Encyclopedia',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'profile' as NavView,
      label: 'Creator Profile',
      icon: User,
      badge: currentUser ? 'PRO' : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    },
  ];

  const sidebarContent = (isDrawer = false) => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
      {/* Top Header & Logo */}
      <div>
        <div
          className={`flex items-center justify-between px-2 py-4 border-b sticky top-0 z-20 backdrop-blur-md ${
            isLight ? 'border-slate-200/80 bg-white/95' : 'border-slate-800/80 bg-slate-950/95'
          }`}
        >
          {(!isCollapsed || isDrawer) ? (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-9 w-32 items-center justify-start shrink-0">
                <img
                  src="https://lh3.googleusercontent.com/d/1wD4MS3OLJmAjuuAy1OueuNM2EFW7TYCI"
                  alt="Striku Logo"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex h-8 w-8 mx-auto items-center justify-center shrink-0">
              <img
                src="https://lh3.googleusercontent.com/d/1wD4MS3OLJmAjuuAy1OueuNM2EFW7TYCI"
                alt="Striku Logo"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
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

        {/* Quick Search Box */}
        {(!isCollapsed || isDrawer) && (
          <div className="px-3 pt-3 pb-1">
            <div
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                isLight
                  ? 'border-slate-200 bg-slate-50/80 text-slate-800 focus-within:bg-white focus-within:border-red-500'
                  : 'border-slate-800 bg-slate-900/80 text-slate-200 focus-within:bg-slate-900 focus-within:border-rose-500'
              }`}
            >
              <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Quick search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none font-sans text-xs placeholder:text-slate-400"
              />
              <span className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold border border-slate-300 dark:border-slate-700 text-slate-400">
                /
              </span>
            </div>
          </div>
        )}

        {/* Primary Action: Audit New Video / Log */}
        {(!isCollapsed || isDrawer) ? (
          <div className="px-3 py-2">
            <button
              type="button"
              onClick={() => {
                if (onScanNewVideo) {
                  onScanNewVideo();
                } else {
                  handleItemClick('scanner');
                }
              }}
              className="w-full flex items-center justify-between rounded-xl bg-[#c2f268] hover:bg-[#b0e258] text-slate-950 font-sans text-xs font-bold py-2.5 px-3 shadow-xs transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-950 text-[#c2f268]">
                  <Plus className="h-3.5 w-3.5 stroke-[3]" />
                </div>
                <span>Audit New Video</span>
              </div>
              <Scan className="h-4 w-4 text-slate-800" />
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
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c2f268] text-slate-950 shadow-xs hover:scale-105 transition cursor-pointer"
              title="Audit New Video"
            >
              <Plus className="h-5 w-5 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Grouped Navigation List */}
        <nav className="px-3 py-2 flex flex-col gap-4">
          {/* Section 1: OVERVIEW */}
          <div>
            {(!isCollapsed || isDrawer) && (
              <div className="px-2 pb-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                Overview
              </div>
            )}
            <div className="flex flex-col gap-1">
              {overviewItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 font-body text-xs font-semibold transition relative group cursor-pointer ${
                      isActive
                        ? isLight
                          ? 'bg-slate-200/80 text-slate-950 font-bold shadow-2xs'
                          : 'bg-slate-800 text-white font-bold shadow-2xs'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? isLight
                            ? 'text-slate-950'
                            : 'text-white'
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
                          (isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: CONNECTIONS */}
          <div>
            {(!isCollapsed || isDrawer) && (
              <div className="px-2 pb-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                Connections
              </div>
            )}
            <div className="flex flex-col gap-1">
              {connectionItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 font-body text-xs font-semibold transition relative group cursor-pointer ${
                      isActive
                        ? isLight
                          ? 'bg-slate-200/80 text-slate-950 font-bold shadow-2xs'
                          : 'bg-slate-800 text-white font-bold shadow-2xs'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? isLight
                            ? 'text-slate-950'
                            : 'text-white'
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
                          (isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: MORE */}
          <div>
            {(!isCollapsed || isDrawer) && (
              <div className="px-2 pb-1.5 font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                More
              </div>
            )}
            <div className="flex flex-col gap-1">
              {moreItems.map((item) => {
                const isActive = currentView === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 font-body text-xs font-semibold transition relative group cursor-pointer ${
                      isActive
                        ? isLight
                          ? 'bg-slate-200/80 text-slate-950 font-bold shadow-2xs'
                          : 'bg-slate-800 text-white font-bold shadow-2xs'
                        : isLight
                        ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                    title={item.label}
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 transition-colors ${
                        isActive
                          ? isLight
                            ? 'text-slate-950'
                            : 'text-white'
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
                          (isLight ? 'bg-slate-200 text-slate-800' : 'bg-slate-800 text-slate-300')
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* BOTTOM SECTION: PRO Upgrade Card + Preferences + User Footer */}
      <div
        className={`p-3 mt-4 border-t flex flex-col gap-3 shrink-0 ${
          isLight
            ? 'border-slate-200/80 bg-slate-50/90 text-slate-800'
            : 'border-slate-800/80 bg-slate-950 text-slate-200'
        }`}
      >
        {/* Gorgeous Pro Upgrade Card */}
        {(!isCollapsed || isDrawer) && (
          <div
            className={`rounded-2xl border p-3.5 flex flex-col gap-2.5 relative overflow-hidden ${
              isLight
                ? 'border-indigo-100 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-blue-50/40 text-indigo-950 shadow-2xs'
                : 'border-indigo-950/80 bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 text-indigo-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                    Current plan:
                  </span>
                  <span className="font-display text-xs font-black">Pro trial active</span>
                </div>
              </div>
            </div>

            <p className="font-sans text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Upgrade to Pro to get the latest and exclusive features & automated strike defense.
            </p>

            <button
              type="button"
              onClick={() => handleItemClick('profile')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold py-2 px-3 shadow-xs transition cursor-pointer"
            >
              <Zap className="h-3.5 w-3.5 fill-current" />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        )}

        {/* Preferences / Dark Mode & Theme Toggle */}
        {(!isCollapsed || isDrawer) && (
          <div className="flex items-center justify-between gap-1.5 pt-1">
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
                  <span className="text-[11px]">Dark mode</span>
                </>
              ) : (
                <>
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[11px]">Light mode</span>
                </>
              )}
            </button>

            {/* Theme Picker Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsThemePickerOpen(!isThemePickerOpen)}
                className={`flex h-8 w-8 items-center justify-center rounded-xl border text-xs font-semibold transition cursor-pointer ${
                  isLight
                    ? 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
                }`}
                title="Themes"
              >
                <Palette className="h-3.5 w-3.5 text-indigo-500" />
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
        )}

        {/* User Footer */}
        {(!isCollapsed || isDrawer) ? (
          currentUser ? (
            <div
              className={`rounded-2xl border p-2.5 flex items-center justify-between gap-2 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div
                onClick={() => handleItemClick('profile')}
                className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1"
                title="View Creator Profile"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-xs shrink-0">
                    {(currentUser.displayName || currentUser.email || 'C')[0].toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col truncate">
                  <span className="font-sans font-bold text-xs truncate text-slate-900 dark:text-white">
                    {currentUser.displayName || 'Brooklyn'}
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                    Pro trial
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
              className={`rounded-2xl border p-2.5 flex items-center justify-between gap-2 ${
                isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900'
              }`}
            >
              <div
                onClick={() => handleItemClick('profile')}
                className="flex items-center gap-2.5 overflow-hidden cursor-pointer flex-1"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-white font-bold text-xs shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="flex flex-col truncate">
                  <span className="font-sans font-bold text-xs truncate text-slate-900 dark:text-white">
                    Guest Creator
                  </span>
                  <span className="font-mono text-[10px] text-amber-500">
                    Sign in required
                  </span>
                </div>
              </div>

              {onSignIn && (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-sans text-xs font-bold hover:bg-indigo-700 transition cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          )
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => handleItemClick('profile')}
              className="h-8 w-8 rounded-full flex items-center justify-center bg-indigo-600 text-white font-bold text-xs cursor-pointer"
              title="Creator Profile"
            >
              {currentUser ? (currentUser.displayName || 'C')[0].toUpperCase() : <User className="h-4 w-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 transition-all duration-300 border-r h-screen sticky top-0 ${
          isLight ? 'border-slate-200/80 bg-slate-50/50' : 'border-slate-800/80 bg-slate-950'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div
            className={`relative flex w-80 max-w-[85vw] h-full flex-col shadow-2xl transition-transform duration-300 ${
              isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'
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
  const items = [
    { id: 'overview' as NavView, label: 'Home', icon: LayoutDashboard },
    { id: 'scanner' as NavView, label: 'Scanner', icon: FileVideo },
    { id: 'channels' as NavView, label: 'Tracker', icon: Youtube },
    { id: 'analytics' as NavView, label: 'Health', icon: Activity },
    { id: 'violations' as NavView, label: 'Flags', icon: AlertTriangle, badge: violationsCount > 0 ? violationsCount : null },
    { id: 'profile' as NavView, label: 'Profile', icon: User },
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 flex md:hidden items-center justify-around border-t px-2 py-2 pb-safe backdrop-blur-md shadow-lg ${
      isLight ? 'border-slate-200 bg-white/95 text-slate-900' : 'border-slate-800 bg-slate-950/95 text-slate-100'
    }`}>
      {items.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition relative cursor-pointer ${
              isActive ? 'text-red-600 dark:text-rose-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] mt-0.5">{item.label}</span>
            {item.badge && (
              <span className="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
