import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Clock } from 'lucide-react';
import {
  SubscriptionTier,
  SUBSCRIPTION_PLANS,
} from '../services/subscriptionManager';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: SubscriptionTier;
  billingCycle: 'monthly' | 'yearly';
  isLight: boolean;
  onSuccess: (tier: SubscriptionTier) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
  isLight,
}) => {
  if (!isOpen) return null;

  const plan = SUBSCRIPTION_PLANS[selectedTier] || SUBSCRIPTION_PLANS.shield;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          className={`relative w-full max-w-md rounded-3xl border shadow-2xl overflow-hidden z-10 my-auto ${
            isLight
              ? 'bg-white border-slate-300 text-slate-900 shadow-xl'
              : 'bg-[#0f172a] border-slate-700 text-white shadow-2xl'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700/80 px-5 py-4 bg-slate-900/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-sans text-base font-bold tracking-tight text-white">
                {plan.name}
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* High-Contrast, Crystal-Clear Notice Box (No "AI type" essays, zero contrast issues) */}
          <div className="p-5 sm:p-6 space-y-4">
            <div className="rounded-2xl border-2 border-amber-500/60 bg-[#1e293b] p-6 text-center space-y-3.5 shadow-lg">
              {/* Badge with high contrast */}
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/80 px-3.5 py-1 font-mono text-xs font-black text-amber-300 uppercase tracking-wider">
                <Clock className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span>Subscription Gateway Added Soon</span>
              </div>

              {/* Main Headline */}
              <h4 className="font-sans text-2xl font-black text-white tracking-tight">
                Payment Gateway Added Soon
              </h4>

              {/* Clear statement: now you can enjoy free trial */}
              <div className="inline-block rounded-xl bg-emerald-500/20 border border-emerald-400/60 px-4 py-1.5">
                <p className="font-sans text-sm sm:text-base font-black text-emerald-300">
                  Now you can enjoy free trial!
                </p>
              </div>

              {/* Crisp explanation - no robot essays */}
              <p className="text-xs sm:text-sm text-slate-200 font-sans font-medium leading-relaxed max-w-xs mx-auto">
                Paid subscriptions cannot be purchased right now. Please continue using the free trial on the website.
              </p>
            </div>

            {/* Simple Dismiss/Close Button (No Free Trial purchase/activate button as requested) */}
            <button
              type="button"
              onClick={onClose}
              className="w-full flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-sans text-xs font-bold py-3 px-4 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
