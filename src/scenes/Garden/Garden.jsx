import { useState } from 'react';
import { useSoulGarden } from '../../state/SoulGardenContext';
import { GARDEN_STAGES } from '../../data/gardenMilestones';
import { INNER_CHILD_DIALOGUE } from '../../data/innerChild';
import GardenElement from '../../components/Garden/GardenElements';
import InnerChild from '../../components/InnerChild/InnerChild';
import Button from '../../components/UI/Button';
import { useTranslation } from '../../i18n/i18n';
import './Garden.css';

// Positions are hand-placed (not random) so the garden always reads as a
// designed scene, not scattered emoji. Percentages are relative to the
// garden "field" — safe zone away from edges on small screens.
const LAYOUT = [
  { top: '62%', left: '18%' },
  { top: '70%', left: '38%' },
  { top: '58%', left: '58%' },
  { top: '68%', left: '76%' },
  { top: '46%', left: '30%' },
  { top: '40%', left: '66%' },
  { top: '30%', left: '50%' },
  { top: '50%', left: '10%' },
  { top: '34%', left: '84%' },
];

function localize(field, lang) {
  if (!field) return '';
  return field[lang] || field.ar || '';
}

function pickInnerChildLine(stageId, lang) {
  const lines = (INNER_CHILD_DIALOGUE[lang] || INNER_CHILD_DIALOGUE.ar)[stageId] || [];
  if (!lines.length) return '';
  return lines[Math.floor(Math.random() * lines.length)];
}

export default function Garden() {
  const { garden, state, goTo, innerChild, interactWithInnerChild } = useSoulGarden();
  const { t, lang } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [icOpen, setIcOpen] = useState(false);
  const [icLine, setIcLine] = useState('');

  const reachedStages = GARDEN_STAGES.filter(
    (s) => s.threshold > 0 && s.threshold <= garden.percent
  );

  const journeyStarted =
    state.checkIns.length + state.journalEntries.length + state.completedExercises.length > 0;

  const selectedStage = selected ? GARDEN_STAGES.find((s) => s.id === selected) : null;

  return (
    <section className="garden-scene container">
      <header className="garden-scene__header fade-up">
        <p className="eyebrow">{t('garden.eyebrow')}</p>
        <h1>{localize(garden.stage.label, lang)}</h1>
        <p className="garden-scene__meaning">{localize(garden.stage.meaning, lang)}</p>
      </header>

      <div className="garden-field" role="group" aria-label={t('garden.elementsLabel')}>
        {reachedStages.length === 0 && (
          <p className="garden-field__empty-note fade-up">{t('garden.emptyNote')}</p>
        )}
        {reachedStages.map((s, i) => {
          const pos = LAYOUT[i % LAYOUT.length];
          const isSelected = selected === s.id;
          return (
            <button
              key={s.id}
              type="button"
              className={`garden-item ${isSelected ? 'is-selected' : ''}`}
              style={{ top: pos.top, left: pos.left, '--i': i }}
              onClick={() => setSelected(isSelected ? null : s.id)}
              aria-pressed={isSelected}
              aria-label={`${localize(s.label, lang)} — ${localize(s.symbol, lang)}`}
            >
              <span className="garden-item__icon" aria-hidden="true">
                <GardenElement stageId={s.id} />
              </span>
            </button>
          );
        })}
        {innerChild.relationship.id !== 'distant' && (
          <button
            type="button"
            className="garden-item garden-item--inner-child"
            style={{ top: '78%', left: '50%' }}
            onClick={() => {
              interactWithInnerChild();
              setIcLine(pickInnerChildLine(innerChild.relationship.id, lang));
              setIcOpen((v) => !v);
            }}
            aria-pressed={icOpen}
            aria-label={innerChild.name || t('innerChild.introTitle', { name: '' })}
          >
            <InnerChild state={innerChild.relationship.defaultState} size="sm" />
          </button>
        )}
      </div>

      {icOpen && innerChild.relationship.id !== 'distant' && (
        <div className="garden-meaning-card fade-up" role="status">
          {innerChild.name && (
            <p className="garden-meaning-card__symbol">{t('innerChild.introTitle', { name: innerChild.name })}</p>
          )}
          <p>{t('innerChild.introBody')}</p>
          {icLine && <p className="garden-meaning-card__quote">{icLine}</p>}
        </div>
      )}

      {selectedStage && (
        <div className="garden-meaning-card fade-up" role="status">
          <p className="garden-meaning-card__symbol">{localize(selectedStage.symbol, lang)}</p>
          <p>{localize(selectedStage.meaning, lang)}</p>
        </div>
      )}

      <div className="garden-scene__progress" aria-hidden="true">
        <div className="garden-scene__progress-track">
          <div className="garden-scene__progress-fill" style={{ width: `${garden.percent}%` }} />
        </div>
        {garden.next && (
          <p className="garden-scene__next">
            {t('garden.growingTowards')}: {localize(garden.next.label, lang)}
          </p>
        )}
      </div>

      {!journeyStarted && (
        <div className="garden-scene__cta fade-up">
          <p>{t('garden.startPrompt')}</p>
          <Button onClick={() => goTo('checkin')}>{t('garden.startCta')}</Button>
        </div>
      )}
    </section>
  );
}
