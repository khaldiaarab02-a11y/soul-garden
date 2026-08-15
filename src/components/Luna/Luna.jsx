import { useEffect, useState } from 'react';
import { LUNA_STATES, LUNA_SIZES } from '../../data/lunaStates';
import { useTranslation } from '../../i18n/i18n';
import './Luna.css';

const LUNA_IMG = `${import.meta.env.BASE_URL}images/characters/luna/luna-hero.png`;

/**
 * Luna — the reusable emotional guide character.
 *
 * Props:
 *  - state: one of LUNA_STATES keys (default IDLE)
 *  - size: 'sm' | 'md' | 'lg' | 'hero'
 *  - message: optional dialogue string shown in a speech bubble
 *  - visible: whether Luna is mounted/shown (controls enter/exit)
 *  - onMessageEnd: callback after the message has been shown for a while
 */
export default function Luna({
  state = 'IDLE',
  size = 'md',
  message = null,
  visible = true,
  align = 'center',
}) {
  const [entered, setEntered] = useState(false);
  const { t } = useTranslation();
  const lunaState = LUNA_STATES[state] || LUNA_STATES.IDLE;
  const px = LUNA_SIZES[size] || LUNA_SIZES.md;

  useEffect(() => {
    const t = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(t);
  }, []);

  if (!visible) return null;

  return (
    <div className={`luna-wrap luna-align--${align} ${entered ? 'is-entered' : ''}`}>
      <div
        className={`luna-figure ${lunaState.animationClass}`}
        style={{ '--luna-size': `${px}px`, '--luna-glow': lunaState.glowIntensity }}
        role="img"
        aria-label={t('luna.ariaLabel')}
      >
        <div className="luna-aura" aria-hidden="true" />
        <img src={LUNA_IMG} alt={t('luna.alt')} className="luna-image" draggable="false" />
        <span className="luna-soul-seed" aria-hidden="true" />
      </div>
      {message && (
        <div className="luna-bubble fade-up" role="status">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
