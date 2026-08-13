/*
  Journey Schema (reference / documentation)
  ===========================================
  This file documents the shape a journey object must follow. It is
  not a runtime validator (no TypeScript in this foundation), just a
  clear contract so the Product Director can author new journeys as
  plain data without touching application code.

  A "journey" (e.g. "Garden of Awareness") is made of ordered "days",
  each a self-contained reflective exercise.

  Journey shape:
  {
    id: string,                 // e.g. 'garden-of-awareness'
    title: { ar: string, en?: string },
    subtitle: { ar: string, en?: string },
    visualTheme: string,        // key into a future scene-theme registry
    audioTheme: string,         // key into src/audio/soundRegistry.js
    unlockCondition: {          // when this journey becomes available
      type: 'always' | 'previousJourneyCompleted' | 'dayCount',
      value?: string | number,
    },
    days: Day[],
  }

  Day shape:
  {
    id: string,                 // e.g. 'day01'
    title: { ar: string, en?: string },
    introduction: { ar: string, en?: string },
    questions: Question[],
    journalingPrompt: { ar: string, en?: string },
    completionMessage: { ar: string, en?: string },
  }

  Question shape:
  {
    id: string,
    prompt: { ar: string, en?: string },
    type: 'choice' | 'openText' | 'emotionalSelection',
    choices?: { id: string, label: { ar: string, en?: string } }[],
  }

  See src/journeys/exampleJourney.js for a minimal, non-final example
  showing this shape populated — TASK 001 does not author real "Day 01"
  content, only the data contract.
*/
