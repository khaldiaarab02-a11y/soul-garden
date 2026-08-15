import './GardenBackground.css';
import { useSettings } from '../../state/SettingsContext';

const FIREFLY_COUNT = 14;
const FIREFLY_COUNT_REDUCED = 5;

export default function GardenBackground({ variant = 'default' }) {
  const { settings } = useSettings();
  const count = settings.effectsEnabled ? FIREFLY_COUNT : FIREFLY_COUNT_REDUCED;
  const fireflies = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={`garden-bg garden-bg--${variant}`} aria-hidden="true">
      <div className="garden-bg__mist" />
      <div className="garden-bg__glow-top" />
      <div className="garden-bg__glow-bottom" />
      <div className="garden-bg__fireflies">
        {fireflies.map((i) => (
          <span
            key={i}
            className="firefly"
            style={{
              '--x': `${(i * 37) % 100}%`,
              '--delay': `${(i % 7) * 0.9}s`,
              '--dur': `${9 + (i % 5) * 2}s`,
            }}
          />
        ))}
      </div>
      <div className="garden-bg__vignette" />
    </div>
  );
}
