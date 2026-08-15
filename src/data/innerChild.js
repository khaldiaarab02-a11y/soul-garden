// The Inner Child — a distinct character from Luna. Luna is the guide;
// the Inner Child is a symbolic, non-clinical representation of the
// user's own inner child. These states are emotional/symbolic, not a
// diagnostic model of any kind.

export const INNER_CHILD_STATES = {
  RESTING: { id: 'RESTING', animationClass: 'ic--resting' },
  SHY: { id: 'SHY', animationClass: 'ic--shy' },
  CURIOUS: { id: 'CURIOUS', animationClass: 'ic--curious' },
  SAD: { id: 'SAD', animationClass: 'ic--sad' },
  SAFE: { id: 'SAFE', animationClass: 'ic--safe' },
  HOPEFUL: { id: 'HOPEFUL', animationClass: 'ic--hopeful' },
  PLAYFUL: { id: 'PLAYFUL', animationClass: 'ic--playful' },
  HAPPY: { id: 'HAPPY', animationClass: 'ic--happy' },
  CELEBRATING: { id: 'CELEBRATING', animationClass: 'ic--celebrating' },
};

// The Inner Child's presence deepens as the user's real journey deepens —
// driven by the same garden score used for GARDEN_STAGES, kept as a
// separate, coarser scale so it doesn't need to track garden thresholds
// 1:1. See computeInnerChildRelationship() in gardenMilestones-adjacent
// logic (SoulGardenContext derives this the same way it derives `garden`).
export const RELATIONSHIP_STAGES = [
  {
    id: 'distant',
    minPercent: 0,
    defaultState: 'RESTING',
    behavior: 'sits alone, minimal interaction',
  },
  {
    id: 'noticing',
    minPercent: 15,
    defaultState: 'SHY',
    behavior: 'glances over, still keeps distance',
  },
  {
    id: 'approaching',
    minPercent: 35,
    defaultState: 'CURIOUS',
    behavior: 'approaches, interacts with flowers',
  },
  {
    id: 'present',
    minPercent: 60,
    defaultState: 'PLAYFUL',
    behavior: 'plays among butterflies, has a small garden area',
  },
  {
    id: 'close',
    minPercent: 85,
    defaultState: 'HAPPY',
    behavior: 'has a special place in the garden, appears during exercises',
  },
];

export function computeRelationshipStage(gardenPercent) {
  let stage = RELATIONSHIP_STAGES[0];
  for (const s of RELATIONSHIP_STAGES) {
    if (gardenPercent >= s.minPercent) stage = s;
  }
  return stage;
}

// Dialogue keyed by relationship stage, in both languages. Kept here
// (rather than in the i18n dictionaries) because it's tightly coupled to
// the character's progression logic, the same way lunaEncounters.js keeps
// its own dialogue rather than pulling from ar.js/en.js.
export const INNER_CHILD_DIALOGUE = {
  ar: {
    distant: ['...'],
    noticing: ['هل تعرفين أنني هنا؟'],
    approaching: ['أحب هذه الزهرة... هل زرعتِها؟'],
    present: ['تعالي نلعب بين الفراشات!'],
    close: ['أشعر بالأمان هنا معكِ.'],
  },
  en: {
    distant: ['...'],
    noticing: ['Do you know I\'m here?'],
    approaching: ['I like this flower... did you plant it?'],
    present: ['Come play with the butterflies!'],
    close: ['I feel safe here with you.'],
  },
};
