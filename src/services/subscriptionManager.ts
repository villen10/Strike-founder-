/**
 * SaaS Subscription & Device Fingerprint Quota Management
 * Handles:
 * 1. Free Starter ($0/mo) - 5 Videos/mo, Max 3 mins, Alert only, Safe Cut Timecodes LOCKED, Appeal LOCKED
 * 2. Creator Shield ($19/mo) - 25 Videos/mo, Full length HD/4K, All Safe Cut Timecodes Unlocked, 3-Pass Multi-Agent
 * 3. Creator Pro ($39/mo) - 75 Videos/mo, AI Strike Counter-Appeal Kit, Side-by-Side 2 Video Compare, Channel Tracker
 * 4. Studio & Agency Master ($80/mo) - Unlimited Videos, Batch 20+ Bulk, 5 Team Seats, PDF Certificates
 */

export type SubscriptionTier = 'free' | 'shield' | 'pro' | 'enterprise';

export interface PlanDetails {
  id: SubscriptionTier;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyScanLimit: number;
  maxVideoDurationSec: number; // in seconds (180 for free = 3 min)
  badge?: string;
  description: string;
  features: string[];
  highlight?: boolean;
}

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, PlanDetails> = {
  free: {
    id: 'free',
    name: 'Free Starter',
    monthlyPrice: 0,
    yearlyPrice: 0,
    monthlyScanLimit: 5,
    maxVideoDurationSec: 180, // Max 3 minutes
    description: 'Basic strike alert scan for Shorts & Reels (upto 3 minutes).',
    features: [
      '5 Video Scans per month (Device bounded)',
      'Shorts & Reels support (Max 3 minutes video length)',
      'Strike Hazard Alert (Critical / Caution / Safe detection)',
      'Community Guidelines violation reason explanation',
      '🔒 Exact Safe Cut Timecodes & Blur Instructions LOCKED',
      '🔒 AI Strike Legal Counter-Appeal Kit LOCKED',
    ],
  },
  shield: {
    id: 'shield',
    name: 'Creator Shield',
    monthlyPrice: 19,
    yearlyPrice: 190,
    monthlyScanLimit: 25,
    maxVideoDurationSec: 3600, // 60 minutes
    badge: 'MOST POPULAR FOR CREATORS',
    highlight: true,
    description: 'For active YouTubers needing frame-accurate safe cut timecodes.',
    features: [
      '25 Video Scans per month (Full HD & 4K length)',
      '✓ ALL Exact Safe Cut & Blur Timecodes UNLOCKED',
      'Second-by-second CapCut & Premiere trim guides',
      'Full 3-Pass Multi-Agent Neural Pipeline (Alpha, Beta, Omega)',
      'Downloadable EDL & Cut Sheet markers',
      'Cloud Audit History persistence',
    ],
  },
  pro: {
    id: 'pro',
    name: 'Creator Pro',
    monthlyPrice: 39,
    yearlyPrice: 390,
    monthlyScanLimit: 75,
    maxVideoDurationSec: 7200, // 2 hours
    badge: 'FULL SUITE',
    description: 'High-volume creators needing AI legal counter-appeals & comparisons.',
    features: [
      '75 Video Scans per month (Full length HD/4K)',
      'Everything in Creator Shield included',
      '✓ 1-Click AI YouTube Legal Counter-Appeal Kit UNLOCKED',
      '✓ Side-by-Side 2 Video Trend Comparison Tool UNLOCKED',
      '✓ Channel Tracker (24h/7d metrics & strike monitoring)',
      'Priority high-speed GPU processing',
    ],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Studio & Agency Master',
    monthlyPrice: 80,
    yearlyPrice: 799,
    monthlyScanLimit: Infinity,
    maxVideoDurationSec: Infinity,
    badge: 'FOR AGENCIES & MCNS',
    description: 'For production houses, editing agencies, and MCN networks.',
    features: [
      'UNLIMITED Video Scans (Zero monthly limits)',
      'Simultaneous Batch Bulk Queue (20+ videos at once)',
      '5 Team Editor Seats & Shared Studio Access',
      'Exportable White-Label PDF Client Audit Certificates',
      'Direct YouTube Studio API Channel Sync',
      'Dedicated 24/7 Strike Defense Concierge',
    ],
  },
};

const STORAGE_KEYS = {
  TIER: 'striku_sub_tier',
  DEVICE_ID: 'striku_device_fp_id',
  SCAN_COUNT: 'striku_device_scan_count',
  CYCLE_START: 'striku_device_cycle_start',
};

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

export function getOrCreateDeviceFingerprint(): string {
  try {
    const existing = localStorage.getItem(STORAGE_KEYS.DEVICE_ID);
    if (existing) return existing;

    const screenData = `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const navData = `${navigator.platform || ''}_${navigator.hardwareConcurrency || 4}_${navigator.language || 'en'}`;
    const raw = `${screenData}_${timezone}_${navData}_${Math.random().toString(36).substring(2, 10)}`;

    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash << 5) - hash + raw.charCodeAt(i);
      hash |= 0;
    }
    const fp = 'dev_' + Math.abs(hash).toString(36) + '_' + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.DEVICE_ID, fp);
    return fp;
  } catch (e) {
    return 'dev_fallback_' + Math.random().toString(36).substring(2, 10);
  }
}

export function getCurrentSubscriptionTier(): SubscriptionTier {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.TIER) as SubscriptionTier;
    if (saved === 'shield' || saved === 'pro' || saved === 'enterprise' || saved === 'free') {
      return saved;
    }
  } catch (e) {}
  return 'free';
}

export function setCurrentSubscriptionTier(tier: SubscriptionTier): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TIER, tier);
    window.dispatchEvent(new CustomEvent('striku:subscription-changed', { detail: { tier } }));
  } catch (e) {}
}

export interface DeviceUsageMetrics {
  usedScans: number;
  totalScans: number;
  remainingScans: number;
  daysUntilReset: number;
  isLimitReached: boolean;
  tier: SubscriptionTier;
  maxVideoDurationSec: number;
}

export function getDeviceScanMetrics(): DeviceUsageMetrics {
  const tier = getCurrentSubscriptionTier();
  const plan = SUBSCRIPTION_PLANS[tier] || SUBSCRIPTION_PLANS.free;

  if (tier === 'enterprise') {
    return {
      usedScans: 0,
      totalScans: Infinity,
      remainingScans: Infinity,
      daysUntilReset: 30,
      isLimitReached: false,
      tier,
      maxVideoDurationSec: Infinity,
    };
  }

  getOrCreateDeviceFingerprint();

  let used = 0;
  let cycleStart = Date.now();

  try {
    const savedCount = localStorage.getItem(STORAGE_KEYS.SCAN_COUNT);
    const savedStart = localStorage.getItem(STORAGE_KEYS.CYCLE_START);

    if (savedStart) {
      cycleStart = parseInt(savedStart, 10);
      const elapsed = Date.now() - cycleStart;
      if (elapsed > MONTH_MS) {
        cycleStart = Date.now();
        used = 0;
        localStorage.setItem(STORAGE_KEYS.CYCLE_START, cycleStart.toString());
        localStorage.setItem(STORAGE_KEYS.SCAN_COUNT, '0');
      } else {
        used = savedCount ? parseInt(savedCount, 10) : 0;
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.CYCLE_START, cycleStart.toString());
      localStorage.setItem(STORAGE_KEYS.SCAN_COUNT, '0');
    }
  } catch (e) {}

  const totalAllowed = plan.monthlyScanLimit;
  const remaining = Math.max(0, totalAllowed - used);
  const elapsed = Date.now() - cycleStart;
  const daysUntilReset = Math.max(1, Math.ceil((MONTH_MS - elapsed) / (24 * 60 * 60 * 1000)));

  return {
    usedScans: used,
    totalScans: totalAllowed,
    remainingScans: remaining,
    daysUntilReset,
    isLimitReached: remaining <= 0,
    tier,
    maxVideoDurationSec: plan.maxVideoDurationSec,
  };
}

export function recordScanAttempt(): { allowed: boolean; remaining: number; reason?: string } {
  const tier = getCurrentSubscriptionTier();
  if (tier === 'enterprise') {
    return { allowed: true, remaining: Infinity };
  }

  const metrics = getDeviceScanMetrics();
  if (metrics.isLimitReached) {
    return {
      allowed: false,
      remaining: 0,
      reason:
        tier === 'free'
          ? 'Free Device Limit Reached: You have used all 5 free trial video scans this month on this device. Upgrade to Creator Shield ($19/mo) to continue scanning.'
          : `Monthly Scan Limit Reached (${metrics.totalScans}/${metrics.totalScans}). Upgrade to Pro or Studio for more scans.`,
    };
  }

  const newUsed = metrics.usedScans + 1;
  try {
    localStorage.setItem(STORAGE_KEYS.SCAN_COUNT, newUsed.toString());
    window.dispatchEvent(new CustomEvent('striku:quota-updated'));
  } catch (e) {}

  return {
    allowed: true,
    remaining: Math.max(0, metrics.totalScans - newUsed),
  };
}

/**
 * Check if a premium feature is unlocked for current tier
 */
export function isFeatureUnlocked(
  feature:
    | 'safe_cut_timecodes'
    | 'long_videos'
    | 'multi_agent_consensus'
    | 'ai_appeal_generator'
    | 'side_by_side_compare'
    | 'channel_tracker'
    | 'batch_upload'
    | 'white_label_pdf'
): { unlocked: boolean; requiredTier: SubscriptionTier; message: string } {
  const tier = getCurrentSubscriptionTier();

  switch (feature) {
    case 'safe_cut_timecodes':
      // Free is LOCKED. Shield ($19), Pro ($39), Enterprise ($80) are UNLOCKED.
      return {
        unlocked: tier !== 'free',
        requiredTier: 'shield',
        message: 'Exact CapCut/Premiere safe-cut timecodes and blur timestamps are locked on Free tier. Upgrade to Creator Shield ($19/mo) to unlock frame-by-frame cuts.',
      };

    case 'long_videos':
      // Free is max 3 minutes.
      return {
        unlocked: tier !== 'free',
        requiredTier: 'shield',
        message: 'Free tier is limited to Shorts & Reels (upto 3 minutes). Upgrade to Creator Shield ($19/mo) for full-length HD/4K videos.',
      };

    case 'multi_agent_consensus':
      return {
        unlocked: tier !== 'free',
        requiredTier: 'shield',
        message: '3-Pass Multi-Agent Neural Consensus is available on Creator Shield and above.',
      };

    case 'ai_appeal_generator':
      // Unlocked on Pro ($39) and Enterprise ($80)
      return {
        unlocked: tier === 'pro' || tier === 'enterprise',
        requiredTier: 'pro',
        message: '1-Click AI YouTube Legal Counter-Appeal Kit requires Creator Pro ($39/mo) or Studio Master ($80/mo).',
      };

    case 'side_by_side_compare':
    case 'channel_tracker':
      return {
        unlocked: tier === 'pro' || tier === 'enterprise',
        requiredTier: 'pro',
        message: 'Side-by-side video comparison and Channel Tracker require Creator Pro ($39/mo).',
      };

    case 'batch_upload':
    case 'white_label_pdf':
      return {
        unlocked: tier === 'enterprise',
        requiredTier: 'enterprise',
        message: 'Bulk batch video queue and White-label PDF Client Certificates require Studio & Agency Master ($80/mo).',
      };

    default:
      return { unlocked: true, requiredTier: 'free', message: '' };
  }
}
