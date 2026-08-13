import { useEffect, useRef } from 'react';

/*
  useParallax
  ===========
  Applies a very subtle pointer-follow parallax to a ref'd element by
  writing CSS custom properties (--parallax-x / --parallax-y) that the
  element's own stylesheet decides how to use (different layers can
  move at different "depths" via their own multiplier in CSS).

  Deliberately conservative:
    - Disabled entirely when the user prefers reduced motion.
    - Disabled on coarse/touch pointers (no mouse to follow, and it
      would otherwise just jitter on scroll).
    - Movement is clamped to a few pixels — "very subtle parallax"
      per the brief, not a scroll-jacking effect.
*/
export function useParallax({ strength = 10 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (prefersReducedMotion || !hasFinePointer) {
      return undefined;
    }

    let frame = null;

    const handlePointerMove = (event) => {
      const { innerWidth, innerHeight } = window;
      const x = (event.clientX / innerWidth - 0.5) * 2; // -1..1
      const y = (event.clientY / innerHeight - 0.5) * 2; // -1..1

      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty('--parallax-x', `${(x * strength).toFixed(2)}px`);
        node.style.setProperty('--parallax-y', `${(y * strength).toFixed(2)}px`);
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);

  return ref;
}
