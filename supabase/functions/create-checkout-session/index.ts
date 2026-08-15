// supabase/functions/create-checkout-session/index.ts
//
// Creates a Stripe Checkout Session for a Soul Garden subscription.
// Runs server-side only (Supabase Edge Function / Deno). The Stripe secret
// key NEVER reaches the browser — it is read here from an environment
// variable that is only available to this function at runtime.
//
// Deploy:
//   supabase functions deploy create-checkout-session
// Required secrets (set with `supabase secrets set`):
//   STRIPE_SECRET_KEY      — Stripe secret key (sk_live_... / sk_test_...)
//   SUPABASE_URL           — provided automatically by the platform
//   SUPABASE_SERVICE_ROLE_KEY — provided automatically by the platform
//
// The client calls this with a Supabase auth token in the Authorization
// header; we verify it, look up (or create) the Stripe customer, and
// return a Checkout Session URL. We never trust a client-supplied user id.

import { serve } from 'https://deno.land/std@0.203.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import Stripe from 'https://esm.sh/stripe@16.2.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') ?? '';
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the caller's identity from their own JWT — never trust a
    // client-supplied user id in the request body.
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { priceId, plan } = await req.json();
    if (!priceId) {
      return new Response(JSON.stringify({ error: 'missing_price_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Reuse an existing Stripe customer if we already created one for this
    // user (stored on profiles.stripe_customer_id), otherwise create one
    // and persist it. Written with the service role, exactly like the
    // webhook — the client itself never writes this column (see the
    // protect_subscription_columns trigger).
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .maybeSingle();

    let customerId = profile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;
      await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id);
    }

    const origin = req.headers.get('origin') || Deno.env.get('SITE_URL') || 'https://khaldiaarab02-a11y.github.io';
    const basePath = '/soul-garden/';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}${basePath}?checkout=success`,
      cancel_url: `${origin}${basePath}?checkout=cancelled`,
      client_reference_id: user.id,
      metadata: { supabase_user_id: user.id, plan: plan ?? 'unknown' },
      subscription_data: { metadata: { supabase_user_id: user.id } },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('create-checkout-session error:', err);
    return new Response(JSON.stringify({ error: 'internal_error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
