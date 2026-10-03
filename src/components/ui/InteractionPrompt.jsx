import React from 'react';
import { useInteractionStore } from '../../systems/interactionSystem.js';

export function InteractionPrompt() {
  const { nearbyInteractable, isSitting } = useInteractionStore();

  if (!nearbyInteractable && !isSitting) {
    return null;
  }

  const label = isSitting ? 'Stand' : 'Sit';
  const subtitle = isSitting ? 'or press WASD' : '';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '88px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 20px',
        backgroundColor: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
        borderRadius: '30px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 15px rgba(56, 189, 248, 0.2)',
        color: '#f8fafc',
        fontFamily: "'Inter', sans-serif",
        fontSize: '0.92rem',
        fontWeight: '500',
        zIndex: 50,
        pointerEvents: 'none',
        userSelect: 'none',
        animation: 'fadeInUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '26px',
          height: '26px',
          backgroundColor: '#38bdf8',
          color: '#09090b',
          fontWeight: '700',
          fontSize: '0.85rem',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(56, 189, 248, 0.4)'
        }}
      >
        F
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span>Press to <strong>{label}</strong></span>
        {subtitle && (
          <span style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
            ({subtitle})
          </span>
        )}
      </div>
    </div>
  );
}
