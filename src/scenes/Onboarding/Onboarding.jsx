import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import InnerChild from '../../components/InnerChild/InnerChild';
import Button from '../../components/UI/Button';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { DIALOGUE_BY_LANG } from '../../data/dialogue';
import { useTranslation } from '../../i18n/i18n';
import './Onboarding.css';

// Onboarding has two phases: Luna's existing dialogue steps, then a final
// "name your inner child" step. The Luna dialogue steps come from
// DIALOGUE_BY_LANG so they follow the active language; the naming step is
// fully localized through useTranslation.
export default function Onboarding() {
  const { completeOnboarding, goTo, setInnerChildName, state } = useSoulGarden();
  const { t, lang } = useTranslation();
  const [step, setStep] = useState(0);
  const [nameDraft, setNameDraft] = useState('');
  const steps = DIALOGUE_BY_LANG[lang]?.onboarding || DIALOGUE_BY_LANG.ar.onboarding;
  const namingStepIndex = steps.length; // one step appended after Luna's dialogue
  const isNamingStep = step === namingStepIndex;
  const isLastDialogueStep = step === steps.length - 1;

  const finish = (name) => {
    if (name) setInnerChildName(name);
    completeOnboarding();
    goTo('garden');
  };

  const next = () => {
    if (isNamingStep) {
      finish(nameDraft.trim() || null);
    } else if (isLastDialogueStep) {
      setStep(namingStepIndex);
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <section className="onboarding container">
      {isNamingStep ? (
        <div className="onboarding__naming fade-up">
          <InnerChild state="SHY" size="md" />
          <h2>{t('onboarding.nameInnerChildTitle')}</h2>
          <p className="onboarding__hint">{t('onboarding.nameInnerChildHint')}</p>
          <input
            className="onboarding__name-input"
            type="text"
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            placeholder={t('onboarding.nameInnerChildPlaceholder')}
            aria-label={t('onboarding.nameInnerChildTitle')}
            maxLength={40}
          />
        </div>
      ) : (
        <Luna state={isLastDialogueStep ? 'ENCOURAGING' : 'LISTENING'} size="lg" message={steps[step]} />
      )}

      <div className="onboarding__dots" role="tablist" aria-label={t('onboarding.welcomeTitle')}>
        {[...steps, null].map((_, i) => (
          <span key={i} className={`dot ${i === step ? 'is-active' : ''}`} aria-hidden="true" />
        ))}
      </div>

      <div className="onboarding__actions">
        <Button onClick={next}>{isNamingStep ? t('onboarding.finish') : t('common.continue')}</Button>
        {!isNamingStep && (
          <Button variant="ghost" onClick={() => setStep(namingStepIndex)}>
            {isLastDialogueStep ? t('common.continue') : t('onboarding.nameInnerChildSkip')}
          </Button>
        )}
        {isNamingStep && (
          <Button variant="ghost" onClick={() => finish(null)}>
            {t('onboarding.nameInnerChildSkip')}
          </Button>
        )}
      </div>
    </section>
  );
}
