import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { useAuth } from '../../state/AuthContext';
import { SUBSCRIPTION_PLANS, formatPrice } from '../../config/subscriptionConfig';
import { getRandomLine } from '../../data/dialogue';
import { useTranslation } from '../../i18n/i18n';
import '../../components/UI/UI.css';
import './Subscription.css';

const LOCALE = { ar: 'ar-EG', en: 'en-US' };

// Checkout is intentionally NOT wired to a fake "become premium" toggle.
// Real entitlement can only ever come from the stripe-webhook Edge
// Function writing profiles.subscription_status (see
// supabase/migrations/002_soul_garden_expansion.sql). Until real Stripe
// Price IDs are configured (see subscriptionConfig.js), the checkout button
// explains that plainly instead of pretending to charge anyone.
export default function Subscription() {
  const { entitlements, goTo } = useSoulGarden();
  const { user, isGuest } = useAuth();
  const { t, lang } = useTranslation();
  const [plan, setPlan] = useState('yearly');
  const [checkoutState, setCheckoutState] = useState('idle'); // idle | loading | error

  const status = entitlements.status;
  const selected = SUBSCRIPTION_PLANS[plan];
  const stripeReady = Boolean(selected.stripePriceId);

  const handleCheckout = async () => {
    if (isGuest) {
      goTo('auth');
      return;
    }
    if (!stripeReady) return; // button is disabled in this case, but guard anyway

    setCheckoutState('loading');
    try {
      // Calls the create-checkout-session Edge Function (see
      // supabase/functions/create-checkout-session). Never creates a
      // Stripe session or touches secret keys from the browser.
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user?.access_token || ''}` },
        body: JSON.stringify({ priceId: selected.stripePriceId, plan }),
      });
      if (!res.ok) throw new Error('checkout_failed');
      const { url } = await res.json();
      if (url) window.location.href = url;
      else throw new Error('no_checkout_url');
    } catch {
      setCheckoutState('error');
    }
  };

  return (
    <section className="subscription container">
      <Luna state="ENCOURAGING" size="md" message={getRandomLine('subscriptionTeaser', lang)} />

      <header className="subscription__header fade-up">
        <p className="eyebrow">{t('account.subscription')}</p>
        <h1>{t('subscription.title')}</h1>
        <p className="subscription__subtitle">{t('subscription.subtitle')}</p>
      </header>

      {status !== 'free' && (
        <div className="card subscription__status fade-up" role="status">
          <p className="subscription__status-label">{t('subscription.currentPlan')}</p>
          <p className="subscription__status-value">{t(`subscription.${status}`)}</p>
          {status === 'active' && <p>{t('subscription.alreadyActive')}</p>}
          {status === 'trialing' && <p>{t('subscription.alreadyTrialing')}</p>}
          {status === 'past_due' && <p className="form-error">{t('subscription.pastDueNote')}</p>}
          {status === 'cancelled' && <p>{t('subscription.cancelledNote')}</p>}
          {(status === 'active' || status === 'trialing' || status === 'past_due') && (
            <Button
              variant="ghost"
              onClick={() =>
                window.open(import.meta.env.VITE_STRIPE_BILLING_PORTAL_URL || '#', '_blank', 'noopener')
              }
            >
              {t('subscription.manageCta')}
            </Button>
          )}
        </div>
      )}

      <div className="card subscription__benefits fade-up">
        <h2>{t('subscription.benefitsTitle')}</h2>
        <ul>
          {t('subscription.benefits').map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <p className="subscription__free-note">{t('subscription.freeNote')}</p>
      </div>

      {!entitlements.isPremium && (
        <div className="card subscription__plans fade-up">
          <div className="subscription__plan-toggle" role="tablist" aria-label={t('account.subscription')}>
            {Object.values(SUBSCRIPTION_PLANS).map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={plan === p.id}
                className={`subscription__plan-btn ${plan === p.id ? 'is-active' : ''}`}
                onClick={() => setPlan(p.id)}
              >
                {t(`subscription.${p.id}`)}
              </button>
            ))}
          </div>

          <p className="subscription__price">
            {formatPrice(plan, LOCALE[lang])}
            <span className="subscription__price-interval">
              {plan === 'monthly' ? t('subscription.perMonth') : t('subscription.perYear')}
            </span>
          </p>

          {!stripeReady && <p className="subscription__not-configured">{t('subscription.notConfigured')}</p>}
          {checkoutState === 'error' && <p className="form-error">{t('subscription.checkoutError')}</p>}

          <Button onClick={handleCheckout} disabled={!stripeReady || checkoutState === 'loading'}>
            {checkoutState === 'loading' ? t('subscription.loadingCheckout') : t('subscription.cta')}
          </Button>
        </div>
      )}
    </section>
  );
}
