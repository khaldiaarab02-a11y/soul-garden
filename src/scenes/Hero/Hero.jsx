import { useState, useEffect } from 'react';
import Luna from '../../components/Luna/Luna';
import Button from '../../components/UI/Button';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { getRandomLine } from '../../data/dialogue';
import './Hero.css';

export default function Hero() {
  const { state, goTo } = useSoulGarden();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setMessage(getRandomLine('welcome')), 900);
    return () => clearTimeout(t);
  }, []);

  const handleEnter = () => {
    goTo(state.hasOnboarded ? 'checkin' : 'onboarding');
  };

  return (
    <section className="hero">
      <div className="hero__inner container">
        <Luna state="WELCOME" size="hero" message={message} />
        <div className="hero__copy fade-up">
          <p className="eyebrow">حديقة الروح</p>
          <h1 className="hero__title">مساحة هادئة لتصغي فيها إلى نفسك</h1>
          <p className="hero__subtitle">
            ادخل حديقتك الداخلية، برفقة لونا، لرحلة لطيفة من الوعي والتأمل والكتابة —
            بلا استعجال، وبلا حكم.
          </p>
          <Button onClick={handleEnter}>ابدأ الرحلة</Button>
        </div>
      </div>
    </section>
  );
}
