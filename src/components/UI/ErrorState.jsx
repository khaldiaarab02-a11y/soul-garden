import Button from './Button';
import { useTranslation } from '../../i18n/i18n';
import './LoadingState.css';

/**
 * ErrorState — friendly, human error message with a retry action.
 * `detail` is an optional technical string, shown small and only for
 * debugging — never the primary message a normal user sees.
 */
export default function ErrorState({ onRetry, detail, messageKey = 'errors.generic' }) {
  const { t } = useTranslation();
  return (
    <div className="loading-state error-state" role="alert">
      <p className="loading-state__message">{t(messageKey)}</p>
      <p className="error-state__hint">{t('errors.network')}</p>
      {onRetry && <Button variant="ghost" onClick={onRetry}>{t('common.tryAgain')}</Button>}
      {detail && <p className="error-state__detail">{detail}</p>}
    </div>
  );
}
