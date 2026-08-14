// Centralized audio manager.
// Never autoplays. Fails silently if an asset is missing so the
// product never looks broken when audio files aren't present yet.

const BASE = import.meta.env.BASE_URL;

const TRACKS = {
  ambience: `${BASE}audio/garden-ambience.mp3`,
  chime: `${BASE}audio/soft-chime.mp3`,
  page: `${BASE}audio/page-turn.mp3`,
};

const cache = {};
let ambienceEnabled = false;
let ambienceEl = null;

function getAudio(key) {
  if (!TRACKS[key]) return null;
  if (!cache[key]) {
    const el = new Audio(TRACKS[key]);
    el.preload = 'none';
    cache[key] = el;
  }
  return cache[key];
}

export function playSound(key, { volume = 0.4 } = {}) {
  const el = getAudio(key);
  if (!el) return;
  try {
    const instance = el.cloneNode();
    instance.volume = volume;
    instance.play().catch(() => {
      /* asset missing or autoplay blocked — ignore gracefully */
    });
  } catch {
    // no-op: audio is an enhancement, never a requirement
  }
}

export function toggleAmbience(enable) {
  ambienceEnabled = enable;
  if (enable) {
    if (!ambienceEl) {
      ambienceEl = getAudio('ambience');
      if (ambienceEl) {
        ambienceEl.loop = true;
        ambienceEl.volume = 0.25;
      }
    }
    ambienceEl?.play().catch(() => {});
  } else {
    ambienceEl?.pause();
  }
}

export function isAmbienceEnabled() {
  return ambienceEnabled;
}
