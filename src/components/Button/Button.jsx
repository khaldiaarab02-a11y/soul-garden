import './Button.css';

/*
  Button
  ======
  The base interactive element for Soul Garden. Three variants for now;
  more (e.g. "ghost", "icon") can be added as later tasks require them
  without changing the API.

  Props:
    variant: 'primary' | 'secondary' | 'text'   (default: 'primary')
    as:      element/component to render as     (default: 'button')
    ...rest: passed through to the underlying element
*/
export default function Button({
  variant = 'primary',
  as: Component = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = ['sg-button', `sg-button--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...rest}>
      <span className="sg-button__label">{children}</span>
    </Component>
  );
}
