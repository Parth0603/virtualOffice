import React, { useState, useEffect } from 'react';
import { workspaceStore } from '../../state/useWorkspaceStore.js';
import { getBackendUrl } from '../../networking/socketClient.js';

export function WorkspaceLanding() {
  const { profile } = workspaceStore.getState();
  const [name, setName] = useState(profile.name || '');
  const [mode, setMode] = useState('create'); // 'create' | 'join'
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  // Auto-detect workspace ID from URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/workspace/')) {
      const id = path.split('/')[2];
      if (id) {
        setJoinId(id);
        setMode('join');
      }
    }
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    setError('');
    const newId = Math.random().toString(36).substring(2, 10);
    const backendUrl = getBackendUrl();
    try {
      await fetch(`${backendUrl}/api/workspace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newId })
      });
    } catch (err) {
      console.warn('Backend pre-registration note:', err);
    }
    workspaceStore.setProfile({ ...profile, name: name.trim() });
    workspaceStore.setWorkspaceId(newId);
    workspaceStore.setIsCreator(true);
    window.history.pushState({}, '', `/workspace/${newId}`);
    workspaceStore.setStage('avatar');
  };

  const handleJoin = async () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!joinId.trim() || checking) {
      setError('Please enter a workspace code or link.');
      return;
    }
    setError('');
    const id = joinId
      .replace(window.location.origin, '')
      .replace('/workspace/', '')
      .replace(/https?:\/\/[^/]+\/workspace\//i, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .trim();

    if (!id) {
      setError('Please enter a valid Workspace ID');
      return;
    }

    setChecking(true);
    const backendUrl = getBackendUrl();
    try {
      const res = await fetch(`${backendUrl}/api/workspace/${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.exists) {
        setError(`Workspace "${id}" not found. Please verify the code.`);
        setChecking(false);
        return;
      }
      workspaceStore.setProfile({ ...profile, name: name.trim() });
      workspaceStore.setWorkspaceId(id);
      workspaceStore.setIsCreator(false);
      window.history.pushState({}, '', `/workspace/${id}`);
      workspaceStore.setStage('avatar');
    } catch (err) {
      setError('Could not reach the workspace server. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setJoinId(text);
        setError('');
        setCopiedSuccess(true);
        setTimeout(() => setCopiedSuccess(false), 1800);
      }
    } catch {
      // Clipboard access not available
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      backgroundColor: '#0c101a',
      backgroundImage: 'radial-gradient(circle at 50% 20%, #151c2e 0%, #0c101a 75%)',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      color: '#f8fafc',
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

      {/* Soft ambient back light */}
      <div style={{
        position: 'absolute',
        top: '25%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '540px',
        height: '320px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56, 114, 224, 0.12) 0%, transparent 70%)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }} />

      {/* Main Container */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        maxWidth: '420px',
        padding: '0 20px',
        boxSizing: 'border-box'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{
            margin: 0,
            fontSize: '28px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: '#f8fafc'
          }}>
            SYNTRA
          </h1>
        </div>

        {/* Translucent iPhone Glass Card */}
        <div style={{
          background: 'rgba(21, 28, 44, 0.62)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          borderRadius: '22px',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          padding: '28px',
          position: 'relative'
        }}>
          {/* Segmented Mode Switcher (iOS-inspired pill) */}
          <div style={{
            display: 'flex',
            background: 'rgba(10, 14, 24, 0.65)',
            padding: '3px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '22px'
          }}>
            <button
              type="button"
              onClick={() => { setMode('create'); setError(''); }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '9px',
                border: 'none',
                background: mode === 'create' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: mode === 'create' ? '#ffffff' : '#94a3b8',
                fontWeight: mode === 'create' ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.18s ease',
                boxShadow: mode === 'create' ? '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)' : 'none'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Create Space</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode('join'); setError(''); }}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '9px',
                border: 'none',
                background: mode === 'join' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: mode === 'join' ? '#ffffff' : '#94a3b8',
                fontWeight: mode === 'join' ? 600 : 400,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.18s ease',
                boxShadow: mode === 'join' ? '0 2px 8px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)' : 'none'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Join Space</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              color: '#f87171',
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '12px',
              lineHeight: 1.4,
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === 'create') handleCreate();
              else handleJoin();
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
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
                  onChange={(e) => { setName(e.target.value); setError(''); }}
                  placeholder="e.g. Parth"
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
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

            {/* Join Mode: Workspace ID Input */}
            {mode === 'join' && (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '7px'
                }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>
                    Workspace ID or Link
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteClipboard}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: copiedSuccess ? '#34d399' : '#94a3b8',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>{copiedSuccess ? 'Pasted' : 'Paste'}</span>
                  </button>
                </div>
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
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={joinId}
                    onChange={(e) => { setJoinId(e.target.value); setError(''); }}
                    placeholder="e.g. 7xK92LmQ"
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 40px',
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
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={checking || !name.trim() || (mode === 'join' && !joinId.trim())}
              style={{
                width: '100%',
                padding: '12px 18px',
                marginTop: '6px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                background: (!name.trim() || (mode === 'join' && !joinId.trim()))
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                color: (!name.trim() || (mode === 'join' && !joinId.trim())) ? '#64748b' : '#ffffff',
                fontSize: '14px',
                fontWeight: 600,
                cursor: (!name.trim() || (mode === 'join' && !joinId.trim()) || checking) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.18s ease',
                boxShadow: (!name.trim() || (mode === 'join' && !joinId.trim()))
                  ? 'none'
                  : '0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.18)'
              }}
              onMouseEnter={(e) => {
                if (name.trim() && (mode !== 'join' || joinId.trim()) && !checking) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.28)';
                }
              }}
              onMouseLeave={(e) => {
                if (name.trim() && (mode !== 'join' || joinId.trim()) && !checking) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                }
              }}
            >
              {checking ? (
                <span>Checking...</span>
              ) : (
                <>
                  <span>Continue</span>
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
  );
}
