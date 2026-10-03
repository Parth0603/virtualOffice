import React, { useState, useEffect, useRef } from 'react';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';

export function PerformanceStats() {
  const [show, setShow] = useState(false);
  const [fps, setFps] = useState(60);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const { remotePlayersVersion } = useWorkspaceStore();

  useEffect(() => {
    let animId;
    const calculateFps = () => {
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      animId = requestAnimationFrame(calculateFps);
    };
    animId = requestAnimationFrame(calculateFps);

    const handleKey = (e) => {
      if (e.key.toLowerCase() === 'p' && !['input', 'textarea'].includes(e.target.tagName.toLowerCase())) {
        setShow(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('keydown', handleKey);
    };
  }, []);

  if (!show) {
    return (
      <div
        onClick={() => setShow(true)}
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          color: '#94a3b8',
          fontSize: '11px',
          padding: '4px 8px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontFamily: 'monospace'
        }}
      >
        [P] Stats
      </div>
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: '16px',
      left: '16px',
      zIndex: 20,
      background: 'rgba(15, 23, 42, 0.9)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '8px',
      padding: '10px 14px',
      color: '#38bdf8',
      fontSize: '12px',
      fontFamily: 'monospace',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      pointerEvents: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', borderBottom: '1px solid #334155', paddingBottom: '4px', marginBottom: '6px' }}>
        <strong>Performance Metrics</strong>
        <span onClick={() => setShow(false)} style={{ cursor: 'pointer', color: '#94a3b8' }}>✕</span>
      </div>
      <div>FPS: <span style={{ color: fps >= 50 ? '#4ade80' : '#f87171' }}>{fps}</span></div>
      <div>World Tiles: 300 (Instanced)</div>
      <div>Tile Draw Calls: 2</div>
      <div>Net Rate: 20 Hz</div>
      <div style={{ marginTop: '4px', color: '#94a3b8', fontSize: '10px' }}>Press 'P' to toggle</div>
    </div>
  );
}
