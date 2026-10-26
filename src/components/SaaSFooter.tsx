import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  DollarSign,
  HelpCircle,
  Mail,
  Lock,
  ExternalLink,
  Sparkles,
  CreditCard,
  FileText,
  Youtube,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  Check,
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
  return (
    <footer
      className={`mt-16 border-t font-public-sans transition ${
        isLight
          ? 'border-slate-200 bg-gradient-to-b from-white via-slate-50/80 to-slate-100 text-slate-800'
          : 'border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black text-slate-200'
      }`}
    >
      {/* Upper Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 & 2: Brand & Trust Guarantee (Span 2) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 text-white shadow-sm">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-satoshi text-lg font-black tracking-tight text-slate-950 dark:text-white">
                    Striku<span className="text-red-600">.cloud</span>
                  </span>
                  <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-slate-500">
                    YouTube Strike Defense &amp; Pre-Auditor
                  </span>
                </div>
              </div>

              <p className="font-public-sans text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm">
                Empowering independent video creators with 3-Pass Multi-Agent Neural Consensus. Identify Community Guideline hazards, protect channel monetization, and export frame-accurate CapCut cuts before uploading.
              </p>

              {/* Zero Video Retention Trust Box */}
              <div
                className={`mt-5 rounded-2xl border p-3.5 max-w-sm transition ${
                  isLight
                    ? 'border-emerald-200 bg-emerald-50/70 text-emerald-950'
                    : 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-bold font-satoshi mb-1">
                  <Lock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Zero Video Retention Guarantee</span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  Raw video files are processed in volatile RAM and immediately discarded. Never stored, never shared, and never used to train public AI models.
                </p>
              </div>
            </div>

            {/* Merchant of Record Notice */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800/80 text-[11px] text-slate-500">
              Merchant of Record: Digital payments &amp; worldwide tax compliance securely handled by <strong>Lemon Squeezy, LLC</strong>.
            </div>
          </div>

          {/* Col 3: Product & Tools */}
          <div className="flex flex-col gap-3">
            <h4 className="font-satoshi text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Creator Tools
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('scanner')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer text-left"
                >
                  Multi-Video Pre-Scanner
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('channels')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer text-left"
                >
                  YouTube Channel Tracker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('violations')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer text-left"
                >
                  CapCut Safe Cut Timecodes
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('appeal')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer text-left"
                >
                  AI Strike Counter-Appeal Kit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('analytics')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer text-left"
                >
                  Channel Health &amp; Trend History
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('subscription')}
                  className="hover:text-red-600 dark:hover:text-red-400 transition cursor-pointer font-bold text-indigo-600 dark:text-indigo-400 text-left"
                >
                  Subscription Pricing ($0 - $80) →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Refund & Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-satoshi text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Policies &amp; Legal
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', 'refund')}
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span>14-Day Refund Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', 'privacy')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                >
                  Data Privacy &amp; Zero Retention
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', 'terms')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                >
                  Terms of Service &amp; Usage
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('knowledge')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                >
                  YouTube Guidelines Policy Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', 'about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                >
                  Neural Architecture &amp; Methodology
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Company, Support & Help */}
          <div className="flex flex-col gap-3">
            <h4 className="font-satoshi text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Support &amp; Company
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', 'faq')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <HelpCircle className="h-3 w-3 text-indigo-500" />
                  <span>Frequently Asked Questions</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', 'contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left flex items-center gap-1.5"
                >
                  <Mail className="h-3 w-3 text-slate-400" />
                  <span>Contact 24/7 Support Desk</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('legal', 'about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer text-left"
                >
                  About Striku (About Us)
                </button>
              </li>
              <li className="pt-2">
                <a
                  href="mailto:strikucloud@gmail.com"
                  className="font-mono text-[11px] font-bold text-slate-500 hover:text-indigo-600 transition truncate block"
                >
                  strikucloud@gmail.com
                </a>
              </li>
              {isSuperAdmin && (
                <li className="pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('admin')}
                    className="flex items-center gap-1.5 rounded-lg bg-red-600/10 border border-red-600/30 px-2 py-1 text-[10px] font-mono font-bold text-red-600 dark:text-red-400 hover:bg-red-600 hover:text-white transition cursor-pointer"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>Admin Mission Control</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Why Choose Striku? Our Service Is Best For You (Creator Benefits & Core Capabilities) */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
              <h4 className="font-satoshi text-sm sm:text-base font-black tracking-tight text-slate-900 dark:text-white">
                Why Choose Striku? Our Service Is Best For You
              </h4>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Designed specifically for creators, video editors, and production studios. Audit your video files before publishing to YouTube to prevent channel strikes, copyright claims, and lost ad revenue with millisecond-accurate timestamps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border transition ${isLight ? 'bg-white border-slate-200 hover:border-red-300 shadow-xs' : 'bg-slate-900/60 border-slate-800 hover:border-red-900/50'}`}>
              <button
                type="button"
                onClick={() => onNavigate('scanner')}
                className="text-left group cursor-pointer w-full"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-between mb-1.5">
                  <span>Pre-Upload Strike Defense</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Frame-by-frame temporal inspection catches community guidelines violations, dangerous stunts, and age restrictions before you upload.
                </p>
              </button>
            </div>

            <div className={`p-4 rounded-2xl border transition ${isLight ? 'bg-white border-slate-200 hover:border-red-300 shadow-xs' : 'bg-slate-900/60 border-slate-800 hover:border-red-900/50'}`}>
              <button
                type="button"
                onClick={() => onNavigate('knowledge')}
                className="text-left group cursor-pointer w-full"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-between mb-1.5">
                  <span>YouTube Strike Checker</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Evaluates dangerous acts, child safety hazards, graphic content, and hate speech against current YouTube policy rubrics.
                </p>
              </button>
            </div>

            <div className={`p-4 rounded-2xl border transition ${isLight ? 'bg-white border-slate-200 hover:border-red-300 shadow-xs' : 'bg-slate-900/60 border-slate-800 hover:border-red-900/50'}`}>
              <button
                type="button"
                onClick={() => onNavigate('scanner')}
                className="text-left group cursor-pointer w-full"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-between mb-1.5">
                  <span>Copyright &amp; Claim Founder</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Audio &amp; visual matching to detect unlicensed background tracks, audio loops, and broadcast clips before Content ID triggers.
                </p>
              </button>
            </div>

            <div className={`p-4 rounded-2xl border transition ${isLight ? 'bg-white border-slate-200 hover:border-red-300 shadow-xs' : 'bg-slate-900/60 border-slate-800 hover:border-red-900/50'}`}>
              <button
                type="button"
                onClick={() => onNavigate('violations')}
                className="text-left group cursor-pointer w-full"
              >
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 flex items-center justify-between mb-1.5">
                  <span>CapCut Safe-Cut Timecodes</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Frame-accurate millisecond timestamps tell you exactly where to blur, cut, or mute without having to re-edit your entire timeline.
                </p>
              </button>
            </div>
          </div>

          {/* Creator Benefits & Assurance Badges */}
          <div className="mt-5 flex flex-wrap items-center gap-2 pt-2 text-[11px] font-sans text-slate-500">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Creator Advantages:
            </span>
            <span className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-2.5 py-1 text-slate-600 dark:text-slate-300 font-medium">Instant Pre-Upload Audit</span>
            <span className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-2.5 py-1 text-slate-600 dark:text-slate-300 font-medium">Zero-Retention Privacy Guarantee</span>
            <span className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-2.5 py-1 text-slate-600 dark:text-slate-300 font-medium">Millisecond Safe-Cut Export</span>
            <span className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 px-2.5 py-1 text-slate-600 dark:text-slate-300 font-medium">Monetization Protection</span>
          </div>
        </div>

        {/* Free Video Copyright & YouTube Strike Tools Directory (Crawlable Sitelinks & SEO Rank Booster) */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col gap-1.5 mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-600 dark:text-red-400" />
              <h4 className="font-satoshi text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Free YouTube Copyright &amp; Strike Tools Directory
              </h4>
            </div>
            <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
              Explore our suite of free online creator utilities for copyright detection, audio claim pre-screening, YouTube strike prevention, and CapCut editing workflows.
            </p>
          </div>

          {/* Primary Sitelinks Grid (Targeting Google's Sub-link Blue Cards) */}
          <nav aria-label="Quick Creator Tools" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            <a
              href="#video-copyright-checker-online-free"
              onClick={() => onNavigate('scanner')}
              className={`p-3 rounded-xl border transition flex flex-col gap-1 group cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-red-400' : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-red-800'
              }`}
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center justify-between">
                <span>Video Copyright Checker Online Free</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </div>
              <p className="text-[11px] text-slate-500">
                Upload video before publishing to scan for Content ID claims and strike risks with zero video retention.
              </p>
            </a>

            <a
              href="#youtube-video-strike-checker"
              onClick={() => onNavigate('knowledge')}
              className={`p-3 rounded-xl border transition flex flex-col gap-1 group cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-red-400' : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-red-800'
              }`}
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center justify-between">
                <span>YouTube Video Strike Checker</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </div>
              <p className="text-[11px] text-slate-500">
                Pre-screen video frames for child safety, dangerous stunts, graphic violence, and community guidelines strikes.
              </p>
            </a>

            <a
              href="#copyright-checker-youtube-audio"
              onClick={() => onNavigate('scanner')}
              className={`p-3 rounded-xl border transition flex flex-col gap-1 group cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-red-400' : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-red-800'
              }`}
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center justify-between">
                <span>Copyright Checker YouTube Audio</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </div>
              <p className="text-[11px] text-slate-500">
                Analyze acoustic waveforms and background music tracks to detect unlicensed music claims before upload.
              </p>
            </a>

            <a
              href="#copyright-checker-youtube-link"
              onClick={() => onNavigate('scanner')}
              className={`p-3 rounded-xl border transition flex flex-col gap-1 group cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-red-400' : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-red-800'
              }`}
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center justify-between">
                <span>Copyright Checker YouTube Link</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </div>
              <p className="text-[11px] text-slate-500">
                Check YouTube video links and published channel compliance to evaluate historical strike risks and warnings.
              </p>
            </a>

            <a
              href="#strike-violations"
              onClick={() => onNavigate('violations')}
              className={`p-3 rounded-xl border transition flex flex-col gap-1 group cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-red-400' : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-red-800'
              }`}
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center justify-between">
                <span>CapCut Safe Cut Timecodes</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </div>
              <p className="text-[11px] text-slate-500">
                Export second-by-second timestamps to trim, blur, or mute flagged footage in CapCut or Premiere Pro.
              </p>
            </a>

            <a
              href="#ai-appeal-generator"
              onClick={() => onNavigate('appeal')}
              className={`p-3 rounded-xl border transition flex flex-col gap-1 group cursor-pointer ${
                isLight ? 'bg-white hover:bg-slate-50 border-slate-200 hover:border-red-400' : 'bg-slate-900/70 hover:bg-slate-850 border-slate-800 hover:border-red-800'
              }`}
            >
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center justify-between">
                <span>AI Strike Counter-Appeal Kit</span>
                <ExternalLink className="h-3 w-3 opacity-60" />
              </div>
              <p className="text-[11px] text-slate-500">
                Generate formal dispute letters referencing YouTube guidelines and Fair Use doctrine (17 U.S.C. § 107).
              </p>
            </a>
          </nav>

          {/* 100+ Creator Keywords Tag Cloud for Crawlers & Long-Tail Search */}
          <div className="flex flex-col gap-2 pt-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Popular Search Topics &amp; Compliance Checks:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              {[
                { label: 'video copyright checker online free', href: '#video-copyright-checker-online-free' },
                { label: 'video copyright checker', href: '#video-copyright-checker' },
                { label: 'youtube video strike checker', href: '#youtube-video-strike-checker' },
                { label: 'copyright checker youtube audio', href: '#copyright-checker-youtube-audio' },
                { label: 'copyright checker youtube link', href: '#copyright-checker-youtube-link' },
                { label: 'copyright checker youtube', href: '#copyright-checker-youtube' },
                { label: 'check video before upload', href: '#check-video-before-upload' },
                { label: 'youtube copyright check before upload', href: '#check-video-before-upload' },
                { label: 'content id claim founder', href: '#video-copyright-checker' },
                { label: 'free video copyright checker without login', href: '#video-copyright-checker-online-free' },
                { label: 'check song copyright for youtube', href: '#copyright-checker-youtube-audio' },
                { label: 'background music copyright checker', href: '#copyright-checker-youtube-audio' },
                { label: 'youtube community guidelines strike detector', href: '#youtube-video-strike-checker' },
                { label: 'strike risk analyzer', href: '#strike-violations' },
                { label: 'capcut safe cut timecodes', href: '#strike-violations' },
                { label: 'fair use copyright checker', href: '#content-hub' },
                { label: 'youtube monetization yellow dollar checker', href: '#scanner' },
                { label: 'avoid copyright strike youtube', href: '#content-hub' },
                { label: 'pre upload video compliance check', href: '#check-video-before-upload' },
                { label: 'counter notification appeal generator', href: '#ai-appeal-generator' },
                { label: 'youtube shorts copyright check', href: '#scanner' },
                { label: 'zero video retention privacy', href: '#legal-privacy' },
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className={`rounded-md px-2 py-0.5 border text-[11px] font-sans transition hover:underline ${
                    isLight
                      ? 'border-slate-200 bg-white text-slate-600 hover:text-blue-600 hover:border-blue-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-blue-400 hover:border-blue-700'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Trust Badges Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-500">
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1">
              <Lock className="h-3 w-3 text-emerald-500" />
              <span>256-Bit SSL Bank-Grade Encryption</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1">
              <CheckCircle2 className="h-3 w-3 text-amber-500" />
              <span>Lemon Squeezy Verified Merchant</span>
            </span>
            <span className="flex items-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1">
              <Youtube className="h-3 w-3 text-red-600" />
              <span>YouTube Community Guidelines 2026 Aligned</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational SLA: 99.98%</span>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer Row */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} Striku (striku.cloud). All worldwide rights reserved.
          </p>
          <p className="max-w-md text-[10px] leading-relaxed opacity-80">
            Striku is an independent pre-moderation SaaS application. YouTube, YouTube Studio, and related trademarks are properties of Google, LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};
