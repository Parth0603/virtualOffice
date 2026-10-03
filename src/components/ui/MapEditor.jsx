import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ROWS, COLS, TILE_SIZE } from '../../constants/grid.js';
import { ZONE_COLORS, DEFAULT_OFFICE_MAP, ZONE_METADATA } from '../../constants/zoneColors.js';
import { socketClient } from '../../networking/socketClient.js';

export function MapEditor({ onMapSubmitted }) {
  const canvasRef = useRef(null);
  const [currentZone, setCurrentZone] = useState(1);
  const [mapGrid, setMapGrid] = useState(() =>
    DEFAULT_OFFICE_MAP.map(row => [...row])
  );
  const isPaintingRef = useRef(false);

  // Redraw canvas
  const drawMap = useCallback((grid) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const zoneId = grid[r][c];
        ctx.fillStyle = ZONE_COLORS[zoneId] || '#1e293b';
        ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      }
    }
  }, []);

  useEffect(() => {
    drawMap(mapGrid);
  }, [mapGrid, drawMap]);

  const paintTile = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / TILE_SIZE);
    const r = Math.floor((e.clientY - rect.top) / TILE_SIZE);

    if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
      setMapGrid(prev => {
        if (prev[r][c] === currentZone) return prev;
        const next = prev.map((row, ri) =>
          ri === r ? [...row] : row
        );
        next[r][c] = currentZone;
        return next;
      });
    }
  };

  const handleMouseDown = (e) => {
    isPaintingRef.current = true;
    paintTile(e);
  };

  const handleMouseMove = (e) => {
    if (isPaintingRef.current) {
      paintTile(e);
    }
  };

  const handleMouseUp = () => {
    isPaintingRef.current = false;
  };

  const handleStartCollaboration = () => {
    const socket = socketClient.getSocket();
    if (socket) {
      socket.emit('submitMap', {
        map: mapGrid,
        zoneColors: ZONE_COLORS
      });
    }
    if (onMapSubmitted) {
      onMapSubmitted({ map: mapGrid, zoneColors: ZONE_COLORS });
    }
  };

  const handleResetToDefault = () => {
    setMapGrid(DEFAULT_OFFICE_MAP.map(row => [...row]));
  };

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      fontFamily: "'Inter', sans-serif",
      padding: '2rem',
      boxSizing: 'border-box'
    }}>
      <h1 style={{
        fontSize: '2rem',
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: '0.4rem',
        textShadow: '0 2px 10px rgba(0,0,0,0.5)',
        textAlign: 'center'
      }}>
        Workspace Floorplan Architect
      </h1>
      <p style={{
        color: '#94a3b8',
        marginBottom: '1.25rem',
        textAlign: 'center',
        maxWidth: '520px',
        lineHeight: 1.5,
        fontSize: '0.9rem'
      }}>
        Customize rooms, team areas, and partitions, or launch with our pre-designed collaborative office layout.
      </p>

      {/* Zone Room Picker */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.6rem',
        marginBottom: '1.25rem',
        padding: '0.75rem 1.25rem',
        background: 'rgba(15, 23, 42, 0.85)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {ZONE_COLORS.map((clr, idx) => {
          const meta = ZONE_METADATA[idx] || {};
          const isSelected = currentZone === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentZone(idx)}
              title={meta.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                background: isSelected ? 'rgba(56, 189, 248, 0.2)' : 'rgba(30, 41, 59, 0.6)',
                cursor: 'pointer',
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.2s ease',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: isSelected ? '700' : '500'
              }}
            >
              <span>{meta.icon}</span>
              <span>{meta.label}</span>
            </button>
          );
        })}
      </div>

      {/* Grid Canvas */}
      <div style={{
        boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid rgba(255, 255, 255, 0.15)'
      }}>
        <canvas
          ref={canvasRef}
          width={COLS * TILE_SIZE}
          height={ROWS * TILE_SIZE}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            display: 'block',
            cursor: 'crosshair',
            backgroundColor: '#0f172a'
          }}
        />
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={handleResetToDefault}
          style={{
            padding: '0.85rem 1.75rem',
            fontWeight: '600',
            fontSize: '0.9rem',
            background: 'rgba(30, 41, 59, 0.8)',
            color: '#cbd5e1',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Reset to Default Office
        </button>

        <button
          onClick={handleStartCollaboration}
          style={{
            padding: '0.85rem 2.25rem',
            fontWeight: '700',
            fontSize: '0.95rem',
            background: 'linear-gradient(45deg, #2563eb, #3b82f6)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(37, 99, 235, 0.4)',
            transition: 'all 0.3s ease'
          }}
        >
          Enter Workspace 🏢
        </button>
      </div>
    </div>
  );
}
