import { useCallback } from 'react';
import { audioManager } from './AudioManager.js';

/*
  useAudio
  ========
  Thin React hook so components talk to the AudioManager singleton
  without importing it directly everywhere. Keeps components decoupled
  from the audio implementation — swap AudioManager's internals later
  (e.g. Howler.js) without touching any component.
*/
export function useAudio() {
  const play = useCallback((channel, soundKey, options) => {
    audioManager.play(channel, soundKey, options);
  }, []);

  const stop = useCallback((channel) => {
    audioManager.stop(channel);
  }, []);

  const setChannelVolume = useCallback((channel, value) => {
    audioManager.setChannelVolume(channel, value);
  }, []);

  const toggleChannel = useCallback((channel, enabled) => {
    audioManager.toggleChannel(channel, enabled);
  }, []);

  return { play, stop, setChannelVolume, toggleChannel };
}
