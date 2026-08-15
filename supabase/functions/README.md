# Soul Garden — Supabase Edge Functions

Two functions, both server-side only. Neither the Stripe secret key nor the
webhook signing secret is ever sent to the browser.

## `create-checkout-session`

Called by `Subscription.jsx` when a signed-in user picks a plan. Verifies
the caller's Supabase session, finds or creates a Stripe Customer, and
returns a Checkout Session URL. Does **not** modify entitlements itself —
entitlements only change once Stripe confirms payment via the webhook.

## `stripe-webhook`

The only code path allowed to write `profiles.subscription_status` (see the
`protect_subscription_columns` trigger in
`supabase/migrations/002_soul_garden_expansion.sql` — the client is blocked
from writing that column even with a valid session). Verifies the Stripe
signature before trusting anything in the request body.

## Deploy

```bash
supabase functions deploy create-checkout-session
supabase functions deploy stripe-webhook --no-verify-jwt
```

`--no-verify-jwt` on the webhook is intentional: Stripe calls it, not a
logged-in user, so Supabase's normal JWT check doesn't apply — the Stripe
signature check inside the function is the real security boundary there.

## Required secrets

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_...
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...
```

`SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are provided automatically by
the Edge Functions runtime — do not set them yourself, and never put either
in frontend code or a `VITE_`-prefixed variable.

## Stripe Dashboard setup (CONFIGURATION REQUIRED — not done by this code)

1. Create a Product "Soul Garden Premium" with two recurring Prices
   (monthly, yearly). Copy each Price ID into `VITE_STRIPE_PRICE_MONTHLY`
   / `VITE_STRIPE_PRICE_YEARLY` in the frontend `.env`.
2. Add a webhook endpoint pointing at the deployed `stripe-webhook`
   function URL, subscribed to: `checkout.session.completed`,
   `customer.subscription.created`, `customer.subscription.updated`,
   `customer.subscription.deleted`, `invoice.payment_failed`.
3. Copy the endpoint's signing secret into `STRIPE_WEBHOOK_SECRET` above.

Until these three steps are done, `Subscription.jsx` shows "payments
aren't enabled yet" and disables the checkout button rather than pretending
to charge anyone.
