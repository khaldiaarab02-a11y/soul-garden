import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { getRandomLine } from '../../data/dialogue';
import '../../components/UI/UI.css';
import './Journal.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Journal() {
  const { state, addJournalEntry } = useSoulGarden();
  const [text, setText] = useState('');

  const handleSave = () => {
    if (!text.trim()) return;
    addJournalEntry(text.trim(), 'كتابة حرة');
    setText('');
  };

  return (
    <section className="journal container">
      <div className="journal__header">
        <Luna state="IDLE" size="sm" align="start" />
        <div>
          <p className="eyebrow">المفكرة</p>
          <h1>مفكرتك الخاصة</h1>
          <p>{getRandomLine('journalIntro')}</p>
        </div>
      </div>

      <div className="card journal__composer fade-up">
        <textarea
          className="textarea-field"
          placeholder="اكتب ما يجول في خاطرك..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleSave} disabled={!text.trim()}>
          حفظ في المفكرة
        </Button>
      </div>

      <div className="journal__entries">
        {state.journalEntries.length === 0 && (
          <p className="journal__empty">لم تكتب شيئاً بعد. هذه الصفحة تنتظرك متى شعرت أنك جاهز.</p>
        )}
        {state.journalEntries.map((entry) => (
          <article key={entry.id} className="journal-entry card">
            <div className="journal-entry__meta">
              <span>{entry.prompt}</span>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            </div>
            <p className="journal-entry__text">{entry.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
