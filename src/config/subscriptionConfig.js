// Single source of truth for subscription plans and pricing. Every UI that
// shows a price reads from here — never hard-code a number in a component.
// Change the price here and it updates everywhere, including the Stripe
// Price IDs the Edge Function reads (see supabase/functions/README.md).

export const SUBSCRIPTION_PLANS = {
  monthly: {
    id: 'monthly',
    // Populate with the real Stripe Price ID once created in the Stripe
    // Dashboard (Product catalog → Soul Garden Premium → Monthly price).
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_MONTHLY || null,
    amount: 6.99,
    currency: 'USD',
    interval: 'month',
  },
  yearly: {
    id: 'yearly',
    stripePriceId: import.meta.env.VITE_STRIPE_PRICE_YEARLY || null,
    amount: 59.99,
    currency: 'USD',
    interval: 'year',
  },
};

export function formatPrice(planId, locale = 'en-US') {
  const plan = SUBSCRIPTION_PLANS[planId];
  if (!plan) return '';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: plan.currency }).format(
      plan.amount
    );
  } catch {
    return `${plan.amount} ${plan.currency}`;
  }
}

// Statuses that Stripe (via the webhook) can write into
// profiles.subscription_status. Kept here so entitlements.js and any UI
// badge use the exact same vocabulary as the database check constraint.
export const SUBSCRIPTION_STATUSES = ['free', 'trialing', 'active', 'past_due', 'cancelled'];
