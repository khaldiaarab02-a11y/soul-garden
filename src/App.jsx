import { SoulGardenProvider, useSoulGarden } from './state/SoulGardenContext';
import GardenBackground from './components/Garden/GardenBackground';
import Navigation from './components/Navigation/Navigation';
import Hero from './scenes/Hero/Hero';
import Onboarding from './scenes/Onboarding/Onboarding';
import CheckIn from './scenes/CheckIn/CheckIn';
import Journey from './scenes/Journey/Journey';
import Journal from './scenes/Journal/Journal';
import Progress from './scenes/Progress/Progress';

const SCENES = {
  hero: Hero,
  onboarding: Onboarding,
  checkin: CheckIn,
  journey: Journey,
  journal: Journal,
  progress: Progress,
};

function SceneRouter() {
  const { state } = useSoulGarden();
  const Scene = SCENES[state.currentScene] || Hero;
  return <Scene />;
}

export default function App() {
  return (
    <SoulGardenProvider>
      <a href="#main" className="skip-link">تخطَّ إلى المحتوى</a>
      <GardenBackground />
      <Navigation />
      <main id="main">
        <SceneRouter />
      </main>
    </SoulGardenProvider>
  );
}
