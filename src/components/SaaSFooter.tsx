import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ArrowUp,
  Shield,
  Sparkles,
} from 'lucide-react';
import { NavView } from './Sidebar';
import { LegalTabType } from './LegalTrustHub';

interface SaaSFooterProps {
  isLight: boolean;
  onNavigate: (view: NavView, legalTab?: LegalTabType) => void;
  onOpenPricing?: () => void;
  onOpenCompare?: () => void;
  isSuperAdmin?: boolean;
}

export const SaaSFooter: React.FC<SaaSFooterProps> = ({
  isLight,
  onNavigate,
  onOpenPricing,
  onOpenCompare,
  isSuperAdmin = false,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative w-full border-t border-emerald-950/40 text-slate-300 font-sans overflow-hidden"
      style={{
        backgroundColor: '#061311',
        backgroundImage: `
          linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '28px 28px',
      }}
    >
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="flex flex-col gap-8 max-w-4xl">
          {/* Brand Logo & Name (Striku) */}
          <div className="flex items-center gap-3">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Striku Logo"
                onError={() => setLogoError(true)}
                className="h-11 w-11 rounded-2xl object-contain bg-emerald-950/40 border border-emerald-500/30 p-1 shadow-lg shadow-emerald-950/50"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-400 text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 16l-4-4 1.41-1.41L11 15.17l6.59-6.59L19 10l-8 8z" />
                </svg>
              </div>
            )}

            <div className="flex flex-col">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-white uppercase">
                STRIKU<span className="text-[#10b981]">.CLOUD</span>
              </span>
            </div>
          </div>

          {/* Subtitle / Tagline */}
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
            Scan your video before YouTube does. Copyright, reused content, and monetization risk check for creators.
          </p>

          {/* Product Maker */}
          <div className="text-sm sm:text-base text-slate-300">
            A product by{' '}
            <span className="text-[#10b981] font-bold">MOQ Automation</span>
          </div>

          {/* Locations */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm text-slate-300">
            {/* Pakistan Location */}
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white tracking-wide">Pakistan</span>
              <span className="text-slate-400">Karachi West, Pakistan</span>
            </div>

            {/* USA Location */}
            <div className="flex flex-col gap-1">
              <span className="font-bold text-white tracking-wide">USA</span>
              <span className="text-slate-400">5900 Balcones Dr Ste 22699</span>
              <span className="text-slate-400">Austin, TX 78731, USA</span>
            </div>
          </div>

          {/* Phone Contact */}
          <div className="text-sm text-slate-300">
            Phone:{' '}
            <a
              href="tel:+923362103534"
              className="text-slate-200 hover:text-[#10b981] transition font-mono font-medium"
            >
              +92 336 2103534
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-[#10b981] transition cursor-pointer"
            >
              <Instagram className="h-4 w-4 text-[#10b981]" />
              <span>Instagram</span>
            </a>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-[#10b981] transition cursor-pointer"
            >
              <Facebook className="h-4 w-4 text-[#10b981]" />
              <span>Facebook</span>
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-[#10b981] transition cursor-pointer"
            >
              <Twitter className="h-4 w-4 text-[#10b981]" />
              <span>Twitter</span>
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-[#10b981] transition cursor-pointer"
            >
              <Youtube className="h-4 w-4 text-[#10b981]" />
              <span>YouTube</span>
            </a>
          </div>

          {/* Navigation Links Grid: RESOURCES & LEGAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {/* Resources Column */}
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                RESOURCES
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('content-hub')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('scanner')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Check a video before upload
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenPricing) onOpenPricing();
                      else onNavigate('subscription');
                    }}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('channels')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Channel Tracker
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & About Column */}
            <div className="flex flex-col gap-3">
              <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-white">
                LEGAL
              </h3>
              <ul className="flex flex-col gap-2.5 text-sm text-slate-300">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('legal', 'privacy')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('legal', 'terms')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('legal', 'refund')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Refund &amp; Cancellation
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('legal', 'about')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left font-medium text-emerald-400"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('legal', 'contact')}
                    className="hover:text-[#10b981] transition cursor-pointer text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Thin Divider Line */}
          <div className="w-full h-px bg-emerald-950/80 my-2" />

          {/* Copyright & Disclaimer Footnote */}
          <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-slate-400">
            <p className="text-slate-300">
              © {new Date().getFullYear()} Striku (striku.cloud). All worldwide rights reserved.
            </p>
            <p className="text-slate-400 text-xs">
              AI risk estimate, not an official YouTube ruling.
            </p>
            <p className="text-slate-400 text-xs">
              Designed and Developed by{' '}
              <span className="text-[#10b981] font-semibold">Faiwebz</span>
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Floating Button (matching screenshot green circle with up arrow) */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#053d33] hover:bg-[#075346] text-[#10b981] hover:text-white border border-[#10b981]/40 shadow-xl shadow-emerald-950/60 transition-all duration-300 transform cursor-pointer ${
          showScrollTop ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ArrowUp className="h-5 w-5 stroke-[2.5]" />
      </button>
    </footer>
  );
};
