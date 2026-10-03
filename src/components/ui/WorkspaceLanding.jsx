import React, { useState, useEffect } from 'react';
import { workspaceStore } from '../../state/useWorkspaceStore.js';

export function WorkspaceLanding() {
  const { profile } = workspaceStore.getState();
  const [name, setName] = useState(profile.name || '');
  const [mode, setMode] = useState('select'); // 'select' | 'create' | 'join'
  const [joinId, setJoinId] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

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

  const handleCreate = () => {
    if (!name.trim()) return;
    const newId = Math.random().toString(36).substring(2, 10);
    workspaceStore.setProfile({ ...profile, name });
    workspaceStore.setWorkspaceId(newId);
    workspaceStore.setIsCreator(true);
    window.history.pushState({}, '', `/workspace/${newId}`);
    workspaceStore.setStage('avatar');
  };

  const handleJoin = async () => {
    if (!name.trim() || !joinId.trim() || checking) return;
    setError('');
    const id = joinId.replace(window.location.origin, '').replace('/workspace/', '').replace(/\//g, '').trim();
    if (!id) {
      setError('Please enter a valid Workspace ID');
      return;
    }

    setChecking(true);
    try {
      const res = await fetch(`/api/workspace/${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.exists) {
        setError(`Workspace "${id}" does not exist. Please check the code.`);
        setChecking(false);
        return;
      }
      workspaceStore.setProfile({ ...profile, name });
      workspaceStore.setWorkspaceId(id);
      workspaceStore.setIsCreator(false);
      window.history.pushState({}, '', `/workspace/${id}`);
      workspaceStore.setStage('avatar');
    } catch (err) {
      setError('Could not verify workspace. Please make sure the server is reachable.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'linear-gradient(135deg, #1e293b, #0f172a)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)', padding: '40px', borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)', width: '400px', textAlign: 'center',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
      }}>
        <h1 style={{ margin: '0 0 30px 0', fontSize: '24px', fontWeight: 600 }}>Virtual Workspace</h1>

        {mode === 'select' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={() => setMode('create')}
              style={{
                padding: '12px', background: '#3b82f6', color: 'white', border: 'none',
                borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 500
              }}
            >Create Workspace</button>
            <button
              onClick={() => setMode('join')}
              style={{
                padding: '12px', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 500
              }}
            >Join Workspace</button>
          </div>
        )}

        {mode === 'create' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 10px 0', textAlign: 'center' }}>Create New Workspace</h2>
            <label style={{ fontSize: '14px', color: '#94a3b8' }}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => setMode('select')}
                style={{ flex: 1, padding: '10px', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}
              >Back</button>
              <button
                onClick={handleCreate}
                disabled={!name.trim()}
                style={{ flex: 2, padding: '10px', background: name.trim() ? '#3b82f6' : '#1e3a8a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
              >Create & Enter</button>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left' }}>
            <h2 style={{ fontSize: '18px', margin: '0 0 10px 0', textAlign: 'center' }}>Join Workspace</h2>
            
            {error && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid #ef4444',
                color: '#fca5a5',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                lineHeight: '1.4'
              }}>
                {error}
              </div>
            )}

            <label style={{ fontSize: '14px', color: '#94a3b8' }}>Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              placeholder="Enter your name"
              style={{
                padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
              }}
            />
            <label style={{ fontSize: '14px', color: '#94a3b8', marginTop: '10px' }}>Workspace ID or Link</label>
            <input
              type="text"
              value={joinId}
              onChange={(e) => { setJoinId(e.target.value); setError(''); }}
              placeholder="e.g. 7xK92LmQ"
              style={{
                padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(0,0,0,0.2)', color: 'white', outline: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                onClick={() => { setMode('select'); setError(''); }}
                style={{ flex: 1, padding: '10px', background: 'transparent', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', cursor: 'pointer' }}
              >Back</button>
              <button
                onClick={handleJoin}
                disabled={!name.trim() || !joinId.trim() || checking}
                style={{
                  flex: 2,
                  padding: '10px',
                  background: (name.trim() && joinId.trim() && !checking) ? '#3b82f6' : '#1e3a8a',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: checking ? 'wait' : 'pointer'
                }}
              >
                {checking ? 'Checking...' : 'Join Workspace'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
