import React from 'react';
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
} from 'lucide-react';
import { ColorTheme } from '../types/audit';

export type NavView = 'overview' | 'scanner' | 'analytics' | 'violations' | 'appeal' | 'knowledge' | 'profile';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  theme: ColorTheme;
  violationsCount: number;
  avgComplianceScore: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  theme,
  violationsCount,
  avgComplianceScore,
}) => {
  const isLight = theme.isLight;

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
      badge: null,
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
      description: 'EDSA legal counter-appeal',
      icon: FileText,
      badge: null,
    },
    {
      id: 'knowledge' as NavView,
      label: 'Policy Encyclopedia',
      description: 'YouTube community guidelines',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'profile' as NavView,
      label: 'Creator Profile',
      description: 'Cloud scans & account',
      icon: User,
      badge: null,
    },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r transition-all duration-200 shrink-0 sticky top-[61px] h-[calc(100vh-61px)] z-30 ${
        isCollapsed ? 'w-18' : 'w-64'
      } ${
        isLight
          ? 'border-slate-200/80 bg-white text-slate-800'
          : 'border-slate-800/80 bg-slate-950 text-slate-200'
      }`}
    >
      {/* Sidebar Header & Collapse Toggle */}
      <div
        className={`flex items-center justify-between px-3.5 py-3 border-b ${
          isLight ? 'border-slate-200/80' : 'border-slate-800/80'
        }`}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2 overflow-hidden">
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Creator Studio
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`flex h-8 w-8 items-center justify-center rounded-xl border transition ${
            isLight
              ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600'
              : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation Items List */}
      <nav className="flex-1 overflow-y-auto p-2.5 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-xs font-semibold transition relative group ${
                isActive
                  ? isLight
                    ? 'bg-red-50 text-red-700 shadow-xs ring-1 ring-red-200 font-bold'
                    : 'bg-rose-950/60 text-white shadow-xs ring-1 ring-rose-500/40 font-bold'
                  : isLight
                  ? 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
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

              {!isCollapsed && (
                <div className="flex-1 text-left truncate flex flex-col">
                  <span className="truncate">{item.label}</span>
                </div>
              )}

              {!isCollapsed && item.badge && (
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

      {/* Sidebar Footer info */}
      {!isCollapsed && (
        <div
          className={`p-3.5 border-t text-xs ${
            isLight
              ? 'border-slate-200/80 bg-slate-50/70 text-slate-600'
              : 'border-slate-800/80 bg-slate-950/90 text-slate-400'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-body text-[11px] font-semibold text-slate-500">
              Channel Standing:
            </span>
            <span className="font-mono text-xs font-bold text-emerald-600 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Good (0 Strikes)
            </span>
          </div>
          <p className="font-body text-[10px] text-slate-400">
            Automated Ingestion Pre-Check Active
          </p>
        </div>
      )}
    </aside>
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

  const mobileItems = [
    { id: 'overview' as NavView, label: 'Overview', icon: LayoutDashboard },
    { id: 'scanner' as NavView, label: 'Scanner', icon: FileVideo },
    { id: 'analytics' as NavView, label: 'Health', icon: Activity },
    {
      id: 'violations' as NavView,
      label: 'Flags',
      icon: AlertTriangle,
      badge: violationsCount > 0 ? violationsCount : null,
    },
    { id: 'appeal' as NavView, label: 'Appeal', icon: FileText },
    { id: 'knowledge' as NavView, label: 'Policies', icon: BookOpen },
    { id: 'profile' as NavView, label: 'Profile', icon: User },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t flex items-center justify-around px-1 py-1 transition-colors duration-200 backdrop-blur-md shadow-lg ${
        isLight
          ? 'border-slate-200/90 bg-white/95 text-slate-800'
          : 'border-slate-800/90 bg-slate-950/95 text-slate-200'
      }`}
    >
      {mobileItems.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => onSelectView(item.id)}
            className={`flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-1 rounded-xl transition relative ${
              isActive
                ? isLight
                  ? 'text-red-600 font-bold'
                  : 'text-rose-400 font-bold'
                : isLight
                ? 'text-slate-500 hover:text-slate-900 font-medium'
                : 'text-slate-400 hover:text-slate-200 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className="h-4.5 w-4.5" />
              {item.badge && (
                <span className="absolute -top-1 -right-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 font-mono text-[8px] font-bold text-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="font-body text-[10px] mt-0.5 tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
