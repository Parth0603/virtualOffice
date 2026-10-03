import React from 'react';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';
import { socketClient } from '../../networking/socketClient.js';
import { cameraControls } from '../../systems/cameraControls.js';
import { CameraManager, useCameraMode } from '../../systems/cameraManager.js';
import { getZoneMetadata } from '../../constants/zoneColors.js';

export function PermissionOverlays() {
  const { myRole, myId, zoneRequests } = useWorkspaceStore();
  const cameraMode = useCameraMode();

  const handleApprove = (userId, zoneId) => {
    const socket = socketClient.getSocket();
    if (socket) {
      socket.emit('zonePermissionResponse', { userId, zoneId, approved: true });
    }
  };

  const handleDeny = (userId, zoneId) => {
    const socket = socketClient.getSocket();
    if (socket) {
      socket.emit('zonePermissionResponse', { userId, zoneId, approved: false });
    }
  };

  const handleRequestPrivateAccess = () => {
    const socket = socketClient.getSocket();
    if (socket) {
      // Trigger move attempt to restricted zone to initiate permission request
      socket.emit('playerMove', { x: 352, y: 384 });
    }
  };

  const myRequest = zoneRequests[myId];

  return (
    <>
      {/* Host Permission Request Modals/Popups */}
      {myRole === 'host' && (
        <div style={{
          position: 'absolute',
          top: '75px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 30
        }}>
          {Object.entries(zoneRequests).map(([userId, req]) => {
            if (req.status !== 'pending') return null;
            const meta = getZoneMetadata(req.zoneId);
            return (
              <div
                key={userId}
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid #3b82f6',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(12px)',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>🔒</span>
                <span style={{ fontSize: '0.85rem' }}>
                  Member requested entry to <strong>{meta.name}</strong>
                </span>
                <button
                  onClick={() => handleApprove(userId, req.zoneId)}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16,185,129,0.3)'
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDeny(userId, req.zoneId)}
                  style={{
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontWeight: '700',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(239,68,68,0.3)'
                  }}
                >
                  Deny
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* User Permission Status Badge */}
      {myRequest && (
        <div style={{
          position: 'absolute',
          top: '75px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '10px 20px',
          borderRadius: '25px',
          backgroundColor: myRequest.status === 'denied' ? 'rgba(239, 68, 68, 0.95)' : 'rgba(245, 158, 11, 0.95)',
          color: 'white',
          fontWeight: '700',
          fontSize: '0.85rem',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          zIndex: 30,
          backdropFilter: 'blur(10px)',
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {myRequest.status === 'denied' ? (
            <>
              <span>⛔</span>
              <span>Access Denied by Host</span>
              <button
                onClick={handleRequestPrivateAccess}
                style={{
                  marginLeft: '8px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  color: 'white',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Request Again
              </button>
            </>
          ) : (
            <>
              <span>⏳</span>
              <span>Waiting for Host Approval for Private Room...</span>
            </>
          )}
        </div>
      )}

      {/* Controls HUD & Reset Camera Button */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '20px',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '8px'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '8px 14px',
          color: '#cbd5e1',
          fontSize: '0.78rem',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          userSelect: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
        }}>
          <span>🖱️ <strong>Drag / Click</strong> to look</span>
          <span>🔄 <strong>Scroll</strong> to zoom</span>
          <span>⌨️ <strong>WASD</strong> to move</span>
          <span>📷 <strong>[C]</strong> {cameraMode === 'FIRST_PERSON' ? '1st Person' : '3rd Person'}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            id="camera-mode-toggle-btn"
            onClick={(e) => {
              e.stopPropagation();
              CameraManager.toggleMode();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              padding: '7px 14px',
              fontWeight: '600',
              fontSize: '0.8rem',
              color: '#ffffff',
              borderRadius: '6px',
              cursor: 'pointer',
              border: cameraMode === 'FIRST_PERSON' ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.2)',
              backgroundColor: cameraMode === 'FIRST_PERSON' ? '#2563eb' : '#1e293b',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'all 0.2s ease',
              fontFamily: "'Inter', sans-serif",
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              position: 'relative',
              zIndex: 100
            }}
            title="Toggle between First Person and Third Person camera (Hotkey: C)"
          >
            {cameraMode === 'FIRST_PERSON' ? '👁️ First Person' : '🎥 Third Person'}
          </button>

          <button
            id="camera-reset-perspective-btn"
            onClick={(e) => {
              e.stopPropagation();
              cameraControls.reset(0, 0.38, 95);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              padding: '7px 14px',
              fontWeight: '600',
              fontSize: '0.8rem',
              color: '#e2e8f0',
              borderRadius: '6px',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backgroundColor: '#1e293b',
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              transition: 'all 0.2s ease',
              fontFamily: "'Inter', sans-serif",
              position: 'relative',
              zIndex: 100
            }}
            title="Reset perspective to default angle and zoom"
          >
            🔄 Reset Perspective
          </button>
        </div>
      </div>
    </>
  );
}
