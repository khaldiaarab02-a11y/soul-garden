/*
  journeyRegistry
  ===============
  Central index of all journeys available in the app. Components should
  read journeys from here rather than importing individual journey
  files directly, so adding a new journey later is a one-line addition.

  Real journeys (Garden of Awareness, Roots, Inner Child, Lake of
  Release, Mirror of Self, Bridge of Forgiveness, Garden of Growth,
  New Beginning) will be added here as they're authored in future
  tasks. Only the placeholder example lives here today.
*/

import { exampleJourney } from './exampleJourney.js';

export const journeyRegistry = {
  [exampleJourney.id]: exampleJourney,
};

export function getJourney(journeyId) {
  return journeyRegistry[journeyId] ?? null;
}

export function listJourneys() {
  return Object.values(journeyRegistry);
}
