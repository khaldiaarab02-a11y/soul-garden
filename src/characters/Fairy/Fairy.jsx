import React from 'react';
import { fairyConfig } from './fairyConfig';
import {
  DEFAULT_FAIRY_STATE,
  FAIRY_STATES,
  isValidFairyState,
} from './fairyStates';
import './Fairy.css';

const STATE_CLASS = {
  [FAIRY_STATES.IDLE]: 'fairy--idle',
  [FAIRY_STATES.WELCOME]: 'fairy--welcome',
  [FAIRY_STATES.LISTENING]: 'fairy--listening',
  [FAIRY_STATES.THINKING]: 'fairy--thinking',
  [FAIRY_STATES.ENCOURAGING]: 'fairy--encouraging',
  [FAIRY_STATES.CELEBRATING]: 'fairy--celebrating',
  [FAIRY_STATES.FAREWELL]: 'fairy--farewell',
};

function LunaArtwork({ state }) {
  return (
    <div className="fairy__artwork" aria-hidden="true">
      <div className="fairy__aura" />
      <div className="fairy__wings fairy__wings--back">
        <span />
        <span />
      </div>

      <div className="fairy__figure">
        <div className="fairy__hair fairy__hair--back" />
        <div className="fairy__body">
          <div className="fairy__dress" />
          <div className="fairy__seed" />
        </div>
        <div className="fairy__head">
          <div className="fairy__hair fairy__hair--front" />
          <div className="fairy__face">
            <span className="fairy__eye fairy__eye--left" />
            <span className="fairy__eye fairy__eye--right" />
            <span className="fairy__mouth" />
          </div>
        </div>
      </div>

      <div className="fairy__wings fairy__wings--front">
        <span />
        <span />
      </div>

      <div className="fairy__sparkles">
        {Array.from({ length: 7 }, (_, index) => (
          <i key={index} style={{ '--i': index }} />
        ))}
      </div>
    </div>
  );
}

export default function Fairy({
  state = DEFAULT_FAIRY_STATE,
  message,
  visible = true,
  className = '',
  onAppear,
  'aria-label': ariaLabel,
}) {
  const safeState = isValidFairyState(state) ? state : DEFAULT_FAIRY_STATE;
  const stateClass = STATE_CLASS[safeState];

  React.useEffect(() => {
    if (visible) onAppear?.();
  }, [visible, onAppear]);

  if (!visible) return null;

  return (
    <section
      className={`fairy ${stateClass} ${className}`.trim()}
      aria-label={ariaLabel || fairyConfig.accessibilityLabel}
      data-fairy-state={safeState}
    >
      <LunaArtwork state={safeState} />

      {message ? (
        <div className="fairy__message" role="status" aria-live="polite">
          {message}
        </div>
      ) : null}
    </section>
  );
}

export { FAIRY_STATES };
