import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import PremiumGate from '../../components/UI/PremiumGate';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { getRandomLine } from '../../data/dialogue';
import { useTranslation } from '../../i18n/i18n';
import { FREE_JOURNAL_LIMIT } from '../../services/entitlements';
import '../../components/UI/UI.css';
import './Journal.css';

const LOCALE = { ar: 'ar-EG', en: 'en-US' };

export default function Journal() {
  const { state, addJournalEntry, entitlements } = useSoulGarden();
  const { t, lang } = useTranslation();
  const [text, setText] = useState('');

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString(LOCALE[lang] || 'ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const handleSave = () => {
    if (!text.trim()) return;
    addJournalEntry(text.trim(), t('journal.freeWriting'));
    setText('');
  };

  const visibleEntries = entitlements.canAccessFullJournal
    ? state.journalEntries
    : state.journalEntries.slice(0, FREE_JOURNAL_LIMIT);
  const hiddenCount = state.journalEntries.length - visibleEntries.length;

  return (
    <section className="journal container">
      <div className="journal__header">
        <Luna state="IDLE" size="sm" align="start" />
        <div>
          <p className="eyebrow">{t('journal.title')}</p>
          <h1>{t('journal.title')}</h1>
          <p>{getRandomLine('journalIntro', lang)}</p>
        </div>
      </div>

      <div className="card journal__composer fade-up">
        <label htmlFor="journal-text" className="sr-only">
          {t('journal.placeholder')}
        </label>
        <textarea
          id="journal-text"
          className="textarea-field"
          placeholder={t('journal.placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleSave} disabled={!text.trim()}>
          {t('journal.save')}
        </Button>
      </div>

      <div className="journal__entries">
        {state.journalEntries.length === 0 && <p className="journal__empty">{t('journal.empty')}</p>}
        {visibleEntries.map((entry) => (
          <article key={entry.id} className="journal-entry card">
            <div className="journal-entry__meta">
              <span>{entry.prompt}</span>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            </div>
            <p className="journal-entry__text">{entry.text}</p>
          </article>
        ))}
        {hiddenCount > 0 && (
          <PremiumGate can="canAccessFullJournal" compact>
            <></>
          </PremiumGate>
        )}
      </div>
    </section>
  );
}
