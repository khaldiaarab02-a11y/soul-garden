# SOUL GARDEN — PROJECT CONSTITUTION

## 1. PROJECT IDENTITY

Project name: Soul Garden

Soul Garden is a premium immersive emotional-wellness web experience.

It is designed as a magical symbolic garden representing the user's
inner emotional world.

The product should feel:

- safe
- warm
- elegant
- magical
- emotionally intelligent
- premium
- cinematic
- peaceful
- personal
- immersive

It must NOT feel like:

- a generic therapy website
- a corporate dashboard
- a generic SaaS application
- a childish fairy game
- a generic AI chatbot
- an ordinary blog
- a template website

The central emotional principle is:

"Guide the user gently. Never judge, pressure, or overwhelm them."

---

# 2. CURRENT TECHNOLOGY

The project uses:

- React
- Vite
- JavaScript
- JSX
- CSS

Do NOT migrate to:

- TypeScript
- Next.js
- Vue
- Svelte
- another framework

unless explicitly requested.

Prefer existing dependencies and native browser capabilities.

Do not introduce large dependencies without a strong technical reason.

---

# 3. DEPLOYMENT

The application is deployed on GitHub Pages.

Repository:

soul-garden

Production URL:

https://khaldiaarab02-a11y.github.io/soul-garden/

The application is hosted under:

/soul-garden/

Therefore Vite must use:

base: '/soul-garden/'

Static assets must work correctly from the GitHub Pages subpath.

Never assume the application is hosted at `/`.

Prefer:

import.meta.env.BASE_URL

when constructing runtime asset paths.

Always verify:

- images
- fonts
- audio
- CSS assets
- other public resources

against the GitHub Pages deployment path.

---

# 4. ARCHITECTURE

Existing architectural areas include:

src/
├── App.jsx
├── main.jsx
├── Scenes/
├── audio/
├── characters/
├── components/
├── data/
├── journal/
├── journeys/
├── state/
└── styles/

public/
├── audio/
├── fonts/
└── images/

Always inspect the real repository before modifying anything.

Do not assume the repository exactly matches documentation.

---

# 5. PRESERVE EXISTING ARCHITECTURE

Existing working architecture is valuable.

Do not rewrite systems simply because another implementation appears
more convenient.

Do not unnecessarily rename:

- Fairy.jsx
- Fairy.css
- Fairy directory
- Button components
- Scene.jsx
- Scene.css
- existing state systems
- journal systems
- journey systems
- audio systems

Fairy is the historical architectural name for the character system.

The official character is now Luna.

Do not create a duplicate Luna architecture simply because the
existing system is named Fairy.

Evolve the existing Fairy system into Luna.

---

# 6. LUNA

Luna is the official magical emotional guide of Soul Garden.

Luna is a young adult woman with an elegant, gentle,
emotionally comforting presence.

She is a guide, not a princess.

Visual identity:

Face:
- soft symmetrical feminine features
- warm delicate expression
- subtle gentle smile
- expressive violet/lavender eyes
- realistic adult proportions
- natural eyebrows
- delicate nose
- delicate lips

Hair:
- very long
- below the waist
- soft lavender
- subtle blush-pink highlights
- silky
- slightly wavy
- luminous

Outfit:
- ivory
- soft lavender
- dusty blush pink
- champagne-gold details
- flowing elegant fantasy dress
- subtle luminous embroidery
- sophisticated
- non-revealing
- minimal jewelry

Soul Seed:
- tiny glowing golden symbol near the center of her chest

Wings:
- delicate
- translucent
- pearlescent lavender/blush
- thin champagne-gold veins
- visually secondary

Aura:
- subtle warm magical glow
- tiny luminous particles
- calm emotional atmosphere

Luna must remain recognizable across future:

- poses
- expressions
- emotional states
- scenes
- illustrations
- animations

---

# 7. LUNA ARTWORK

Official artwork:

public/images/characters/luna/luna-hero.png

Do not duplicate the artwork.

Do not move it without a strong architectural reason.

Do not convert it to base64.

Do not distort its aspect ratio.

Use:

object-fit: contain

when displayed as a character image.

The transparent background must remain transparent.

---

# 8. LUNA STATES

The character system should support emotional states.

Current conceptual states:

- CALM
- WELCOMING
- LISTENING
- GUIDING
- HEALING

State behavior should be data-driven.

Do not scatter emotional state logic throughout unrelated components.

Future states must be easy to add.

---

# 9. LUNA MOTION

Luna may use:

- subtle breathing
- gentle floating
- soft aura pulsing
- tiny particles
- state-specific micro-animation

Motion must be:

slow
soft
elegant
non-distracting

Avoid:

- bouncing
- excessive movement
- fast particle effects
- game-like animation
- aggressive scaling

Always support:

prefers-reduced-motion

When reduced motion is enabled:

- stop continuous loops
- keep a calm final visual state
- preserve usability

---

# 10. DESIGN LANGUAGE

Soul Garden visual language:

- magical garden
- twilight atmosphere
- moonlight
- soft botanical forms
- subtle particles
- luminous pathway
- emotional warmth
- cinematic depth

Core palette:

- ivory
- soft lavender
- dusty blush
- champagne gold
- twilight purple
- muted sage
- warm moonlight

Avoid:

- neon colors
- excessive saturation
- harsh gradients
- cheap glow effects
- excessive glassmorphism
- generic AI aesthetics

---

# 11. DESIGN TOKENS

Use existing:

src/styles/tokens.colors.css
src/styles/tokens.layout.css
src/styles/tokens.typography.css

Do not duplicate design tokens inside individual components.

If a genuinely new global token is required,
add it to the appropriate token file.

Do not create random values throughout components.

---

# 12. TYPOGRAPHY

Typography must be:

- elegant
- readable
- emotionally warm
- accessible

Arabic must remain highly readable.

Maintain a clear hierarchy:

eyebrow
H1
subtitle
body
caption
button

There should normally be one primary H1 per scene/page.

Do not create duplicate H1 elements.

---

# 13. HERO SCENE

The Hero is the user's first visual experience.

It combines:

- Scene
- GardenBackground
- ParticleField
- HeroTitle
- HeroCTA
- Luna

Visual hierarchy:

1. Luna
2. Main title
3. supporting copy
4. CTA
5. garden environment
6. atmospheric particles

The environment must support the character,
not overpower her.

---

# 14. HERO ENVIRONMENT

The garden should communicate:

- safety
- mystery
- calm
- emotional discovery

Layers may include:

- moonlight
- distant trees
- pathway
- foreground vegetation
- atmospheric particles
- fireflies
- subtle depth/parallax

Parallax must remain:

- subtle
- desktop-oriented
- disabled on touch devices
- disabled for reduced motion

---

# 15. BUTTON SYSTEM

Reuse the existing Button component.

Never create another button architecture.

Do not create:

- MagicButton
- GlowButton2
- PrimaryButtonNew
- duplicate button components

HeroCTA should reuse the existing Button.

Real `<button>` elements must remain keyboard accessible.

---

# 16. RESPONSIVE DESIGN

Design mobile-first.

Target:

360px
390px
430px
768px
1024px
1280px
1440px
1920px

Mobile must be intentionally designed.

Do not simply shrink desktop.

Requirements:

- no horizontal overflow
- Luna remains visible
- CTA remains reachable
- title remains readable
- no text/image collision
- no clipped character
- no cropped hands
- no cropped feet
- comfortable spacing

---

# 17. ACCESSIBILITY

Use semantic HTML.

Use ARIA only when needed.

Support:

- keyboard navigation
- focus states
- sufficient contrast
- readable text
- meaningful image alternatives
- reduced motion

Do not use unnecessary:

role="img"

on complex containers.

Interactive elements must be keyboard accessible.

---

# 18. AUDIO

Existing audio architecture:

src/audio/

Keep it centralized.

Potential future sounds:

- ambient garden
- fireflies
- transitions
- interaction sounds
- emotional journey ambience

Never rely on automatic audio playback without user interaction.

Respect browser autoplay restrictions.

---

# 19. JOURNEYS

Existing:

src/journeys/

is the central location for journey definitions.

Journey data should be separated from presentation.

Journey architecture should support:

- id
- title
- description
- duration
- theme
- days
- exercises
- progress
- completion

Do not hard-code journey data inside UI components.

---

# 20. JOURNAL

Existing:

src/journal/

is the central journal architecture.

Future capabilities may include:

- daily reflection
- emotional notes
- prompts
- timestamps
- completion
- progress

Keep the architecture extensible.

Do not introduce authentication or cloud persistence unless explicitly
requested.

---

# 21. STATE

Existing:

src/state/

is the central shared-state architecture.

Prefer:

- React state
- React context

Avoid introducing a new global state library unless genuinely necessary.

Do not create multiple competing global state systems.

---

# 22. DATA

Reusable content belongs in:

src/data/

Do not hard-code large content structures directly into visual
components.

Content should be replaceable without rewriting presentation logic.

---

# 23. ASSET STRUCTURE

Use:

public/images/
public/audio/
public/fonts/

Character assets belong under:

public/images/characters/

Luna:

public/images/characters/luna/

Avoid scattering static assets across unrelated locations.

---

# 24. COMPONENT PRINCIPLES

Components should have clear responsibilities.

Prefer:

Scene
HeroScene
GardenBackground
ParticleField
HeroTitle
HeroCTA
Fairy/Luna

rather than giant monolithic components.

Do not create components for trivial one-line abstractions unless
they improve architecture.

Do not create deeply coupled components.

---

# 25. PERFORMANCE

Optimize for:

- fast initial rendering
- low layout shift
- low animation cost
- mobile performance
- minimal unnecessary rerenders

Prefer CSS animations where appropriate.

Avoid huge DOM particle systems.

Avoid unnecessary dependencies.

---

# 26. GITHUB PAGES SAFETY

GitHub Pages is case-sensitive.

These are different:

Fairy.jsx
fairy.jsx

GardenBackground.jsx
Gardenbackground.jsx

HeroScene.jsx
heroscene.jsx

Always verify exact casing.

Verify all import paths.

Verify all public asset paths.

---

# 27. BUILD REQUIREMENT

Before declaring any task complete:

Run:

npm install

Then:

npm run build

The build must pass.

If it fails:

1. inspect the error
2. identify the cause
3. fix it
4. run build again
5. repeat

Do not tell the user to fix ordinary build errors.

---

# 28. REVIEW REQUIREMENT

Before delivery review:

Architecture
Imports
File casing
Asset paths
GitHub Pages base
Responsive layout
Accessibility
Reduced motion
CSS conflicts
Z-index
Unused imports
Duplicate components
Missing files
Build output

---

# 29. GIT SAFETY

Never:

- force push
- rewrite history
- reset destructively
- delete unrelated user work
- overwrite unrelated files

Use dedicated task branches.

Preferred branch pattern:

task-XXX-description

Do not automatically merge into main.

Do not push destructive changes.

---

# 30. IMPLEMENTATION BEHAVIOR

When asked to implement a task:

DO NOT:

- modify one file and stop
- ask which file to edit next
- provide only snippets
- wait for confirmation after every file
- create duplicate architectures
- stop before build verification

Instead:

1. inspect repository
2. understand architecture
3. plan internally
4. implement complete scope
5. test
6. fix
7. review
8. package
9. report

The user wants coherent delivery.

---

# 31. QUALITY STANDARD

Soul Garden must feel like a premium commercial digital experience.

Every implementation decision should be judged by:

Does this feel intentional?

Does this feel calm?

Does this feel magical?

Does this feel emotionally safe?

Does this feel premium?

Does this work beautifully on mobile?

Does the architecture support future development?

Does the result feel like a real product rather than a coding demo?

If not, improve it.

---

# 32. PRODUCT SAFETY

Soul Garden is an emotional-wellness and self-reflection experience.

Do not present it as medical treatment.

Do not promise guaranteed healing.

Do not claim to diagnose mental-health conditions.

Use supportive language.

The experience should encourage reflection and personal agency.

---

# 33. MASTER RULE

The repository is the source of truth.

Inspect before modifying.

Preserve before replacing.

Reuse before duplicating.

Test before declaring success.

Build before delivery.

Never sacrifice architecture for speed.

Never sacrifice user experience for implementation convenience.

============================================================
END OF SOUL GARDEN PROJECT CONSTITUTION
============================================================
