# حديقة الروح — Soul Garden

**Status:** TASK 002 — Official Hero Scene (complete). TASK 001 — Technical Foundation (complete).

## Project Purpose

Soul Garden is an immersive, Arabic-first emotional-reflection journey —
a magical, cinematic guided experience, not a blog, dashboard, or
productivity app. A gentle companion (currently named **Luna / لونا**)
walks the user through reflective "journeys" set inside a magical
garden world.

This repository started as the **technical foundation** for that
product (TASK 001) and now includes the **official Hero Scene**
(TASK 002) — the first cinematic garden view a visitor sees. It does
not yet contain the real Luna character, journal, auth, or any real
journey/day content — those arrive in later, explicitly-scoped tasks
from the Product Director.

## Architecture

- **React + Vite**, plain JavaScript (no TypeScript in this pass).
- **Design tokens** (`src/styles/tokens.*.css`) are the single source
  of truth for color, typography, spacing, radius, shadow, and motion.
  Components consume tokens via CSS custom properties — no hard-coded
  hex values or magic numbers in component styles.
- **Arabic-first, RTL by default.** `index.html` sets
  `<html lang="ar" dir="rtl">`. `src/state/LanguageContext.jsx` owns
  language/direction at runtime so a future language switch is a
  single state change, not a per-component concern.
- **Data-driven journeys.** Journey content (title, questions, choices,
  journaling prompts, completion messages, themes) is plain data under
  `src/journeys/`, following the contract in `journeySchema.js`. The
  Product Director can author new journeys without touching component
  code.
- **Centralized audio.** `src/audio/AudioManager.js` is the *only*
  place audio playback happens. No component should own an `<audio>`
  element directly. Sounds are looked up by key from
  `src/audio/soundRegistry.js`, which is currently empty (no real
  audio assets yet, per product rules).
- **Local-only progress & journal.** `src/state/ProgressContext.jsx`
  persists progress to `localStorage` (no backend/auth yet). Journal
  entries are never placed in URLs or sent to any third-party service;
  all journal access should go through `src/journal/journalStore.js`.
- **Hero Scene built on the existing `Scene` shell.**
  `src/scenes/HeroScene/` composes the cinematic garden landing view
  on top of the original `Scene` component (extended with optional
  `background`/`variant` props, backward compatible) rather than
  inventing a parallel scene system. See "The Hero Scene" below.

## The Hero Scene (TASK 002)

`src/scenes/HeroScene/HeroScene.jsx` is the first visual experience of
Soul Garden — a layered magical garden with moonlight, distant trees,
a glowing pathway, gentle foreground vegetation, and floating
particles/fireflies behind the title and primary CTA.

- **`Scene.jsx`** (extended, not replaced) now accepts an optional
  `background` node — used here to swap in the garden art direction —
  and a `variant="hero"` that relaxes the container's spacing for a
  full-bleed composition. Existing callers that don't pass these props
  are unaffected.
- **`components/GardenBackground.jsx`** renders the layered garden
  (moonlight glow → distant trees → glowing pathway → foreground
  vegetation) as CSS/SVG placeholders, each reading its image slot
  from `assets.js`.
- **`components/ParticleField.jsx`** generates a small, randomized
  population of rising light particles and flickering fireflies.
- **`components/HeroTitle.jsx`** renders the page's single `<h1>`
  (eyebrow → title → subtitle), with a soft staggered entrance.
- **`components/HeroCTA.jsx`** wraps the *existing* `Button` component
  with an ambient glow and delayed entrance — no new button system.
- **`useParallax.js`** applies a few pixels of pointer-based parallax
  to the background layers, automatically disabled for touch pointers
  and `prefers-reduced-motion`.
- **`assets.js`** documents exactly which layers are placeholder today
  and the one-line change needed to swap in final artwork later (see
  "Swapping in final artwork" below).

All Hero styling reads from the existing token files
(`src/styles/tokens.*.css`) — no new tokens were defined.

### Swapping in final artwork later

Each visual layer in `GardenBackground` checks a slot in
`src/scenes/HeroScene/assets.js` (all `null` today). To replace a
placeholder with real illustration:

1. Add the image file to `public/images/hero/`.
2. Set that layer's value in `assets.js`, e.g.
   `distantTrees: '/images/hero/distant-trees.png'`.
3. Nothing else changes — `GardenBackground` renders the image instead
   of its CSS placeholder automatically, keeping parallax, depth
   ordering, and responsive behavior intact.

## Folder Structure

```
src/
  components/     Reusable, generic UI (Button, ...)
  scenes/         Scene shell + HeroScene (hero garden view, TASK 002)
  characters/     Companion/character system (Fairy/Luna placeholder)
  journeys/       Journey data + schema + registry
  audio/          AudioManager, sound registry, useAudio hook
  journal/        Privacy-conscious journal read/write helpers
  state/          React context providers (language, progress)
  data/           Small app-wide config constants
  styles/         Design tokens + global stylesheet
public/
  images/         Static image assets (empty for now; hero art goes
                   under images/hero/ once approved — see assets.js)
  audio/          Static audio assets (empty for now)
  fonts/          Self-hosted font files (empty for now)
```

Full `scenes/` detail:

```
src/scenes/
  Scene.jsx / Scene.css          Generic scene shell (extended in TASK 002
                                  with optional background/variant props)
  HeroScene/
    HeroScene.jsx / .css         Composes the Hero on top of Scene
    assets.js                    Placeholder → final-artwork slot map
    useParallax.js               Subtle pointer-parallax hook
    components/
      GardenBackground.jsx/.css  Moonlight, trees, pathway, vegetation
      ParticleField.jsx/.css     Floating particles + fireflies
      HeroTitle.jsx/.css         Eyebrow, h1 title, subtitle
      HeroCTA.jsx/.css           Wraps the existing Button
```

## How to Run Locally

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (default `http://localhost:5173`).

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # lint the codebase
```

## Development Rules

These rules apply to everyone working on this codebase, human or AI:

1. **Task-by-task.** Do not build ahead of the current, explicitly
   scoped task. This foundation intentionally does *not* include the
   final Hero Scene, the full garden, the final Luna character, or
   Day 01 content.
2. **No invented features.** Follow the Product Director's brief;
   don't add product decisions unilaterally.
3. **Tokens, not magic numbers.** All color/type/spacing/radius/shadow/
   timing values in new components should reference
   `src/styles/tokens.*.css`.
4. **Arabic RTL is the default,** not an afterthought bolted on later.
   Prefer CSS logical properties (`padding-inline`, `margin-block`,
   etc.) over physical ones (`padding-left`) so layouts mirror
   correctly.
5. **Audio always goes through `AudioManager`.** Never wire an
   `<audio>` tag directly into a button or component.
6. **Journeys are data, not code.** New journey content belongs in
   `src/journeys/`, following `journeySchema.js` — not hard-coded into
   components.
7. **Journal privacy is non-negotiable.** No journal content in URLs,
   analytics, or third-party requests, ever.
8. **This product does not diagnose or treat.** No copy anywhere
   should imply medical/clinical authority or guaranteed healing.
