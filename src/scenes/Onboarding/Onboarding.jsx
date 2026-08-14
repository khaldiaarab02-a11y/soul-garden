import { useState } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { DIALOGUE } from '../../data/dialogue';
import './Onboarding.css';

export default function Onboarding() {
  const { completeOnboarding, goTo } = useSoulGarden();
  const [step, setStep] = useState(0);
  const steps = DIALOGUE.onboarding;
  const isLast = step === steps.length - 1;

  const next = () => {
    if (isLast) {
      completeOnboarding();
      goTo('checkin');
    } else {
      setStep((s) => s + 1);
    }
  };

  return (
    <section className="onboarding container">
      <Luna state={isLast ? 'ENCOURAGING' : 'LISTENING'} size="lg" message={steps[step]} />
      <div className="onboarding__dots" role="tablist" aria-label="خطوات التعريف">
        {steps.map((_, i) => (
          <span key={i} className={`dot ${i === step ? 'is-active' : ''}`} aria-hidden="true" />
        ))}
      </div>
      <div className="onboarding__actions">
        <Button onClick={next}>{isLast ? 'لنبدأ التأمل' : 'التالي'}</Button>
        {!isLast && (
          <Button
            variant="ghost"
            onClick={() => {
              completeOnboarding();
              goTo('checkin');
            }}
          >
            تخطّي
          </Button>
        )}
      </div>
    </section>
  );
}
