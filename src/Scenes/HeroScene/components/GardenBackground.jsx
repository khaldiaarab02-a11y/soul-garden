import './GardenBackground.css';
import { heroArtwork } from '../assets.js';
import { useParallax } from '../useParallax.js';

/*
  GardenBackground
  =================
  The layered "magical garden environment" behind the Hero title —
  soft sky, moonlight, distant trees, a glowing pathway, and gentle
  foreground vegetation, built with CSS/SVG placeholders (per the
  brief: no downloaded imagery). Every layer that will eventually be
  real illustrated artwork reads its slot from `heroArtwork`
  (see ../assets.js) — swap a path in there and this component
  renders the image instead of its placeholder shape automatically.

  Depth order (back to front), each its own layer for parallax:
    1. moonlight glow
    2. distant trees
    3. glowing pathway
    4. foreground vegetation
*/
export default function GardenBackground() {
  const parallaxRef = useParallax({ strength: 14 });

  return (
    <div className="sg-garden" ref={parallaxRef} aria-hidden="true">
      <div className="sg-garden__layer sg-garden__moonlight" />

      <div className="sg-garden__layer sg-garden__trees">
        {heroArtwork.distantTrees ? (
          <img
            className="sg-garden__art"
            src={heroArtwork.distantTrees}
            alt=""
          />
        ) : (
          <TreesPlaceholder />
        )}
      </div>

      <div className="sg-garden__layer sg-garden__pathway">
        {heroArtwork.pathwayOverlay ? (
          <img
            className="sg-garden__art"
            src={heroArtwork.pathwayOverlay}
            alt=""
          />
        ) : (
          <PathwayPlaceholder />
        )}
      </div>

      <div className="sg-garden__layer sg-garden__vegetation">
        {heroArtwork.foregroundVegetation ? (
          <img
            className="sg-garden__art"
            src={heroArtwork.foregroundVegetation}
            alt=""
          />
        ) : (
          <VegetationPlaceholder />
        )}
      </div>
    </div>
  );
}

/* ---- Procedural placeholders ----
   Simple, elegant stand-ins built from soft blurred shapes so the
   composition already reads as "garden" before real artwork exists.
   Not meant to be final — see assets.js for how they get replaced. */

function TreesPlaceholder() {
  return (
    <div className="sg-trees-placeholder">
      <span className="sg-tree sg-tree--1" />
      <span className="sg-tree sg-tree--2" />
      <span className="sg-tree sg-tree--3" />
      <span className="sg-tree sg-tree--4" />
      <span className="sg-tree sg-tree--5" />
    </div>
  );
}

function VegetationPlaceholder() {
  return (
    <div className="sg-vegetation-placeholder">
      <span className="sg-leaf sg-leaf--left-1" />
      <span className="sg-leaf sg-leaf--left-2" />
      <span className="sg-leaf sg-leaf--right-1" />
      <span className="sg-leaf sg-leaf--right-2" />
    </div>
  );
}

function PathwayPlaceholder() {
  return (
    <svg
      className="sg-pathway-svg"
      viewBox="0 0 200 220"
      preserveAspectRatio="xMidYMax meet"
      fill="none"
    >
      <defs>
        <linearGradient id="sg-path-gradient" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-gold-300)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-lavender-300)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        className="sg-pathway-svg__stroke"
        d="M100,220 C70,180 130,150 95,110 C65,75 120,55 100,0"
        stroke="url(#sg-path-gradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
