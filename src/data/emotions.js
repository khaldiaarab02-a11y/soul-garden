// Emotion catalog — ids/colors/symbols are language-agnostic; labels are
// resolved through i18n (see src/i18n/ar.js & en.js -> "emotions" and
// "intensity" namespaces) so this file never needs a language branch.
export const EMOTIONS = [
  { id: 'calm', color: '#B7C9B4', symbol: '🌿' },
  { id: 'joyful', color: '#D9B872', symbol: '✨' },
  { id: 'tired', color: '#C9B8E8', symbol: '🌙' },
  { id: 'anxious', color: '#F0C9D6', symbol: '🌊' },
  { id: 'sad', color: '#8FA3C7', symbol: '🌧️' },
  { id: 'hopeful', color: '#E4DAF5', symbol: '🌸' },
  { id: 'confused', color: '#CFC3B4', symbol: '🍃' },
  { id: 'grateful', color: '#EFDDB0', symbol: '🕯️' },
];

export const INTENSITY_KEYS = ['mild', 'moderate', 'strong'];
