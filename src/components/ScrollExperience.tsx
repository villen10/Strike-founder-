import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  Sparkles,
  ChevronDown,
  Zap,
  Scissors,
  Scale,
  Play,
  ShieldCheck,
  ShieldAlert,
  ChevronUp,
} from 'lucide-react';

/**
 * Sleek, high-performance scroll progress bar at the very top of the viewport.
 */
export const ScrollProgressBar: React.FC<{ isLight?: boolean }> = ({ isLight = false }) => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3.5px] bg-gradient-to-r from-red-600 via-rose-500 to-amber-400 origin-left z-[100] pointer-events-none shadow-[0_0_14px_rgba(244,63,94,0.8)]"
    />
  );
};

export type HeavyAnimationDirection =
  | 'bottom-left-rotate' // Ghuma kar bottom-left se aye
  | 'bottom-right-rotate' // Ghuma kar bottom-right se aye
  | 'bottom' // Nicha se uthe
  | 'up' // Alias for bottom
  | 'right' // Right side se swoosh
  | 'left' // Left side se swoosh
  | 'pop-rotate' // Scale + rotate pop
  | 'tilt-3d' // 3D perspective entrance
  | 'none';

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: HeavyAnimationDirection;
  className?: string;
  duration?: number;
  once?: boolean;
}

/**
 * Heavy, high-impact scroll reveal container.
 * Supports bottom-left rotation, bottom-rise, right swoop, and custom easing curves.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'bottom-left-rotate',
  className = '',
  duration = 0.65,
  once = true,
}) => {
  const getInitial = () => {
    switch (direction) {
      case 'bottom-left-rotate':
        return {
          opacity: 0,
          x: -70,
          y: 75,
          rotate: -12,
          scale: 0.9,
          filter: 'blur(6px)',
        };
      case 'bottom-right-rotate':
        return {
          opacity: 0,
          x: 70,
          y: 75,
          rotate: 12,
          scale: 0.9,
          filter: 'blur(6px)',
        };
      case 'bottom':
      case 'up':
        return {
          opacity: 0,
          y: 80,
          scale: 0.94,
          filter: 'blur(4px)',
        };
      case 'right':
        return {
          opacity: 0,
          x: 85,
          y: 15,
          rotate: 4,
          scale: 0.95,
          filter: 'blur(4px)',
        };
      case 'left':
        return {
          opacity: 0,
          x: -85,
          y: 15,
          rotate: -4,
          scale: 0.95,
          filter: 'blur(4px)',
        };
      case 'pop-rotate':
        return {
          opacity: 0,
          scale: 0.76,
          rotate: -10,
          y: 40,
        };
      case 'tilt-3d':
        return {
          opacity: 0,
          y: 60,
          rotateX: 25,
          scale: 0.92,
        };
      case 'none':
      default:
        return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        rotateX: 0,
        scale: 1,
        filter: 'blur(0px)',
      }}
      viewport={{ once, margin: '-40px' }}
      transition={{
        duration,
        delay,
        type: 'spring',
        damping: 18,
        stiffness: 90,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated Typography Font Reveal:
 * Brings in headings and text labels smoothly as you scroll down.
 */
export const ScrollTextReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: 'bottom' | 'bottom-left' | 'right';
}> = ({ children, delay = 0, className = '', from = 'bottom' }) => {
  const getInitial = () => {
    if (from === 'bottom-left') {
      return { opacity: 0, x: -35, y: 35, rotate: -4 };
    }
    if (from === 'right') {
      return { opacity: 0, x: 45, y: 0 };
    }
    return { opacity: 0, y: 28, scale: 0.97 };
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Animated Button Reveal:
 * Buttons pop up with a slight bounce and rotate as you scroll to them.
 */
export const ScrollButtonReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'bottom' | 'bottom-left' | 'right';
}> = ({ children, delay = 0.1, className = '', direction = 'bottom-left' }) => {
  const initial =
    direction === 'bottom-left'
      ? { opacity: 0, x: -30, y: 30, rotate: -8, scale: 0.9 }
      : direction === 'right'
      ? { opacity: 0, x: 35, y: 20, rotate: 6, scale: 0.9 }
      : { opacity: 0, y: 35, scale: 0.88 };

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        type: 'spring',
        stiffness: 160,
        damping: 14,
        delay,
      }}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Floating Scroll Action Dock:
 * As user scrolls, this bottom dock smoothly fades in with fonts and buttons.
 * Fades out when scrolled back to the top.
 */
interface FloatingScrollHUDProps {
  isLight?: boolean;
  videoTitle?: string;
  safetyGrade?: string;
  onScanClick: () => void;
  onCutSheetClick: () => void;
  onCompareClick: () => void;
  onSampleClick: () => void;
}

export const FloatingScrollHUD: React.FC<FloatingScrollHUDProps> = ({
  isLight = false,
  videoTitle = 'Studio Active Video',
  safetyGrade,
  onScanClick,
  onCutSheetClick,
  onCompareClick,
  onSampleClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      setScrollPct(pct);
      // Appear once scrolled past 140px, fade out if near the top
      setIsVisible(scrollTop > 140);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: 60, scale: 0.92, rotate: 2 }}
          transition={{
            type: 'spring',
            stiffness: 140,
            damping: 18,
          }}
          className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[94vw] sm:max-w-xl md:max-w-2xl w-full pointer-events-auto"
        >
          <div
            className={`relative flex items-center justify-between gap-3 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all ${
              isLight
                ? 'bg-white/92 border-slate-200 text-slate-800 shadow-slate-300/80 ring-1 ring-slate-900/5'
                : 'bg-slate-950/90 border-slate-800 text-white shadow-black/90 ring-1 ring-rose-500/20'
            }`}
          >
            {/* Left: Animated Status Font / Info */}
            <div className="flex items-center gap-2.5 min-w-0 pr-1">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-md shadow-red-900/30">
                <Zap className="h-4 w-4 animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10px] font-black uppercase tracking-wider text-rose-500">
                    STRIKU ENGINE
                  </span>
                  <span className="font-mono text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800/80 text-slate-300 hidden sm:inline-block">
                    {scrollPct}% scroll
                  </span>
                </div>
                <span
                  className="font-sans text-xs font-semibold truncate max-w-[140px] sm:max-w-[200px]"
                  title={videoTitle}
                >
                  {videoTitle}
                </span>
              </div>
            </div>

            {/* Right: Animated Action Buttons ("botton") */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Scan Video Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onScanClick}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-3 py-1.5 text-xs font-bold shadow-md shadow-rose-900/30 cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Scan Video</span>
                <span className="xs:hidden">Scan</span>
              </motion.button>

              {/* Safe Cut Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCutSheetClick}
                className={`hidden md:flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold border cursor-pointer transition ${
                  isLight
                    ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <Scissors className="h-3.5 w-3.5 text-rose-500" />
                <span>Safe Cut</span>
              </motion.button>

              {/* Compare Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCompareClick}
                className={`hidden lg:flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold border cursor-pointer transition ${
                  isLight
                    ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <Scale className="h-3.5 w-3.5 text-indigo-400" />
                <span>Compare</span>
              </motion.button>

              {/* Test Demo Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSampleClick}
                className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-semibold border cursor-pointer transition ${
                  isLight
                    ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300'
                }`}
                title="1-Click Load Test Scenario"
              >
                <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                <span className="hidden sm:inline">Try Demo</span>
              </motion.button>

              {/* Jump to Top Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={scrollToTop}
                title="Scroll back to top"
                className={`flex h-7 w-7 items-center justify-center rounded-lg border cursor-pointer transition ${
                  isLight
                    ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-600'
                    : 'border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300'
                }`}
              >
                <ChevronUp className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Animated "Scroll Down" pulse prompt for landing and overview sections.
 */
export const ScrollHintPrompt: React.FC<{
  label?: string;
  targetId?: string;
  isLight?: boolean;
}> = ({ label = 'Scroll to explore video audit', targetId, isLight = false }) => {
  const handleScrollDown = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollBy({ top: 400, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="flex justify-center py-2"
    >
      <button
        type="button"
        onClick={handleScrollDown}
        className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-[11px] font-bold tracking-wider uppercase transition cursor-pointer border ${
          isLight
            ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            : 'bg-slate-900/90 hover:bg-slate-850 text-slate-300 border-slate-800 shadow-md shadow-black/40'
        } hover:scale-105 active:scale-95`}
      >
        <Sparkles className="h-3.5 w-3.5 text-red-500 animate-spin" style={{ animationDuration: '4s' }} />
        <span>{label}</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 text-rose-500 group-hover:text-red-400" />
        </motion.div>
      </button>
    </motion.div>
  );
};

/**
 * Floating "Back to Top" button that smoothly appears when scrolling down.
 */
export const ScrollToTopButton: React.FC<{ isLight?: boolean }> = ({ isLight = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      setScrollPercent(pct);
      setIsVisible(scrollTop > 260);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, x: 20, y: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, x: 20, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-20 md:bottom-20 right-5 z-40"
        >
          <button
            type="button"
            onClick={scrollToTop}
            title="Scroll to Top"
            className={`group relative flex items-center gap-2 rounded-2xl p-2.5 sm:px-3 sm:py-2.5 shadow-xl transition-all cursor-pointer border ${
              isLight
                ? 'bg-white/95 text-slate-800 border-slate-200 hover:border-red-500 shadow-slate-300/60 backdrop-blur-md'
                : 'bg-slate-900/95 text-white border-slate-700 hover:border-rose-500 shadow-black/80 backdrop-blur-md'
            } hover:scale-105 active:scale-95`}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white shadow-md shadow-red-900/40 group-hover:rotate-[-6deg] transition-transform">
              <ArrowUp className="h-4 w-4" />
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="font-satoshi text-xs font-bold leading-none">Top</span>
              <span className="font-mono text-[9px] text-slate-400 mt-0.5 leading-none">
                {scrollPercent}%
              </span>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
