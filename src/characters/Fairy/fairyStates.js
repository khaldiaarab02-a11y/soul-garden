export const FAIRY_STATES = Object.freeze({
  IDLE: 'IDLE',
  WELCOME: 'WELCOME',
  LISTENING: 'LISTENING',
  THINKING: 'THINKING',
  ENCOURAGING: 'ENCOURAGING',
  CELEBRATING: 'CELEBRATING',
  FAREWELL: 'FAREWELL',
});

export const DEFAULT_FAIRY_STATE = FAIRY_STATES.IDLE;

export function isValidFairyState(state) {
  return Object.values(FAIRY_STATES).includes(state);
}
