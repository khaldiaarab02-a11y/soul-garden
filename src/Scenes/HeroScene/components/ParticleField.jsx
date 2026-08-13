import { useMemo } from 'react';
import './ParticleField.css';

/*
  ParticleField
  =============
  "Subtle glowing particles" + "soft firefly-like lights" from the
  brief, as two small populations of absolutely-positioned dots.
  Positions/timings are randomized once per mount (useMemo) so they
  don't reshuffle on re-render, but still differ across page loads.

  Kept deliberately sparse and slow — this is atmosphere, not a
  particle-system demo. prefers-reduced-motion is handled globally
  (see src/styles/global.css), which freezes these to a calm static
  frame rather than removing them.
*/

const PARTICLE_COUNT = 10;
const FIREFLY_COUNT = 6;

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function useGeneratedPoints(count, config) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, index) => ({
        id: index,
        left: `${randomBetween(6, 94).toFixed(1)}%`,
        top: `${randomBetween(config.topMin, config.topMax).toFixed(1)}%`,
        size: `${randomBetween(config.sizeMin, config.sizeMax).toFixed(1)}px`,
        duration: `${randomBetween(config.durationMin, config.durationMax).toFixed(1)}s`,
        delay: `${randomBetween(0, config.durationMax).toFixed(1)}s`,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [count]
  );
}

export default function ParticleField() {
  const particles = useGeneratedPoints(PARTICLE_COUNT, {
    topMin: 20,
    topMax: 85,
    sizeMin: 2,
    sizeMax: 4,
    durationMin: 9,
    durationMax: 16,
  });

  const fireflies = useGeneratedPoints(FIREFLY_COUNT, {
    topMin: 45,
    topMax: 90,
    sizeMin: 3,
    sizeMax: 5,
    durationMin: 3,
    durationMax: 6,
  });

  return (
    <div className="sg-particle-field" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={`particle-${p.id}`}
          className="sg-particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
      {fireflies.map((f) => (
        <span
          key={`firefly-${f.id}`}
          className="sg-firefly"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            animationDuration: f.duration,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  );
}
