import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { fetchSettings, pushSettings } from '../services/dataService';
import { toggleAmbience, setSoundEnabled } from '../audio/audioManager';

const STORAGE_KEY = 'soul-garden:settings:v1';

const defaultSettings = {
  audioEnabled: false, // never autoplay by default
  effectsEnabled: true,
  lunaEnabled: true,
  reducedMotion: false,
  largeText: false,
  language: 'ar', // 'ar' | 'en' — see src/i18n
};

const LANGUAGE_DIR = { ar: 'rtl', en: 'ltr' };

function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

const SettingsCtx = createContext(null);

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState(loadLocal);
  const loadedForUserRef = useRef(null);

  // Apply side effects: reduced motion / large text as document-level
  // attributes so any component's CSS can respond without prop drilling.
  useEffect(() => {
    document.documentElement.classList.toggle('prefers-reduced-motion-forced', settings.reducedMotion);
    document.documentElement.classList.toggle('text-size-large', settings.largeText);
  }, [settings.reducedMotion, settings.largeText]);

  useEffect(() => {
    toggleAmbience(settings.audioEnabled);
    setSoundEnabled(settings.audioEnabled);
  }, [settings.audioEnabled]);

  // Language drives the whole layout direction — not just text. Switching
  // language must never touch progress/garden/journal state, so this effect
  // only ever writes document-level attributes.
  useEffect(() => {
    const dir = LANGUAGE_DIR[settings.language] || 'rtl';
    document.documentElement.setAttribute('lang', settings.language);
    document.documentElement.setAttribute('dir', dir);
  }, [settings.language]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // best-effort only
    }
  }, [settings]);

  // Pull saved settings once per signed-in session.
  useEffect(() => {
    if (!user || loadedForUserRef.current === user.id) return;
    loadedForUserRef.current = user.id;
    fetchSettings(user.id).then((remote) => {
      if (remote) {
        setSettings((s) => ({
          ...s,
          audioEnabled: remote.audio_enabled,
          effectsEnabled: remote.effects_enabled,
          lunaEnabled: remote.luna_enabled,
          reducedMotion: remote.reduced_motion,
          largeText: remote.large_text,
          language: remote.language || s.language,
        }));
      }
    });
  }, [user]);

  const update = useCallback(
    (patch) => {
      setSettings((s) => {
        const next = { ...s, ...patch };
        if (user) pushSettings(user.id, next);
        return next;
      });
    },
    [user]
  );

  return (
    <SettingsCtx.Provider value={{ settings, update }}>{children}</SettingsCtx.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsCtx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
