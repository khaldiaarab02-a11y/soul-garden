/*
  journalStore
  ============
  Thin, privacy-conscious access layer for journal entries. Per the
  brief: journal content is never placed in URLs, never sent to
  third-party services, and (for the prototype) lives only in
  localStorage via ProgressContext.

  Components should not read/write `progress.journalEntries` directly —
  go through these helpers so the privacy rules stay enforced in one
  place even as storage evolves (e.g. to encrypted accounts later).

  No journal UI is built in TASK 001 — this is the data-access
  foundation the future journal UI will call into.
*/

export function addJournalEntry(progress, updateProgress, entry) {
  const newEntry = {
    id: `entry-${Date.now()}`,
    createdAt: new Date().toISOString(),
    journeyId: entry.journeyId ?? null,
    dayId: entry.dayId ?? null,
    text: entry.text ?? '',
  };

  updateProgress({
    journalEntries: [...progress.journalEntries, newEntry],
  });

  return newEntry;
}

export function getJournalEntries(progress, { journeyId } = {}) {
  if (!journeyId) return progress.journalEntries;
  return progress.journalEntries.filter((e) => e.journeyId === journeyId);
}
