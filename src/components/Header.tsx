import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Bell,
  Sparkles,
  Lock,
  Building2,
  Zap,
  CheckCircle2,
  FileVideo,
  LayoutDashboard,
  Youtube,
  Star,
  Scale,
  LogOut,
  User,
  Plus,
  ShieldCheck,
  ChevronDown,
  X,
  CreditCard,
} from 'lucide-react';
import { ColorThemeId } from '../types/audit';
import { COLOR_THEMES } from '../services/themeConfig';
import { SubscriptionTier } from '../services/subscriptionManager';
import { NavView } from './Sidebar';

export interface HeaderUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface HeaderProps {
  currentTheme: ColorThemeId;
  currentUser?: HeaderUser | null;
  currentTier?: SubscriptionTier;
  remainingFreeScans?: number;
  currentView?: NavView;
  onNavigate?: (view: NavView) => void;
  onScanNewVideo?: () => void;
  onOpenPricing?: () => void;
  onNavigateProfile?: () => void;
  onToggleMobileSidebar?: () => void;
  onSignIn?: () => void;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  currentUser,
  currentTier = 'free',
  remainingFreeScans = 5,
  currentView = 'overview',
  onNavigate,
  onScanNewVideo,
  onOpenPricing,
  onNavigateProfile,
  onToggleMobileSidebar,
  onSignIn,
  onSignOut,
}) => {
  const [logoError, setLogoError] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 'notif-1',
      title: 'YouTube 2026 Guidelines Synced',
      time: 'Just now',
      desc: 'Content ID & community safety rules active for pre-upload audit.',
      isNew: true,
    },
    {
      id: 'notif-2',
      title: 'Zero-Video Retention Active',
      time: '12m ago',
      desc: 'RAM-only temporary video processing enabled. 100% private.',
      isNew: true,
    },
    {
      id: 'notif-3',
      title: 'CapCut Safe Cut Export Ready',
      time: '1h ago',
      desc: 'Precision millisecond timecode export is available for all audits.',
      isNew: false,
    },
  ];

  const quickNavItems: { id: NavView; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Scanner', icon: FileVideo },
    { id: 'channels', label: 'Tracker', icon: Youtube },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'legal', label: 'Trust & FAQ', icon: Scale },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full border-b border-white/20 text-slate-100 font-sans shadow-md backdrop-blur-md"
      style={{
        backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
      }}
    >
      <div className="flex w-full items-center justify-between px-3 sm:px-6 py-2.5 gap-2 sm:gap-4">
        {/* Left Section: Sidebar Toggle + Brand Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 hover:bg-black/60 border border-white/25 text-white transition cursor-pointer"
              title="Toggle Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}

          {/* Logo (navigates to overview / Home) */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('overview')}
            className="flex items-center gap-3 group cursor-pointer text-left"
            title="Go to Home"
          >
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Striku Logo"
                onError={() => setLogoError(true)}
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl object-contain bg-black/40 border border-white/25 p-1.5 group-hover:border-sky-400 transition shadow-md"
              />
            ) : (
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-black/40 border border-white/25 text-sky-400 group-hover:border-sky-400 transition shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>
            )}

            <div className="flex flex-col">
              <span className="hidden sm:inline font-sans text-[10px] uppercase tracking-wider text-slate-200 drop-shadow-xs font-bold">
                YouTube Pre-Check
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Glass Capsule Pill */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1 rounded-full backdrop-blur-2xl bg-black/40 border border-white/30 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.45),0_0_20px_rgba(56,189,248,0.2)]"
          style={{
            backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {quickNavItems.map((item) => {
            const isActive = currentView === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white font-bold shadow-[0_0_18px_rgba(56,189,248,0.7),0_2px_8px_rgba(0,0,0,0.4)] scale-[1.03]'
                    : 'text-slate-300/85 hover:text-white hover:bg-white/10'
                }`}
                title={item.label}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section: Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Check/Scan Video Button */}
          <button
            type="button"
            onClick={() => {
              if (onScanNewVideo) {
                onScanNewVideo();
              } else if (onNavigate) {
                onNavigate('scanner');
              }
            }}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 px-3 py-1.5 text-xs font-bold transition shadow-md shadow-emerald-950/50 cursor-pointer active:scale-95"
            title="Scan a Video Now"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Check Video</span>
          </button>

          {/* Subscription Tier / Quota Button */}
          {onOpenPricing && (
            currentTier === 'free' ? (
              <button
                type="button"
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/40 hover:border-emerald-400 px-2.5 sm:px-3 py-1 text-xs font-semibold text-emerald-300 transition cursor-pointer shadow-xs active:scale-95"
                title="View Subscription Plans"
              >
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] font-mono hidden xs:inline">
                  {remainingFreeScans > 0 ? `${remainingFreeScans}/5 Free` : '0/5 Left'}
                </span>
                <span className="rounded-full bg-emerald-500 text-slate-950 px-2 py-0.2 text-[9px] sm:text-[10px] font-bold">
                  Upgrade
                </span>
              </button>
            ) : currentTier === 'pro' ? (
              <button
                type="button"
                onClick={onOpenPricing}
                className="flex items-center gap-1.5 rounded-full border border-emerald-500/60 bg-emerald-950/60 hover:bg-emerald-900/50 px-3 py-1 text-xs font-bold text-emerald-300 transition cursor-pointer shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5 text-[#10b981] fill-current" />
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

          {/* Operational Shield Status Chip */}
          <div
            className="hidden lg:flex items-center gap-1.5 rounded-full px-3 py-1 border border-emerald-900/60 bg-emerald-950/40 text-emerald-300 text-xs font-semibold"
            title="Pre-upload scans processed in private RAM. Never stored."
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">0-Data Retention</span>
          </div>

          {/* Operational Shield Status Chip */}
          <div
            className="hidden lg:flex items-center gap-1.5 rounded-full px-3 py-1 border border-emerald-900/60 bg-emerald-950/40 text-emerald-300 text-xs font-semibold"
            title="Pre-upload scans processed in private RAM. Never stored."
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">0-Data Retention</span>
          </div>
        </div>
      </div>
    </header>
  );
};
