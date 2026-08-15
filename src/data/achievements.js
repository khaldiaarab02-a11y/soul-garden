// Achievements — meaningful markers, never a competitive point system.
// Each definition's check(state, garden, innerChild) is pure and derived
// from real user actions, the same way garden progress is. Persisted unlock
// timestamps live in SoulGardenContext (state.unlockedAchievements) so an
// achievement never "un-unlocks" once real actions have earned it, but the
// eligibility check itself never needs its own separate counter.

export const ACHIEVEMENTS = [
  {
    id: 'first-checkin',
    titleKey: 'achievements.firstCheckIn',
    check: (state) => state.checkIns.length >= 1,
  },
  {
    id: 'first-journal',
    titleKey: 'achievements.firstJournal',
    check: (state) => state.journalEntries.length >= 1,
  },
  {
    id: 'first-exercise',
    titleKey: 'achievements.firstExercise',
    check: (state) => state.completedExercises.length >= 1,
  },
  {
    id: 'first-journey',
    titleKey: 'achievements.firstJourney',
    check: (state) => state.completedDays.length >= 1,
  },
  {
    id: 'first-bloom',
    titleKey: 'achievements.firstBloom',
    check: (state, garden) => ['flower', 'flowers', 'butterfly', 'fireflies', 'tree', 'water', 'full'].includes(garden.stage.id),
  },
  {
    id: 'first-butterfly',
    titleKey: 'achievements.firstButterfly',
    check: (state, garden) => ['butterfly', 'fireflies', 'tree', 'water', 'full'].includes(garden.stage.id),
  },
  {
    id: 'inner-child-met',
    titleKey: 'achievements.innerChildMet',
    check: (state) => Boolean(state.innerChildName),
  },
];

export function computeUnlockedIds(state, garden, innerChild) {
  return ACHIEVEMENTS.filter((a) => a.check(state, garden, innerChild)).map((a) => a.id);
}
