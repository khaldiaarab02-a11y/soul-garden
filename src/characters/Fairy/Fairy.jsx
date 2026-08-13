import { fairyConfig } from './fairyConfig.js';
import {
  DEFAULT_FAIRY_STATE,
  isValidFairyState,
} from './fairyStates.js';
import FairyGlow from './components/FairyGlow.jsx';
import FairyMessage from './components/FairyMessage.jsx';
import './Fairy.css';

const LUNA_ARTWORK = '/images/characters/luna/luna-hero.png';

export default function Fairy({
  state = DEFAULT_FAIRY_STATE,
  message = '',
  className = '',
}) {
  const safeState = isValidFairyState(state)
    ? state
    : DEFAULT_FAIRY_STATE;

  return (
    <div
      className={`fairy fairy--${safeState.toLowerCase()} ${className}`}
      role="img"
      aria-label={fairyConfig.accessibilityLabel}
    >
      <FairyGlow />

      <div className="fairy__aura" aria-hidden="true" />

      <div className="fairy__character">
        <img
          className="fairy__artwork"
          src={LUNA_ARTWORK}
          alt={fairyConfig.accessibilityLabel}
          draggable="false"
        />
      </div>

      <FairyMessage message={message} />
    </div>
  );
}
