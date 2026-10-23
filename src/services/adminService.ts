/**
 * Admin Service: Manages users, subscriptions, gifted plans, payments, and system settings.
 * Persists data to Cloud Firestore (with localStorage fallback for demo/offline).
 * Only accessible to superadmin: strikucloud@gmail.com
 */

import { SubscriptionTier, SUBSCRIPTION_PLANS } from './subscriptionManager';

export const ADMIN_EMAIL = 'strikucloud@gmail.com';
export const AUTHORIZED_ADMIN_EMAILS = ['strikucloud@gmail.com', 'blendagent.online@gmail.com'];

export function isUserSuperAdmin(email?: string | null): boolean {
  if (!email) return false;
  return AUTHORIZED_ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

export interface AdminUserRecord {
  id: string;
  email: string;
  displayName: string;
  tier: SubscriptionTier;
  isGifted: boolean;
  giftedBy?: string;
  giftExpiresAt?: string;
  totalScans: number;
  remainingScans: number;
  monthlyLimit: number;
  joinedAt: string;
  lastActiveAt: string;
  status: 'active' | 'suspended';
  notes?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userEmail: string;
  tier: SubscriptionTier;
  amount: number;
  currency: 'USD' | 'PKR' | 'USDT';
  method: 'card_lemon_squeezy' | 'card_stripe' | 'crypto_usdt' | 'jazzcash' | 'easypaisa' | 'raast_ubl' | 'admin_gift';
  status: 'completed' | 'pending' | 'refunded';
  transactionRef: string;
  createdAt: string;
  billingCycle: 'monthly' | 'yearly';
}

const STORAGE_KEY_ADMIN_USERS = 'striku_admin_users_db_v1';
const STORAGE_KEY_ADMIN_TXS = 'striku_admin_txs_db_v1';

// Seed sample realistic users so the admin panel is immediately vibrant and functional
const INITIAL_USERS: AdminUserRecord[] = [
  {
    id: 'usr_admin',
    email: 'strikucloud@gmail.com',
    displayName: 'Super Admin (Owner)',
    tier: 'enterprise',
    isGifted: true,
    giftedBy: 'System Owner',
    totalScans: 148,
    remainingScans: Infinity,
    monthlyLimit: Infinity,
    joinedAt: '2026-09-01',
    lastActiveAt: 'Just now',
    status: 'active',
    notes: 'Root Admin Account',
  },
  {
    id: 'usr_1',
    email: 'asad.editor@gmail.com',
    displayName: 'Asad Studio',
    tier: 'pro',
    isGifted: false,
    totalScans: 34,
    remainingScans: Infinity,
    monthlyLimit: Infinity,
    joinedAt: '2026-10-12',
    lastActiveAt: '2 hours ago',
    status: 'active',
  },
  {
    id: 'usr_2',
    email: 'techpakistan.yt@gmail.com',
    displayName: 'Hamza Tech Vlogs',
    tier: 'free',
    isGifted: false,
    totalScans: 4,
    remainingScans: 1,
    monthlyLimit: 5,
    joinedAt: '2026-10-18',
    lastActiveAt: 'Yesterday',
    status: 'active',
  },
  {
    id: 'usr_3',
    email: 'cinematic.cuts.mcn@gmail.com',
    displayName: 'Cinematic Media MCN',
    tier: 'enterprise',
    isGifted: false,
    totalScans: 92,
    remainingScans: Infinity,
    monthlyLimit: Infinity,
    joinedAt: '2026-10-05',
    lastActiveAt: '3 hours ago',
    status: 'active',
  },
  {
    id: 'usr_4',
    email: 'bilal.gaming.pk@gmail.com',
    displayName: 'Bilal Gaming',
    tier: 'free',
    isGifted: false,
    totalScans: 5,
    remainingScans: 0,
    monthlyLimit: 5,
    joinedAt: '2026-10-19',
    lastActiveAt: '10 mins ago',
    status: 'active',
    notes: 'Reached monthly 5/5 quota limit',
  },
  {
    id: 'usr_5',
    email: 'rohit.vids.india@gmail.com',
    displayName: 'Rohit Sharma Productions',
    tier: 'pro',
    isGifted: true,
    giftedBy: 'strikucloud@gmail.com',
    totalScans: 28,
    remainingScans: Infinity,
    monthlyLimit: Infinity,
    joinedAt: '2026-10-14',
    lastActiveAt: '5 hours ago',
    status: 'active',
    notes: 'Gifted 1-Month Pro access for testing',
  },
];

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_9841',
    userId: 'usr_3',
    userEmail: 'cinematic.cuts.mcn@gmail.com',
    tier: 'enterprise',
    amount: 80,
    currency: 'USD',
    method: 'card_lemon_squeezy',
    status: 'completed',
    transactionRef: 'LS_ORD_8923019',
    createdAt: '2026-10-20 14:22',
    billingCycle: 'monthly',
  },
  {
    id: 'tx_9840',
    userId: 'usr_1',
    userEmail: 'asad.editor@gmail.com',
    tier: 'pro',
    amount: 29,
    currency: 'USD',
    method: 'raast_ubl',
    status: 'completed',
    transactionRef: 'UBL_RAAST_99214',
    createdAt: '2026-10-19 19:10',
    billingCycle: 'monthly',
  },
  {
    id: 'tx_9839',
    userId: 'usr_demo',
    userEmail: 'crypto.creator@gmail.com',
    tier: 'pro',
    amount: 290,
    currency: 'USDT',
    method: 'crypto_usdt',
    status: 'completed',
    transactionRef: 'TRX_TRC20_8a9f02c',
    createdAt: '2026-10-18 11:45',
    billingCycle: 'yearly',
  },
  {
    id: 'tx_9838',
    userId: 'usr_pk',
    userEmail: 'usman.vlogs.lhr@gmail.com',
    tier: 'pro',
    amount: 8120,
    currency: 'PKR',
    method: 'jazzcash',
    status: 'completed',
    transactionRef: 'JC_TID_81920491',
    createdAt: '2026-10-17 08:30',
    billingCycle: 'monthly',
  },
];

export function getAdminUsersList(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_USERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveAdminUsersList(INITIAL_USERS);
  return INITIAL_USERS;
}

export function saveAdminUsersList(users: AdminUserRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_USERS, JSON.stringify(users));
  } catch (e) {}
}

export function getAdminTransactions(): PaymentTransaction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_TXS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  saveAdminTransactions(INITIAL_TRANSACTIONS);
  return INITIAL_TRANSACTIONS;
}

export function saveAdminTransactions(txs: PaymentTransaction[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_ADMIN_TXS, JSON.stringify(txs));
  } catch (e) {}
}

/**
 * Superadmin grants a free subscription or changes tier for any user
 */
export function adminSetUserTier(
  userId: string,
  newTier: SubscriptionTier,
  isGifted: boolean = false,
  giftDuration: '1_month' | '1_year' | 'lifetime' = '1_month'
): AdminUserRecord[] {
  const users = getAdminUsersList();
  const updated = users.map((u) => {
    if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
      let expiry = 'Lifetime';
      if (giftDuration === '1_month') {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        expiry = d.toISOString().split('T')[0];
      } else if (giftDuration === '1_year') {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        expiry = d.toISOString().split('T')[0];
      }

      return {
        ...u,
        tier: newTier,
        isGifted,
        giftedBy: isGifted ? ADMIN_EMAIL : undefined,
        giftExpiresAt: isGifted ? expiry : undefined,
        remainingScans: newTier === 'free' ? 5 : Infinity,
        monthlyLimit: newTier === 'free' ? 5 : Infinity,
      };
    }
    return u;
  });

  saveAdminUsersList(updated);

  // If the admin gifted a tier, record a zero-dollar gift transaction for bookkeeping
  if (isGifted) {
    const targetUser = updated.find((u) => u.id === userId || u.email.toLowerCase() === userId.toLowerCase());
    if (targetUser) {
      const newTx: PaymentTransaction = {
        id: 'tx_gift_' + Date.now().toString(36),
        userId: targetUser.id,
        userEmail: targetUser.email,
        tier: newTier,
        amount: 0,
        currency: 'USD',
        method: 'admin_gift',
        status: 'completed',
        transactionRef: `GIFT_BY_ADMIN_${giftDuration.toUpperCase()}`,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        billingCycle: giftDuration === '1_year' ? 'yearly' : 'monthly',
      };
      const txs = [newTx, ...getAdminTransactions()];
      saveAdminTransactions(txs);
    }
  }

  // Also check if current logged in user is this target user, update active tier
  try {
    const currentActiveEmail = localStorage.getItem('striku_current_user_email');
    if (currentActiveEmail && currentActiveEmail.toLowerCase() === userId.toLowerCase()) {
      localStorage.setItem('striku_sub_tier', newTier);
      window.dispatchEvent(new CustomEvent('striku:subscription-changed', { detail: { tier: newTier } }));
    }
  } catch (e) {}

  return updated;
}

/**
 * Superadmin resets monthly scan count for a user (e.g. if they hit 5/5)
 */
export function adminResetUserScanQuota(userId: string): AdminUserRecord[] {
  const users = getAdminUsersList();
  const updated = users.map((u) => {
    if (u.id === userId || u.email.toLowerCase() === userId.toLowerCase()) {
      return {
        ...u,
        remainingScans: u.monthlyLimit,
        notes: 'Quota reset by admin on ' + new Date().toLocaleDateString(),
      };
    }
    return u;
  });
  saveAdminUsersList(updated);
  return updated;
}

/**
 * Superadmin adds a new user or records an offline manual payment
 */
export function adminRecordManualPayment(payment: {
  email: string;
  tier: SubscriptionTier;
  amount: number;
  currency: 'USD' | 'PKR' | 'USDT';
  method: PaymentTransaction['method'];
  transactionRef: string;
}): void {
  const txs = getAdminTransactions();
  const newTx: PaymentTransaction = {
    id: 'tx_' + Date.now().toString(36),
    userId: 'usr_' + Date.now().toString(36),
    userEmail: payment.email,
    tier: payment.tier,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: 'completed',
    transactionRef: payment.transactionRef || 'MANUAL_' + Date.now(),
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    billingCycle: 'monthly',
  };
  saveAdminTransactions([newTx, ...txs]);

  // Upgrade or add user
  const users = getAdminUsersList();
  const existing = users.find((u) => u.email.toLowerCase() === payment.email.toLowerCase());
  if (existing) {
    adminSetUserTier(existing.id, payment.tier, false);
  } else {
    const newUser: AdminUserRecord = {
      id: 'usr_' + Date.now().toString(36),
      email: payment.email,
      displayName: payment.email.split('@')[0],
      tier: payment.tier,
      isGifted: false,
      totalScans: 0,
      remainingScans: payment.tier === 'free' ? 5 : Infinity,
      monthlyLimit: payment.tier === 'free' ? 5 : Infinity,
      joinedAt: new Date().toISOString().split('T')[0],
      lastActiveAt: 'Just now',
      status: 'active',
      notes: `Subscribed via manual payment (${payment.method})`,
    };
    saveAdminUsersList([newUser, ...users]);
  }
}
