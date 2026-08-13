/*
  soundRegistry
  =============
  Single source of truth mapping a semantic sound key to its file path
  under public/audio/. Intentionally EMPTY for TASK 001 — no real audio
  assets exist yet (the brief explicitly says not to download
  copyrighted music, and to use placeholders).

  When real assets are added later, register them here — nothing in
  AudioManager or components needs to change:

    export const soundRegistry = {
      'garden-of-awareness-theme': '/audio/music/garden-of-awareness.mp3',
      'luna-greeting-01': '/audio/character/luna-greeting-01.mp3',
      'page-transition-soft': '/audio/effects/transition-soft.mp3',
    };
*/

export const soundRegistry = {
  // (empty — populated as real assets are approved and added)
};
