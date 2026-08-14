import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'soul-garden:state:v1';

const defaultState = {
  hasOnboarded: false,
  checkIns: [], // { id, emotionId, intensity, note, date }
  journalEntries: [], // { id, text, prompt, date }
  completedExercises: [], // exercise ids
  completedDays: [], // day ids
  currentScene: 'hero',
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
}

const SoulGardenCtx = createContext(null);

export function SoulGardenProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode, quota, etc.) — fail gracefully.
    }
  }, [state]);

  const completeOnboarding = useCallback(() => {
    setState((s) => ({ ...s, hasOnboarded: true }));
  }, []);

  const addCheckIn = useCallback((emotionId, intensity, note) => {
    setState((s) => ({
      ...s,
      checkIns: [
        ...s.checkIns,
        { id: `ci-${Date.now()}`, emotionId, intensity, note, date: new Date().toISOString() },
      ],
    }));
  }, []);

  const addJournalEntry = useCallback((text, prompt) => {
    setState((s) => ({
      ...s,
      journalEntries: [
        { id: `je-${Date.now()}`, text, prompt, date: new Date().toISOString() },
        ...s.journalEntries,
      ],
    }));
  }, []);

  const completeExercise = useCallback((exerciseId) => {
    setState((s) =>
      s.completedExercises.includes(exerciseId)
        ? s
        : { ...s, completedExercises: [...s.completedExercises, exerciseId] }
    );
  }, []);

  const completeDay = useCallback((dayId) => {
    setState((s) =>
      s.completedDays.includes(dayId) ? s : { ...s, completedDays: [...s.completedDays, dayId] }
    );
  }, []);

  const goTo = useCallback((scene) => {
    setState((s) => ({ ...s, currentScene: scene }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = {
    state,
    completeOnboarding,
    addCheckIn,
    addJournalEntry,
    completeExercise,
    completeDay,
    goTo,
  };

  return <SoulGardenCtx.Provider value={value}>{children}</SoulGardenCtx.Provider>;
}

export function useSoulGarden() {
  const ctx = useContext(SoulGardenCtx);
  if (!ctx) throw new Error('useSoulGarden must be used within SoulGardenProvider');
  return ctx;
}
