// Lemon Squeezy Merchant of Record Configuration & Webhook Automation Service

import { SubscriptionTier, setCurrentSubscriptionTier } from './subscriptionManager';
import { adminSetUserTier, getAdminUsersList } from './adminService';

export interface LemonSqueezyConfig {
  storeId: string;
  storeSlug: string;
  apiKey: string;
  webhookSecret: string;
  variantShield19: string;
  variantPro39: string;
  variantAgency80: string;
  isLiveMode: boolean;
}

const STORAGE_KEY = 'striku_lemonsqueezy_config';

const DEFAULT_CONFIG: LemonSqueezyConfig = {
  storeId: 'striku-media',
  storeSlug: 'striku',
  apiKey: 'lsq_live_demo_key_9847291048',
  webhookSecret: 'whsec_striku_77819230192',
  variantShield19: 'var_shield_19001',
  variantPro39: 'var_pro_39002',
  variantAgency80: 'var_agency_80003',
  isLiveMode: false,
};

export function getLemonSqueezyConfig(): LemonSqueezyConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_CONFIG;
}

export function saveLemonSqueezyConfig(config: Partial<LemonSqueezyConfig>): LemonSqueezyConfig {
  const current = getLemonSqueezyConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

// Generate Lemon Squeezy Hosted Checkout URL
export function getLemonCheckoutUrl(
  tier: SubscriptionTier,
  userEmail?: string | null,
  billingCycle: 'monthly' | 'yearly' = 'monthly'
): string {
  const cfg = getLemonSqueezyConfig();
  let variantId = cfg.variantPro39;
  if (tier === 'shield') variantId = cfg.variantShield19;
  if (tier === 'enterprise') variantId = cfg.variantAgency80;

  const baseUrl = `https://${cfg.storeSlug || 'striku'}.lemonsqueezy.com/checkout/buy/${variantId}`;
  const params = new URLSearchParams();
  if (userEmail) params.append('checkout[email]', userEmail);
  params.append('checkout[custom][billing_cycle]', billingCycle);
  params.append('checkout[custom][tier]', tier);

  return `${baseUrl}?${params.toString()}`;
}

// Simulated incoming Webhook handler for instant automatic activation
export function processLemonSqueezyWebhook(payload: {
  event_name: 'order_created' | 'subscription_created' | 'subscription_cancelled' | 'subscription_updated';
  data: {
    attributes: {
      user_email: string;
      user_name?: string;
      product_name: string;
      total: number;
      currency: string;
      status: string;
    };
    custom_data?: {
      tier?: SubscriptionTier;
    };
  };
}): { success: boolean; message: string } {
  const email = payload.data.attributes.user_email;
  const event = payload.event_name;
  let targetTier: SubscriptionTier = payload.data.custom_data?.tier || 'pro';

  if (payload.data.attributes.product_name.toLowerCase().includes('shield')) {
    targetTier = 'shield';
  } else if (payload.data.attributes.product_name.toLowerCase().includes('agency') || payload.data.attributes.product_name.toLowerCase().includes('studio') || payload.data.attributes.product_name.toLowerCase().includes('80')) {
    targetTier = 'enterprise';
  }

  if (event === 'subscription_created' || event === 'order_created') {
    // 1. Upgrade user in admin service
    const users = getAdminUsersList();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      adminSetUserTier(existing.id, targetTier, false);
    }

    // 2. If it's the currently active browser user, upgrade immediately
    const currentUserEmail = localStorage.getItem('striku_current_user_email');
    if (!currentUserEmail || currentUserEmail.toLowerCase() === email.toLowerCase()) {
      setCurrentSubscriptionTier(targetTier);
    }

    return {
      success: true,
      message: `[Lemon Squeezy Webhook] Successfully activated ${targetTier.toUpperCase()} for ${email}!`,
    };
  } else if (event === 'subscription_cancelled') {
    const users = getAdminUsersList();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      adminSetUserTier(existing.id, 'free', false);
    }
    const currentUserEmail = localStorage.getItem('striku_current_user_email');
    if (!currentUserEmail || currentUserEmail.toLowerCase() === email.toLowerCase()) {
      setCurrentSubscriptionTier('free');
    }

    return {
      success: true,
      message: `[Lemon Squeezy Webhook] Subscription cancelled for ${email}. Reverted to Free Starter.`,
    };
  }

  return { success: true, message: 'Webhook processed.' };
}
