# Soul Garden (حديقة الروح)

An immersive emotional-reflection and personal-growth experience, presented
as a living magical garden that grows with the user's real progress —
check-ins, journaling, and reflection exercises — guided by Luna.

Built with Vite + React, Supabase (Auth/Postgres/Edge Functions), and a
full Arabic/English i18n system with RTL/LTR support.

---

## Quick start

```bash
npm install
npm run dev
```

The app works fully in **guest mode** with zero configuration — progress is
saved to `localStorage`. Supabase is only required for persistent accounts,
cross-device sync, and subscriptions.

## Environment variables

Copy `.env.example` to `.env.local` and fill in the public values (see
below). **Never** put a secret key (Supabase service role, Stripe secret
key, Stripe webhook secret) in this file or in any `VITE_`-prefixed
variable — those are server-side only, set via `supabase secrets set` (see
`supabase/functions/README.md`).

| Variable | Where it's used |
|---|---|
| `VITE_SUPABASE_URL` | Frontend Supabase client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend Supabase client (anon key) |
| `VITE_STRIPE_PRICE_MONTHLY` / `VITE_STRIPE_PRICE_YEARLY` | Subscription scene pricing |
| `VITE_STRIPE_BILLING_PORTAL_URL` | "Manage subscription" link for existing subscribers |

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` (base tables) then
   `supabase/migrations/002_soul_garden_expansion.sql` (language, Inner
   Child, subscription columns) against your project — both are additive
   and safe to re-run.
3. Copy **Project URL** and **anon/publishable key** from
   Project Settings → API into `.env.local`.
4. In Authentication → URL Configuration, add your deployed URL (and
   `http://localhost:5173` for local dev) to the redirect allow-list —
   required for magic links and password recovery to redirect back
   correctly.

### Row-Level Security

Every private table (`profiles`, `check_ins`, `journal_entries`,
`exercise_completions`, `journey_progress`, `garden_state`, `achievements`,
`user_settings`, `inner_child`) has RLS enabled with an
`auth.uid() = user_id` (or `= id` for `profiles`) policy — a user can only
ever read/write their own rows. `profiles.subscription_status` and related
columns additionally have a trigger
(`protect_subscription_columns`) that blocks the *authenticated* role from
writing them at all — only the `stripe-webhook` Edge Function (service
role) can change entitlement state. This is the actual enforcement point
behind "a client can never make itself premium."

## Authentication

Full flow implemented: sign up, log in, log out, magic link, forgot
password, and — importantly — **completing** password recovery (the emailed
link redirects back into the app, which detects Supabase's
`PASSWORD_RECOVERY` auth event and shows a dedicated screen to set a new
password, overriding whatever scene was active). Session state is
persisted by Supabase's client automatically. A loading state is shown
while the initial session check runs, so there's never a blank screen on
first load.

## Internationalization

`src/i18n/ar.js` and `src/i18n/en.js` hold every user-facing string,
resolved through `useTranslation()` (`src/i18n/i18n.js`). Language is
stored in `SettingsContext`, persisted to `localStorage` and (when
signed in) `user_settings.language`, and drives `<html lang/dir>` directly
— switching language never touches progress, garden, journal, or Inner
Child state. RTL/LTR-sensitive CSS uses logical properties
(`inset-inline-*`, `text-align: start/end`, `padding-inline-*`) rather than
hard-coded `left`/`right`.

Luna's dialogue (`src/data/dialogue.js`), Inner Child dialogue
(`src/data/innerChild.js`), garden stage names (`src/data/gardenMilestones.js`),
and journey content (`src/data/journeys.js`) are all bilingual data, not
hard-coded per-component strings — extending either language means editing
data, not JSX.

## The Living Garden

`src/data/gardenMilestones.js` computes a 0–100 score from real actions
(onboarding, check-ins, journal entries, completed exercises, completed
journey days) and maps it to a garden stage (empty → seed → sprout →
flower → flowers → butterfly → fireflies → tree → water → fully awakened).
This progression logic is completely separate from rendering:
`src/components/Garden/GardenElements.jsx` is the only place that decides
what each stage *looks like* (hand-built SVG, not emoji). Add a new stage
in one file, its visual in the other — nothing else changes.

## Luna

`src/components/Luna/LunaEncounterManager.jsx` is a standalone engine that
decides, from real app events (`SoulGardenContext.state.lastEvent`, scene
changes, garden-stage changes, idle time), when Luna should unexpectedly
appear, say a contextual line, and disappear — with per-encounter cooldowns
and "only once" flags so she's never repetitive. Fully respects the
Luna-encounters setting and reduced-motion.

## Inner Child

A second, distinct symbolic character (not Luna) — named by the user
during onboarding (or later in Settings), persisted to its own `inner_child`
table, and whose presence in the garden deepens through five relationship
stages derived from the same real garden score (never a separate XP
counter). No character artwork asset existed in the project, so it's
rendered as an abstract SVG light-figure (`src/components/InnerChild/`)
rather than inventing one — swap in real art there if/when it exists.

## Subscriptions & Stripe

- `src/config/subscriptionConfig.js` — single source of truth for plan
  pricing (no price hard-coded anywhere else).
- `src/services/entitlements.js` — the only place that maps
  `subscription_status` to feature access (`canAccessFullJourneys`,
  `canAccessFullJournal`, etc). Components never compare
  `subscription_status` directly.
- `src/components/UI/PremiumGate.jsx` — wraps gated content with the
  garden-mist teaser described in the brief, instead of a generic paywall.
- `src/scenes/Subscription/Subscription.jsx` — the actual premium
  presentation: benefits, plan toggle, current-status states (free /
  trialing / active / past_due / cancelled), and checkout entry point.
- `supabase/functions/create-checkout-session` and
  `supabase/functions/stripe-webhook` — real Edge Function architecture
  (see `supabase/functions/README.md` for deployment). The webhook is the
  **only** code path that ever writes entitlement state; checkout never
  fakes success, and the UI plainly says "payments aren't enabled yet"
  until real Stripe Price IDs are configured.

## Audio

`src/audio/audioManager.js` is the single audio system (no duplicates). A
single "Sound" setting gates both ambience and one-off effects (Luna
appear/disappear, garden bloom, achievement unlocked). If the referenced
audio files don't exist on disk, playback fails silently — the app never
throws or blocks on missing audio.

## Accessibility

Semantic landmarks, a working skip-link, `aria-live` regions for Luna's
appearances and status messages, `aria-pressed`/`aria-selected` on
interactive toggles, visible focus rings (`:focus-visible`, using a
dedicated `--color-focus` token), keyboard-operable toggles and language
switchers (real `<button>`s, not `<div onClick>`), and full
`prefers-reduced-motion` + a manual "reduce motion" setting that both
short-circuit every CSS animation in the app via a shared
`:root.prefers-reduced-motion-forced` class.

## GitHub Pages deployment

`vite.config.js` sets `base: '/soul-garden/'`; `.github/workflows/deploy.yml`
builds and deploys to Pages on every push to `main`, reading Supabase and
Stripe *public* values from GitHub Actions secrets (never the Stripe
secret key or Supabase service role key — those never appear in this
workflow at all).

---

## Status

### COMPLETE
- Guest mode with full localStorage persistence; no account required
- Supabase Auth: sign up, log in, log out, magic link, forgot password,
  **and completing** password recovery
- Guest → account migration (check-ins, journal, exercises, journey days,
  achievements, Inner Child name, subscription status, settings/language),
  merge-only (never overwrites with older data, never duplicates)
- Full bilingual i18n (Arabic default + English) with RTL/LTR, verified
  with a full-codebase scan for hard-coded strings
- Living Garden: progression/rendering separation, SVG elements, symbolic
  meanings on click
- Inner Child: naming, persistence, 5-stage relationship progression,
  bilingual dialogue, garden integration
- Luna encounter engine: contextual triggers, cooldowns, once-only flags,
  audio cues, Inner-Child- and subscription-aware encounters
- Achievements: derived from real actions, persisted, RLS-protected,
  displayed in Progress
- Centralized entitlements + `PremiumGate` + Subscription scene (real UI,
  no fake payment success)
- Stripe Edge Function *architecture* (checkout session creation +
  webhook with signature verification + entitlement sync) — code complete
- Loading state (session check) and a global error boundary — no blank or
  raw-crash screens
- RLS verified on all 9 tables; subscription columns additionally
  protected by a database trigger against client writes
- Accessibility pass: focus states, aria-live, keyboard operability,
  reduced motion, logical-property RTL/LTR fixes
- Full static verification: every relative import resolves, every named
  import matches an actual export, every file's brackets balance, no
  hard-coded Arabic left in any `.jsx` file

### CONFIGURATION REQUIRED (architecture is done; needs your credentials)
- Run the two SQL files against your actual Supabase project
- Create the Stripe Product/Prices and set `VITE_STRIPE_PRICE_MONTHLY` /
  `VITE_STRIPE_PRICE_YEARLY`
- Deploy `create-checkout-session` and `stripe-webhook`
  (`supabase functions deploy ...`) and set `STRIPE_SECRET_KEY` /
  `STRIPE_WEBHOOK_SECRET` via `supabase secrets set`
- Add the Stripe webhook endpoint in the Stripe Dashboard
- Supply real audio files under `public/audio/` if you want sound (the app
  is fully functional, silently, without them)
- Supply real Inner Child artwork if/when available (currently a
  deliberate abstract SVG, not a placeholder image)

### BLOCKED BY ENVIRONMENT
- `npm install` / `npm run build` could not be executed in this working
  session — the sandbox has no network access to the npm registry
  (`npm error 403 Forbidden - registry.npmjs.org`). In place of a live
  build, every file in the project was statically verified: all relative
  imports resolve to real files, all named imports match real exports, all
  brackets/braces/parens balance in every file, and the previously-broken
  `Subscription` import (the reported build blocker) is now a real file.
  This is a strong signal but **not a substitute for an actual
  `npm run build`** — run it in an environment with registry access before
  deploying.
