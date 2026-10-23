import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Users,
  CreditCard,
  Sparkles,
  Gift,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  Clock,
  ChevronRight,
  Plus,
  Coins,
  Smartphone,
  Globe,
  Lock,
  ArrowUpRight,
  SlidersHorizontal,
  X,
  ExternalLink,
  Zap,
} from 'lucide-react';
import {
  AdminUserRecord,
  PaymentTransaction,
  getAdminUsersList,
  saveAdminUsersList,
  getAdminTransactions,
  adminSetUserTier,
  adminResetUserScanQuota,
  adminRecordManualPayment,
  ADMIN_EMAIL,
} from '../services/adminService';
import { SubscriptionTier, SUBSCRIPTION_PLANS } from '../services/subscriptionManager';
import {
  getLemonSqueezyConfig,
  saveLemonSqueezyConfig,
  LemonSqueezyConfig,
  processLemonSqueezyWebhook,
} from '../services/lemonSqueezyService';

interface AdminPanelDashboardProps {
  isLight: boolean;
  onNavigateScanner?: () => void;
}

type AdminTab = 'users' | 'transactions' | 'lemonsqueezy' | 'gateways' | 'system';

export const AdminPanelDashboard: React.FC<AdminPanelDashboardProps> = ({
  isLight,
  onNavigateScanner,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [users, setUsers] = useState<AdminUserRecord[]>(() => getAdminUsersList());
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => getAdminTransactions());
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<'all' | SubscriptionTier>('all');

  // Lemon Squeezy Automation Config State
  const [lemonConfig, setLemonConfig] = useState<LemonSqueezyConfig>(() => getLemonSqueezyConfig());
  const [showApiKey, setShowApiKey] = useState(false);
  const [simulatedEmail, setSimulatedEmail] = useState('creator@youtube.studio');
  const [simulatedTier, setSimulatedTier] = useState<SubscriptionTier>('pro');
  const [simulatedEvent, setSimulatedEvent] = useState<'subscription_created' | 'subscription_cancelled'>('subscription_created');

  // Gift Modal State
  const [selectedUserForGift, setSelectedUserForGift] = useState<AdminUserRecord | null>(null);
  const [giftTier, setGiftTier] = useState<SubscriptionTier>('pro');
  const [giftDuration, setGiftDuration] = useState<'1_month' | '1_year' | 'lifetime'>('1_month');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Manual Payment Record Modal State
  const [isManualPaymentModalOpen, setIsManualPaymentModalOpen] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualTier, setManualTier] = useState<SubscriptionTier>('pro');
  const [manualAmount, setManualAmount] = useState('29');
  const [manualCurrency, setManualCurrency] = useState<'USD' | 'PKR' | 'USDT'>('USD');
  const [manualMethod, setManualMethod] = useState<PaymentTransaction['method']>('raast_ubl');
  const [manualRef, setManualRef] = useState('');

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || u.tier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleApplyGift = () => {
    if (!selectedUserForGift) return;
    const updated = adminSetUserTier(selectedUserForGift.id, giftTier, true, giftDuration);
    setUsers(updated);
    setTransactions(getAdminTransactions());
    showToast(`Successfully gifted ${SUBSCRIPTION_PLANS[giftTier].name} to ${selectedUserForGift.email}!`);
    setSelectedUserForGift(null);
  };

  const handleQuickResetQuota = (u: AdminUserRecord) => {
    const updated = adminResetUserScanQuota(u.id);
    setUsers(updated);
    showToast(`Monthly scan quota reset to 5/5 for ${u.email}`);
  };

  const handleRecordPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;

    adminRecordManualPayment({
      email: manualEmail.trim(),
      tier: manualTier,
      amount: parseFloat(manualAmount) || 29,
      currency: manualCurrency,
      method: manualMethod,
      transactionRef: manualRef.trim() || `MANUAL_REF_${Date.now()}`,
    });

    setUsers(getAdminUsersList());
    setTransactions(getAdminTransactions());
    setIsManualPaymentModalOpen(false);
    showToast(`Payment recorded and ${manualTier.toUpperCase()} activated for ${manualEmail}!`);
    setManualEmail('');
    setManualRef('');
  };

  // Metrics calculations
  const totalRevenueUSD = transactions
    .filter((t) => t.status === 'completed' && t.method !== 'admin_gift')
    .reduce((acc, curr) => {
      if (curr.currency === 'USD' || curr.currency === 'USDT') return acc + curr.amount;
      if (curr.currency === 'PKR') return acc + curr.amount / 280;
      return acc;
    }, 0);

  const proCount = users.filter((u) => u.tier === 'pro').length;
  const enterpriseCount = users.filter((u) => u.tier === 'enterprise').length;
  const freeCount = users.filter((u) => u.tier === 'free').length;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Toast Notification */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-white font-sans text-xs font-bold shadow-xl shadow-emerald-900/40"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Superadmin Header Banner */}
      <div
        className={`rounded-3xl border p-5 sm:p-6 transition shadow-xs relative overflow-hidden ${
          isLight
            ? 'border-slate-200 bg-white text-slate-900 shadow-slate-200/50'
            : 'border-slate-800 bg-[#0d1322] text-slate-100'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 text-white shadow-lg shadow-rose-950/30 shrink-0">
              <ShieldCheck className="h-6 w-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-black tracking-tight">
                  Striku Admin Mission Control
                </h1>
                <span className="rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-rose-400">
                  SUPERADMIN
                </span>
              </div>
              <p className="font-sans text-xs text-slate-400 mt-1">
                Authenticated as <strong className="text-white">{ADMIN_EMAIL}</strong> • Complete control over subscriptions, payments, and users.
              </p>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsManualPaymentModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white px-3.5 py-2 text-xs font-bold transition shadow-md shadow-red-900/30 cursor-pointer active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Record Payment / Add User</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/60">
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Total Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="font-display text-xl font-bold text-white">
              ${Math.round(totalRevenueUSD).toLocaleString()} <span className="text-xs text-emerald-400 font-mono">+18%</span>
            </div>
            <span className="text-[10px] text-slate-500">Live gross sales</span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Agency $80 Tier</span>
              <Building2 className="h-4 w-4 text-amber-400" />
            </div>
            <div className="font-display text-xl font-bold text-amber-400">
              {enterpriseCount} Studios
            </div>
            <span className="text-[10px] text-slate-500">${enterpriseCount * 80}/mo MRR</span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Creator Pro $29</span>
              <Sparkles className="h-4 w-4 text-rose-400" />
            </div>
            <div className="font-display text-xl font-bold text-rose-400">
              {proCount} Creators
            </div>
            <span className="text-[10px] text-slate-500">${proCount * 29}/mo MRR</span>
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-3.5">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-xs font-semibold">Free Users</span>
              <Users className="h-4 w-4 text-slate-400" />
            </div>
            <div className="font-display text-xl font-bold text-white">
              {freeCount} Creators
            </div>
            <span className="text-[10px] text-slate-500">5 Free scans/month</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'users'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>User Accounts & Gifting ({users.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'transactions'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Payments & Ledger ({transactions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lemonsqueezy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'lemonsqueezy'
              ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Zap className="h-4 w-4" />
          <span>🍋 Lemon Squeezy Auto-Payment &amp; API</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gateways')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'gateways'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Globe className="h-4 w-4" />
          <span>Pakistan & Global Payout Setup Guide</span>
        </button>
      </div>

      {/* TAB 1: USERS & GIFTING */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search user email or channel name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-400 font-semibold">Filter Plan:</span>
              <div className="flex rounded-xl border border-slate-800 bg-slate-900 p-1 text-xs font-semibold">
                {(['all', 'free', 'pro', 'enterprise'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTierFilter(t)}
                    className={`px-3 py-1 rounded-lg capitalize transition cursor-pointer ${
                      tierFilter === t ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Table */}
          <div
            className={`rounded-3xl border overflow-hidden transition shadow-xs ${
              isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/90'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-3.5 sm:p-4">Creator / Email</th>
                    <th className="p-3.5 sm:p-4">Subscription Plan</th>
                    <th className="p-3.5 sm:p-4">Audits Run</th>
                    <th className="p-3.5 sm:p-4">Monthly Quota</th>
                    <th className="p-3.5 sm:p-4">Gift Status</th>
                    <th className="p-3.5 sm:p-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredUsers.map((u) => {
                    const isLimitBlocked = u.tier === 'free' && u.remainingScans <= 0;
                    return (
                      <tr key={u.id} className="hover:bg-slate-850/40 transition">
                        {/* Name & Email */}
                        <td className="p-3.5 sm:p-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-rose-600 to-indigo-600 text-white font-bold text-xs shrink-0">
                              {u.displayName[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">
                                {u.displayName}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono truncate block">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Subscription Tier Badge */}
                        <td className="p-3.5 sm:p-4">
                          {u.tier === 'enterprise' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-amber-300">
                              <Building2 className="h-3 w-3" />
                              <span>Agency $80</span>
                            </span>
                          ) : u.tier === 'pro' ? (
                            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-mono font-bold text-rose-300">
                              <Sparkles className="h-3 w-3" />
                              <span>Creator Pro $29</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800 px-2.5 py-0.5 text-[10px] font-mono font-bold text-slate-300">
                              <span>Starter Free</span>
                            </span>
                          )}
                        </td>

                        {/* Audits Run */}
                        <td className="p-3.5 sm:p-4 font-mono text-slate-300">
                          {u.totalScans} videos
                        </td>

                        {/* Monthly Quota */}
                        <td className="p-3.5 sm:p-4">
                          {u.tier === 'free' ? (
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-mono font-bold ${
                                  isLimitBlocked ? 'text-red-400' : 'text-emerald-400'
                                }`}
                              >
                                {u.remainingScans}/5 left
                              </span>
                              {isLimitBlocked && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickResetQuota(u)}
                                  className="text-[10px] underline text-rose-400 hover:text-rose-300 cursor-pointer"
                                  title="Reset back to 5 free scans"
                                >
                                  Reset
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="font-mono text-emerald-400 font-bold">Unlimited</span>
                          )}
                        </td>

                        {/* Gift status */}
                        <td className="p-3.5 sm:p-4">
                          {u.isGifted ? (
                            <span className="inline-flex items-center gap-1 text-[11px] text-amber-300 font-semibold">
                              <Gift className="h-3 w-3 text-amber-400" />
                              <span>Gifted ({u.giftExpiresAt || 'Active'})</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Paid / Organic</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 sm:p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUserForGift(u)}
                            className="inline-flex items-center gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-2.5 py-1 text-[11px] font-bold transition cursor-pointer"
                            title="Gift Free Pro or Enterprise"
                          >
                            <Gift className="h-3 w-3" />
                            <span>Gift Subscription</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nextTier: SubscriptionTier =
                                u.tier === 'free' ? 'pro' : u.tier === 'pro' ? 'enterprise' : 'free';
                              const updated = adminSetUserTier(u.id, nextTier, false);
                              setUsers(updated);
                              showToast(`Switched ${u.email} to ${nextTier.toUpperCase()}`);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer"
                            title="Cycle plan"
                          >
                            <span>Toggle Tier</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRANSACTIONS & LEDGER */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Payment History & Global Order Ledger
              </h3>
              <p className="font-sans text-xs text-slate-400">
                All transactions via Lemon Squeezy, Stripe, Binance Pay USDT, Raast, and Local PK.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsManualPaymentModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Record Manual Payment</span>
            </button>
          </div>

          <div
            className={`rounded-3xl border overflow-hidden transition shadow-xs ${
              isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-slate-900/90'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-mono text-[11px] uppercase">
                  <tr>
                    <th className="p-3.5 sm:p-4">Customer</th>
                    <th className="p-3.5 sm:p-4">Tier</th>
                    <th className="p-3.5 sm:p-4">Amount</th>
                    <th className="p-3.5 sm:p-4">Payment Method</th>
                    <th className="p-3.5 sm:p-4">Reference / Order ID</th>
                    <th className="p-3.5 sm:p-4">Date & Time</th>
                    <th className="p-3.5 sm:p-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-850/40 transition">
                      <td className="p-3.5 sm:p-4 font-bold text-white">
                        {tx.userEmail}
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <span className="font-mono text-[10px] font-bold uppercase text-slate-300">
                          {tx.tier}
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4 font-mono font-bold text-emerald-400">
                        {tx.currency === 'USD'
                          ? `$${tx.amount}.00`
                          : tx.currency === 'USDT'
                          ? `${tx.amount} USDT`
                          : `PKR ${tx.amount.toLocaleString()}`}
                      </td>

                      <td className="p-3.5 sm:p-4">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded-lg border border-slate-700">
                          {tx.method === 'card_lemon_squeezy' && 'Lemon Squeezy Card'}
                          {tx.method === 'card_stripe' && 'Stripe Card'}
                          {tx.method === 'crypto_usdt' && 'USDT TRC-20'}
                          {tx.method === 'jazzcash' && 'JazzCash PK'}
                          {tx.method === 'raast_ubl' && 'Raast / UBL Bank'}
                          {tx.method === 'admin_gift' && 'Admin Gift (Free)'}
                        </span>
                      </td>

                      <td className="p-3.5 sm:p-4 font-mono text-[11px] text-slate-400">
                        {tx.transactionRef}
                      </td>

                      <td className="p-3.5 sm:p-4 text-slate-400 text-[11px] font-mono">
                        {tx.createdAt}
                      </td>

                      <td className="p-3.5 sm:p-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>PAID</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAYMENT GATEWAY ARCHITECTURE & PAKISTAN WITHDRAWAL GUIDE */}
      {activeTab === 'gateways' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-rose-500/40 bg-gradient-to-br from-rose-950/30 to-slate-900 p-5 sm:p-6 text-white">
            <h2 className="font-display text-xl font-bold mb-2">
              Payment Gateway Setup Guide: Receive Money Worldwide & Withdraw to Pakistan (UBL / Meezan)
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
              Below is the exact blueprint to accept payments from USA, Europe, India, Pakistan, and worldwide, and withdraw the USD earnings directly to your Pakistani bank account (such as <strong>UBL</strong>, Meezan Bank, or HBL).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* GATEWAY 1: LEMON SQUEEZY (RECOMMENDED) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base">
                        Lemon Squeezy
                      </h4>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        #1 RECOMMENDED FOR PK
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Lemon Squeezy is a <strong>Merchant of Record (MoR)</strong>. You do NOT need a US/UK company to register. It supports Pakistani founders directly.
                </p>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block font-bold">
                    How it works:
                  </span>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-amber-400">1.</span>
                    <span>Sign up at <strong>lemonsqueezy.com</strong> using your CNIC & Pakistani address.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-amber-400">2.</span>
                    <span>Create subscription products: <strong>Creator Pro ($29)</strong> and <strong>Agency Studio ($80)</strong>.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-amber-400">3.</span>
                    <span>Accept all Credit/Debit cards, Apple Pay, Google Pay worldwide.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-emerald-400">4.</span>
                    <span><strong>Payout to UBL:</strong> Link your <strong>Payoneer</strong> or <strong>Elevate Pay</strong> account in Lemon Squeezy settings. Withdraw USD straight into your Pakistani UBL bank account!</span>
                  </div>
                </div>
              </div>

              <a
                href="https://www.lemonsqueezy.com"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-2.5 transition"
              >
                <span>Visit LemonSqueezy.com</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* GATEWAY 2: BINANCE PAY / USDT CRYPTO */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Coins className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base">
                        Binance Pay & USDT
                      </h4>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        FASTEST CASHOUT IN PK
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Zero transaction limits, zero chargebacks, and instant cashout in Pakistan via Binance P2P.
                </p>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block font-bold">
                    How it works:
                  </span>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-emerald-400">1.</span>
                    <span>Create a verified Binance account with your Pakistani CNIC.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-emerald-400">2.</span>
                    <span>Customers pay $29 or $80 in USDT (TRC-20 or Binance Pay ID).</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-emerald-400">3.</span>
                    <span><strong>Withdraw to UBL / Easypaisa:</strong> Open Binance P2P & sell USDT for PKR. The buyer transfers PKR directly to your UBL bank account in 60 seconds!</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-2.5 text-xs text-emerald-300 text-center font-bold">
                ✓ 100% borderless, instant settlement
              </div>
            </div>

            {/* GATEWAY 3: STRIPE VIA UK LTD / US LLC */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 space-y-3.5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-white text-base">
                        Stripe via UK Ltd
                      </h4>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold">
                        GLOBAL ENTERPRISE
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  For full global enterprise SaaS valuation. Open a UK company online from Pakistan ($15-20 cost) to get an official Stripe account.
                </p>

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 space-y-2 text-xs">
                  <span className="text-[11px] font-mono uppercase text-slate-400 block font-bold">
                    How it works:
                  </span>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-indigo-400">1.</span>
                    <span>Register a UK Ltd via 1st Formations / Companies House ($18).</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-indigo-400">2.</span>
                    <span>Open a <strong>Wise Business</strong> or <strong>Payoneer UK</strong> account.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-indigo-400">3.</span>
                    <span>Set up Stripe with UK Ltd details and link Wise/Payoneer.</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-slate-300">
                    <span className="font-bold text-indigo-400">4.</span>
                    <span>Wise/Payoneer automatically sends funds to your <strong>UBL Bank</strong> in PKR.</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-2.5 text-xs text-indigo-300 text-center font-bold">
                ✓ Full recurring card subscriptions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LEMON SQUEEZY AUTOMATION & API SETUP */}
      {activeTab === 'lemonsqueezy' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-5 sm:p-7 text-white shadow-xl">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
              <Zap className="h-4 w-4" />
              <span>Merchant of Record (MoR) Auto-Payment & Webhooks</span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-black">
              Lemon Squeezy API & Automatic Subscription Engine
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Lemon Squeezy handles worldwide credit cards, Apple Pay, Google Pay, and international taxes. Here is the exact blueprint of how Lemon Squeezy connects with this website to automatically charge users and upgrade their accounts instantly upon payment.
            </p>
          </div>

          {/* 4 Core Data Points Lemon Squeezy Provides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">Key 01</span>
                <span className="text-xs">🏪</span>
              </div>
              <h4 className="font-display text-sm font-bold text-white">Store ID / Slug</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Your unique digital storefront name (e.g. <code className="text-amber-300 font-mono">striku</code>). All checkout URLs are prefixed with this.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-rose-400 uppercase">Key 02</span>
                <span className="text-xs">📦</span>
              </div>
              <h4 className="font-display text-sm font-bold text-white">Product Variant IDs</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Every plan ($19, $39, $80) gets a numeric Variant ID. Our buttons use this ID to open the exact checkout overlay.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase">Key 03</span>
                <span className="text-xs">🔑</span>
              </div>
              <h4 className="font-display text-sm font-bold text-white">API Key (Bearer)</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                Generated under <em>Settings &gt; API</em>. Lets your application query active customer subscriptions and status automatically.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-emerald-400 uppercase">Key 04</span>
                <span className="text-xs">⚡</span>
              </div>
              <h4 className="font-display text-sm font-bold text-white">Webhook Signing Secret</h4>
              <p className="text-[11px] text-slate-400 leading-snug">
                When a card is charged, Lemon Squeezy pings our Webhook URL with a signed signature to trigger instant instant tier upgrades.
              </p>
            </div>
          </div>

          {/* Interactive Webhook Simulator & Credentials Editor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Form 1: API & Variant Keys Configuration */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-amber-400" />
                  <h3 className="font-display text-base font-bold text-white">
                    Lemon Squeezy Credentials
                  </h3>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-mono font-bold text-emerald-300">
                  AUTO-SAVED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Store Slug / Subdomain:
                  </label>
                  <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono">
                    <span className="text-slate-500 mr-1">https://</span>
                    <input
                      type="text"
                      value={lemonConfig.storeSlug}
                      onChange={(e) => setLemonConfig({ ...lemonConfig, storeSlug: e.target.value })}
                      className="bg-transparent border-none outline-none flex-1 text-amber-300"
                      placeholder="your-store-slug"
                    />
                    <span className="text-slate-500">.lemonsqueezy.com</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-400 font-semibold">
                      Live / Test API Key:
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="text-[10px] text-amber-400 hover:underline cursor-pointer"
                    >
                      {showApiKey ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={lemonConfig.apiKey}
                    onChange={(e) => setLemonConfig({ ...lemonConfig, apiKey: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white outline-none focus:border-amber-500"
                    placeholder="lsq_live_..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                      Creator Shield ($19) Variant:
                    </label>
                    <input
                      type="text"
                      value={lemonConfig.variantShield19}
                      onChange={(e) => setLemonConfig({ ...lemonConfig, variantShield19: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-emerald-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                      Creator Pro ($39) Variant:
                    </label>
                    <input
                      type="text"
                      value={lemonConfig.variantPro39}
                      onChange={(e) => setLemonConfig({ ...lemonConfig, variantPro39: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-rose-300 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 font-medium mb-1">
                      Agency Master ($80) Variant:
                    </label>
                    <input
                      type="text"
                      value={lemonConfig.variantAgency80}
                      onChange={(e) => setLemonConfig({ ...lemonConfig, variantAgency80: e.target.value })}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-2.5 py-1.5 font-mono text-xs text-amber-300 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Webhook Signing Secret:
                  </label>
                  <input
                    type="password"
                    value={lemonConfig.webhookSecret}
                    onChange={(e) => setLemonConfig({ ...lemonConfig, webhookSecret: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 font-mono text-xs text-white outline-none focus:border-amber-500"
                    placeholder="whsec_..."
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="liveModeCheck"
                      checked={lemonConfig.isLiveMode}
                      onChange={(e) => setLemonConfig({ ...lemonConfig, isLiveMode: e.target.checked })}
                      className="rounded border-slate-800 text-amber-500 cursor-pointer"
                    />
                    <label htmlFor="liveModeCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                      Enable Live Production Mode
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      saveLemonSqueezyConfig(lemonConfig);
                      showToast('Lemon Squeezy API credentials saved successfully!');
                    }}
                    className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 text-xs transition cursor-pointer"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            </div>

            {/* Form 2: Real-Time Webhook Simulator (Test Live Flow) */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 sm:p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-display text-base font-bold text-white">
                      Live Webhook Simulator
                    </h3>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">
                    TEST AUTOMATION
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Test the entire automatic subscription lifecycle without spending real money. Trigger a synthetic Lemon Squeezy webhook to verify that user accounts automatically unlock their paid plan instantly.
                </p>

                <div className="space-y-3 mt-4 text-xs">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">
                      Target User Email to Upgrade:
                    </label>
                    <input
                      type="email"
                      value={simulatedEmail}
                      onChange={(e) => setSimulatedEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white font-mono text-xs outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">
                        Webhook Event:
                      </label>
                      <select
                        value={simulatedEvent}
                        onChange={(e) => setSimulatedEvent(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white text-xs outline-none"
                      >
                        <option value="subscription_created">subscription_created (Upgrade)</option>
                        <option value="subscription_cancelled">subscription_cancelled (Downgrade)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-400 font-semibold mb-1">
                        Purchased Tier:
                      </label>
                      <select
                        value={simulatedTier}
                        onChange={(e) => setSimulatedTier(e.target.value as any)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-white text-xs outline-none"
                      >
                        <option value="shield">Creator Shield ($19/mo)</option>
                        <option value="pro">Creator Pro ($39/mo)</option>
                        <option value="enterprise">Agency Master ($80/mo)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const price = simulatedTier === 'enterprise' ? 80 : simulatedTier === 'shield' ? 19 : 39;
                    const res = processLemonSqueezyWebhook({
                      event_name: simulatedEvent,
                      data: {
                        attributes: {
                          user_email: simulatedEmail,
                          product_name: `Striku ${SUBSCRIPTION_PLANS[simulatedTier].name}`,
                          total: price * 100,
                          currency: 'USD',
                          status: 'active',
                        },
                        custom_data: {
                          tier: simulatedTier,
                        },
                      },
                    });

                    // Sync local user list and ledger
                    setUsers(getAdminUsersList());
                    setTransactions(getAdminTransactions());
                    showToast(res.message);
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold py-2.5 text-xs transition cursor-pointer shadow-md"
                >
                  🚀 Fire Simulated Webhook (Test Auto-Upgrade)
                </button>
                <span className="block text-[10px] text-center text-slate-500 font-mono">
                  Updates local database and emits real-time tier upgrade event
                </span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Lemon Squeezy Account Setup Guide from Pakistan */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <span className="text-amber-400">📌</span>
              <span>Step-by-Step: Lemon Squeezy Account Setup & Documents Required</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <h4 className="font-display font-bold text-white text-sm">
                  1. Required Information & Documents:
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-400">
                  <li><strong>Pakistani CNIC / Smart Card</strong> or Passport (as Individual/Freelancer).</li>
                  <li><strong>Active Website URL:</strong> Provide this application&apos;s URL (or custom domain).</li>
                  <li><strong>Published Legal Pages:</strong> Already generated on your website (FAQ, 14-Day Refund Policy, Privacy Policy, Terms, About Us, Contact Desk).</li>
                  <li><strong>Payoneer / Elevate Pay Account:</strong> For receiving USD and direct transfer to Pakistani Bank (UBL).</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <h4 className="font-display font-bold text-white text-sm">
                  2. Exact 4 Steps to Live Payments:
                </h4>
                <ol className="space-y-1.5 list-decimal pl-4 text-slate-400">
                  <li>Go to <strong>lemonsqueezy.com</strong> and click <em>Get Started</em>. Choose <strong>Individual</strong>.</li>
                  <li>Create 3 Subscription Products: <strong>Creator Shield ($19)</strong>, <strong>Creator Pro ($39)</strong>, <strong>Agency Master ($80)</strong>.</li>
                  <li>Copy each product&apos;s <strong>Variant ID</strong> and paste them in the form above.</li>
                  <li>Add your Webhook URL in Lemon Squeezy (<em>Settings &gt; Webhooks</em>) with <code>subscription_created</code> enabled.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: GIFT SUBSCRIPTION TO USER */}
      <AnimatePresence>
        {selectedUserForGift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUserForGift(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0d1322] p-6 text-white shadow-2xl z-10 my-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">
                      Gift Free Subscription
                    </h3>
                    <p className="text-xs text-slate-400">
                      Grant free premium tier to: <strong>{selectedUserForGift.email}</strong>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedUserForGift(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Select Gifted Plan:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setGiftTier('pro')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      giftTier === 'pro'
                        ? 'border-rose-500 bg-rose-500/20 text-white ring-1 ring-rose-500'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-sm">Creator Pro</div>
                    <div className="text-[11px] text-slate-400">$29/mo value • Unlimited</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGiftTier('enterprise')}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer ${
                      giftTier === 'enterprise'
                        ? 'border-amber-500 bg-amber-500/20 text-white ring-1 ring-amber-500'
                        : 'border-slate-800 bg-slate-900 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-sm">Agency Studio</div>
                    <div className="text-[11px] text-slate-400">$80/mo value • AI Appeals</div>
                  </button>
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Gift Duration:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: '1_month', label: '1 Month' },
                    { id: '1_year', label: '1 Year' },
                    { id: 'lifetime', label: 'Lifetime' },
                  ].map((dur) => (
                    <button
                      key={dur.id}
                      type="button"
                      onClick={() => setGiftDuration(dur.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition cursor-pointer ${
                        giftDuration === dur.id
                          ? 'border-emerald-500 bg-emerald-500/20 text-white'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleApplyGift}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-display font-bold py-3 text-sm transition shadow-lg shadow-amber-900/30 cursor-pointer"
                >
                  <Gift className="h-4 w-4" />
                  <span>Grant Free Subscription Now</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: RECORD OFFLINE / MANUAL PAYMENT */}
      <AnimatePresence>
        {isManualPaymentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManualPaymentModalOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-800 bg-[#0d1322] p-6 text-white shadow-2xl z-10 my-auto space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base">
                      Record Offline / Manual Payment
                    </h3>
                    <p className="text-xs text-slate-400">
                      Activate a user who paid via Raast, UBL Bank, Cash, or USDT
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsManualPaymentModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleRecordPaymentSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    User Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="creator@youtube.channel"
                    value={manualEmail}
                    onChange={(e) => setManualEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Plan to Activate
                    </label>
                    <select
                      value={manualTier}
                      onChange={(e) => {
                        const t = e.target.value as SubscriptionTier;
                        setManualTier(t);
                        setManualAmount(t === 'enterprise' ? '80' : '29');
                      }}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      <option value="pro">Creator Pro ($29/mo)</option>
                      <option value="enterprise">Agency Studio ($80/mo)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Payment Channel
                    </label>
                    <select
                      value={manualMethod}
                      onChange={(e) => setManualMethod(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      <option value="raast_ubl">Raast / UBL Bank PK</option>
                      <option value="jazzcash">JazzCash PK</option>
                      <option value="easypaisa">Easypaisa PK</option>
                      <option value="crypto_usdt">Binance Pay / USDT</option>
                      <option value="card_lemon_squeezy">Lemon Squeezy</option>
                      <option value="card_stripe">Stripe</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Amount Paid
                    </label>
                    <input
                      type="number"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(e.target.value)}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-mono text-white focus:border-rose-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">
                      Currency
                    </label>
                    <select
                      value={manualCurrency}
                      onChange={(e) => setManualCurrency(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white focus:border-rose-500 focus:outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="PKR">PKR (Rs)</option>
                      <option value="USDT">USDT</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Bank / Transaction Ref (TID)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UBL-TID-89218 or TRX-992"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-display font-bold py-3 text-sm transition shadow-lg shadow-red-900/30 cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Activate User & Save Record</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
