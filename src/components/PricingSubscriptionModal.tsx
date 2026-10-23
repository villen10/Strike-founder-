import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Check,
  Zap,
  Sparkles,
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  Globe,
  Scissors,
  FileText,
  Scale,
  Film,
} from 'lucide-react';
import {
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
  getDeviceScanMetrics,
} from '../services/subscriptionManager';

interface PricingSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  isLight: boolean;
  onSelectPlan: (tier: SubscriptionTier, billingCycle: 'monthly' | 'yearly') => void;
  upgradeReason?: string;
}

export const PricingSubscriptionModal: React.FC<PricingSubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  isLight,
  onSelectPlan,
  upgradeReason,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const metrics = getDeviceScanMetrics();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          className={`relative w-full max-w-6xl rounded-3xl border shadow-2xl overflow-hidden z-10 my-auto ${
            isLight ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0a0f1d] border-slate-800 text-white'
          }`}
        >
          {/* Header */}
          <div className="relative p-5 sm:p-7 text-center border-b border-slate-800/80 bg-gradient-to-b from-rose-950/20 to-transparent">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {upgradeReason && (
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-1.5 mb-3 text-xs font-semibold text-amber-300">
                <Lock className="h-3.5 w-3.5" />
                <span>{upgradeReason}</span>
              </div>
            )}

            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
              Invest in 0 Strikes. Protect Every Dollar You Make.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto mt-2 leading-relaxed">
              Detect YouTube strike risks pre-upload, get exact second-by-second CapCut safe-cut timecodes, and generate legal counter-appeals.
            </p>

            {/* Free Tier Quota Badge */}
            {currentTier === 'free' && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-1.5 text-xs font-mono text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>
                  Free Device Trial: <strong>{metrics.remainingScans} of {metrics.totalScans}</strong> scans left this month
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-[11px] text-slate-400">Resets in {metrics.daysUntilReset} days</span>
              </div>
            )}

            {/* Monthly / Yearly Switch */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>
                Monthly Billing
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

          {/* Pricing Grid: 4 Plans (Free $0, Shield $19, Pro $39, Master $80) */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* PLAN 1: FREE STARTER ($0) */}
            <div
              className={`rounded-2xl border p-4.5 flex flex-col justify-between transition ${
                currentTier === 'free'
                  ? 'border-slate-700 bg-slate-900/60 ring-1 ring-slate-700'
                  : 'border-slate-800 bg-slate-900/30'
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
                  Basic strike alert for Shorts/Reels (Max 3 mins).
                </p>

                <div className="my-3">
                  <span className="font-display text-3xl font-black text-white">$0</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">5 Video Scans/mo (Device bounded)</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">Shorts & Reels (Max 3 mins)</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">Strike Hazard Alert detection</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-rose-400 font-semibold">
                    <Lock className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-[11px]">Exact Safe Cut Timecodes LOCKED</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-rose-400 font-semibold">
                    <Lock className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span className="text-[11px]">AI Legal Strike Appeal LOCKED</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  disabled={currentTier === 'free'}
                  onClick={() => onSelectPlan('free', billingCycle)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 font-sans text-xs font-bold text-slate-300 transition cursor-pointer disabled:opacity-40"
                >
                  {currentTier === 'free' ? 'Active Plan' : 'Downgrade to Free'}
                </button>
              </div>
            </div>

            {/* PLAN 2: CREATOR SHIELD ($19/mo) */}
            <div className="relative rounded-2xl border-2 border-emerald-500/80 bg-gradient-to-b from-[#0f2420] via-[#0f1724] to-[#0c1220] p-4.5 flex flex-col justify-between shadow-lg shadow-emerald-950/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-2.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider shadow-md">
                POPULAR CHOICE
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
                  Unlock exact frame-accurate CapCut safe-cut timecodes.
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
                  <div className="flex items-start gap-1.5 text-white font-medium">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">25 Video Scans / month</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-white font-medium">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">Full length HD & 4K videos (60 min)</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-emerald-300 font-bold">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">✓ ALL Safe Cut Timecodes UNLOCKED</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-white">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">CapCut / Premiere EDL Cut Sheet</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-white">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">3-Pass Multi-Agent Neural Consensus</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onSelectPlan('shield', billingCycle)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 py-2.5 font-display text-xs font-bold text-white transition shadow-md shadow-emerald-900/30 cursor-pointer active:scale-95"
                >
                  <span>{currentTier === 'shield' ? 'Current Plan' : 'Get Creator Shield ($19)'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* PLAN 3: CREATOR PRO ($39/mo) */}
            <div className="relative rounded-2xl border-2 border-rose-500/80 bg-gradient-to-b from-[#24101e] via-[#151224] to-[#0c1220] p-4.5 flex flex-col justify-between shadow-xl shadow-rose-950/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-2.5 py-0.5 font-mono text-[9px] font-bold text-white uppercase tracking-wider shadow-md">
                FULL CREATOR SUITE
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
                  <div className="flex items-start gap-1.5 text-white font-medium">
                    <Check className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">75 Video Scans / month</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-rose-300 font-bold">
                    <Check className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">✓ AI YouTube Counter-Appeal Kit</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-rose-300 font-bold">
                    <Check className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">✓ Side-by-Side 2 Video Comparison</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-white">
                    <Check className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">✓ Channel Tracker 24h/7d Monitoring</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-white">
                    <Check className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">All Safe Cut Timecodes Unlocked</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onSelectPlan('pro', billingCycle)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 py-2.5 font-display text-xs font-bold text-white transition shadow-lg shadow-red-900/30 cursor-pointer active:scale-95"
                >
                  <span>{currentTier === 'pro' ? 'Current Plan' : 'Get Creator Pro ($39)'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* PLAN 4: STUDIO & AGENCY MASTER ($80/mo) */}
            <div
              className={`rounded-2xl border p-4.5 flex flex-col justify-between transition ${
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
                  For editing studios, agencies, and MCN networks.
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
                  <div className="flex items-start gap-1.5 text-amber-300 font-bold">
                    <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">UNLIMITED Video Scans</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-200">
                    <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">Batch Bulk Queue (20+ videos)</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-200">
                    <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">5 Team Editor Seats</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-200">
                    <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">Exportable PDF Client Certificates</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-200">
                    <Check className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-[11px]">YouTube Studio API Channel Sync</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => onSelectPlan('enterprise', billingCycle)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/15 hover:bg-amber-500/25 py-2.5 font-display text-xs font-bold text-amber-300 transition cursor-pointer active:scale-95"
                >
                  <span>{currentTier === 'enterprise' ? 'Current Plan' : 'Get Studio Master ($80)'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Worldwide Payment Trust Bar */}
          <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-rose-500" />
              <span>Worldwide via Lemon Squeezy: Visa, Mastercard, AMEX, Apple Pay, Google Pay</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="text-emerald-400 font-bold">✓ 14-Day Full Refund Guarantee</span>
              <span className="text-emerald-400 font-bold">✓ PK Raast / JazzCash / UBL Bank</span>
              <span className="text-amber-400 font-bold">✓ Binance Pay & USDT TRC20</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
