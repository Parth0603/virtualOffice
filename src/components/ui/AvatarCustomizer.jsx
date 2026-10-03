import React, { useState } from 'react';
import { useWorkspaceStore, workspaceStore } from '../../state/useWorkspaceStore.js';

export function AvatarCustomizer({ onContinue }) {
  const { profile } = useWorkspaceStore();
  const [name, setName] = useState(profile.name || '');
  const [color, setColor] = useState(profile.color || '#3182ce');
  const [style, setStyle] = useState(profile.style || 'casual');
  const [hair, setHair] = useState(profile.hair || 'short');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a name.');
      return;
    }

    workspaceStore.setProfile({
      name: name.trim(),
      color,
      style,
      hair
    });

    onContinue();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '1rem',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        padding: '2rem',
        borderRadius: '1rem',
        textAlign: 'center',
        width: '100%',
        maxWidth: '420px',
        color: '#f1f5f9'
      }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '1.5rem', color: '#f1f5f9' }}>
          Customize Your Avatar
        </h1>

        {/* Avatar Preview */}
        <div style={{
          width: '120px',
          height: '120px',
          margin: '0 auto 1.5rem',
          borderRadius: style === 'business' ? '20%' : '50%',
          backgroundColor: color,
          border: '3px solid #3b82f6',
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem'
        }}>
          {style === 'business' ? '👔' : style === 'creative' ? '🎨' : '👤'}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Player Name */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Enter Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '2px solid rgba(148, 163, 184, 0.2)',
                background: 'rgba(30, 41, 59, 0.8)',
                color: '#e2e8f0',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Avatar Style */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Avatar Style
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[
                { id: 'casual', label: '👤 Casual' },
                { id: 'business', label: '👔 Business' },
                { id: 'creative', label: '🎨 Creative' }
              ].map(s => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: style === s.id ? '2px solid #3b82f6' : '2px solid transparent',
                    background: style === s.id ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                    color: style === s.id ? '#3b82f6' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hair Style */}
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Hair Style
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
              {['short', 'long', 'curly', 'bald'].map(h => (
                <button
                  type="button"
                  key={h}
                  onClick={() => setHair(h)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    border: hair === h ? '2px solid #3b82f6' : '2px solid transparent',
                    background: hair === h ? 'rgba(59, 130, 246, 0.15)' : 'rgba(30, 41, 59, 0.8)',
                    color: hair === h ? '#3b82f6' : '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Color Picker */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#cbd5e1', marginBottom: '0.5rem' }}>
              Choose a Color
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                padding: '4px',
                borderRadius: '0.5rem',
                border: '2px solid #475569',
                backgroundColor: '#1e293b',
                cursor: 'pointer'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
