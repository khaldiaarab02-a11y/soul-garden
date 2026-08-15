import { useSoulGarden } from '../../state/SoulGardenContext';
import { useTranslation } from '../../i18n/i18n';
import './Navigation.css';

const NAV_ITEM_IDS = ['garden', 'journey', 'checkin', 'journal', 'progress', 'profile'];
const NAV_ICONS = { garden: '🌿', journey: '🧭', checkin: '💭', journal: '📔', progress: '✨', profile: '👤' };
const NAV_LABEL_KEYS = {
  garden: 'nav.garden',
  journey: 'nav.journey',
  checkin: 'nav.checkin',
  journal: 'nav.journal',
  progress: 'nav.progress',
  profile: 'nav.account',
};

export default function Navigation() {
  const { state, goTo } = useSoulGarden();
  const { t } = useTranslation();

  if (state.currentScene === 'hero') return null;

  return (
    <nav className="nav" aria-label={t('nav.home')}>
      <button className="nav__brand" onClick={() => goTo('hero')} aria-label={t('common.appName')}>
        {t('common.appName')}
      </button>
      <ul className="nav__list">
        {NAV_ITEM_IDS.map((id) => (
          <li key={id}>
            <button
              className={`nav__link ${state.currentScene === id ? 'is-active' : ''}`}
              onClick={() => goTo(id)}
              aria-current={state.currentScene === id ? 'page' : undefined}
            >
              <span className="nav__icon" aria-hidden="true">{NAV_ICONS[id]}</span>
              <span className="nav__text">{t(NAV_LABEL_KEYS[id])}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
