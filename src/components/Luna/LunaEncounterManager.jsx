import { useEffect, useRef, useState, useCallback } from 'react';
import Luna from './Luna';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { useSettings } from '../../state/SettingsContext';
import { useTranslation } from '../../i18n/i18n';
import { LUNA_ENCOUNTERS } from '../../data/lunaEncounters';
import { getRandomLine } from '../../data/dialogue';
import { playSound } from '../../audio/audioManager';
import './LunaEncounterManager.css';

const SEEN_KEY = 'soul-garden:luna:seen-once';
const COOLDOWN_KEY = 'soul-garden:luna:cooldowns';
const FIRST_VISIT_KEY = 'soul-garden:luna:last-visit';
const VISIBLE_MS = 5200;
const RETURN_GAP_MS = 60 * 60 * 1000; // an hour+ away counts as "returning"

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore — encounters simply won't persist "seen" state this session
  }
}

/**
 * Renders nothing when Luna is not currently making an appearance.
 * Mounted once, globally, in App — independent of which scene is active.
 */
export default function LunaEncounterManager() {
  const { state, garden, entitlements } = useSoulGarden();
  const { settings } = useSettings();
  const { lang } = useTranslation();
  const [active, setActive] = useState(null); // { encounterId, lunaState, message }
  const busyRef = useRef(false);
  const prevStageRef = useRef(undefined);
  const lastEventAtRef = useRef(null);
  const lastActivityRef = useRef(Date.now());
  const visitMetaRef = useRef(null);

  // First-visit / returning-visit detection (kept out of main app state —
  // it's about *time away*, not journey data).
  useEffect(() => {
    const prevVisit = readJSON(FIRST_VISIT_KEY, null);
    const now = Date.now();
    visitMetaRef.current = {
      isFirstVisitEver: !prevVisit,
      isReturningVisit: Boolean(prevVisit) && now - prevVisit > RETURN_GAP_MS,
    };
    writeJSON(FIRST_VISIT_KEY, now);
  }, []);

  // Track idle time only while it matters (garden scene).
  useEffect(() => {
    const bump = () => {
      lastActivityRef.current = Date.now();
    };
    window.addEventListener('pointerdown', bump);
    window.addEventListener('keydown', bump);
    window.addEventListener('scroll', bump, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', bump);
      window.removeEventListener('keydown', bump);
      window.removeEventListener('scroll', bump);
    };
  }, []);

  const dismiss = useCallback(() => {
    playSound('lunaDisappear', { volume: 0.3 });
    setActive(null);
    // small grace window before Luna can appear again
    setTimeout(() => {
      busyRef.current = false;
    }, 1500);
  }, []);

  const tryShow = useCallback(
    (encounter) => {
      if (busyRef.current) return;
      const seen = readJSON(SEEN_KEY, []);
      if (encounter.once && seen.includes(encounter.id)) return;

      const cooldowns = readJSON(COOLDOWN_KEY, {});
      const last = cooldowns[encounter.id] || 0;
      if (encounter.cooldownMs && Date.now() - last < encounter.cooldownMs) return;

      busyRef.current = true;
      playSound('lunaAppear', { volume: 0.35 });
      setActive({
        encounterId: encounter.id,
        lunaState: encounter.state,
        message: getRandomLine(encounter.dialogueKey, lang),
      });

      if (encounter.once) writeJSON(SEEN_KEY, [...seen, encounter.id]);
      writeJSON(COOLDOWN_KEY, { ...cooldowns, [encounter.id]: Date.now() });

      setTimeout(dismiss, VISIBLE_MS);
    },
    [dismiss, lang]
  );

  const evaluate = useCallback(() => {
    if (!settings.lunaEnabled || busyRef.current || !visitMetaRef.current) return;

    const stageChanged =
      prevStageRef.current !== undefined && prevStageRef.current !== garden.stage.id;

    const ctx = {
      scene: state.currentScene,
      isFirstVisitEver: visitMetaRef.current.isFirstVisitEver,
      isReturningVisit: visitMetaRef.current.isReturningVisit,
      idleMs: Date.now() - lastActivityRef.current,
      lastEvent: state.lastEvent,
      gardenStageChanged: stageChanged,
      gardenStage: garden.stage,
      prevGardenStage: prevStageRef.current ?? null,
      completedExercisesCount: state.completedExercises.length,
      isPremium: entitlements.isPremium,
    };

    const candidates = LUNA_ENCOUNTERS.filter((e) => e.when(ctx)).sort(
      (a, b) => b.priority - a.priority
    );
    if (candidates.length) tryShow(candidates[0]);
  }, [state, garden, tryShow, settings.lunaEnabled, entitlements.isPremium]);

  // React to real events: new lastEvent, scene change, or garden stage change.
  useEffect(() => {
    if (state.lastEvent && state.lastEvent.at !== lastEventAtRef.current) {
      lastEventAtRef.current = state.lastEvent.at;
      evaluate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.lastEvent]);

  useEffect(() => {
    evaluate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentScene]);

  useEffect(() => {
    if (prevStageRef.current !== garden.stage.id) {
      evaluate();
      prevStageRef.current = garden.stage.id;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [garden.stage.id]);

  // Ambient idle whisper — only worth polling while the garden is on screen.
  useEffect(() => {
    if (state.currentScene !== 'garden') return undefined;
    const id = setInterval(evaluate, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentScene]);

  if (!active) return null;

  return (
    <div className="luna-encounter" role="status" aria-live="polite">
      <Luna state={active.lunaState} size="md" message={active.message} align="end" />
    </div>
  );
}
