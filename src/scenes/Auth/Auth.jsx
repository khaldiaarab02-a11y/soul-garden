import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useAuth } from '../../state/AuthContext';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { useTranslation } from '../../i18n/i18n';
import '../../components/UI/UI.css';
import './Auth.css';

export default function Auth() {
  const { signUp, signIn, signInWithMagicLink, resetPassword, isSupabaseConfigured } = useAuth();
  const { goTo } = useSoulGarden();
  const { t } = useTranslation();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const MODES = {
    login: { title: t('auth.loginTitle'), cta: t('auth.submitLogin') },
    signup: { title: t('auth.signupTitle'), cta: t('auth.submitSignup') },
    magic: { title: t('auth.magicLink'), cta: t('auth.magicLink') },
    reset: { title: t('auth.forgotPassword'), cta: t('auth.forgotPassword') },
  };
  const meta = MODES[mode];

  if (!isSupabaseConfigured) {
    return (
      <section className="auth container">
        <Luna state="IDLE" size="md" />
        <div className="card auth__card fade-up">
          <h1>{t('auth.unavailableTitle')}</h1>
          <p>{t('auth.unavailableBody')}</p>
          <Button onClick={() => goTo('garden')}>{t('auth.backToGarden')}</Button>
        </div>
      </section>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    let result;
    if (mode === 'login') result = await signIn(email, password);
    else if (mode === 'signup') result = await signUp(email, password, name);
    else if (mode === 'magic') result = await signInWithMagicLink(email);
    else result = await resetPassword(email);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (mode === 'login') {
      goTo('garden');
    } else if (mode === 'signup') {
      setSuccess(t('auth.signupSuccess'));
    } else if (mode === 'magic') {
      setSuccess(t('auth.magicLinkSuccess'));
    } else {
      setSuccess(t('auth.resetEmailSuccess'));
    }
  };

  return (
    <section className="auth container">
      <Luna state="LISTENING" size="md" />
      <form className="card auth__card fade-up" onSubmit={handleSubmit}>
        <h1>{meta.title}</h1>

        {error && <p className="form-error" role="alert">{t(error)}</p>}
        {success && <p className="form-success" role="status">{success}</p>}

        {mode === 'signup' && (
          <div className="field-group">
            <label htmlFor="auth-name">{t('auth.displayName')}</label>
            <input
              id="auth-name"
              className="input-field"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('auth.namePlaceholder')}
            />
          </div>
        )}

        <div className="field-group">
          <label htmlFor="auth-email">{t('auth.email')}</label>
          <input
            id="auth-email"
            className="input-field"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            dir="ltr"
          />
        </div>

        {(mode === 'login' || mode === 'signup') && (
          <div className="field-group">
            <label htmlFor="auth-password">{t('auth.password')}</label>
            <input
              id="auth-password"
              className="input-field"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              dir="ltr"
            />
          </div>
        )}

        <Button type="submit" disabled={loading}>
          {loading ? t('common.loading') : meta.cta}
        </Button>

        <div className="auth__links">
          {mode !== 'login' && (
            <button type="button" className="auth__link" onClick={() => setMode('login')}>
              {t('auth.haveAccount')}
            </button>
          )}
          {mode !== 'signup' && (
            <button type="button" className="auth__link" onClick={() => setMode('signup')}>
              {t('auth.createNew')}
            </button>
          )}
          {mode !== 'magic' && (
            <button type="button" className="auth__link" onClick={() => setMode('magic')}>
              {t('auth.magicLinkLink')}
            </button>
          )}
          {mode !== 'reset' && mode === 'login' && (
            <button type="button" className="auth__link" onClick={() => setMode('reset')}>
              {t('auth.forgotPassword')}
            </button>
          )}
        </div>

        <button type="button" className="auth__guest" onClick={() => goTo('garden')}>
          {t('auth.guestContinue')}
        </button>
      </form>
    </section>
  );
}
