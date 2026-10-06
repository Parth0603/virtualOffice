/**
 * EnvironmentDebugPanel
 * Developer testing toolbar for simulating time of day (DAY, SUNSET, NIGHT, DAWN, DUSK)
 * and weather states (CLEAR, CLOUDY, RAIN, STORM) locally without affecting normal users.
 */

import React, { useState, useEffect } from 'react';
import { timeSystem } from './TimeSystem.js';
import { weatherSystem } from './WeatherSystem.js';
import { socketClient } from '../networking/socketClient.js';
import { useWorkspaceStore } from '../state/useWorkspaceStore.js';

export function EnvironmentDebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeMode, setTimeMode] = useState('real'); // 'real' | 'custom'
  const [customHour, setCustomHour] = useState(12);
  const [weatherMode, setWeatherMode] = useState('server'); // 'server' | 'custom'
  const [customWeather, setCustomWeather] = useState('CLEAR');
  const [statusText, setStatusText] = useState('');
  const { environment, myRole } = useWorkspaceStore();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle debug panel with F8 or Ctrl+Shift+E
      if (e.key === 'F8' || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e')) {
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update status ticker every second
  useEffect(() => {
    const interval = setInterval(() => {
      const ts = timeSystem.getTimeState();
      const ws = weatherSystem.getWeatherState();
      setStatusText(`${ts.formattedTime} [${ts.phase}] | Weather: ${ws.weather} (Rain: ${(ws.rainIntensity * 100).toFixed(0)}%)`);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleTimeChange = (hour) => {
    setTimeMode('custom');
    setCustomHour(hour);
    timeSystem.setDebugHour(hour);
  };

  const handleTimeReal = () => {
    setTimeMode('real');
    timeSystem.setDebugHour(null);
  };

  const handleWeatherChange = (weatherType) => {
    setWeatherMode('custom');
    setCustomWeather(weatherType);
    let intensity = 0.0;
    if (weatherType === 'RAIN') intensity = 0.65;
    if (weatherType === 'STORM') intensity = 1.0;
    if (weatherType === 'CLOUDY') intensity = 0.5;

    weatherSystem.setDebugWeather({
      weather: weatherType,
      weatherIntensity: intensity,
      cloudCover: weatherType === 'CLEAR' ? 0.1 : (weatherType === 'CLOUDY' ? 0.6 : 0.95),
      windSpeed: weatherType === 'STORM' ? 28 : 10,
      windDirection: 210
    });
  };

  const handleWeatherServer = () => {
    setWeatherMode('server');
    weatherSystem.setDebugWeather(null);
  };

  // Broadcast environment change to workspace if host
  const handleBroadcastServerWeather = (weatherType) => {
    const socket = socketClient.getSocket();
    if (socket) {
      let intensity = 0.0;
      if (weatherType === 'RAIN') intensity = 0.65;
      if (weatherType === 'STORM') intensity = 1.0;
      if (weatherType === 'CLOUDY') intensity = 0.5;

      socket.emit('setEnvironmentOverride', {
        weather: weatherType,
        weatherIntensity: intensity,
        cloudCover: weatherType === 'CLEAR' ? 0.1 : 0.8,
        windSpeed: weatherType === 'STORM' ? 28 : 10,
        windDirection: 210
      });
    }
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      left: '16px',
      zIndex: 9999,
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Discreet Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Environment Dev Toolbar (F8)"
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          color: '#38bdf8',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '6px',
          padding: '6px 10px',
          fontSize: '11px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span>🌐 Env Tester</span>
        <span style={{ fontSize: '9px', opacity: 0.6, background: 'rgba(255,255,255,0.1)', padding: '1px 4px', borderRadius: '3px' }}>F8</span>
      </button>

      {/* Expanded Control Modal */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          bottom: '36px',
          left: '0',
          width: '320px',
          background: 'rgba(15, 23, 42, 0.95)',
          color: '#f8fafc',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          padding: '14px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
          backdropFilter: 'blur(10px)',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>Environment Diagnostics</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px' }}
            >×</button>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '6px 8px', borderRadius: '6px', marginBottom: '12px', fontSize: '11px', color: '#cbd5e1' }}>
            {statusText}
          </div>

          {/* Time Controls */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Time of Day</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{timeMode === 'real' ? 'Asia/Kolkata (Live)' : `${customHour}:00`}</span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '6px' }}>
              <button
                onClick={() => handleTimeChange(6.0)}
                style={{
                  background: customHour === 6.0 && timeMode === 'custom' ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                  color: 'white', border: 'none', borderRadius: '4px', padding: '4px', fontSize: '10px', cursor: 'pointer'
                }}
              >DAWN</button>
              <button
                onClick={() => handleTimeChange(12.0)}
                style={{
                  background: customHour === 12.0 && timeMode === 'custom' ? '#3b82f6' : 'rgba(255,255,255,0.08)',
                  color: 'white', border: 'none', borderRadius: '4px', padding: '4px', fontSize: '10px', cursor: 'pointer'
                }}
              >DAY</button>
              <button
                onClick={() => handleTimeChange(18.2)}
                style={{
                  background: customHour === 18.2 && timeMode === 'custom' ? '#ea580c' : 'rgba(255,255,255,0.08)',
                  color: 'white', border: 'none', borderRadius: '4px', padding: '4px', fontSize: '10px', cursor: 'pointer'
                }}
              >SUNSET</button>
              <button
                onClick={() => handleTimeChange(19.8)}
                style={{
                  background: customHour === 19.8 && timeMode === 'custom' ? '#6366f1' : 'rgba(255,255,255,0.08)',
                  color: 'white', border: 'none', borderRadius: '4px', padding: '4px', fontSize: '10px', cursor: 'pointer'
                }}
              >DUSK</button>
              <button
                onClick={() => handleTimeChange(23.0)}
                style={{
                  background: customHour === 23.0 && timeMode === 'custom' ? '#1e293b' : 'rgba(255,255,255,0.08)',
                  color: 'white', border: 'none', borderRadius: '4px', padding: '4px', fontSize: '10px', cursor: 'pointer'
                }}
              >NIGHT</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="range"
                min="0"
                max="24"
                step="0.5"
                value={customHour}
                onChange={(e) => handleTimeChange(parseFloat(e.target.value))}
                style={{ flex: 1, cursor: 'pointer' }}
              />
              <button
                onClick={handleTimeReal}
                style={{
                  background: timeMode === 'real' ? '#22c55e' : 'rgba(255,255,255,0.1)',
                  color: 'white', border: 'none', borderRadius: '4px', padding: '3px 8px', fontSize: '10px', cursor: 'pointer'
                }}
              >Live</button>
            </div>
          </div>

          {/* Weather Controls */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 600, color: '#e2e8f0' }}>Weather State</span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>{weatherMode === 'server' ? 'Server Synced' : customWeather}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '6px' }}>
              {['CLEAR', 'CLOUDY', 'RAIN', 'STORM'].map((w) => (
                <button
                  key={w}
                  onClick={() => handleWeatherChange(w)}
                  style={{
                    background: customWeather === w && weatherMode === 'custom' ? '#0284c7' : 'rgba(255,255,255,0.08)',
                    color: 'white', border: 'none', borderRadius: '4px', padding: '5px', fontSize: '10px', cursor: 'pointer', fontWeight: 600
                  }}
                >{w}</button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '6px' }}>
              <button
                onClick={handleWeatherServer}
                style={{
                  flex: 1,
                  background: weatherMode === 'server' ? '#22c55e' : 'rgba(255,255,255,0.1)',
                  color: 'white', border: 'none', borderRadius: '4px', padding: '4px', fontSize: '11px', cursor: 'pointer'
                }}
              >Restore Server Weather</button>

              {myRole === 'host' && (
                <button
                  onClick={() => handleBroadcastServerWeather(customWeather)}
                  title="Broadcast this weather state to all players in the workspace"
                  style={{
                    background: '#f59e0b', color: 'black', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: 600, cursor: 'pointer'
                  }}
                >Sync Room</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
