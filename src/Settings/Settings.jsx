import { useState } from 'react';
import { useSettings } from '../../state/SettingsContext';
import { useAuth } from '../../state/AuthContext';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { deleteAllUserData } from '../../services/dataService';
import Toggle from '../../components/UI/Toggle';
import Button from '../../components/UI/Button';
import { useTranslation, LANGUAGES } from '../../i18n/i18n';
import '../../components/UI/UI.css';
import './Settings.css';

export default function Settings() {
  const { settings, update } = useSettings();
  const { user, isGuest, isSupabaseConfigured, signOut } = useAuth();
  const { state, setInnerChildName, goTo, entitlements } = useSoulGarden();
  const { t, lang } = useTranslation();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState(null);
  const [nameDraft, setNameDraft] = useState(state.innerChildName || '');

  const handleDeleteAccountData = async () => {
    if (!user) return;
    const result = await deleteAllUserData(user.id);
    setDeleteStatus(result.ok ? 'success' : 'error');
    setConfirmDelete(false);
  };

  const handleNameBlur = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== state.innerChildName) setInnerChildName(trimmed);
  };

  return (
    <section className="settings container">
      <header className="settings__header fade-up">
        <p className="eyebrow">{t('settings.title')}</p>
        <h1>{t('settings.heading')}</h1>
      </header>

      <div className="card settings__group fade-up">
        <h2>{t('settings.account')}</h2>
        {isGuest ? (
          <div className="toggle-row toggle-row--action">
            <p className="toggle-row__desc">{t('profile.guestQuestion')}</p>
            <Button variant="ghost" onClick={() => goTo('auth')}>
              {t('account.login')}
            </Button>
          </div>
        ) : (
          <div className="toggle-row toggle-row--action">
            <p className="toggle-row__label">{user.email}</p>
            <Button
              variant="ghost"
              onClick={async () => {
                await signOut();
                goTo('hero');
              }}
            >
              {t('account.logout')}
            </Button>
          </div>
        )}
        <div className="toggle-row toggle-row--action">
          <p className="toggle-row__label">{t('settings.subscription')}</p>
          <Button variant="ghost" onClick={() => goTo('subscription')}>
            {entitlements.isPremium ? t('subscription.manage') : t('subscription.unlock')}
          </Button>
        </div>
      </div>

      <div className="card settings__group fade-up">
        <h2>{t('settings.language')}</h2>
        <div className="settings__language-toggle" role="tablist" aria-label={t('settings.language')}>
          {Object.entries(LANGUAGES).map(([code, meta]) => (
            <button
              key={code}
              type="button"
              role="tab"
              aria-selected={lang === code}
              className={`settings__language-btn ${lang === code ? 'is-active' : ''}`}
              onClick={() => update({ language: code })}
            >
              {meta.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card settings__group fade-up">
        <h2>{t('settings.experience')}</h2>

        <div className="toggle-row">
          <div>
            <p className="toggle-row__label">{t('settings.sound')}</p>
            <p className="toggle-row__desc">{t('settings.soundDesc')}</p>
          </div>
          <Toggle checked={settings.audioEnabled} onChange={(v) => update({ audioEnabled: v })} label={t('settings.sound')} />
        </div>

        <div className="toggle-row">
          <div>
            <p className="toggle-row__label">{t('settings.effects')}</p>
            <p className="toggle-row__desc">{t('settings.effectsDesc')}</p>
          </div>
          <Toggle checked={settings.effectsEnabled} onChange={(v) => update({ effectsEnabled: v })} label={t('settings.effects')} />
        </div>

        <div className="toggle-row">
          <div>
            <p className="toggle-row__label">{t('settings.lunaEncounters')}</p>
            <p className="toggle-row__desc">{t('settings.lunaEncountersDesc')}</p>
          </div>
          <Toggle checked={settings.lunaEnabled} onChange={(v) => update({ lunaEnabled: v })} label={t('settings.lunaEncounters')} />
        </div>

        <div className="toggle-row">
          <div>
            <p className="toggle-row__label">{t('settings.innerChildName')}</p>
          </div>
          <input
            className="settings__inline-input"
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onBlur={handleNameBlur}
            maxLength={40}
            aria-label={t('settings.innerChildName')}
          />
        </div>
      </div>

      <div className="card settings__group fade-up">
        <h2>{t('settings.accessibility')}</h2>

        <div className="toggle-row">
          <div>
            <p className="toggle-row__label">{t('settings.reducedMotion')}</p>
            <p className="toggle-row__desc">{t('settings.reducedMotionDesc')}</p>
          </div>
          <Toggle checked={settings.reducedMotion} onChange={(v) => update({ reducedMotion: v })} label={t('settings.reducedMotion')} />
        </div>

        <div className="toggle-row">
          <div>
            <p className="toggle-row__label">{t('settings.largeText')}</p>
            <p className="toggle-row__desc">{t('settings.largeTextDesc')}</p>
          </div>
          <Toggle checked={settings.largeText} onChange={(v) => update({ largeText: v })} label={t('settings.largeText')} />
        </div>
      </div>

      <div className="card settings__group fade-up">
        <h2>{t('settings.privacyTitle')}</h2>
        {isGuest ? (
          <p className="settings__note">{t('settings.privacyGuestNote')}</p>
        ) : isSupabaseConfigured ? (
          <>
            <p className="settings__note">{t('settings.privacyAuthNote')}</p>
            {deleteStatus === 'success' && <p className="form-success" role="status">{t('settings.deleteDataSuccess')}</p>}
            {deleteStatus === 'error' && <p className="form-error" role="alert">{t('settings.deleteDataError')}</p>}
            {!confirmDelete ? (
              <Button variant="ghost" onClick={() => setConfirmDelete(true)}>
                {t('settings.deleteData')}
              </Button>
            ) : (
              <div className="settings__confirm" role="alertdialog" aria-label={t('settings.deleteDataConfirm')}>
                <p>{t('settings.deleteDataConfirm')}</p>
                <div className="settings__confirm-actions">
                  <Button onClick={handleDeleteAccountData}>{t('settings.confirmYes')}</Button>
                  <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                    {t('settings.confirmCancel')}
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </div>

      <div className="card settings__group fade-up">
        <h2>{t('settings.aboutTitle')}</h2>
        <p className="settings__note">{t('settings.aboutBody')}</p>
      </div>
    </section>
  );
}
