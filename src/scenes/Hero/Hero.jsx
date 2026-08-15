import { useState, useEffect } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { getRandomLine } from '../../data/dialogue';
import { useTranslation } from '../../i18n/i18n';
import './Hero.css';

export default function Hero() {
  const { state, goTo } = useSoulGarden();
  const { t, lang } = useTranslation();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setMessage(getRandomLine('welcome', lang)), 900);
    return () => clearTimeout(timeout);
  }, [lang]);

  const handleEnter = () => {
    goTo(state.hasOnboarded ? 'garden' : 'onboarding');
  };

  return (
    <section className="hero">
      <div className="hero__inner container">
        <Luna state="WELCOME" size="hero" message={message} />
        <div className="hero__copy fade-up">
          <p className="eyebrow">{t('common.appName')}</p>
          <h1 className="hero__title">{t('hero.tagline')}</h1>
          <p className="hero__subtitle">{t('hero.subtitle')}</p>
          <Button onClick={handleEnter}>{t('hero.cta')}</Button>
        </div>
      </div>
    </section>
  );
}
