// supabase/functions/stripe-webhook/index.ts
//
// The ONLY code path allowed to write profiles.subscription_status /
// subscription_plan / stripe_subscription_id / subscription_current_period_end
// (enforced server-side by the protect_subscription_columns trigger in
// supabase/migrations/002_soul_garden_expansion.sql — the client literally
// cannot write these columns, even with a valid session).
//
// Deploy:
//   supabase functions deploy stripe-webhook --no-verify-jwt
//   (no-verify-jwt because Stripe calls this, not a logged-in user — this
//   function verifies the Stripe *signature* instead, which is the actual
//   security boundary here)
//
// Then in the Stripe Dashboard → Developers → Webhooks, add an endpoint
// pointing at this function's URL, subscribed to:
//   checkout.session.completed
//   customer.subscription.created
//   customer.subscription.updated
//   customer.subscription.deleted
//   invoice.payment_failed
//
// Required secrets:
//   STRIPE_SECRET_KEY
//   STRIPE_WEBHOOK_SECRET   — from the Stripe Dashboard webhook endpoint
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (provided automatically)

import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import Stripe from 'https://esm.sh/stripe@16.2.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function mapStripeStatus(stripeStatus: string): string {
  // Stripe's vocabulary -> ours (see subscriptionConfig.js SUBSCRIPTION_STATUSES
  // and the check constraint on profiles.subscription_status).
  switch (stripeStatus) {
    case 'trialing':
      return 'trialing';
    case 'active':
      return 'active';
    case 'past_due':
    case 'unpaid':
    case 'incomplete':
      return 'past_due';
    case 'canceled':
    case 'incomplete_expired':
      return 'cancelled';
    default:
      return 'free';
  }
}

async function syncSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.supabase_user_id;
  if (!userId) {
    console.warn('stripe-webhook: subscription missing supabase_user_id metadata', subscription.id);
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const plan = subscription.items.data[0]?.price?.recurring?.interval === 'year' ? 'yearly' : 'monthly';

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      subscription_status: mapStripeStatus(subscription.status),
      subscription_plan: plan,
      stripe_subscription_id: subscription.id,
      subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    })
    .eq('id', userId);

  if (error) console.error('stripe-webhook: failed to update profile', error);
}

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature ?? '', webhookSecret);
  } catch (err) {
    console.error('stripe-webhook: signature verification failed', err);
    return new Response('invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          await syncSubscription(subscription);
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await syncSubscription(subscription);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          await syncSubscription(subscription); // will map to past_due
        }
        break;
      }
      default:
        // Unhandled event types are safely ignored.
        break;
    }
  } catch (err) {
    console.error('stripe-webhook: handler error', err);
    return new Response('handler error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
