import React, { useState, useEffect } from 'react';
import { ArrowUp, Mail } from 'lucide-react';
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
      className={`relative w-full border-t font-sans overflow-hidden shadow-sm transition-colors duration-200 ${
        isLight
          ? 'border-slate-200/80 text-slate-800'
          : 'border-slate-800/80 text-slate-100'
      }`}
      style={{
        backgroundImage: `url('/assets/aistudio/5d0b6ed188fecc12368c09462d76be44_9d7acdc2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center bottom',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="flex flex-col gap-8 max-w-4xl">
          {/* Brand Logo & Name (Striku) */}
          <div className="flex items-center gap-3">
            {!logoError ? (
              <img
                src="/logo.png"
                alt="Striku Logo"
                onError={() => setLogoError(true)}
                className={`h-11 w-11 rounded-2xl object-contain border p-1 shadow-sm ${
                  isLight ? 'bg-white/80 border-slate-200' : 'bg-slate-900/80 border-slate-700'
                }`}
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md border border-indigo-200">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 16l-4-4 1.41-1.41L11 15.17l6.59-6.59L19 10l-8 8z" />
                </svg>
              </div>
            )}

            <div className="flex flex-col">
              <span className={`font-display font-black text-xl sm:text-2xl tracking-tight uppercase ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                STRIKU<span className="text-indigo-600">.CLOUD</span>
              </span>
            </div>
          </div>

          {/* Subtitle / Tagline */}
          <p className={`text-sm sm:text-base font-normal leading-relaxed max-w-xl ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            Scan your video before YouTube does. Copyright, reused content, and monetization risk check for creators.
          </p>

          {/* Product Maker */}
          <div className={`text-sm sm:text-base ${
            isLight ? 'text-slate-700' : 'text-slate-300'
          }`}>
            A product by{' '}
            <span className={`font-bold ${isLight ? 'text-slate-950' : 'text-white'}`}>FM Automation</span>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1 text-sm">
            <span className={`font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>Location</span>
            <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Khanewal, Pakistan</span>
          </div>

          {/* Contact Channels: WhatsApp & Email Logos */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-sm pt-1">
            {/* WhatsApp Contact with Logo */}
            <a
              href="https://wa.me/923197419085"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 transition cursor-pointer group"
              title="Chat on WhatsApp"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition group-hover:scale-105 ${
                isLight
                  ? 'bg-white/80 border-slate-200 text-slate-700 group-hover:border-indigo-400 group-hover:text-indigo-600 group-hover:bg-indigo-50/70'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 group-hover:border-indigo-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/60'
              }`}>
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className={`text-[11px] font-mono uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>WhatsApp</span>
                <span className={`font-mono font-medium transition ${
                  isLight
                    ? 'text-slate-900 group-hover:text-indigo-600'
                    : 'text-slate-200 group-hover:text-indigo-400'
                }`}>+92 319 7419085</span>
              </div>
            </a>

            {/* Email Contact with Logo */}
            <a
              href="mailto:strikucloud@gmail.com"
              className="inline-flex items-center gap-3 transition cursor-pointer group"
              title="Send an Email"
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-sm transition group-hover:scale-105 ${
                isLight
                  ? 'bg-white/80 border-slate-200 text-slate-700 group-hover:border-indigo-400 group-hover:text-indigo-600 group-hover:bg-indigo-50/70'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 group-hover:border-indigo-400 group-hover:text-indigo-400 group-hover:bg-indigo-950/60'
              }`}>
                <Mail className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className={`text-[11px] font-mono uppercase tracking-wider ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>Email</span>
                <span className={`font-mono font-medium transition ${
                  isLight
                    ? 'text-slate-900 group-hover:text-indigo-600'
                    : 'text-slate-200 group-hover:text-indigo-400'
                }`}>strikucloud@gmail.com</span>
              </div>
            </a>
          </div>

          {/* Navigation Links Grid: RESOURCES & LEGAL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
            {/* Resources Column */}
            <div className="flex flex-col gap-3">
              <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                RESOURCES
              </h3>
              <ul className={`flex flex-col gap-2.5 text-sm ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('content-hub')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('scanner')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
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
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('channels')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Channel Tracker
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & About Column */}
            <div className="flex flex-col gap-3">
              <h3 className={`font-mono text-xs font-bold uppercase tracking-widest ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                LEGAL &amp; POLICIES
              </h3>
              <ul className={`flex flex-col gap-2.5 text-sm ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('about')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left font-semibold"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('contact')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('refund')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Refund &amp; Cancellation Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('faq')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Frequently Asked Questions (FAQ)
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('privacy')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('terms')}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                  >
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Thin Divider Line */}
          <div className={`w-full h-px my-2 ${isLight ? 'bg-slate-300/80' : 'bg-slate-800/80'}`} />

          {/* Copyright & Disclaimer Footnote */}
          <div className={`flex flex-col gap-1.5 text-xs sm:text-sm ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <p className={isLight ? 'text-slate-750 font-medium' : 'text-slate-300'}>
              © {new Date().getFullYear()} Striku (striku.cloud). All worldwide rights reserved.
            </p>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              AI risk estimate, not an official YouTube ruling. Safe video pre-check with Zero-Data retention.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Floating Button (Clean dark/indigo button with up arrow) */}
      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 hover:bg-indigo-600 text-white shadow-xl shadow-slate-900/25 border border-slate-700/30 transition-all duration-300 transform cursor-pointer ${
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
