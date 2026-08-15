import { useEffect, useState } from 'react';
import { INNER_CHILD_STATES } from '../../data/innerChild';
import { useTranslation } from '../../i18n/i18n';
import './InnerChild.css';

/**
 * InnerChild — symbolic character, distinct from Luna.
 *
 * No artwork asset exists for this character (none was provided in the
 * project, and inventing one wasn't part of this delivery — see README).
 * Rendered instead as a soft abstract light-figure built from CSS/SVG so it
 * still reads as a consistent character rather than a placeholder box.
 *
 * Props:
 *  - state: one of INNER_CHILD_STATES keys
 *  - name: the name the user gave their inner child (or null)
 *  - message: optional dialogue line
 *  - size: 'sm' | 'md' | 'lg'
 */
const SIZES = { sm: 90, md: 150, lg: 220 };

export default function InnerChild({ state = 'RESTING', name = null, message = null, size = 'md' }) {
  const [entered, setEntered] = useState(false);
  const { t } = useTranslation();
  const icState = INNER_CHILD_STATES[state] || INNER_CHILD_STATES.RESTING;
  const px = SIZES[size] || SIZES.md;

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={`inner-child-wrap ${entered ? 'is-entered' : ''}`}>
      <div
        className={`inner-child-figure ${icState.animationClass}`}
        style={{ '--ic-size': `${px}px` }}
        role="img"
        aria-label={name || t('innerChild.ariaLabel')}
      >
        <span className="inner-child-aura" aria-hidden="true" />
        <svg viewBox="0 0 100 100" className="inner-child-svg" aria-hidden="true">
          <ellipse cx="50" cy="66" rx="20" ry="24" className="ic-body" />
          <circle cx="50" cy="34" r="17" className="ic-head" />
          <circle cx="50" cy="34" r="17" className="ic-head-glow" />
        </svg>
        <span className="inner-child-sparkle" aria-hidden="true" />
      </div>
      {(name || message) && (
        <div className="inner-child-label">
          {name && <p className="inner-child-name">{name}</p>}
          {message && <p className="inner-child-message">{message}</p>}
        </div>
      )}
    </div>
  );
}
