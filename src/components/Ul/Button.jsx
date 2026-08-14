// The ONE button system. All calls-to-action in the product go through this.
export default function Button({ children, variant = 'primary', onClick, type = 'button', ...rest }) {
  const cls = variant === 'ghost' ? 'btn btn-ghost' : 'btn btn-primary';
  return (
    <button type={type} className={cls} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}
