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
  from?: 'bottom' | 'bottom-left' | 'right' | 'fade-blur';
}> = ({ children, delay = 0, className = '', from = 'fade-blur' }) => {
  const getInitial = () => {
    switch (from) {
      case 'bottom-left':
        return { opacity: 0, x: -40, y: 30, filter: 'blur(8px)', scale: 0.95 };
      case 'right':
        return { opacity: 0, x: 40, y: 0, filter: 'blur(8px)', scale: 0.95 };
      case 'bottom':
        return { opacity: 0, y: 35, filter: 'blur(8px)', scale: 0.94 };
      case 'fade-blur':
      default:
        return { opacity: 0, y: 20, filter: 'blur(12px)', scale: 0.96 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-25px' }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`font-sans tracking-tight ${className}`}
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
  isAuditActive?: boolean;
  activeActionKey?: string;
  onScanClick: () => void;
  onCutSheetClick: () => void;
  onCompareClick: () => void;
}

export const FloatingScrollHUD: React.FC<FloatingScrollHUDProps> = ({
  isLight = false,
  videoTitle = 'Studio Active Video',
  safetyGrade,
  isAuditActive = false,
  activeActionKey,
  onScanClick,
  onCutSheetClick,
  onCompareClick,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [isAuditInView, setIsAuditInView] = useState(false);
  const [activeButton, setActiveButton] = useState<'scan' | 'cut' | 'compare' | 'sample'>('scan');

  // Sync active action prop if provided
  useEffect(() => {
    if (activeActionKey && ['scan', 'cut', 'compare', 'sample'].includes(activeActionKey)) {
      setActiveButton(activeActionKey as any);
    }
  }, [activeActionKey]);

  // Robust window scroll listener with passive performance
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      setScrollPct(pct);
      // Appear once scrolled past 120px, smoothly fade out when at top
      setIsVisible(scrollTop > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to detect when user is focused on the Audit Results section
  useEffect(() => {
    const targetEl =
      document.getElementById('audit-results-section') ||
      document.getElementById('compliance-verdict-section');

    if (!targetEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsAuditInView(entry.isIntersecting);
      },
      {
        threshold: [0.1, 0.4, 0.8],
        rootMargin: '-60px 0px -80px 0px',
      }
    );

    observer.observe(targetEl);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleButtonClick = (action: 'scan' | 'cut' | 'compare' | 'sample', callback: () => void) => {
    setActiveButton(action);
    callback();
  };

  // Whether user is actively focused on audit results
  const isFocusedOnResults = isAuditInView || isAuditActive;

  // Staggered variants for CTA buttons
  const buttonContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.06,
      },
    },
  };

  const buttonItemVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 240,
        damping: 18,
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        /* Robust Positioning Container: Fixed stretch decoupled from transform coordinates */
        <div
          role="region"
          aria-label="Floating Action Dock"
          className="fixed inset-x-0 bottom-4 sm:bottom-6 z-50 pointer-events-none flex justify-center px-3 sm:px-4"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          {/* Inner Motion Element: Spring pop, scale and fade from bottom without layout shift */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.94 }}
            transition={{
              type: 'spring',
              stiffness: 180,
              damping: 22,
            }}
            className="pointer-events-auto relative w-full max-w-[96vw] sm:max-w-2xl md:max-w-3xl"
          >
            {/* Glassmorphic Container with Top-edge Neon Accent */}
            <div
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
                isLight
                  ? 'bg-white/94 border-slate-200 text-slate-800 shadow-slate-400/30 ring-1 ring-slate-900/5'
                  : 'bg-slate-950/92 border-slate-800 text-white shadow-black/95 ring-1 ring-rose-500/20'
              } ${
                isFocusedOnResults
                  ? isLight
                    ? 'ring-2 ring-rose-500/40 shadow-rose-200/50'
                    : 'ring-2 ring-rose-500/50 shadow-[0_10px_35px_rgba(244,63,94,0.25)]'
                  : ''
              }`}
            >
              {/* Glowing Top Beam */}
              <div
                className={`absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500 to-transparent transition-opacity duration-500 ${
                  isFocusedOnResults ? 'opacity-100' : 'opacity-40'
                }`}
              />

              {/* Active Audit State Banner (when user is focused on results) */}
              <AnimatePresence>
                {isFocusedOnResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-gradient-to-r from-rose-950/40 via-red-950/30 to-amber-950/20 px-3 py-0.5 border-b border-rose-500/20 flex items-center justify-between text-[10px] font-mono"
                  >
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold uppercase tracking-wider">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                      </span>
                      <span>AUDIT RESULTS ACTIVE</span>
                      {safetyGrade && (
                        <span className="text-slate-400 font-normal">
                          · Grade: <strong className={safetyGrade === 'SAFE_TO_UPLOAD' ? 'text-emerald-400' : 'text-rose-400'}>{safetyGrade}</strong>
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 hidden xs:inline">
                      Focus Mode // {scrollPct}%
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Dock Body */}
              <div className="flex items-center justify-between gap-2.5 sm:gap-4 p-2 sm:p-2.5 px-3 sm:px-4">
                {/* Left: Info / Title Font */}
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <div className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/70 overflow-hidden shadow-md shadow-red-900/35">
                    <img
                      src="/logo.png"
                      alt="Striku"
                      className="h-full w-full object-contain p-0.5"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-rose-500">
                        STRIKU STUDIO
                      </span>
                      <span className="font-mono text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full bg-slate-800/80 text-slate-300 hidden sm:inline-block">
                        {scrollPct}%
                      </span>
                    </div>
                    <span
                      className="font-sans text-xs sm:text-sm font-bold truncate max-w-[130px] sm:max-w-[190px] md:max-w-[220px]"
                      title={videoTitle}
                    >
                      {videoTitle}
                    </span>
                  </div>
                </div>

                {/* Right: Call To Action Buttons (Smoothly Appearing & Fade-In with Active Persistent State) */}
                <motion.div
                  variants={buttonContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex items-center gap-1.5 sm:gap-2 shrink-0"
                >
                  {/* 1. Scan Video Button */}
                  <motion.div variants={buttonItemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleButtonClick('scan', onScanClick)}
                      className={`relative flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all shadow-md cursor-pointer ${
                        activeButton === 'scan' && isFocusedOnResults
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-rose-900/50 ring-2 ring-white/60 dark:ring-rose-400'
                          : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-900/30'
                      }`}
                      title="Run Full Community Guidelines & Strike Audit"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span className="hidden xs:inline">Scan Video</span>
                      <span className="xs:hidden">Scan</span>
                      {activeButton === 'scan' && isFocusedOnResults && (
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      )}
                    </motion.button>
                  </motion.div>

                  {/* 2. Safe Cut Button */}
                  <motion.div variants={buttonItemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleButtonClick('cut', onCutSheetClick)}
                      className={`hidden sm:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                        activeButton === 'cut' && isFocusedOnResults
                          ? 'border-rose-500 bg-rose-500/20 text-rose-500 ring-2 ring-rose-500/40 font-bold'
                          : isLight
                          ? 'border-slate-200 bg-slate-100/90 hover:bg-slate-200 text-slate-700'
                          : 'border-slate-800 bg-slate-900/90 hover:bg-slate-850 text-slate-300'
                      }`}
                      title="Open Safe Cut Sheet & Timecode Blur Guide"
                    >
                      <Scissors className="h-3.5 w-3.5 text-rose-500" />
                      <span>Safe Cut</span>
                    </motion.button>
                  </motion.div>

                  {/* 3. Compare Button */}
                  <motion.div variants={buttonItemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleButtonClick('compare', onCompareClick)}
                      className={`hidden md:flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                        activeButton === 'compare' && isFocusedOnResults
                          ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500/40 font-bold'
                          : isLight
                          ? 'border-slate-200 bg-slate-100/90 hover:bg-slate-200 text-slate-700'
                          : 'border-slate-800 bg-slate-900/90 hover:bg-slate-850 text-slate-300'
                      }`}
                      title="Compare 2 Videos Side-by-Side"
                    >
                      <Scale className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Compare</span>
                    </motion.button>
                  </motion.div>



                  {/* 5. Back to Top Arrow Button */}
                  <motion.div variants={buttonItemVariants}>
                    <motion.button
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={scrollToTop}
                      title="Scroll back to top"
                      className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl border transition-all cursor-pointer ${
                        isLight
                          ? 'border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:border-slate-300'
                          : 'border-slate-800 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </motion.button>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
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
