import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import ProgressBar from '../../components/UI/ProgressBar';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { JOURNEYS } from '../../data/journeys';
import { getRandomLine } from '../../data/dialogue';
import '../../components/UI/UI.css';
import './Progress.css';

export default function Progress() {
  const { state, goTo } = useSoulGarden();
  const totalExercises = JOURNEYS.flatMap((j) => j.days.flatMap((d) => d.exercises)).length;
  const completedCount = state.completedExercises.length;

  return (
    <section className="progress-scene container">
      <div className="progress-scene__header">
        <Luna state="ENCOURAGING" size="md" message={getRandomLine('progress')} align="start" />
        <div>
          <p className="eyebrow">تقدّمي</p>
          <h1>مسيرتك حتى الآن</h1>
        </div>
      </div>

      <div className="card progress-scene__summary fade-up">
        <ProgressBar
          value={completedCount}
          max={Math.max(totalExercises, 1)}
          label="التمارين المكتملة"
        />
        <div className="progress-scene__stats">
          <div className="stat">
            <span className="stat__num">{state.checkIns.length}</span>
            <span className="stat__label">تسجيلات مشاعر</span>
          </div>
          <div className="stat">
            <span className="stat__num">{state.journalEntries.length}</span>
            <span className="stat__label">مدخلات في المفكرة</span>
          </div>
          <div className="stat">
            <span className="stat__num">{state.completedDays.length}</span>
            <span className="stat__label">أيام مكتملة</span>
          </div>
        </div>
      </div>

      <div className="progress-scene__actions">
        <Button onClick={() => goTo('checkin')}>تأمل جديد</Button>
        <Button variant="ghost" onClick={() => goTo('journal')}>
          افتح المفكرة
        </Button>
      </div>
    </section>
  );
}
