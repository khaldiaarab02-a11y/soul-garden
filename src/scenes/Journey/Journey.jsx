import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { getJourney } from '../../data/journeys';
import { getRandomLine } from '../../data/dialogue';
import '../../components/UI/UI.css';
import './Journey.css';

const journey = getJourney('awakening');
const day = journey.days[0];

export default function Journey() {
  const { state, addJournalEntry, completeExercise, completeDay, goTo } = useSoulGarden();
  const [exIndex, setExIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [breathDone, setBreathDone] = useState(false);
  const [finished, setFinished] = useState(state.completedDays.includes(day.id));

  const exercise = day.exercises[exIndex];
  const isLastExercise = exIndex === day.exercises.length - 1;
  const completedCount = day.exercises.filter((ex) =>
    state.completedExercises.includes(ex.id)
  ).length;

  const handleNext = () => {
    if (exercise.type === 'reflection' && answer.trim()) {
      addJournalEntry(answer.trim(), exercise.prompt);
    }
    completeExercise(exercise.id);
    setAnswer('');
    setBreathDone(false);

    if (isLastExercise) {
      completeDay(day.id);
      setFinished(true);
    } else {
      setExIndex((i) => i + 1);
    }
  };

  if (finished) {
    return (
      <section className="journey container journey--done">
        <Luna state="CELEBRATING" size="lg" message={getRandomLine('completion')} />
        <h2>أكملت "{day.title}"</h2>
        <p className="journey__done-copy">هذه هي المحطة الأولى من رحلتك في {journey.title}.</p>
        <div className="journey__actions">
          <Button onClick={() => goTo('progress')}>عرض تقدّمي</Button>
          <Button variant="ghost" onClick={() => goTo('journal')}>
            مراجعة المفكرة
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="journey container">
      <div className="journey__header">
        <p className="eyebrow">{journey.title}</p>
        <h1>{day.title}</h1>
        <p className="journey__intro">{day.intro}</p>
        <ProgressBar
          value={completedCount}
          max={day.exercises.length}
          label={`تمرين ${exIndex + 1} من ${day.exercises.length}`}
        />
      </div>

      <div className="card journey__card fade-up">
        <Luna state="THINKING" size="sm" align="start" />
        <p className="journey__prompt">{exercise.prompt}</p>

        {exercise.type === 'reflection' && (
          <textarea
            className="textarea-field"
            placeholder={exercise.placeholder}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
        )}

        {exercise.type === 'breathing' && (
          <div className="journey__breathing">
            <div className={`breathing-circle ${breathDone ? 'is-done' : ''}`} />
            <Button variant="ghost" onClick={() => setBreathDone(true)}>
              {breathDone ? 'تم بلطف' : 'أنهيت التنفس'}
            </Button>
          </div>
        )}

        <Button
          onClick={handleNext}
          disabled={exercise.type === 'breathing' && !breathDone}
        >
          {isLastExercise ? 'إنهاء اليوم' : 'التالي'}
        </Button>
      </div>
    </section>
  );
}
