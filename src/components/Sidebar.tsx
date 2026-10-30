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
  User,
  Plus,
  X,
  Youtube,
  CreditCard,
  Star,
  MessageSquare,
  Scale,
  Sparkles,
  Zap,
  Lock,
} from 'lucide-react';
import { ColorTheme, ColorThemeId } from '../types/audit';
import { SubscriptionTier } from '../services/subscriptionManager';
import { isUserSuperAdmin } from '../services/adminService';

export type NavView =
  | 'overview'
  | 'scanner'
  | 'explore'
  | 'channels'
  | 'analytics'
  | 'violations'
  | 'appeal'
  | 'knowledge'
  | 'content-hub'
  | 'reviews'
  | 'my-reviews'
  | 'ai-specs'
  | 'profile'
  | 'subscription'
  | 'admin'
  | 'legal';

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
  strictnessMode?: 'STANDARD' | 'PARANOID_ZERO_RISK';
  onToggleStrictness?: (mode: 'STANDARD' | 'PARANOID_ZERO_RISK') => void;
  currentTheme?: ColorThemeId;
  onSelectTheme?: (theme: ColorThemeId) => void;
  currentUser?: SidebarUser | null;
  onSignIn?: () => void;
  onRegister?: () => void;
  onSignOut?: () => void;
  onScanNewVideo?: () => void;
  onOpenCompare?: () => void;
  currentTier?: SubscriptionTier;
  remainingFreeScans?: number;
  onOpenPricing?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  isCollapsed,
  onToggleCollapse,
  isOpenMobile = false,
  onCloseMobile,
  violationsCount,
  avgComplianceScore,
  pendingQueueCount = 0,
  currentUser,
  onScanNewVideo,
  currentTier = 'free',
  remainingFreeScans = 5,
  onOpenPricing,
}) => {
  const isSuperAdmin = isUserSuperAdmin(currentUser?.email);

  const handleItemClick = (id: NavView) => {
    onSelectView(id);
    if (isOpenMobile && onCloseMobile) {
      onCloseMobile();
    }
  };

  const mainNavItems = [
    {
      id: 'overview' as NavView,
      label: 'Home Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'scanner' as NavView,
      label: 'Video Scanner',
      icon: FileVideo,
      badge: pendingQueueCount > 0 ? `${pendingQueueCount}` : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    },
    {
      id: 'channels' as NavView,
      label: 'Channel Tracker',
      icon: Youtube,
    },
    {
      id: 'violations' as NavView,
      label: 'Policy Flags & Cuts',
      icon: AlertTriangle,
      badge: violationsCount > 0 ? `${violationsCount}` : null,
      badgeColor: 'bg-red-500 text-white font-bold',
    },
    {
      id: 'appeal' as NavView,
      label: 'Strike Appeal Kit',
      icon: FileText,
    },
    {
      id: 'analytics' as NavView,
      label: 'Channel Health',
      icon: Activity,
    },
  ];

  const communityNavItems = [
    {
      id: 'knowledge' as NavView,
      label: 'Policy Guide',
      icon: BookOpen,
    },
    {
      id: 'reviews' as NavView,
      label: 'Creator Reviews',
      icon: Star,
      badge: '4.9★',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'my-reviews' as NavView,
      label: 'My Reviews',
      icon: MessageSquare,
    },
  ];

  const accountNavItems = [
    {
      id: 'subscription' as NavView,
      label: 'Pricing & Plans',
      icon: CreditCard,
      badge:
        currentTier === 'enterprise'
          ? 'AGENCY'
          : currentTier === 'pro'
          ? 'PRO'
          : `${remainingFreeScans}/5 Free`,
      badgeColor:
        currentTier === 'pro'
          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
          : 'bg-slate-800 text-slate-300',
    },
    {
      id: 'legal' as NavView,
      label: 'Trust & FAQ Hub',
      icon: Scale,
    },
    {
      id: 'profile' as NavView,
      label: 'Creator Profile',
      icon: User,
      badge: currentUser ? (isSuperAdmin ? 'ADMIN' : 'PRO') : null,
      badgeColor: isSuperAdmin ? 'bg-red-600 text-white font-bold' : 'bg-emerald-500 text-slate-950 font-bold',
    },
    ...(isSuperAdmin
      ? [
          {
            id: 'admin' as NavView,
            label: 'Mission Control',
            icon: ShieldCheck,
            badge: 'SUPERADMIN',
            badgeColor: 'bg-red-600 text-white font-bold',
          },
        ]
      : []),
  ];

  const renderNavGroup = (title: string, items: typeof mainNavItems, isDrawer: boolean) => (
    <div className="flex flex-col gap-1">
      {(!isCollapsed || isDrawer) && (
        <span className="px-3 pt-2 pb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {title}
        </span>
      )}
      {items.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleItemClick(item.id)}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition cursor-pointer text-left ${
              isActive
                ? 'bg-[#10b981]/15 text-[#10b981] font-bold border border-[#10b981]/30 shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-emerald-950/40'
            }`}
            title={item.label}
          >
            <Icon
              className={`h-4 w-4 shrink-0 transition ${
                isActive ? 'text-[#10b981]' : 'text-slate-400'
              }`}
            />

            {(!isCollapsed || isDrawer) && (
              <span className="flex-1 truncate">{item.label}</span>
            )}

            {(!isCollapsed || isDrawer) && item.badge && (
              <span
                className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold ${
                  item.badgeColor || 'bg-slate-800 text-slate-300'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const sidebarContent = (isDrawer = false) => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-none justify-between">
      {/* Top Section */}
      <div className="flex flex-col gap-3">
        {/* Top Header / Close / Collapse */}
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-emerald-950/60">
          {isDrawer ? (
            <>
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Striku"
                  className="h-6 w-6 rounded-lg object-contain bg-emerald-950/60 p-0.5 border border-emerald-500/30"
                />
                <span className="font-display font-black text-sm uppercase text-white tracking-tight">
                  STRIKU<span className="text-[#10b981]">.CLOUD</span>
                </span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/30 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              {!isCollapsed && (
                <div className="flex items-center gap-2 pl-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Workspace
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={onToggleCollapse}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-950/40 text-slate-400 hover:text-white transition cursor-pointer ${
                  isCollapsed ? 'mx-auto' : ''
                }`}
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-3.5 w-3.5" />
                ) : (
                  <ChevronLeft className="h-3.5 w-3.5" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Primary Call to Action: Check Video */}
        {(!isCollapsed || isDrawer) ? (
          <div className="px-3">
            <button
              type="button"
              onClick={() => {
                if (onScanNewVideo) {
                  onScanNewVideo();
                } else {
                  handleItemClick('scanner');
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-sans text-xs font-bold py-2.5 px-3 shadow-md transition cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
              <span>Check Video Now</span>
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
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-slate-950 shadow-md hover:scale-105 transition cursor-pointer"
              title="Check Video Now"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="px-3 flex flex-col gap-3">
          {renderNavGroup('Navigation', mainNavItems, isDrawer)}
          {renderNavGroup('Community & Rules', communityNavItems, isDrawer)}
          {renderNavGroup('Account & Trust', accountNavItems, isDrawer)}
        </nav>
      </div>

      {/* Bottom Section: Clean Plan Status Card */}
      {(!isCollapsed || isDrawer) && (
        <div className="p-3 border-t border-emerald-950/60 flex flex-col gap-2 mt-4">
          <div className="rounded-2xl border border-emerald-900/40 bg-black/40 p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/20 text-[#10b981]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-slate-400 uppercase font-bold">
                    Current Plan
                  </span>
                  <span className="font-display text-xs font-black text-white">
                    {currentTier === 'enterprise'
                      ? 'Agency ($80/mo)'
                      : currentTier === 'pro'
                      ? 'Creator Pro ($29/mo)'
                      : `Free (${remainingFreeScans}/5 Scans)`}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenPricing || (() => handleItemClick('subscription'))}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 font-sans text-xs font-bold py-2 px-3 transition cursor-pointer"
            >
              <Zap className="h-3 w-3 text-[#10b981]" />
              <span>
                {currentTier === 'free' ? 'Upgrade to Pro ($29)' : 'Manage Subscription'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-mono pt-1">
            <Lock className="h-3 w-3 text-[#10b981]" />
            <span>Zero Video Storage Privacy</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-white/20 text-slate-100 backdrop-blur-xl transition-all duration-300 select-none ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
        style={{
          backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'left center',
        }}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile Drawer (When Opened on Mobile) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Panel */}
          <div
            className="relative flex w-72 max-w-[85vw] flex-col border-r border-white/20 text-slate-100 shadow-2xl z-10 backdrop-blur-2xl"
            style={{
              backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};

export interface MobileBottomNavProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  theme?: ColorTheme;
  violationsCount?: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  violationsCount = 0,
}) => {
  const items = [
    { id: 'overview' as NavView, label: 'Home', icon: LayoutDashboard },
    { id: 'scanner' as NavView, label: 'Scanner', icon: FileVideo },
    { id: 'channels' as NavView, label: 'Tracker', icon: Youtube },
    { id: 'knowledge' as NavView, label: 'Policies', icon: BookOpen },
    {
      id: 'violations' as NavView,
      label: 'Flags',
      icon: AlertTriangle,
      badge: violationsCount > 0 ? violationsCount : null,
    },
    { id: 'profile' as NavView, label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-3.5 left-1/2 -translate-x-1/2 z-50 flex md:hidden items-center justify-between gap-1 sm:gap-2 px-3 py-2 rounded-full backdrop-blur-2xl bg-black/40 border border-white/30 shadow-[0_16px_40px_rgba(0,0,0,0.5),0_0_25px_rgba(56,189,248,0.22)] max-w-[95vw] w-fit"
      style={{
        backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {items.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              onSelectView(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative flex flex-col items-center justify-center px-1.5 sm:px-2 py-0.5 group cursor-pointer transition-all duration-300"
            title={item.label}
            aria-label={item.label}
          >
            <div
              className={`flex items-center justify-center transition-all duration-300 ${
                isActive
                  ? 'w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(56,189,248,0.75),0_4px_14px_rgba(0,0,0,0.45)] scale-105 -translate-y-1'
                  : 'w-10 h-10 rounded-full text-slate-300/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
            </div>

            <span
              className={`text-[9px] font-medium tracking-tight transition-colors duration-200 -mt-0.5 ${
                isActive ? 'text-sky-300 font-bold' : 'text-slate-400 group-hover:text-slate-200'
              }`}
            >
              {item.label}
            </span>

            {item.badge && (
              <span className="absolute -top-1 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-md ring-2 ring-slate-950">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
};

