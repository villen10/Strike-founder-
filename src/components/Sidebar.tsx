import React, { useState } from 'react';
import {
  Compass,
  Clapperboard,
  Tv,
  ShieldAlert,
  FileCode,
  LineChart,
  BookMarked,
  MessageCircle,
  Crown,
  UserCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
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
      icon: Compass,
    },
    {
      id: 'scanner' as NavView,
      label: 'Video Scanner',
      icon: Clapperboard,
      badge: pendingQueueCount > 0 ? `${pendingQueueCount}` : null,
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold',
    },
    {
      id: 'channels' as NavView,
      label: 'Channel Tracker',
      icon: Tv,
    },
    {
      id: 'violations' as NavView,
      label: 'Policy Flags & Cuts',
      icon: ShieldAlert,
      badge: violationsCount > 0 ? `${violationsCount}` : null,
      badgeColor: 'bg-red-500 text-white font-bold',
    },
    {
      id: 'appeal' as NavView,
      label: 'Strike Appeal Kit',
      icon: FileCode,
    },
    {
      id: 'analytics' as NavView,
      label: 'Channel Health',
      icon: LineChart,
    },
  ];

  const communityNavItems = [
    {
      id: 'knowledge' as NavView,
      label: 'Policy Guide',
      icon: BookMarked,
    },
    {
      id: 'reviews' as NavView,
      label: 'Creator Reviews',
      icon: Sparkles,
      badge: '4.9★',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'my-reviews' as NavView,
      label: 'My Reviews',
      icon: MessageCircle,
    },
  ];

  const accountNavItems = [
    {
      id: 'subscription' as NavView,
      label: 'Pricing & Plans',
      icon: Crown,
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
      icon: UserCircle,
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
        <span className="px-3 pt-2 pb-1 font-sans text-[10px] font-bold uppercase tracking-wider text-slate-800">
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
            className={`w-full flex items-center gap-3.5 px-3 py-2 text-xs font-semibold transition-all duration-300 cursor-pointer text-left rounded-xl ${
              isActive
                ? 'bg-blue-600/15 text-blue-700 font-bold'
                : 'bg-transparent text-slate-950 hover:text-blue-600 hover:bg-black/5'
            }`}
            title={item.label}
          >
            <Icon className={`h-4 w-4 shrink-0 transition ${isActive ? 'text-blue-600 stroke-[2.4]' : 'text-slate-800 stroke-[1.8]'}`} />

            {(!isCollapsed || isDrawer) && (
              <span className={`flex-1 font-sans truncate transition-colors ${isActive ? 'text-blue-700 font-bold text-xs' : 'text-slate-950 hover:text-black font-bold text-xs'}`}>
                {item.label}
              </span>
            )}

            {(!isCollapsed || isDrawer) && item.badge && (
              <span
                className={`rounded-full px-2.5 py-0.5 font-sans text-[9px] font-bold ${
                  item.badgeColor || 'bg-slate-200 text-slate-900'
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
        <div className="flex items-center justify-between px-3.5 py-3 border-b border-sky-900/40">
          {isDrawer ? (
            <>
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Striku"
                  className="h-11 w-11 rounded-2xl object-contain bg-white/60 p-1 border border-sky-500/30 shadow-md"
                />
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-950/50 hover:bg-sky-900/60 border border-sky-500/30 text-slate-300 hover:text-white transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              {!isCollapsed && (
                <div className="flex items-center gap-2 pl-1">
                  <span className="font-sans text-[10px] uppercase tracking-wider text-sky-400 font-bold">
                    Workspace
                  </span>
                </div>
              )}
              <button
                type="button"
                onClick={onToggleCollapse}
                className={`flex h-7 w-7 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-950/40 text-sky-400 hover:text-white transition cursor-pointer ${
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
          <div className="px-3 pt-2">
            <button
              type="button"
              onClick={() => {
                if (onScanNewVideo) {
                  onScanNewVideo();
                } else {
                  handleItemClick('scanner');
                }
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-sans text-xs font-bold py-2.5 px-3 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition cursor-pointer"
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
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-sky-500 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:scale-105 transition cursor-pointer"
              title="Check Video Now"
            >
              <Plus className="h-4 w-4 stroke-[3]" />
            </button>
          </div>
        )}

        {/* Navigation Sections */}
        <nav className="px-3 flex flex-col gap-3 pt-2">
          {renderNavGroup('Navigation', mainNavItems, isDrawer)}
          {renderNavGroup('Community & Rules', communityNavItems, isDrawer)}
          {renderNavGroup('Account & Trust', accountNavItems, isDrawer)}
        </nav>
      </div>

      {/* Bottom Section: Clean Plan Status Card */}
      {(!isCollapsed || isDrawer) && (
        <div className="p-3 border-t border-sky-900/40 flex flex-col gap-2 mt-4">
          <div className="rounded-2xl border border-sky-500/30 bg-sky-950/40 backdrop-blur-md p-3.5 flex flex-col gap-2 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-sans text-[9px] text-sky-300 uppercase font-bold tracking-wider">
                    Current Plan
                  </span>
                  <span className="font-sans text-xs font-extrabold text-white">
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
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-blue-600/40 hover:bg-blue-600/60 border border-sky-400/40 text-sky-200 font-sans text-xs font-bold py-2 px-3 transition cursor-pointer shadow-xs"
            >
              <Zap className="h-3 w-3 text-sky-400" />
              <span>
                {currentTier === 'free' ? 'Upgrade to Pro ($29)' : 'Manage Subscription'}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-sky-300 font-sans pt-1">
            <Lock className="h-3 w-3 text-sky-400" />
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




