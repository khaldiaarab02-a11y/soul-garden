import React from 'react';

export default function FairyGlow({ children }) {
  return (
    <div className="fairy-glow" aria-hidden="true">
      {children}
    </div>
  );
}
