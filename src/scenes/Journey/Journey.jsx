import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import PremiumGate from '../../components/UI/PremiumGate';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { getJourney } from '../../data/journeys';
import { getRandomLine } from '../../data/dialogue';
import { useTranslation } from '../../i18n/i18n';
import '../../components/UI/UI.css';
import './Journey.css';

const journey = getJourney('awakening');
const day = journey.days[0];

export default function Journey() {
  const { state, addJournalEntry, completeExercise, completeDay, goTo, entitlements } = useSoulGarden();
  const { t, lang } = useTranslation();
  const [exIndex, setExIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [breathDone, setBreathDone] = useState(false);
  const [finished, setFinished] = useState(state.completedDays.includes(day.id));

  const exercise = day.exercises[exIndex];
  const isLastExercise = exIndex === day.exercises.length - 1;
  const completedCount = day.exercises.filter((ex) =>
    state.completedExercises.includes(ex.id)
  ).length;

  const locked = (journey.premium || day.premium) && !entitlements.canAccessFullJourneys;

  const handleNext = () => {
    if (exercise.type === 'reflection' && answer.trim()) {
      addJournalEntry(answer.trim(), exercise.prompt[lang] || exercise.prompt.ar);
    }
    completeExercise(exercise.id, journey.id);
    setAnswer('');
    setBreathDone(false);

    if (isLastExercise) {
      completeDay(day.id, journey.id);
      setFinished(true);
    } else {
      setExIndex((i) => i + 1);
    }
  };

  if (locked) {
    return (
      <section className="journey container">
        <div className="journey__header">
          <p className="eyebrow">{journey.title[lang] || journey.title.ar}</p>
          <h1>{day.title[lang] || day.title.ar}</h1>
        </div>
        <PremiumGate can="canAccessFullJourneys" />
      </section>
    );
  }

  if (finished) {
    return (
      <section className="journey container journey--done">
        <Luna state="CELEBRATING" size="lg" message={getRandomLine('completion', lang)} />
        <h2>{day.title[lang] || day.title.ar}</h2>
        <p className="journey__done-copy">{journey.title[lang] || journey.title.ar}</p>
        <div className="journey__actions">
          <Button onClick={() => goTo('progress')}>{t('progress.title')}</Button>
          <Button variant="ghost" onClick={() => goTo('journal')}>
            {t('checkin.writeJournal')}
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="journey container">
      <div className="journey__header">
        <p className="eyebrow">{journey.title[lang] || journey.title.ar}</p>
        <h1>{day.title[lang] || day.title.ar}</h1>
        <p className="journey__intro">{day.intro[lang] || day.intro.ar}</p>
        <ProgressBar
          value={completedCount}
          max={day.exercises.length}
          label={`${exIndex + 1} / ${day.exercises.length}`}
        />
      </div>

      <div className="card journey__card fade-up">
        <Luna state="THINKING" size="sm" align="start" />
        <p className="journey__prompt">{exercise.prompt[lang] || exercise.prompt.ar}</p>

        {exercise.type === 'reflection' && (
          <textarea
            className="textarea-field"
            placeholder={exercise.placeholder[lang] || exercise.placeholder.ar}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {exercise.type === 'breathing' && (
          <div className="journey__breathing">
            <div className={`breathing-circle ${breathDone ? 'is-done' : ''}`} />
            <Button variant="ghost" onClick={() => setBreathDone(true)}>
              {breathDone ? t('common.yes') : t('common.continue')}
            </Button>
          </div>
        )}

        <Button onClick={handleNext} disabled={exercise.type === 'breathing' && !breathDone}>
          {isLastExercise ? t('onboarding.finish') : t('common.continue')}
        </Button>
      </div>
    </section>
  );
}
