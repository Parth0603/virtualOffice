import React, { useState } from 'react';
import { useWorkspaceStore, workspaceStore } from '../../state/useWorkspaceStore.js';

export function AvatarCustomizer({ onContinue }) {
  const { profile, workspaceId } = useWorkspaceStore();
  const [name, setName] = useState(profile.name || '');
  const [color, setColor] = useState(profile.color || '#2563eb');
  const [style, setStyle] = useState(profile.style || 'casual');
  const [hair, setHair] = useState(profile.hair || 'short');
  const [isEntering, setIsEntering] = useState(false);

  // Tasteful, cohesive executive color palette
  const curatedColors = [
    { label: 'Blue', hex: '#2563eb' },
    { label: 'Slate', hex: '#475569' },
    { label: 'Cyan', hex: '#0284c7' },
    { label: 'Emerald', hex: '#16a34a' },
    { label: 'Indigo', hex: '#4f46e5' },
    { label: 'Violet', hex: '#7c3aed' },
    { label: 'Amber', hex: '#d97706' },
    { label: 'Rose', hex: '#e11d48' }
  ];

  const styles = [
    {
      id: 'casual',
      label: 'Casual',
      desc: 'Modern tech aesthetic',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
        </svg>
      )
    },
    {
      id: 'business',
      label: 'Business',
      desc: 'Structured formal attire',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      )
    },
    {
      id: 'creative',
      label: 'Creative',
      desc: 'Contemporary studio fit',
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      )
    }
  ];

  const hairOptions = [
    { id: 'short', label: 'Short' },
    { id: 'curly', label: 'Medium' },
    { id: 'long', label: 'Long' },
    { id: 'bald', label: 'None' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    setIsEntering(true);
    workspaceStore.setProfile({
      name: name.trim(),
      color,
      style,
      hair
    });

    onContinue();
  };

  const handleBackToLanding = () => {
    workspaceStore.setStage('landing');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflowX: 'hidden',
      overflowY: 'auto',
      backgroundColor: '#0c101a',
      backgroundImage: 'radial-gradient(circle at 50% 20%, #151c2e 0%, #0c101a 75%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#f8fafc',
      padding: '24px',
      boxSizing: 'border-box',
      zIndex: 10
    }}>
      {/* Subtle architectural background grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 65% 55% at 50% 45%, black 20%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 45%, black 20%, transparent 80%)',
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '780px',
        boxSizing: 'border-box'
      }}>
        {/* Top Header & Back Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          padding: '0 4px'
        }}>
          <button
            type="button"
            onClick={handleBackToLanding}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 0',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Back</span>
          </button>

          {workspaceId && (
            <div style={{
              fontSize: '11.5px',
              color: '#64748b',
              fontWeight: 500
            }}>
              Space <span style={{ color: '#94a3b8', fontFamily: 'monospace' }}>{workspaceId}</span>
            </div>
          )}
        </div>

        {/* Translucent iPhone Glass Card */}
        <div style={{
          background: 'rgba(21, 28, 44, 0.65)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '24px',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '300px 1fr'
        }}>
          {/* ========================================================= */}
          {/* LEFT: Dynamic Spotlight Stage & Holographic Pedestal       */}
          {/* ========================================================= */}
          <div style={{
            background: 'linear-gradient(180deg, rgba(12, 17, 28, 0.8) 0%, rgba(9, 13, 22, 0.95) 100%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.07)',
            padding: '28px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Dynamic Overhead Light Beam (Conical projection from top) */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '260px',
              height: '100%',
              background: `linear-gradient(180deg, ${color}2e 0%, ${color}12 45%, ${color}00 85%)`,
              clipPath: 'polygon(38% 0%, 62% 0%, 96% 88%, 4% 88%)',
              filter: 'blur(10px)',
              pointerEvents: 'none',
              transition: 'background 0.35s ease'
            }} />

            {/* Top Light Emitter Lens */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '64px',
              height: '3px',
              background: color,
              borderRadius: '0 0 4px 4px',
              boxShadow: `0 0 14px ${color}, 0 0 28px ${color}`,
              transition: 'all 0.35s ease'
            }} />

            {/* Overhead Floating Translucent Name Badge */}
            <div style={{
              background: 'rgba(15, 21, 34, 0.75)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '5px 12px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              zIndex: 3,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 6px #10b981'
              }} />
              <span style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#f8fafc',
                letterSpacing: '-0.01em',
                maxWidth: '120px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {name.trim() || 'Your Name'}
              </span>
            </div>

            {/* Center: Stylized Spatial Presence Hologram & Pedestal */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: '220px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 2,
              margin: 'auto 0'
            }}>
              {/* Soft Ambient Radial Core Glow */}
              <div style={{
                position: 'absolute',
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color}28 0%, transparent 70%)`,
                filter: 'blur(16px)',
                pointerEvents: 'none',
                transition: 'background 0.35s ease'
              }} />

              {/* Holographic Avatar Bust (Clean, High-Tech Silhouette) */}
              <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 3,
                marginBottom: '10px'
              }}>
                {/* Head with Hair Outline & Glowing Visor */}
                <div style={{
                  position: 'relative',
                  width: '54px',
                  height: '54px',
                  borderRadius: hair === 'bald' ? '46%' : '50%',
                  background: 'linear-gradient(160deg, #334155 0%, #1e293b 100%)',
                  border: '1.5px solid rgba(255, 255, 255, 0.16)',
                  boxShadow: `0 8px 16px rgba(0, 0, 0, 0.4), 0 0 16px ${color}33`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Subtle Hair Accent Contour */}
                  {hair !== 'bald' && (
                    <div style={{
                      position: 'absolute',
                      top: hair === 'short' ? '-2px' : hair === 'curly' ? '-4px' : '-5px',
                      left: hair === 'long' ? '-4px' : '3px',
                      right: hair === 'long' ? '-4px' : '3px',
                      height: hair === 'long' ? '28px' : '14px',
                      borderRadius: hair === 'long' ? '14px 14px 6px 6px' : hair === 'curly' ? '10px 10px 4px 4px' : '8px 8px 0 0',
                      borderTop: `2px solid ${hair === 'curly' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.3)'}`,
                      borderLeft: hair === 'long' ? '2px solid rgba(255, 255, 255, 0.25)' : 'none',
                      borderRight: hair === 'long' ? '2px solid rgba(255, 255, 255, 0.25)' : 'none',
                      pointerEvents: 'none'
                    }} />
                  )}

                  {/* Clean Horizontal Reactive Visor Glow */}
                  <div style={{
                    width: '32px',
                    height: '6px',
                    borderRadius: '3px',
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}, inset 0 1px 1px rgba(255, 255, 255, 0.8)`,
                    transition: 'all 0.3s ease'
                  }} />
                </div>

                {/* Sculpted Shoulders / Torso with Archetype Icon */}
                <div style={{
                  width: '92px',
                  height: '56px',
                  borderRadius: '16px 16px 8px 8px',
                  background: `linear-gradient(170deg, ${color}33 0%, rgba(15, 23, 42, 0.9) 100%)`,
                  border: '1.5px solid rgba(255, 255, 255, 0.14)',
                  boxShadow: `0 10px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f8fafc',
                  transition: 'all 0.35s ease'
                }}>
                  <div style={{
                    opacity: 0.9,
                    color: color,
                    filter: `drop-shadow(0 0 6px ${color})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {style === 'business' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                    ) : style === 'creative' ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Illuminated Holographic Pedestal (Floor Dais) */}
              <div style={{
                position: 'absolute',
                bottom: '12px',
                width: '130px',
                height: '34px',
                borderRadius: '50%',
                background: `radial-gradient(ellipse at center, ${color}35 0%, transparent 72%)`,
                border: `1.5px solid ${color}`,
                boxShadow: `0 0 18px ${color}88, inset 0 0 10px ${color}55`,
                transform: 'rotateX(68deg)',
                opacity: 0.85,
                transition: 'all 0.35s ease'
              }} />

              {/* Inner Concentric Orbit Ring */}
              <div style={{
                position: 'absolute',
                bottom: '18px',
                width: '84px',
                height: '22px',
                borderRadius: '50%',
                border: '1px dashed rgba(255, 255, 255, 0.4)',
                transform: 'rotateX(68deg)',
                opacity: 0.6
              }} />
            </div>

            {/* Bottom Subtle Status Pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#94a3b8',
              zIndex: 3
            }}>
              <span style={{ textTransform: 'capitalize', color: '#cbd5e1', fontWeight: 500 }}>
                {style}
              </span>
              <span>•</span>
              <span style={{ textTransform: 'capitalize', color: '#94a3b8' }}>
                {hair === 'bald' ? 'Clean' : hair}
              </span>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT: Clean Translucent Controls                          */}
          {/* ========================================================= */}
          <div style={{
            padding: '28px 26px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Display Name Input */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#94a3b8',
                  marginBottom: '7px'
                }}>
                  Your Name
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute',
                    left: '13px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '10px 14px 10px 38px',
                      borderRadius: '11px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(10, 15, 26, 0.6)',
                      color: '#f8fafc',
                      fontSize: '14px',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s, box-shadow 0.15s'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(255, 255, 255, 0.05)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Avatar Style Selection */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#94a3b8',
                  marginBottom: '7px'
                }}>
                  Avatar Style
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px'
                }}>
                  {styles.map((s) => {
                    const isSelected = style === s.id;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setStyle(s.id)}
                        style={{
                          padding: '9px 8px',
                          borderRadius: '10px',
                          border: isSelected ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.07)',
                          background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 15, 26, 0.45)',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          fontSize: '12.5px',
                          fontWeight: isSelected ? 600 : 400,
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' : 'none'
                        }}
                      >
                        <span style={{ color: isSelected ? color : 'currentColor' }}>{s.icon}</span>
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hair Selector */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#94a3b8',
                  marginBottom: '7px'
                }}>
                  Hair
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '6px'
                }}>
                  {hairOptions.map((h) => {
                    const isSelected = hair === h.id;
                    return (
                      <button
                        type="button"
                        key={h.id}
                        onClick={() => setHair(h.id)}
                        style={{
                          padding: '8px 4px',
                          borderRadius: '9px',
                          border: isSelected ? '1px solid rgba(255, 255, 255, 0.25)' : '1px solid rgba(255, 255, 255, 0.07)',
                          background: isSelected ? 'rgba(255, 255, 255, 0.12)' : 'rgba(10, 15, 26, 0.45)',
                          color: isSelected ? '#ffffff' : '#94a3b8',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: isSelected ? 600 : 400,
                          textAlign: 'center',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none'
                        }}
                      >
                        {h.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Swatches */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#94a3b8',
                  marginBottom: '8px'
                }}>
                  Theme Color
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  {curatedColors.map((c) => {
                    const isSelected = color.toLowerCase() === c.hex.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={c.hex}
                        onClick={() => setColor(c.hex)}
                        title={c.label}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.15)',
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 0 10px ${c.hex}88` : 'none',
                          transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                          transition: 'all 0.15s ease'
                        }}
                      />
                    );
                  })}

                  {/* Custom Color Pip */}
                  <div style={{
                    position: 'relative',
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }} title="Custom Color">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      style={{
                        position: 'absolute',
                        opacity: 0,
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={isEntering || !name.trim()}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  marginTop: '4px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  background: !name.trim()
                    ? 'rgba(255, 255, 255, 0.05)'
                    : 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: !name.trim() ? '#64748b' : '#ffffff',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: !name.trim() || isEntering ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.18s ease',
                  boxShadow: !name.trim()
                    ? 'none'
                    : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.18)'
                }}
                onMouseEnter={(e) => {
                  if (name.trim() && !isEntering) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (name.trim() && !isEntering) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                  }
                }}
              >
                {isEntering ? (
                  <span>Entering Workspace...</span>
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
