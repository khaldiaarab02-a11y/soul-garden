// Garden Progression System
// The garden is a *reflection* of the user's real journey — never decoration.
// Every stage is reached by a computed score derived from real actions:
// onboarding, check-ins, journal entries, exercises, and completed days.
//
// To add a future stage: add one object here. Nothing else needs to change —
// Garden.jsx and the Luna encounter engine both read from this file.
// label/symbol/meaning are bilingual {ar,en} — rendering picks the active
// language; visual rendering itself lives entirely in GardenElements.jsx.

export const GARDEN_STAGES = [
  {
    id: 'empty',
    threshold: 0,
    label: { ar: 'أرض هادئة', en: 'Quiet ground' },
    symbol: { ar: 'بداية تنتظر', en: 'A beginning, waiting' },
    meaning: {
      ar: 'كل حديقة جميلة بدأت بأرض فارغة تنتظر أول بذرة.',
      en: 'Every beautiful garden started as empty ground, waiting for its first seed.',
    },
  },
  {
    id: 'seed',
    threshold: 6,
    label: { ar: 'بذرة', en: 'Seed' },
    symbol: { ar: 'بداية', en: 'A beginning' },
    meaning: { ar: 'خطوة صغيرة زُرعت هنا.', en: 'A small step was planted here.' },
  },
  {
    id: 'sprout',
    threshold: 18,
    label: { ar: 'نبتة', en: 'Sprout' },
    symbol: { ar: 'نمو هادئ', en: 'Quiet growth' },
    meaning: { ar: 'شيء ما بدأ يكبر بصمت.', en: 'Something started growing quietly.' },
  },
  {
    id: 'flower',
    threshold: 32,
    label: { ar: 'أول زهرة', en: 'First flower' },
    symbol: { ar: 'وعي جديد', en: 'New awareness' },
    meaning: { ar: 'وعي جديد تفتّح.', en: 'A new awareness bloomed.' },
  },
  {
    id: 'flowers',
    threshold: 46,
    label: { ar: 'زهور متعددة', en: 'More flowers' },
    symbol: { ar: 'ازدهار', en: 'Flourishing' },
    meaning: { ar: 'الاستمرار له أثر يُرى.', en: 'Showing up keeps leaving a visible mark.' },
  },
  {
    id: 'butterfly',
    threshold: 58,
    label: { ar: 'فراشة', en: 'Butterfly' },
    symbol: { ar: 'تحوّل', en: 'Transformation' },
    meaning: { ar: 'شيء بداخلكِ تحوّل.', en: 'Something inside you has transformed.' },
  },
  {
    id: 'fireflies',
    threshold: 70,
    label: { ar: 'يراعات', en: 'Fireflies' },
    symbol: { ar: 'أمل', en: 'Hope' },
    meaning: {
      ar: 'ضوء صغير يرافقكِ في العتمة أيضًا.',
      en: 'A small light that stays with you, even in the dark.',
    },
  },
  {
    id: 'tree',
    threshold: 80,
    label: { ar: 'شجرة', en: 'Tree' },
    symbol: { ar: 'رسوخ', en: 'Rootedness' },
    meaning: {
      ar: 'جذور راسخة، وظل تستريحين تحته.',
      en: 'Roots that hold, and shade to rest under.',
    },
  },
  {
    id: 'water',
    threshold: 90,
    label: { ar: 'نافورة', en: 'Water feature' },
    symbol: { ar: 'صفاء', en: 'Clarity' },
    meaning: { ar: 'الهدوء أصبح جزءًا من المكان.', en: 'Calm has become part of this place.' },
  },
  {
    id: 'full',
    threshold: 100,
    label: { ar: 'حديقة مكتملة الصحوة', en: 'A fully awakened garden' },
    symbol: { ar: 'اكتمال', en: 'Wholeness' },
    meaning: { ar: 'هذه الحديقة أصبحت تعرفكِ.', en: 'This garden has come to know you.' },
  },
];

// Weighted scoring — deliberately generous early on so the garden never
// feels stagnant after the very first real action.
const WEIGHTS = {
  onboarded: 6,
  checkIn: 3,
  journal: 4,
  exercise: 7,
  day: 11,
};
const CHECKIN_CAP = 12;
const JOURNAL_CAP = 10;

export function computeGardenProgress(state) {
  let score = 0;
  if (state.hasOnboarded) score += WEIGHTS.onboarded;
  score += Math.min(state.checkIns.length, CHECKIN_CAP) * WEIGHTS.checkIn;
  score += Math.min(state.journalEntries.length, JOURNAL_CAP) * WEIGHTS.journal;
  score += state.completedExercises.length * WEIGHTS.exercise;
  score += state.completedDays.length * WEIGHTS.day;

  const percent = Math.max(0, Math.min(100, Math.round(score)));

  let stage = GARDEN_STAGES[0];
  for (const s of GARDEN_STAGES) {
    if (percent >= s.threshold) stage = s;
  }

  const stageIndex = GARDEN_STAGES.findIndex((s) => s.id === stage.id);
  const next = GARDEN_STAGES[stageIndex + 1] || null;

  return { percent, stage, stageIndex, next };
}
