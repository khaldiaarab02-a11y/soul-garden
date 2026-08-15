import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useAuth } from '../../state/AuthContext';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { useTranslation } from '../../i18n/i18n';
import '../../components/UI/UI.css';
import './Auth.css';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const { goTo } = useSoulGarden();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('auth.passwordsNoMatch');
      return;
    }
    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
  };

  return (
    <section className="auth container">
      <Luna state={success ? 'CELEBRATING' : 'LISTENING'} size="md" />
      <form className="card auth__card fade-up" onSubmit={handleSubmit}>
        <h1>{t('auth.newPasswordTitle')}</h1>

        {error && <p className="form-error" role="alert">{t(error)}</p>}
        {success && <p className="form-success" role="status">{t('auth.passwordUpdated')}</p>}

        {!success && (
          <>
            <div className="field-group">
              <label htmlFor="reset-password">{t('auth.newPassword')}</label>
              <input
                id="reset-password"
                className="input-field"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="field-group">
              <label htmlFor="reset-confirm">{t('auth.confirmNewPassword')}</label>
              <input
                id="reset-confirm"
                className="input-field"
                type="password"
                required
                minLength={6}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                dir="ltr"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? t('common.loading') : t('auth.updatePassword')}
            </Button>
          </>
        )}

        {success && <Button onClick={() => goTo('garden')}>{t('common.continue')}</Button>}
      </form>
    </section>
  );
}
