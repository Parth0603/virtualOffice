/**
 * EnvironmentManager
 * Central coordinator for real-world Asia/Kolkata time, server weather synchronization,
 * dynamic architectural lighting, emissive materials, and lightweight particle effects.
 */

import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { timeSystem } from './TimeSystem.js';
import { weatherSystem } from './WeatherSystem.js';
import { lightingSystem } from './LightingSystem.js';
import { WeatherEffects } from './WeatherEffects.jsx';
import { useWorkspaceStore } from '../state/useWorkspaceStore.js';

export function EnvironmentManager({ playerRef }) {
  const { scene } = useThree();
  const { environment: serverEnv } = useWorkspaceStore();

  // Three.js Light References
  const ambientLightRef = useRef();
  const hemiLightRef = useRef();
  const dirLightRef = useRef();
  const fillLightRef = useRef();

  // Office Accent Point Lights
  const receptionLightRef = useRef();
  const boardroomLightRef = useRef();
  const loungeLightRef = useRef();
  const execLightRef = useRef();

  // Local state for UI / WeatherEffects rendering
  const [currentWeatherState, setCurrentWeatherState] = useState(() => weatherSystem.getWeatherState());
  const [playerTargetPos, setPlayerTargetPos] = useState([160, 0, 200]);

  // Sync server environment changes to WeatherSystem
  useEffect(() => {
    if (serverEnv) {
      weatherSystem.setServerWeather(serverEnv);
    }
  }, [serverEnv]);

  // Initialize scene fog
  useEffect(() => {
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2(0xf1f5f9, 0.00075);
    }
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  useFrame((state, delta) => {
    // 1. Compute Time, Weather, and Lighting States
    const timeState = timeSystem.getTimeState();
    const weatherState = weatherSystem.getWeatherState();
    const lighting = lightingSystem.evaluate(timeState, weatherState, delta);

    // 2. Update Scene Sky / Background & Fog
    if (scene.background) {
      scene.background.copy(lighting.skyColor);
    } else {
      scene.background = lighting.skyColor.clone();
    }

    if (scene.fog) {
      scene.fog.color.copy(lighting.fogColor);
      // Slightly denser fog in rain / storm / night
      const targetDensity = weatherState.isStorm
        ? 0.0016
        : (weatherState.rainIntensity > 0 ? 0.0012 : (timeState.daylightFactor < 0.2 ? 0.0009 : 0.0006));
      scene.fog.density += (targetDensity - scene.fog.density) * Math.min(1, delta * 2.0);
    }

    // 3. Update Ambient Light
    if (ambientLightRef.current) {
      ambientLightRef.current.color.copy(lighting.ambientColor);
      ambientLightRef.current.intensity = lighting.ambientIntensity;
    }

    // 4. Update Hemisphere Light
    if (hemiLightRef.current) {
      hemiLightRef.current.color.copy(lighting.hemiSkyColor);
      hemiLightRef.current.groundColor.copy(lighting.hemiGroundColor);
      hemiLightRef.current.intensity = lighting.hemiIntensity;
    }

    // 5. Update Main Directional Daylight / Key Light
    if (dirLightRef.current) {
      dirLightRef.current.color.copy(lighting.dirColor);
      dirLightRef.current.intensity = lighting.dirIntensity;
    }

    // 6. Update Fill Light
    if (fillLightRef.current) {
      fillLightRef.current.intensity = lighting.fillIntensity;
    }

    // 7. Update Office Downlights (Point Lights)
    const officeMultiplier = lighting.officeLightIntensity;
    if (receptionLightRef.current) {
      receptionLightRef.current.intensity = 0.45 * officeMultiplier;
    }
    if (boardroomLightRef.current) {
      boardroomLightRef.current.intensity = 0.55 * officeMultiplier;
    }
    if (loungeLightRef.current) {
      loungeLightRef.current.intensity = 0.65 * officeMultiplier;
    }
    if (execLightRef.current) {
      execLightRef.current.intensity = 0.45 * officeMultiplier;
    }

    // 8. Track Player Position for Local Weather Particles
    if (playerRef?.current) {
      const pos = playerRef.current.position;
      setPlayerTargetPos([pos.x, pos.y, pos.z]);
    }

    setCurrentWeatherState(weatherState);
  });

  return (
    <>
      {/* Soft, Balanced Interior Ambient Light */}
      <ambientLight ref={ambientLightRef} intensity={0.48} color="#f8fafc" />

      {/* Modern Architectural Ceiling & Floor Bounce */}
      <hemisphereLight
        ref={hemiLightRef}
        skyColor="#ffffff"
        groundColor="#94a3b8"
        intensity={0.52}
      />

      {/* Primary Architectural Key Daylight through Glass Panes (Single Shadow Caster) */}
      <directionalLight
        ref={dirLightRef}
        position={[180, 280, 140]}
        intensity={0.92}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={10}
        shadow-camera-far={800}
        shadow-camera-left={-380}
        shadow-camera-right={380}
        shadow-camera-top={380}
        shadow-camera-bottom={-380}
        shadow-bias={-0.0003}
      />

      {/* Secondary Soft Ambient Fill Light (Opposite Angle, No Shadows for High FPS) */}
      <directionalLight
        ref={fillLightRef}
        position={[-180, 200, -140]}
        intensity={0.36}
        color="#e2e8f0"
      />

      {/* Reception Desk Canopy Downlight */}
      <pointLight
        ref={receptionLightRef}
        position={[160, 32, 64]}
        color="#bae6fd"
        intensity={0.45}
        distance={120}
        decay={2}
      />

      {/* Meeting Room Overhead Boardroom Lighting */}
      <pointLight
        ref={boardroomLightRef}
        position={[464, 36, 256]}
        color="#f8fafc"
        intensity={0.55}
        distance={160}
        decay={2}
      />

      {/* Lounge Floor Lamp Warm Glow */}
      <pointLight
        ref={loungeLightRef}
        position={[530, 25, 65]}
        color="#fed7aa"
        intensity={0.65}
        distance={110}
        decay={2}
      />

      {/* Private Executive Suite Focused Warm Accent */}
      <pointLight
        ref={execLightRef}
        position={[470, 34, 400]}
        color="#fef3c7"
        intensity={0.45}
        distance={120}
        decay={2}
      />

      {/* Weather Particle System (Rain / Storm) */}
      <WeatherEffects
        weatherState={currentWeatherState}
        targetPosition={playerTargetPos}
      />
    </>
  );
}

// Global programmatic helper for debugging and query
export const environmentManager = {
  getTimeState: () => timeSystem.getTimeState(),
  getWeatherState: () => weatherSystem.getWeatherState(),
  setDebugHour: (h) => timeSystem.setDebugHour(h),
  setDebugWeather: (w) => weatherSystem.setDebugWeather(w)
};

if (typeof window !== 'undefined') {
  window.environmentManager = environmentManager;
}
