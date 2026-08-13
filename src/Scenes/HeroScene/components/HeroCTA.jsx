import Button from '../../../components/Button/Button.jsx';
import './HeroCTA.css';

/*
  HeroCTA
  =======
  Wraps the existing, reusable <Button> (from src/components/Button)
  rather than inventing a new button — per the brief, this must feel
  like part of the magical world without a second button system.
  Adds only what's specific to the Hero moment: a soft ambient glow
  behind the button and a delayed entrance so it appears after the
  title has settled.

  `onActivate` is intentionally the only prop: TASK 002 has no
  destination yet (no journal/journey/auth exists), so the click
  handler is left as a no-op-friendly hook for whoever wires
  navigation in a later task.
*/
export default function HeroCTA({ onActivate }) {
  return (
    <div className="sg-hero-cta">
      <div className="sg-hero-cta__glow" aria-hidden="true" />
      <Button variant="primary" onClick={onActivate}>
        ابدئي رحلتكِ 🦋
      </Button>
    </div>
  );
}
