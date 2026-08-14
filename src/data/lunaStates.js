// Luna's emotional/behavioral states.
// Each state describes how she should look, move, and feel —
// components read this instead of hard-coding behavior.

export const LUNA_STATES = {
  IDLE: {
    id: 'IDLE',
    animationClass: 'luna--idle',
    glowIntensity: 0.5,
  },
  WELCOME: {
    id: 'WELCOME',
    animationClass: 'luna--welcome',
    glowIntensity: 0.8,
  },
  LISTENING: {
    id: 'LISTENING',
    animationClass: 'luna--listening',
    glowIntensity: 0.6,
  },
  THINKING: {
    id: 'THINKING',
    animationClass: 'luna--thinking',
    glowIntensity: 0.4,
  },
  ENCOURAGING: {
    id: 'ENCOURAGING',
    animationClass: 'luna--encouraging',
    glowIntensity: 0.9,
  },
  CELEBRATING: {
    id: 'CELEBRATING',
    animationClass: 'luna--celebrating',
    glowIntensity: 1,
  },
  FAREWELL: {
    id: 'FAREWELL',
    animationClass: 'luna--farewell',
    glowIntensity: 0.5,
  },
};

export const LUNA_SIZES = {
  sm: 120,
  md: 220,
  lg: 340,
  hero: 460,
};
