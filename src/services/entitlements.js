// Centralized entitlements — the ONLY place that decides what a given
// subscription_status can access. Components call useEntitlements() and
// check a named capability; nothing should compare subscription_status
// directly outside this file (see requirement: "do not scatter
// subscription checks throughout JSX").
//
// subscription_status is never trusted from localStorage or any
// client-writable source — it comes from SoulGardenContext, which reads it
// from the `profiles` row fetched over Supabase. That column can only be
// written by the stripe-webhook Edge Function (service role) — see the
// protect_subscription_columns() trigger in
// supabase/migrations/002_soul_garden_expansion.sql.

const PREMIUM_STATUSES = new Set(['active', 'trialing']);

export function getEntitlements(subscriptionStatus = 'free') {
  const isPremium = PREMIUM_STATUSES.has(subscriptionStatus);
  return {
    status: subscriptionStatus,
    isPremium,
    // First journey (JOURNEYS[0], premium:false) is always free; anything
    // marked premium:true in journeys.js requires this.
    canAccessFullJourneys: isPremium,
    // Full, unbounded garden progression/visuals beyond the free preview
    // stages.
    canAccessFullGarden: isPremium,
    // Free users can write and keep a small number of recent entries;
    // full history requires premium (see Journal.jsx FREE_JOURNAL_LIMIT).
    canAccessFullJournal: isPremium,
    // Naming the Inner Child and its first ("noticing") stage are part of
    // the free preview; deeper relationship stages are premium.
    canAccessInnerChildDeepening: isPremium,
    canAccessAdvancedProgress: isPremium,
    canAccessExtendedLunaEncounters: isPremium,
  };
}

export const FREE_JOURNAL_LIMIT = 5;
export const FREE_INNER_CHILD_STAGE_CAP = 'noticing'; // free users cap here
