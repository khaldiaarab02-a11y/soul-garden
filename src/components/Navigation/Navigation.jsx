import { useSoulGarden } from '../../state/SoulGardenContext';
import './Navigation.css';

const NAV_ITEMS = [
  { id: 'hero', label: 'الرئيسية' },
  { id: 'checkin', label: 'التأمل' },
  { id: 'journey', label: 'الرحلة' },
  { id: 'journal', label: 'المفكرة' },
  { id: 'progress', label: 'تقدّمي' },
];

export default function Navigation() {
  const { state, goTo } = useSoulGarden();

  if (state.currentScene === 'hero') return null;

  return (
    <nav className="nav" aria-label="التنقل الرئيسي">
      <button
        className="nav__brand"
        onClick={() => goTo('hero')}
        aria-label="العودة إلى الصفحة الرئيسية لحديقة الروح"
      >
        حديقة الروح
      </button>
      <ul className="nav__list">
        {NAV_ITEMS.filter((i) => i.id !== 'hero').map((item) => (
          <li key={item.id}>
            <button
              className={`nav__link ${state.currentScene === item.id ? 'is-active' : ''}`}
              onClick={() => goTo(item.id)}
              aria-current={state.currentScene === item.id ? 'page' : undefined}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
