/*
  AudioManager
  ============
  A single, reusable audio system for the whole app. No component
  should create its own <audio> element or hard-code playback logic —
  everything goes through this manager so future global controls
  (master volume, music on/off, nature sounds on/off, effects on/off)
  work everywhere for free.

  TASK 001 scope: architecture + channel routing + placeholder-safe
  behavior when asset files don't exist yet. No real audio assets are
  bundled (per the brief — no downloaded copyrighted music).

  Usage (future):
    import { audioManager } from './audio/AudioManager';
    audioManager.play('music', 'garden-of-awareness-theme');
    audioManager.setChannelVolume('music', 0.6);
    audioManager.toggleChannel('effects');
*/

import { soundRegistry } from './soundRegistry.js';

const CHANNELS = ['music', 'ambient', 'effects', 'character'];

class AudioManager {
  constructor() {
    this.masterVolume = 0.8;
    this.channels = Object.fromEntries(
      CHANNELS.map((channel) => [
        channel,
        { enabled: true, volume: 1, currentSrc: null, element: null },
      ])
    );
  }

  /**
   * Register/play a sound on a channel by key. Looks up the real
   * source from the audio registry (src/audio/soundRegistry.js).
   * If no asset is registered yet, this is a safe no-op — the
   * architecture works today even with zero real audio files.
   */
  play(channel, soundKey, { loop = false } = {}) {
    if (!this._isValidChannel(channel)) return;

    const src = this._resolveSrc(soundKey);
    if (!src) {
      console.info(
        `[AudioManager] "${soundKey}" has no asset registered yet — skipping playback (placeholder).`
      );
      return;
    }

    const channelState = this.channels[channel];
    if (!channelState.enabled) return;

    if (!channelState.element) {
      channelState.element = new Audio();
    }

    const el = channelState.element;
    el.src = src;
    el.loop = loop;
    el.volume = this._effectiveVolume(channel);
    el.play().catch((err) => {
      // Autoplay restrictions / missing file — fail quietly, this is
      // an ambient system, not a critical path.
      console.info('[AudioManager] playback deferred:', err.message);
    });

    channelState.currentSrc = src;
  }

  stop(channel) {
    const channelState = this.channels[channel];
    if (channelState?.element) {
      channelState.element.pause();
      channelState.element.currentTime = 0;
    }
  }

  stopAll() {
    CHANNELS.forEach((channel) => this.stop(channel));
  }

  setMasterVolume(value) {
    this.masterVolume = this._clamp(value);
    this._refreshAllVolumes();
  }

  setChannelVolume(channel, value) {
    if (!this._isValidChannel(channel)) return;
    this.channels[channel].volume = this._clamp(value);
    this._refreshVolume(channel);
  }

  toggleChannel(channel, enabled) {
    if (!this._isValidChannel(channel)) return;
    const channelState = this.channels[channel];
    channelState.enabled = enabled ?? !channelState.enabled;
    if (!channelState.enabled) this.stop(channel);
  }

  /* ---- internals ---- */

  _resolveSrc(soundKey) {
    return soundRegistry[soundKey] ?? null;
  }

  _effectiveVolume(channel) {
    return this._clamp(this.masterVolume * this.channels[channel].volume);
  }

  _refreshVolume(channel) {
    const channelState = this.channels[channel];
    if (channelState?.element) {
      channelState.element.volume = this._effectiveVolume(channel);
    }
  }

  _refreshAllVolumes() {
    CHANNELS.forEach((channel) => this._refreshVolume(channel));
  }

  _isValidChannel(channel) {
    return CHANNELS.includes(channel);
  }

  _clamp(value) {
    return Math.min(1, Math.max(0, value));
  }
}

// Singleton — one audio system for the whole app.
export const audioManager = new AudioManager();
export { CHANNELS };
