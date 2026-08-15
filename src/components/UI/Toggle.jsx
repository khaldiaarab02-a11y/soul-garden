export default function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`toggle-switch ${checked ? 'is-on' : ''}`}
      onClick={() => onChange(!checked)}
    />
  );
}
