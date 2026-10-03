import React, { useState } from 'react';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';

export function WorkspaceHeader() {
  const { workspaceId, hostId, myId } = useWorkspaceStore();
  const [copied, setCopied] = useState(false);

  if (!workspaceId) return null;

  const isHost = hostId === myId;
  const workspaceUrl = `${window.location.origin}/workspace/${workspaceId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(workspaceUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.6)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      backdropFilter: 'blur(4px)',
      fontFamily: 'Inter, sans-serif',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      zIndex: 100,
      border: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Workspace</span>
        <span style={{ color: '#94a3b8', fontSize: '11px' }}>ID: {workspaceId}</span>
      </div>
      
      {isHost && (
        <span style={{
          background: '#eab308', color: 'black', padding: '2px 6px',
          borderRadius: '4px', fontSize: '10px', fontWeight: 600
        }}>HOST</span>
      )}

      <button
        onClick={copyLink}
        style={{
          background: copied ? '#22c55e' : '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 500,
          transition: 'background 0.2s'
        }}
      >
        {copied ? 'Link Copied!' : 'Invite / Share'}
      </button>
    </div>
  );
}
