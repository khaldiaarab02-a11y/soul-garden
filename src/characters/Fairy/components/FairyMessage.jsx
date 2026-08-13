import React from 'react';

export default function FairyMessage({ message, visible = true }) {
  if (!visible || !message) return null;
  return (
    <div className="fairy__message" role="status" aria-live="polite">
      {message}
    </div>
  );
}
