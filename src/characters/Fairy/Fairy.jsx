import { fairyConfig } from './fairyConfig.js';
import {
  DEFAULT_FAIRY_STATE,
  isValidFairyState,
} from './fairyStates.js';
import FairyGlow from './components/FairyGlow.jsx';
import FairyMessage from './components/FairyMessage.jsx';
import './Fairy.css';

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

      <div className="fairy__wings" aria-hidden="true">
        <span className="fairy__wing fairy__wing--left" />
        <span className="fairy__wing fairy__wing--right" />
      </div>

      <div className="fairy__character">
        <div className="fairy__hair" aria-hidden="true" />

        <div className="fairy__face">
          <span className="fairy__eye fairy__eye--left" />
          <span className="fairy__eye fairy__eye--right" />

          <span className="fairy__nose" />

          <span className="fairy__mouth" />
        </div>

        <div className="fairy__body">
          <div className="fairy__dress" />
          <div className="fairy__soul-seed" aria-hidden="true" />
        </div>
      </div>

      <FairyMessage message={message} />
    </div>
  );
}
