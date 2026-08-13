import Scene from '../Scene.jsx';
import GardenBackground from './components/GardenBackground.jsx';
import ParticleField from './components/ParticleField.jsx';
import HeroTitle from './components/HeroTitle.jsx';
import HeroCTA from './components/HeroCTA.jsx';
import './HeroScene.css';

/*
  HeroScene
  =========
  The official Soul Garden landing scene — the first thing a user
  sees. Built entirely on the existing architecture:

    - Uses <Scene variant="hero"> for the outer section/container/
      z-index shell (src/scenes/Scene.jsx), passing a custom
      `background` instead of the default wash.
    - Uses the existing <Button> (via HeroCTA) — no new button system.
    - Uses only existing design tokens (colors/type/spacing/motion) —
      no new token definitions anywhere in this folder.

  No title/subtitle props are passed to <Scene>: HeroTitle renders the
  page's single <h1> itself, so heading hierarchy stays correct and
  there's no duplicate heading between Scene and HeroScene.

  Explicitly NOT included here (future tasks, per the brief):
  Luna's final character, Day 01 content, journal, auth, payments,
  dashboard, additional journey areas.
*/
export default function HeroScene() {
  return (
    <Scene
      variant="hero"
      background={
        <>
          <GardenBackground />
          <ParticleField />
        </>
      }
    >
      <div className="sg-hero">
        <HeroTitle />
        <HeroCTA />
      </div>
    </Scene>
  );
}
