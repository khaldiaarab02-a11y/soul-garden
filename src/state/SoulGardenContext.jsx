import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { computeGardenProgress } from '../data/gardenMilestones';
import { computeRelationshipStage } from '../data/innerChild';
import { computeUnlockedIds } from '../data/achievements';
import { getEntitlements } from '../services/entitlements';
import { playSound } from '../audio/audioManager';
import { useAuth } from './AuthContext';
import {
  fetchRemoteJourney,
  pushCheckIn,
  pushJournalEntry,
  pushExerciseCompletion,
  pushDayCompletion,
  pushGardenState,
  fetchInnerChild,
  pushInnerChild,
  fetchAchievements,
  pushAchievement,
} from '../services/dataService';

const STORAGE_KEY = 'soul-garden:state:v1';

const defaultState = {
  hasOnboarded: false,
  checkIns: [], // { id, emotionId, intensity, note, date }
  journalEntries: [], // { id, text, prompt, date }
  completedExercises: [], // exercise ids
  completedDays: [], // day ids
  currentScene: 'hero',
  innerChildName: null,
  innerChildInteractions: 0,
  unlockedAchievements: [], // achievement ids — see src/data/achievements.js
  subscriptionStatus: 'free', // never written by the client — see entitlements.js
  // Lightweight event stamp — the Luna encounter engine watches this to
  // react to real actions without duplicating app logic. Never persisted
  // as meaningful history, just "the last thing that happened".
  lastEvent: null, // { type: 'onboarded' | 'checkin' | 'journal' | 'exercise' | 'day' | 'innerChildMet', payload, at }
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    // lastEvent is intentionally never restored from storage — it only
    // describes "something that just happened this session".
    return { ...defaultState, ...JSON.parse(raw), lastEvent: null };
  } catch {
    return defaultState;
  }
}

const SoulGardenCtx = createContext(null);

export function SoulGardenProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(loadState);
  const [syncing, setSyncing] = useState(false);
  const mergedForUserRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode, quota, etc.) — fail gracefully.
    }
  }, [state]);

  // On sign-in: pull the account's saved journey from Supabase and merge it
  // with whatever exists locally (e.g. guest progress made before signing
  // up). Remote check-ins/journal entries are combined with local ones by
  // id, so nothing made as a guest is lost when creating an account.
  useEffect(() => {
    if (!user || mergedForUserRef.current === user.id) return;
    mergedForUserRef.current = user.id;
    setSyncing(true);
    fetchRemoteJourney(user.id).then((remote) => {
      if (remote) {
        setState((s) => {
          const mergeById = (remoteArr, localArr) => {
            const map = new Map();
            localArr.forEach((item) => map.set(item.id, item));
            remoteArr.forEach((item) => map.set(item.id, item)); // remote wins on conflict
            return Array.from(map.values());
          };
          return {
            ...s,
            hasOnboarded: s.hasOnboarded || Boolean(remote.profile),
            checkIns: mergeById(remote.checkIns, s.checkIns),
            journalEntries: mergeById(remote.journalEntries, s.journalEntries),
            completedExercises: Array.from(
              new Set([...s.completedExercises, ...remote.completedExercises])
            ),
            completedDays: Array.from(new Set([...s.completedDays, ...remote.completedDays])),
            subscriptionStatus: remote.profile?.subscription_status || s.subscriptionStatus,
            innerChildName: s.innerChildName || remote.profile?.inner_child_name || null,
          };
        });
      }
      setSyncing(false);
    });
    fetchInnerChild(user.id).then((remote) => {
      if (remote) {
        setState((s) => ({
          ...s,
          innerChildName: s.innerChildName || remote.name || null,
          innerChildInteractions: Math.max(s.innerChildInteractions, remote.interactions_count || 0),
        }));
      }
    });
    fetchAchievements(user.id).then((remoteIds) => {
      if (remoteIds.length) {
        setState((s) => ({
          ...s,
          unlockedAchievements: Array.from(new Set([...s.unlockedAchievements, ...remoteIds])),
        }));
      }
    });
  }, [user]);

  const completeOnboarding = useCallback(() => {
    setState((s) =>
      s.hasOnboarded
        ? s
        : { ...s, hasOnboarded: true, lastEvent: { type: 'onboarded', at: Date.now() } }
    );
  }, []);

  const addCheckIn = useCallback(
    (emotionId, intensity, note) => {
      setState((s) => ({
        ...s,
        checkIns: [
          ...s.checkIns,
          { id: `ci-${Date.now()}`, emotionId, intensity, note, date: new Date().toISOString() },
        ],
        lastEvent: { type: 'checkin', payload: { emotionId }, at: Date.now() },
      }));
      if (user) pushCheckIn(user.id, { emotionId, intensity, note });
    },
    [user]
  );

  const addJournalEntry = useCallback(
    (text, prompt) => {
      setState((s) => ({
        ...s,
        journalEntries: [
          { id: `je-${Date.now()}`, text, prompt, date: new Date().toISOString() },
          ...s.journalEntries,
        ],
        lastEvent: { type: 'journal', at: Date.now() },
      }));
      if (user) pushJournalEntry(user.id, { text, prompt });
    },
    [user]
  );

  const completeExercise = useCallback(
    (exerciseId, journeyId) => {
      setState((s) =>
        s.completedExercises.includes(exerciseId)
          ? s
          : {
              ...s,
              completedExercises: [...s.completedExercises, exerciseId],
              lastEvent: {
                type: 'exercise',
                payload: { exerciseId, count: s.completedExercises.length + 1 },
                at: Date.now(),
              },
            }
      );
      if (user) pushExerciseCompletion(user.id, { exerciseId, journeyId });
    },
    [user]
  );

  const completeDay = useCallback(
    (dayId, journeyId) => {
      setState((s) =>
        s.completedDays.includes(dayId)
          ? s
          : {
              ...s,
              completedDays: [...s.completedDays, dayId],
              lastEvent: { type: 'day', payload: { dayId }, at: Date.now() },
            }
      );
      if (user) pushDayCompletion(user.id, { dayId, journeyId });
    },
    [user]
  );

  const setInnerChildName = useCallback(
    (name) => {
      setState((s) => ({
        ...s,
        innerChildName: name,
        lastEvent: { type: 'innerChildNamed', payload: { name }, at: Date.now() },
      }));
    },
    []
  );

  const interactWithInnerChild = useCallback(() => {
    setState((s) => {
      const count = s.innerChildInteractions + 1;
      return {
        ...s,
        innerChildInteractions: count,
        lastEvent: { type: 'innerChildInteraction', payload: { count }, at: Date.now() },
      };
    });
  }, []);

  const goTo = useCallback((scene) => {
    setState((s) => ({ ...s, currentScene: scene }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Derived, never persisted — always recomputed from real actions so the
  // garden can never drift out of sync with the user's actual journey.
  const garden = useMemo(() => computeGardenProgress(state), [state]);

  // The Inner Child's presence is derived the same way — from the real
  // garden score, not a separate counter that could drift out of sync.
  const innerChild = useMemo(
    () => ({
      name: state.innerChildName,
      interactions: state.innerChildInteractions,
      relationship: computeRelationshipStage(garden.percent),
    }),
    [state.innerChildName, state.innerChildInteractions, garden.percent]
  );

  // Cache the garden's current stage to Supabase so a future dashboard
  // (or the profile page) can read it without recomputing client-side.
  const prevStageIdRef = useRef(null);
  useEffect(() => {
    if (user) pushGardenState(user.id, { stageId: garden.stage.id, percent: garden.percent });
    if (prevStageIdRef.current && prevStageIdRef.current !== garden.stage.id) {
      playSound('bloom', { volume: 0.4 });
    }
    prevStageIdRef.current = garden.stage.id;
  }, [user, garden.stage.id, garden.percent]);

  // Derive newly-unlocked achievements from real state whenever it changes,
  // and only ever append — an achievement earned by a real action never
  // disappears, even if the underlying count later looks different.
  useEffect(() => {
    const eligible = computeUnlockedIds(state, garden, innerChild);
    const newOnes = eligible.filter((id) => !state.unlockedAchievements.includes(id));
    if (newOnes.length) {
      setState((s) => ({
        ...s,
        unlockedAchievements: Array.from(new Set([...s.unlockedAchievements, ...newOnes])),
      }));
      playSound('achievement', { volume: 0.4 });
      if (user) newOnes.forEach((id) => pushAchievement(user.id, id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.checkIns.length, state.journalEntries.length, state.completedExercises.length, state.completedDays.length, garden.stage.id, state.innerChildName]);

  useEffect(() => {
    if (user && (state.innerChildName || state.innerChildInteractions > 0)) {
      pushInnerChild(user.id, {
        name: state.innerChildName,
        relationshipStage: innerChild.relationship.id,
        interactionsCount: state.innerChildInteractions,
      });
    }
  }, [user, state.innerChildName, state.innerChildInteractions, innerChild.relationship.id]);

  const entitlements = useMemo(() => getEntitlements(state.subscriptionStatus), [state.subscriptionStatus]);

  const value = {
    state,
    garden,
    innerChild,
    entitlements,
    syncing,
    completeOnboarding,
    addCheckIn,
    addJournalEntry,
    completeExercise,
    completeDay,
    setInnerChildName,
    interactWithInnerChild,
    goTo,
  };

  return <SoulGardenCtx.Provider value={value}>{children}</SoulGardenCtx.Provider>;
}

export function useSoulGarden() {
  const ctx = useContext(SoulGardenCtx);
  if (!ctx) throw new Error('useSoulGarden must be used within SoulGardenProvider');
  return ctx;
}
