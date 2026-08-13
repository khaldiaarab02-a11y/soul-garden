import './Scene.css';

/*
  Scene
  =====
  The base environmental container every garden area / journey moment
  will render inside. It owns the atmospheric background layer and a
  content region; it does NOT know about any specific garden area yet.

  Future scenes (Garden of Awareness, Roots, Lake of Release, ...) are
  expected to compose this component and add their own background
  imagery / particle layers rather than duplicating this shell —
  see src/scenes/ for where those will live.

  Props:
    title:      optional heading rendered in the scene (skip if the
                caller renders its own heading inside children, as
                HeroScene does — never render two <h1>s in one scene)
    subtitle:   optional supporting line
    background: optional custom atmosphere content (ReactNode). When
                provided, it replaces the default two-gradient wash so
                richer scenes (e.g. HeroScene's GardenBackground) can
                own their own layered art direction while still using
                this shell for the outer section/container/z-index
                architecture. When omitted, the original default wash
                is used — existing callers are unaffected.
    variant:    'default' | 'hero' — 'hero' relaxes the content
                container's vertical padding/max-width slightly so a
                full-bleed cinematic composition has room to breathe.
    children:   scene content (character, prompts, controls, ...)
*/
export default function Scene({
  title,
  subtitle,
  background,
  variant = 'default',
  children,
}) {
  return (
    <section className={`sg-scene sg-scene--${variant}`}>
      <div className="sg-scene__atmosphere" aria-hidden="true">
        {background}
      </div>

      <div className="container sg-scene__content">
        {title && <h1 className="sg-scene__title">{title}</h1>}
        {subtitle && <p className="sg-scene__subtitle">{subtitle}</p>}
        <div className="sg-scene__body">{children}</div>
      </div>
    </section>
  );
}
