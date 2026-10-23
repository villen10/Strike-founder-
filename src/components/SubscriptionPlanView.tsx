import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Scissors,
  Globe,
  FileText,
  Scale,
} from 'lucide-react';
import {
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
  getDeviceScanMetrics,
} from '../services/subscriptionManager';

interface SubscriptionPlanViewProps {
  currentTier: SubscriptionTier;
  isLight: boolean;
  onOpenCheckout: (tier: SubscriptionTier, billingCycle: 'monthly' | 'yearly') => void;
}

export const SubscriptionPlanView: React.FC<SubscriptionPlanViewProps> = ({
  currentTier,
  isLight,
  onOpenCheckout,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const metrics = getDeviceScanMetrics();

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 text-white">
      {/* Current Active Plan Status Banner */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 transition shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          currentTier === 'enterprise'
            ? 'border-amber-500/50 bg-gradient-to-r from-amber-950/40 via-slate-900 to-[#0e1424]'
            : currentTier === 'pro'
            ? 'border-rose-500/50 bg-gradient-to-r from-rose-950/40 via-slate-900 to-[#0e1424]'
            : currentTier === 'shield'
            ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0e1424]'
            : 'border-slate-800 bg-[#0c1220]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg shrink-0 ${
              currentTier === 'enterprise'
                ? 'bg-amber-600 shadow-amber-950/40'
                : currentTier === 'pro'
                ? 'bg-rose-600 shadow-rose-950/40'
                : currentTier === 'shield'
                ? 'bg-emerald-600 shadow-emerald-950/40'
                : 'bg-slate-800'
            }`}
          >
            {currentTier === 'enterprise' ? (
              <Building2 className="h-6 w-6" />
            ) : currentTier === 'pro' ? (
              <Sparkles className="h-6 w-6" />
            ) : currentTier === 'shield' ? (
              <Scissors className="h-6 w-6" />
            ) : (
              <ShieldCheck className="h-6 w-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Current Plan
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                  currentTier === 'enterprise'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : currentTier === 'pro'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : currentTier === 'shield'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                {SUBSCRIPTION_PLANS[currentTier]?.name || 'Free Starter'}
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-white mt-0.5">
              {currentTier === 'enterprise'
                ? 'Studio & Agency Master ($80/mo)'
                : currentTier === 'pro'
                ? 'Creator Pro Active ($39/mo)'
                : currentTier === 'shield'
                ? 'Creator Shield Active ($19/mo)'
                : 'Free Starter Trial'}
            </h2>
            <p className="font-sans text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              {currentTier === 'free'
                ? `You have audited ${metrics.usedScans} of ${metrics.totalScans} free videos this month. Safe cut timecodes & appeal letters are locked.`
                : currentTier === 'shield'
                ? 'All exact CapCut/Premiere safe-cut timecodes are unlocked. 25 video scans per month active.'
                : currentTier === 'pro'
                ? 'All features including AI Legal Appeals, Side-by-Side Compare & Channel Tracker active. 75 scans/mo.'
                : 'Studio & Agency Master active: Unlimited video audits, team seats, and white-label client PDF certificates.'}
            </p>
          </div>
        </div>

        {currentTier === 'free' && (
          <button
            type="button"
            onClick={() => onOpenCheckout('shield', 'monthly')}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-5 py-3 font-display text-xs font-bold text-white transition shadow-lg shadow-red-900/30 cursor-pointer shrink-0 active:scale-95"
          >
            <Scissors className="h-4 w-4" />
            <span>Unlock Safe Cuts ($19)</span>
          </button>
        )}
      </div>

      {/* Pricing Header & Billing Toggle */}
      <div className="text-center py-2 space-y-2">
        <h1 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
          Choose the Perfect Strike Protection Plan
        </h1>
        <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          No hidden fees. Safe Cut timecodes, AI appeals, and unlimited audits.
        </p>

        {/* Monthly / Yearly Toggle */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
            Monthly
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle((prev) => (prev === 'monthly' ? 'yearly' : 'monthly'))}
            className="relative h-7 w-13 rounded-full bg-slate-800 p-1 transition cursor-pointer border border-slate-700"
          >
            <div
              className={`h-5 w-5 rounded-full bg-gradient-to-r from-red-600 to-rose-600 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
              Annual Billing
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
              SAVE 20%
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* TIER 1: FREE STARTER ($0) */}
        <div
          className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
            currentTier === 'free'
              ? 'border-slate-700 bg-slate-900/80 ring-1 ring-slate-700'
              : 'border-slate-800 bg-[#0d1322]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="font-display font-bold text-base text-white">Free Starter</h3>
              {currentTier === 'free' && (
                <span className="rounded-full bg-slate-800 border border-slate-700 px-2 py-0.5 text-[9px] font-mono font-bold text-slate-300">
                  CURRENT
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 min-h-[32px] leading-relaxed">
              Shorts & Reels (Max 3 mins) basic strike check.
            </p>

            <div className="my-3">
              <span className="font-display text-3xl font-black text-white">$0</span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              {SUBSCRIPTION_PLANS.free.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-300">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              disabled={currentTier === 'free'}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 font-sans text-xs font-bold text-slate-300 transition cursor-pointer disabled:opacity-50"
            >
              {currentTier === 'free' ? 'Active Plan' : 'Downgrade to Free'}
            </button>
          </div>
        </div>

        {/* TIER 2: CREATOR SHIELD ($19/mo) */}
        <div className="relative rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-b from-[#0f2420] via-[#0f1724] to-[#0c1220] p-5 flex flex-col justify-between shadow-lg shadow-emerald-950/30">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-2.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider shadow-md">
            POPULAR
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Scissors className="h-4 w-4 text-emerald-400" />
                <h3 className="font-display font-bold text-base text-white">Creator Shield</h3>
              </div>
              {currentTier === 'shield' && (
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-400">
                  CURRENT
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 min-h-[32px] leading-relaxed">
              Unlocks exact second-by-second CapCut safe-cut timecodes.
            </p>

            <div className="my-3">
              <span className="font-display text-3xl font-black text-white">
                ${billingCycle === 'yearly' ? Math.round(190 / 12) : 19}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
              {billingCycle === 'yearly' && (
                <span className="block text-[10px] font-mono text-emerald-400">
                  Billed $190/yr ($38 saved)
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              {SUBSCRIPTION_PLANS.shield.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-white">
                  <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onOpenCheckout('shield', billingCycle)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-display text-xs font-bold text-white transition shadow-md shadow-emerald-900/30 cursor-pointer active:scale-95"
            >
              <span>{currentTier === 'shield' ? 'Current Plan' : 'Get Creator Shield ($19)'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* TIER 3: CREATOR PRO ($39/mo) */}
        <div className="relative rounded-2xl border-2 border-rose-500/80 bg-gradient-to-b from-[#24101e] via-[#151224] to-[#0c1220] p-5 flex flex-col justify-between shadow-xl shadow-rose-950/30">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-2.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider shadow-md">
            FULL SUITE
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-rose-500 fill-current" />
                <h3 className="font-display font-bold text-base text-white">Creator Pro</h3>
              </div>
              {currentTier === 'pro' && (
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-rose-400">
                  CURRENT
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 min-h-[32px] leading-relaxed">
              Full strike defense, AI legal counter-appeals & comparisons.
            </p>

            <div className="my-3">
              <span className="font-display text-3xl font-black text-white">
                ${billingCycle === 'yearly' ? Math.round(390 / 12) : 39}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
              {billingCycle === 'yearly' && (
                <span className="block text-[10px] font-mono text-emerald-400">
                  Billed $390/yr ($78 saved)
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              {SUBSCRIPTION_PLANS.pro.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-white">
                  <Check className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onOpenCheckout('pro', billingCycle)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 py-2.5 font-display text-xs font-bold text-white transition shadow-lg shadow-red-900/30 cursor-pointer active:scale-95"
            >
              <span>{currentTier === 'pro' ? 'Current Plan' : 'Get Creator Pro ($39)'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* TIER 4: STUDIO & AGENCY MASTER ($80/mo) */}
        <div
          className={`rounded-2xl border p-5 flex flex-col justify-between transition ${
            currentTier === 'enterprise'
              ? 'border-amber-500/80 bg-[#1f1710] ring-1 ring-amber-500'
              : 'border-slate-800 bg-[#121626]'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-amber-400" />
                <h3 className="font-display font-bold text-base text-white">Studio Master</h3>
              </div>
              {currentTier === 'enterprise' ? (
                <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-amber-400">
                  CURRENT
                </span>
              ) : (
                <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[8.5px] font-mono font-bold text-amber-300">
                  $80 TIER
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 min-h-[32px] leading-relaxed">
              Unlimited audits, batch queue, team seats & white-label PDFs.
            </p>

            <div className="my-3">
              <span className="font-display text-3xl font-black text-amber-400">
                ${billingCycle === 'yearly' ? Math.round(799 / 12) : 80}
              </span>
              <span className="text-xs text-slate-400 ml-1">/ month</span>
              {billingCycle === 'yearly' && (
                <span className="block text-[10px] font-mono text-emerald-400">
                  Billed $799/yr ($161 saved)
                </span>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              {SUBSCRIPTION_PLANS.enterprise.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-slate-200">
                  <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-snug">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onOpenCheckout('enterprise', billingCycle)}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 py-2.5 font-display text-xs font-bold text-amber-300 transition cursor-pointer active:scale-95"
            >
              <span>{currentTier === 'enterprise' ? 'Current Plan' : 'Get Studio Master ($80)'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Payment Badges */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1322] p-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-rose-500" />
          <span>Worldwide Supported: Visa, Mastercard, AMEX, Apple Pay, Google Pay via Lemon Squeezy</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="text-emerald-400 font-bold">✓ Pakistan Raast / JazzCash / UBL Bank</span>
          <span className="text-amber-400 font-bold">✓ Binance Pay & USDT TRC20</span>
        </div>
      </div>

      {/* 14-Day Money Back Guarantee Trust Banner */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Check className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-white block">14-Day 100% Full Money-Back Guarantee</span>
            <span className="text-[11px] text-slate-400">Try Creator Shield or Pro risk-free. If not satisfied, get a 100% full refund within 14 days.</span>
          </div>
        </div>
        <div className="text-[11px] font-mono text-emerald-400 shrink-0">
          Zero Risk · Cancel in 1-Click
        </div>
      </div>
    </div>
  );
};
