import { useAuth } from '../../state/AuthContext';
import { useSoulGarden } from '../../state/SoulGardenContext';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import GardenElement from '../../components/Garden/GardenElements';
import { useTranslation } from '../../i18n/i18n';
import './Profile.css';

const LOCALE = { ar: 'ar-EG', en: 'en-US' };

export default function Profile() {
  const { user, isGuest, signOut, isSupabaseConfigured } = useAuth();
  const { state, garden, entitlements, goTo } = useSoulGarden();
  const { t, lang } = useTranslation();

  const startedAt = state.checkIns[0]?.date || state.journalEntries[state.journalEntries.length - 1]?.date;

  return (
    <section className="profile container">
      <header className="profile__header fade-up">
        <Luna state="IDLE" size="sm" />
        <p className="eyebrow">{t('profile.eyebrow')}</p>
        <h1>{isGuest ? t('profile.guest') : user.user_metadata?.display_name || t('profile.welcome')}</h1>
        {!isGuest && <p className="profile__email">{user.email}</p>}
        {!isGuest && (
          <p className="profile__subscription-badge">
            {t('account.subscription')}: {t(`subscription.${entitlements.status}`)}
          </p>
        )}
        {state.innerChildName && (
          <p className="profile__inner-child">
            {t('settings.innerChildName')}: {state.innerChildName}
          </p>
        )}
      </header>

      {isGuest && isSupabaseConfigured && (
        <div className="card profile__guest-notice fade-up">
          <p>{t('profile.guestQuestion')}</p>
          <Button onClick={() => goTo('auth')}>{t('profile.createAccount')}</Button>
        </div>
      )}

      <div className="profile__stats fade-up">
        <div className="profile__stat">
          <span className="profile__stat-value">{state.checkIns.length}</span>
          <span className="profile__stat-label">{t('profile.checkIns')}</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-value">{state.journalEntries.length}</span>
          <span className="profile__stat-label">{t('profile.journalEntries')}</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-value">{state.completedExercises.length}</span>
          <span className="profile__stat-label">{t('profile.exercises')}</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-value profile__stat-icon">
            <GardenElement stageId={garden.stage.id} />
          </span>
          <span className="profile__stat-label">{garden.stage.label[lang] || garden.stage.label.ar}</span>
        </div>
      </div>

      {startedAt && (
        <p className="profile__since">
          {t('profile.since')} {new Date(startedAt).toLocaleDateString(LOCALE[lang] || 'ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      )}

      <div className="profile__actions fade-up">
        <Button variant="ghost" onClick={() => goTo('settings')}>
          {t('profile.settingsBtn')}
        </Button>
        {!isGuest && (
          <Button
            variant="ghost"
            onClick={async () => {
              await signOut();
              goTo('hero');
            }}
          >
            {t('account.logout')}
          </Button>
        )}
      </div>
    </section>
  );
}
