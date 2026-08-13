import HeroScene from './scenes/HeroScene/HeroScene.jsx';

/*
  App
  ===
  TASK 002: the app root now renders the official Hero Scene — the
  first visual experience of Soul Garden.

  The TASK 001 architecture-proof demo (Scene + Fairy placeholder +
  Button rendered directly) has been retired from here now that a
  real scene exists, but none of those components were deleted —
  Fairy.jsx, Button.jsx, and Scene.jsx are all still in place and are
  exactly what HeroScene is built on top of.

  Luna (Fairy) is intentionally NOT part of the Hero — per TASK 002,
  her final character is a later task.
*/
export default function App() {
  return <HeroScene />;
}
