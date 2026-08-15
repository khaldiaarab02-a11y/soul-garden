import { useSoulGarden } from '../../state/SoulGardenContext';
import { useTranslation } from '../../i18n/i18n';
import Button from './Button';
import './UI.css';

/**
 * PremiumGate — wraps content that requires an active subscription.
 * Renders children as-is when entitled; otherwise renders the mist-locked
 * teaser described in the brief ("There is something waiting beyond this
 * path...") instead of the real content.
 */
export default function PremiumGate({ can, children, compact = false }) {
  const { entitlements, goTo } = useSoulGarden();
  const { t } = useTranslation();

  if (entitlements[can]) return children;

  return (
    <div className={`premium-gate ${compact ? 'premium-gate--compact' : ''}`}>
      <div className="premium-gate__mist" aria-hidden="true" />
      <p className="premium-gate__message">{t('subscription.lockedMessage')}</p>
      <Button onClick={() => goTo('subscription')}>{t('subscription.unlock')}</Button>
    </div>
  );
}
