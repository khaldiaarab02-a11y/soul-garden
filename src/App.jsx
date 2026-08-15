import { AuthProvider, useAuth } from './state/AuthContext';
import { SettingsProvider } from './state/SettingsContext';
import { SoulGardenProvider, useSoulGarden } from './state/SoulGardenContext';
import GardenBackground from './components/Garden/GardenBackground';
import Navigation from './components/Navigation/Navigation';
import LunaEncounterManager from './components/Luna/LunaEncounterManager';
import Hero from './scenes/Hero/Hero';
import Onboarding from './scenes/Onboarding/Onboarding';
import Garden from './scenes/Garden/Garden';
import CheckIn from './scenes/CheckIn/CheckIn';
import Journey from './scenes/Journey/Journey';
import Journal from './scenes/Journal/Journal';
import Progress from './scenes/Progress/Progress';
import Auth from './scenes/Auth/Auth';
import ResetPassword from './scenes/Auth/ResetPassword';
import Profile from './scenes/Profile/Profile';
import Settings from './scenes/Settings/Settings';
import Subscription from './scenes/Subscription/Subscription';
import LoadingState from './components/UI/LoadingState';
import ErrorBoundary from './components/UI/ErrorBoundary';
import { useTranslation } from './i18n/i18n';

const SCENES = {
  hero: Hero,
  onboarding: Onboarding,
  garden: Garden,
  checkin: CheckIn,
  journey: Journey,
  journal: Journal,
  progress: Progress,
  auth: Auth,
  'reset-password': ResetPassword,
  profile: Profile,
  settings: Settings,
  subscription: Subscription,
};

function SceneRouter() {
  const { state } = useSoulGarden();
  const { passwordRecovery } = useAuth();
  // A recovery link always wins, no matter what scene was active — the
  // user must be able to finish setting a new password, not get routed
  // back into the app mid-flow.
  const Scene = passwordRecovery ? ResetPassword : SCENES[state.currentScene] || Hero;
  return <Scene />;
}

function AppShell() {
  const { t } = useTranslation();
  return (
    <SoulGardenProvider>
      <a href="#main" className="skip-link">{t('common.skipToContent')}</a>
      <GardenBackground />
      <Navigation />
      <main id="main">
        <SceneRouter />
      </main>
      <LunaEncounterManager />
    </SoulGardenProvider>
  );
}

function Root() {
  // `loading` is only ever true briefly, while Supabase resolves whether
  // there's an existing session — this replaces what used to be a blank
  // screen on first load with the same visual language as the rest of the
  // app (see requirement: no blank screens during auth/session loading).
  const { loading } = useAuth();
  if (loading) return <LoadingState messageKey="loading.checkingSession" />;
  return <AppShell />;
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ErrorBoundary>
          <Root />
        </ErrorBoundary>
      </SettingsProvider>
    </AuthProvider>
  );
}
