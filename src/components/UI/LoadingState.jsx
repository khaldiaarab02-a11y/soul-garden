import { useTranslation } from '../../i18n/i18n';
import './LoadingState.css';

/**
 * LoadingState — used anywhere the app is waiting on auth/session/profile
 * data (never a blank white screen). message defaults to the garden-waking
 * copy; pass a specific key for other contexts (e.g. checkingSession).
 */
export default function LoadingState({ messageKey = 'loading.waking' }) {
  const { t } = useTranslation();
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__glow" aria-hidden="true">
        <span className="loading-state__mote" />
        <span className="loading-state__mote" />
        <span className="loading-state__mote" />
      </div>
      <p className="loading-state__message">{t(messageKey)}</p>
    </div>
  );
}
