/*
  appConfig
  =========
  Small, static app-wide constants that don't belong to any one
  system (journeys, audio, state). Keep this file small — most
  configuration should live closer to the system it configures
  (journeyRegistry.js, soundRegistry.js, tokens.*.css, etc).
*/

export const APP_NAME = {
  ar: 'حديقة الروح',
  en: 'Soul Garden',
};

export const COMPANION_NAME = {
  ar: 'لونا',
  en: 'Luna',
};

export const SUPPORTED_LANGUAGES = ['ar', 'en'];
export const DEFAULT_LANGUAGE = 'ar';
