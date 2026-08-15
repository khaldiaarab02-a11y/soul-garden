// Luna Encounter System
// Luna is not always on screen. She appears unexpectedly, guided by rules —
// never randomly-annoying, always tied to something real that just happened.
//
// To add a future encounter: append one rule object. `when(ctx)` receives the
// live encounter context built by LunaEncounterManager each time something
// changes, and returns true/false. Nothing else needs to change.
//
// ctx shape:
// {
//   scene, isFirstVisitEver, isReturningVisit, idleMs,
//   lastEvent: { type, payload, at } | null,
//   gardenStageChanged: boolean, gardenStage, prevGardenStage,
//   completedExercisesCount,
// }

export const LUNA_ENCOUNTERS = [
  {
    id: 'gate-welcome',
    once: true,
    priority: 100,
    state: 'WELCOME',
    dialogueKey: 'gateWelcome',
    when: (ctx) => ctx.isFirstVisitEver && ctx.scene === 'hero',
  },
  {
    id: 'first-exercise',
    once: true,
    priority: 90,
    state: 'CELEBRATING',
    dialogueKey: 'firstSeed',
    when: (ctx) => ctx.lastEvent?.type === 'exercise' && ctx.completedExercisesCount === 1,
  },
  {
    id: 'checkin-thanks',
    once: false,
    cooldownMs: 5 * 60 * 1000,
    priority: 60,
    state: 'ENCOURAGING',
    dialogueKey: 'checkinAck',
    when: (ctx) => ctx.lastEvent?.type === 'checkin',
  },
  {
    id: 'journal-thanks',
    once: false,
    cooldownMs: 5 * 60 * 1000,
    priority: 55,
    state: 'ENCOURAGING',
    dialogueKey: 'exerciseEncourage',
    when: (ctx) => ctx.lastEvent?.type === 'journal',
  },
  {
    id: 'garden-stage-up',
    once: false,
    cooldownMs: 60 * 1000,
    priority: 95,
    state: 'CELEBRATING',
    dialogueKey: 'gardenGrowth',
    when: (ctx) => ctx.gardenStageChanged && ctx.prevGardenStage !== null,
  },
  {
    id: 'returning-visitor',
    once: false,
    cooldownMs: 12 * 60 * 60 * 1000,
    priority: 70,
    state: 'WELCOME',
    dialogueKey: 'returning',
    when: (ctx) => ctx.isReturningVisit && ctx.scene === 'hero',
  },
  {
    id: 'ambient-whisper',
    once: false,
    cooldownMs: 3 * 60 * 1000,
    priority: 10,
    state: 'IDLE',
    dialogueKey: 'wanderWhisper',
    when: (ctx) => ctx.idleMs > 40_000 && ctx.scene === 'garden',
  },
  {
    id: 'inner-child-first-meeting',
    once: true,
    priority: 80,
    state: 'ENCOURAGING',
    dialogueKey: 'innerChildFirstMeeting',
    when: (ctx) => ctx.lastEvent?.type === 'innerChildNamed',
  },
  {
    id: 'inner-child-bonding',
    once: false,
    cooldownMs: 20 * 60 * 1000,
    priority: 65,
    state: 'ENCOURAGING',
    dialogueKey: 'innerChildBonding',
    when: (ctx) => ctx.lastEvent?.type === 'innerChildInteraction',
  },
  {
    id: 'journey-complete-teaser',
    once: false,
    cooldownMs: 6 * 60 * 60 * 1000,
    priority: 50,
    state: 'ENCOURAGING',
    dialogueKey: 'subscriptionTeaser',
    when: (ctx) => ctx.lastEvent?.type === 'day' && !ctx.isPremium,
  },
];
