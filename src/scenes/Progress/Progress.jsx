import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { JOURNEYS } from '../../data/journeys';
import { ACHIEVEMENTS } from '../../data/achievements';
import { getRandomLine } from '../../data/dialogue';
import { useTranslation } from '../../i18n/i18n';
import '../../components/UI/UI.css';
import './Progress.css';

export default function Progress() {
  const { state, goTo } = useSoulGarden();
  const { t, lang } = useTranslation();
  const totalExercises = JOURNEYS.flatMap((j) => j.days.flatMap((d) => d.exercises)).length;
  const completedCount = state.completedExercises.length;
  const unlocked = new Set(state.unlockedAchievements || []);

  return (
    <section className="progress-scene container">
      <div className="progress-scene__header">
        <Luna state="ENCOURAGING" size="md" message={getRandomLine('progress', lang)} align="start" />
        <div>
          <p className="eyebrow">{t('progress.title')}</p>
          <h1>{t('progress.heading')}</h1>
        </div>
      </div>

      <div className="card progress-scene__summary fade-up">
        <ProgressBar
          value={completedCount}
          max={Math.max(totalExercises, 1)}
          label={t('progress.completedExercises')}
        />
        <div className="progress-scene__stats">
          <div className="stat">
            <span className="stat__num">{state.checkIns.length}</span>
            <span className="stat__label">{t('progress.checkIns')}</span>
          </div>
          <div className="stat">
            <span className="stat__num">{state.journalEntries.length}</span>
            <span className="stat__label">{t('progress.journalEntries')}</span>
          </div>
          <div className="stat">
            <span className="stat__num">{state.completedDays.length}</span>
            <span className="stat__label">{t('progress.completedDays')}</span>
          </div>
        </div>
      </div>

      {unlocked.size > 0 && (
        <div className="card progress-scene__achievements fade-up">
          <h2>{t('progress.achievements')}</h2>
          <ul className="achievement-list">
            {ACHIEVEMENTS.filter((a) => unlocked.has(a.id)).map((a) => (
              <li key={a.id} className="achievement-chip">
                <span className="achievement-chip__dot" aria-hidden="true" />
                {t(a.titleKey)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="progress-scene__actions">
        <Button onClick={() => goTo('checkin')}>{t('progress.newReflection')}</Button>
        <Button variant="ghost" onClick={() => goTo('journal')}>
          {t('progress.openJournal')}
        </Button>
      </div>
    </section>
  );
}
