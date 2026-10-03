import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';
import { getZoneMetadata } from '../../constants/zoneColors.js';

export function ZoneBanner() {
  const { myCurrentZone } = useWorkspaceStore();
  const [visible, setVisible] = useState(false);
  const [zoneInfo, setZoneInfo] = useState(null);
  const timerRef = useRef(null);
  const lastZoneRef = useRef(null);

  useEffect(() => {
    if (!myCurrentZone || myCurrentZone === 0) return;

    // Only show notification on actual zone change
    if (lastZoneRef.current !== myCurrentZone) {
      lastZoneRef.current = myCurrentZone;
      const meta = getZoneMetadata(myCurrentZone);
      setZoneInfo(meta);
      setVisible(true);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setVisible(false);
      }, 2800);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [myCurrentZone]);

  if (!zoneInfo) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '24px',
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '-80px'})`,
        opacity: visible ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
        zIndex: 25,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(12px)',
        border: `1px solid ${zoneInfo.accentColor || 'rgba(255, 255, 255, 0.15)'}`,
        borderRadius: '30px',
        padding: '8px 20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(59, 130, 246, 0.15)',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <span style={{ fontSize: '1.25rem' }}>{zoneInfo.icon}</span>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#ffffff', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.3px' }}>
            {zoneInfo.name}
          </span>
          {zoneInfo.restricted && (
            <span style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#f87171',
              fontSize: '0.68rem',
              fontWeight: '700',
              padding: '2px 7px',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.4)'
            }}>
              Restricted
            </span>
          )}
        </div>
        <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
          {zoneInfo.desc}
        </span>
      </div>
    </div>
  );
}
