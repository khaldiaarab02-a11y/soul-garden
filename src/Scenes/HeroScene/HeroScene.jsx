import Scene from '../Scene.jsx';
import GardenBackground from './components/GardenBackground.jsx';
import ParticleField from './components/ParticleField.jsx';
import HeroTitle from './components/HeroTitle.jsx';
import HeroCTA from './components/HeroCTA.jsx';
import Fairy from '../../characters/Fairy/Fairy.jsx';
import './HeroScene.css';

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
        <Fairy
          state="WELCOME"
          message="مرحبًا بكِ في حديقة الروح…"
        />

        <HeroTitle />
        <HeroCTA />
      </div>
    </Scene>
  );
}
