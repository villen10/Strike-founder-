import React from 'react';
import {
  ShieldCheck,
  Menu,
  Bell,
  Search,
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
  currentTheme: ColorThemeId;
  currentUser?: HeaderUser | null;
  onNavigateProfile?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTheme,
  currentUser,
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
        {/* Left Side: Brand Logo Banner + Mobile Menu Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Brand Logo Banner */}
          <div className="flex h-9 w-32 sm:h-11 sm:w-40 items-center justify-start shrink-0">
            <img
              src="https://lh3.googleusercontent.com/d/1wD4MS3OLJmAjuuAy1OueuNM2EFW7TYCI"
              alt="Striku Logo"
              className="h-full w-full object-contain object-left"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* Mobile Hamburger Toggle for Sidebar */}
          {onToggleMobileSidebar && (
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className={`md:hidden flex h-9 w-9 items-center justify-center rounded-xl border transition cursor-pointer ${
                isLight
                  ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  : 'border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300'
              }`}
              title="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>



        {/* Right Side: Clean Status Bar & Quick Profile Avatar (No clustered buttons!) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Active Protection Chip */}
          <div
            className={`hidden sm:flex items-center gap-1.5 rounded-full px-3 py-1 border text-xs font-semibold ${
              isLight
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-emerald-800/80 bg-emerald-950/50 text-emerald-300'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Active Protection</span>
          </div>

          {/* Quick Notification Bell (Matching Image 2 Header) */}
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
