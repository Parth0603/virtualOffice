import React from 'react';

export function WorldLighting() {
  return (
    <>
      {/* Soft, Balanced Interior Ambient Light */}
      <ambientLight intensity={0.55} color="#f8fafc" />

      {/* Modern Architectural Ceiling & Floor Bounce */}
      <hemisphereLight
        skyColor="#ffffff"
        groundColor="#94a3b8"
        intensity={0.5}
      />

      {/* Primary Architectural Key Daylight through Glass Panes */}
      <directionalLight
        position={[676, 350, 484]}
        intensity={0.95}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={10}
        shadow-camera-far={1200}
        shadow-camera-left={-650}
        shadow-camera-right={650}
        shadow-camera-top={450}
        shadow-camera-bottom={-450}
        shadow-bias={-0.0003}
      />

      {/* Secondary Soft Ambient Fill Light (Opposite Angle, No Shadows for High FPS) */}
      <directionalLight
        position={[200, 250, 100]}
        intensity={0.38}
        color="#e2e8f0"
      />

      {/* Subtle Architectural Ceiling Downlights (Warm, Focused, Zero Shadow Cost) */}
      {/* Reception Desk Canopy Light - Warm 3000K Architectural Glow */}
      <pointLight
        position={[208, 38, 675]}
        color="#fff0da"
        intensity={0.9}
        distance={180}
        decay={2}
      />

      {/* Lobby Primary Waiting Lounge Overhead Downlight (Zone 1) */}
      <pointLight
        position={[95, 42, 560]}
        color="#fff2df"
        intensity={0.75}
        distance={140}
        decay={2}
      />

      {/* Lobby Secondary Lounge Overhead Downlight (Zone 1) */}
      <pointLight
        position={[335, 42, 540]}
        color="#fff2df"
        intensity={0.7}
        distance={140}
        decay={2}
      />

      {/* Conference Boardroom Overhead Lighting */}
      <pointLight
        position={[180, 36, 180]}
        color="#f8fafc"
        intensity={0.65}
        distance={220}
        decay={2}
      />

      {/* Team Workspace Central Downlights */}
      <pointLight
        position={[470, 36, 180]}
        color="#f1f5f9"
        intensity={0.55}
        distance={180}
        decay={2}
      />
      <pointLight
        position={[710, 36, 180]}
        color="#f1f5f9"
        intensity={0.55}
        distance={180}
        decay={2}
      />

      {/* Lounge Floor Lamp Warm Glow */}
      <pointLight
        position={[576, 32, 610]}
        color="#fed7aa"
        intensity={0.65}
        distance={180}
        decay={2}
      />

      {/* Kitchen Island Warm Canopy Accent */}
      <pointLight
        position={[864, 32, 610]}
        color="#fef3c7"
        intensity={0.55}
        distance={160}
        decay={2}
      />

      {/* Private Executive Suite Focused Warm Accent */}
      <pointLight
        position={[912, 34, 180]}
        color="#fef3c7"
        intensity={0.5}
        distance={180}
        decay={2}
      />
    </>
  );
}
