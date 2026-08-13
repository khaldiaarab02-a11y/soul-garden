/*
  heroArtwork
  ===========
  Maps each visual layer of the Hero garden to an (optional) real
  artwork asset path. Every value is `null` for TASK 002 — no final
  illustration exists yet, so GardenBackground renders each layer as a
  procedural CSS/SVG placeholder that already respects the correct
  color tokens, depth ordering, and motion behavior.

  When the Product Director approves final artwork:
    1. Drop the image file(s) into public/images/hero/.
    2. Set the matching slot below to that path, e.g.:
         distantTrees: '/images/hero/distant-trees.png',
    3. Nothing else changes. GardenBackground reads this file and
       swaps that one layer from CSS-placeholder to `<img>`/background
       image automatically — no rewrite of HeroScene, animation logic,
       or parallax needed.

  Layers intentionally left procedural even after real art lands:
    - moonlightGlow: a light effect, cheaper and more flexible as CSS.
    - particles / fireflies: generated + animated in JS (ParticleField),
      not static images.
*/

export const heroArtwork = {
  skyBackground: null, // e.g. '/images/hero/sky.jpg'
  distantTrees: null, // e.g. '/images/hero/distant-trees.png'
  foregroundVegetation: null, // e.g. '/images/hero/foreground-vegetation.png'
  pathwayOverlay: null, // e.g. '/images/hero/pathway.png'
};
