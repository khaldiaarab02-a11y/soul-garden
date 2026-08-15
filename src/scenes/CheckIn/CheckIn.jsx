import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { EMOTIONS, INTENSITY_KEYS } from '../../data/emotions';
import { getRandomLine } from '../../data/dialogue';
import { useTranslation } from '../../i18n/i18n';
import '../../components/UI/UI.css';
import './CheckIn.css';

export default function CheckIn() {
  const { addCheckIn, goTo } = useSoulGarden();
  const { t, lang } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [intensity, setIntensity] = useState(1);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!selected) return;
    addCheckIn(selected, intensity, note.trim());
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="checkin container checkin--done">
        <Luna state="ENCOURAGING" size="lg" message={getRandomLine('checkinAck', lang)} />
        <div className="checkin__actions">
          <Button onClick={() => goTo('journey')}>{t('checkin.continueJourney')}</Button>
          <Button variant="ghost" onClick={() => goTo('journal')}>
            {t('checkin.writeJournal')}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="checkin container">
      <Luna state="LISTENING" size="md" message={getRandomLine('checkin', lang)} align="start" />

      <div className="card checkin__card fade-up">
        <h2>{t('checkin.cardTitle')}</h2>
        <div className="emotion-grid" role="group" aria-label={t('checkin.chooseFeeling')}>
          {EMOTIONS.map((e) => (
            <button
              key={e.id}
              className={`emotion-chip ${selected === e.id ? 'is-selected' : ''}`}
              onClick={() => setSelected(e.id)}
              aria-pressed={selected === e.id}
            >
              <span className="emotion-chip__symbol" aria-hidden="true">{e.symbol}</span>
              <span className="emotion-chip__label">{t(`emotions.${e.id}`)}</span>
            </button>
          ))}
        </div>

        <div className="checkin__intensity">
          <label htmlFor="intensity">{t('checkin.intensity')}</label>
          <input
            id="intensity"
            type="range"
            min="0"
            max="2"
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
          />
          <span className="checkin__intensity-label">{t(`intensity.${INTENSITY_KEYS[intensity]}`)}</span>
        </div>

        <label htmlFor="note" className="checkin__note-label">
          {t('checkin.noteLabel')}
        </label>
        <textarea
          id="note"
          className="textarea-field"
          placeholder={t('checkin.notePlaceholder')}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button onClick={handleSubmit} disabled={!selected}>
          {t('checkin.save')}
        </Button>
      </div>
    </section>
  );
}
