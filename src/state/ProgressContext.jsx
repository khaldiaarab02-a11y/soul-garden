import { createContext, useContext, useEffect, useMemo, useState } from 'react';

/*
  ProgressContext
  ================
  Prototype-stage user progress store, backed by localStorage per the
  brief (no auth/backend yet). Shape is intentionally forward-looking
  so later tasks (journal UI, garden unlocks) can plug in without a
  data-model rewrite.

  PRIVACY NOTE: journalEntries are stored locally only. Nothing here
  is sent anywhere or placed in a URL. See src/journal/ for the future
  read/write helpers that should be the only code touching this slice.
*/

const STORAGE_KEY = 'soul-garden:progress:v1';

const DEFAULT_PROGRESS = {
  currentJourneyId: null,
  currentDay: null,
  completedExercises: [],
  emotionalSelections: [],
  journalEntries: [],
  unlockedAreas: ['garden-of-awareness'],
};

function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch (err) {
    console.warn('Soul Garden: could not read saved progress, starting fresh.', err);
    return DEFAULT_PROGRESS;
  }
}

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (err) {
      console.warn('Soul Garden: could not save progress.', err);
    }
  }, [progress]);

  const value = useMemo(
    () => ({
      progress,
      setProgress,
      updateProgress: (partial) =>
        setProgress((prev) => ({ ...prev, ...partial })),
    }),
    [progress]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return ctx;
}
