import './Fairy.css';

/*
  Fairy
  =====
  Placeholder for the main companion (currently "Luna" / لونا).
  This is NOT the final character design — no illustration, rig, or
  entrance animation yet. It exists to prove where the character
  system lives and how it receives dialogue, so later tasks can swap
  in real artwork/animation without moving files around.

  Props:
    name:    the companion's display name (e.g. "لونا")
    message: a short line of dialogue to display beside her
*/
export default function Fairy({ name, message }) {
  return (
    <div className="sg-fairy" role="group" aria-label={name}>
      <div className="sg-fairy__glyph" aria-hidden="true" />
      {(name || message) && (
        <div className="sg-fairy__dialogue">
          {name && <p className="sg-fairy__name">{name}</p>}
          {message && <p className="sg-fairy__message">{message}</p>}
        </div>
      )}
    </div>
  );
}
