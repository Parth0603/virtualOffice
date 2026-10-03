import React, { useState } from 'react';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';
import { getZoneMetadata } from '../../constants/zoneColors.js';

export function PresenceList() {
  const { zoneRoster, myId, myCurrentZone } = useWorkspaceStore();
  const [collapsed, setCollapsed] = useState(false);

  // Calculate total player count across all zones
  const totalPlayers = Object.values(zoneRoster).reduce(
    (acc, list) => acc + (Array.isArray(list) ? list.length : 0),
    0
  );

  return (
    <div
      style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 20,
        width: collapsed ? 'auto' : '260px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '12px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
        fontFamily: "'Inter', sans-serif",
        color: '#f8fafc',
        overflow: 'hidden',
        transition: 'all 0.25s ease'
      }}
    >
      {/* Header bar */}
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          background: 'rgba(30, 41, 59, 0.7)',
          borderBottom: collapsed ? 'none' : '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.9rem' }}>👥</span>
          <span style={{ fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.3px' }}>
            Workspace Presence
          </span>
          <span
            style={{
              background: '#3b82f6',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: '700',
              padding: '1px 6px',
              borderRadius: '10px'
            }}
          >
            {totalPlayers}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
          {collapsed ? '▼' : '▲'}
        </span>
      </div>

      {/* Roster grouped by room */}
      {!collapsed && (
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '70vh', overflowY: 'auto' }}>
          {Object.entries(zoneRoster).map(([zoneIdStr, players]) => {
            const zId = parseInt(zoneIdStr, 10);
            if (!Array.isArray(players) || players.length === 0) return null;
            const meta = getZoneMetadata(zId);
            const isMyZone = myCurrentZone === zId;

            return (
              <div
                key={zId}
                style={{
                  background: isMyZone ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: isMyZone ? '1px solid rgba(59, 130, 246, 0.35)' : '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '8px 10px'
                }}
              >
                {/* Zone title */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: '700', color: isMyZone ? '#60a5fa' : '#cbd5e1' }}>
                    <span>{meta.icon}</span>
                    <span>{meta.label}</span>
                    {isMyZone && (
                      <span style={{ fontSize: '0.65rem', color: '#93c5fd', fontWeight: '500' }}>
                        (Here)
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {players.length}
                  </span>
                </div>

                {/* Player list in zone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingLeft: '4px' }}>
                  {players.map((p) => {
                    const isMe = p.id === myId;
                    return (
                      <div
                        key={p.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          fontSize: '0.78rem'
                        }}
                      >
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: p.color || '#3b82f6',
                            flexShrink: 0
                          }}
                        />
                        <span
                          style={{
                            fontWeight: isMe ? '700' : '400',
                            color: isMe ? '#ffffff' : '#e2e8f0',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {p.name || 'Member'} {isMe && '(You)'} {p.role === 'host' && '👑'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
