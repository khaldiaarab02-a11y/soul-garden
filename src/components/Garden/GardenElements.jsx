// Garden visual rendering layer — deliberately separate from
// gardenMilestones.js (progression/state). GARDEN_STAGES only ever
// describes *when* a stage is reached and what it means; this file is the
// only place that decides what it *looks like*. To restyle the garden,
// change this file — the state/scoring logic in gardenMilestones.js never
// needs to change alongside it.

function Seed() {
  return (
    <svg viewBox="0 0 40 40" className="ge-seed">
      <ellipse cx="20" cy="24" rx="6" ry="9" className="ge-seed__body" />
    </svg>
  );
}

function Sprout() {
  return (
    <svg viewBox="0 0 40 40" className="ge-sprout">
      <path d="M20 34 V18" className="ge-stem" />
      <path d="M20 20 C12 18 10 10 10 10 C10 10 18 10 20 20 Z" className="ge-leaf" />
      <path d="M20 22 C28 20 30 12 30 12 C30 12 22 12 20 22 Z" className="ge-leaf ge-leaf--r" />
    </svg>
  );
}

function Flower({ hue = 0 }) {
  return (
    <svg viewBox="0 0 40 40" className="ge-flower" style={{ '--flower-hue': hue }}>
      <path d="M20 30 V16" className="ge-stem" />
      <g className="ge-petals">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse key={deg} cx="20" cy="10" rx="4.2" ry="7" transform={`rotate(${deg} 20 16)`} className="ge-petal" />
        ))}
      </g>
      <circle cx="20" cy="16" r="3.4" className="ge-flower-center" />
    </svg>
  );
}

function Butterfly() {
  return (
    <svg viewBox="0 0 40 40" className="ge-butterfly">
      <path d="M20 20 C10 6 2 10 6 20 C2 30 10 34 20 20 Z" className="ge-wing ge-wing--l" />
      <path d="M20 20 C30 6 38 10 34 20 C38 30 30 34 20 20 Z" className="ge-wing ge-wing--r" />
      <rect x="19" y="14" width="2" height="14" rx="1" className="ge-body" />
    </svg>
  );
}

function Firefly() {
  return (
    <svg viewBox="0 0 20 20" className="ge-firefly">
      <circle cx="10" cy="10" r="3" className="ge-firefly__glow" />
      <circle cx="10" cy="10" r="1.4" className="ge-firefly__core" />
    </svg>
  );
}

function Tree() {
  return (
    <svg viewBox="0 0 60 60" className="ge-tree">
      <rect x="27" y="34" width="6" height="22" rx="2" className="ge-trunk" />
      <circle cx="30" cy="26" r="18" className="ge-canopy" />
      <circle cx="18" cy="32" r="10" className="ge-canopy ge-canopy--sm" />
      <circle cx="42" cy="32" r="10" className="ge-canopy ge-canopy--sm" />
    </svg>
  );
}

function Water() {
  return (
    <svg viewBox="0 0 60 40" className="ge-water">
      <ellipse cx="30" cy="24" rx="26" ry="12" className="ge-water__pool" />
      <path d="M12 24 Q20 20 28 24 T44 24" className="ge-water__ripple" />
    </svg>
  );
}

function Full() {
  return (
    <svg viewBox="0 0 60 60" className="ge-full">
      <circle cx="30" cy="30" r="20" className="ge-full__glow" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={30 + Math.cos(a) * 22}
            cy={30 + Math.sin(a) * 22}
            r="2"
            className="ge-full__mote"
          />
        );
      })}
    </svg>
  );
}

// Maps a GARDEN_STAGES id -> visual component. Add a new stage in
// gardenMilestones.js, then a matching entry here — nothing else changes.
export const GARDEN_ELEMENT_COMPONENTS = {
  seed: Seed,
  sprout: Sprout,
  flower: (props) => <Flower hue={330} {...props} />,
  flowers: (props) => <Flower hue={40} {...props} />,
  butterfly: Butterfly,
  fireflies: Firefly,
  tree: Tree,
  water: Water,
  full: Full,
};

export default function GardenElement({ stageId, ...rest }) {
  const Component = GARDEN_ELEMENT_COMPONENTS[stageId];
  if (!Component) return null;
  return <Component {...rest} />;
}
