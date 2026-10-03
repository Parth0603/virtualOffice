import React from 'react';
import { useWorkspaceStore, workspaceStore } from '../../state/useWorkspaceStore.js';

export function MeetingEndedModal() {
  const { meetingEnded } = useWorkspaceStore();
  if (!meetingEnded) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(5px)'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        textAlign: 'center',
        maxWidth: '360px',
        width: '90%',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1e293b', marginBottom: '0.5rem' }}>
          Meeting Ended
        </div>
        <div style={{ fontSize: '0.95rem', color: '#64748b', marginBottom: '1.5rem' }}>
          The host has ended or disconnected from this workspace.
        </div>
        <button
          onClick={() => workspaceStore.reset()}
          style={{
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
