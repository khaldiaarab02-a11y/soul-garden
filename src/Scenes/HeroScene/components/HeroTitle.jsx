import './HeroTitle.css';

/*
  HeroTitle
  =========
  Renders the single <h1> for the Hero (Scene itself renders none when
  no `title` prop is passed — see HeroScene.jsx), preceded by a
  secondary "eyebrow" line and followed by the subtitle. Entrance is a
  soft staggered fade/rise, purely via CSS animation-delay so it needs
  no JS orchestration and degrades to an instant, static appearance
  under prefers-reduced-motion (handled globally).
*/
export default function HeroTitle() {
  return (
    <div className="sg-hero-title">
      <p className="sg-hero-title__eyebrow">رحلة • تأمل • تحرر • ازدهار</p>
      <h1 className="sg-hero-title__heading">حديقة الروح</h1>
      <p className="sg-hero-title__subtitle">
        رحلة للعودة إلى ذاتكِ… خطوةً بخطوة
      </p>
    </div>
  );
}
