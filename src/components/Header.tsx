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

          {/* Logo & Brand Name (navigates to overview / Home) */}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('overview')}
            className="flex items-center gap-2.5 group cursor-pointer text-left"
            title="Go to Home"
          >
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Striku Logo"
                onError={() => setLogoError(true)}
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl object-contain bg-black/40 border border-white/25 p-1 group-hover:border-emerald-400 transition"
              />
            ) : (
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-black/40 border border-white/25 text-[#10b981] group-hover:border-emerald-400 transition">
                <ShieldCheck className="h-5 w-5" />
              </div>
            )}

            <div className="flex flex-col">
              <span className="font-display font-black text-sm sm:text-base tracking-tight text-white uppercase group-hover:text-emerald-300 transition drop-shadow-sm">
                STRIKU<span className="text-[#10b981]">.CLOUD</span>
              </span>
              <span className="hidden sm:inline font-mono text-[9px] uppercase tracking-wider text-slate-200 drop-shadow-xs -mt-1">
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

          {/* Notifications Dropdown Container */}
          <div className="relative" ref={notificationRef}>
            <button
              type="button"
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
                setUnreadCount(0);
              }}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 text-slate-300 hover:text-white transition cursor-pointer relative"
              title="System Notifications"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-[#10b981] ring-2 ring-[#061311]" />
              )}
            </button>

            {/* Notification Dropdown Menu */}
            {isNotificationOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-emerald-900/60 bg-[#061311] text-slate-200 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(16, 185, 129, 0.04) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(16, 185, 129, 0.04) 1px, transparent 1px)
                  `,
                  backgroundSize: '24px 24px',
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-emerald-950/80 mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#10b981]" />
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-white">
                      Notifications &amp; Status
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsNotificationOpen(false)}
                    className="text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2.5 rounded-xl bg-black/40 border border-emerald-950/80 hover:border-emerald-800/40 transition"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {n.isNew && <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />}
                          {n.title}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-emerald-950/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> System 100% Operational
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('legal');
                      setIsNotificationOpen(false);
                    }}
                    className="text-slate-300 hover:text-[#10b981] transition cursor-pointer"
                  >
                    Trust Hub →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Auth Container */}
          {currentUser ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-1.5 p-1 rounded-full border border-emerald-500/30 hover:border-emerald-400 transition cursor-pointer bg-emerald-950/40"
                title="Account menu"
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="h-7 w-7 rounded-full object-cover ring-1 ring-emerald-500"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-slate-950 font-bold text-xs">
                    {(currentUser.displayName || currentUser.email || 'C')[0].toUpperCase()}
                  </div>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 mr-1" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-emerald-900/60 bg-[#061311] text-slate-200 shadow-2xl p-2 z-50">
                  <div className="px-3 py-2 border-b border-emerald-950/80 mb-1">
                    <p className="font-bold text-xs text-white truncate">
                      {currentUser.displayName || 'Creator'}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigateProfile) onNavigateProfile();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-emerald-950/60 hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    <User className="h-3.5 w-3.5" />
                    <span>Creator Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) onNavigate('my-reviews');
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-emerald-950/60 hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    <Star className="h-3.5 w-3.5" />
                    <span>My Reviews</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPricing) onOpenPricing();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-emerald-950/60 hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Subscription Plans</span>
                  </button>

                  {onSignOut && (
                    <div className="pt-1 mt-1 border-t border-emerald-950/80">
                      <button
                        type="button"
                        onClick={() => {
                          onSignOut();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl text-rose-400 hover:bg-rose-950/40 transition cursor-pointer text-left"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignIn}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/60 hover:border-emerald-400 text-white px-3 py-1.5 text-xs font-semibold transition cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-[#10b981]" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
