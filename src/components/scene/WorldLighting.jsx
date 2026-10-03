import React from 'react';

export function WorldLighting() {
  return (
    <>
      {/* Soft, Balanced Interior Ambient Light (Not flat or over-exposed) */}
      <ambientLight intensity={0.48} color="#f8fafc" />

      {/* Modern Architectural Ceiling & Floor Bounce */}
      <hemisphereLight
        skyColor="#ffffff"
        groundColor="#94a3b8"
        intensity={0.52}
      />

      {/* Primary Architectural Key Daylight through Glass Panes */}
      <directionalLight
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
        position={[-180, 200, -140]}
        intensity={0.36}
        color="#e2e8f0"
      />

      {/* Subtle Architectural Ceiling Downlights (Warm, Focused, Zero Shadow Cost) */}
      {/* Reception Desk Canopy Light */}
      <pointLight
        position={[160, 32, 64]}
        color="#bae6fd"
        intensity={0.45}
        distance={120}
        decay={2}
      />

      {/* Meeting Room Overhead Boardroom Lighting */}
      <pointLight
        position={[464, 36, 256]}
        color="#f8fafc"
        intensity={0.55}
        distance={160}
        decay={2}
      />

      {/* Lounge Floor Lamp Warm Glow */}
      <pointLight
        position={[530, 25, 65]}
        color="#fed7aa"
        intensity={0.65}
        distance={110}
        decay={2}
      />

      {/* Private Executive Suite Focused Warm Accent */}
      <pointLight
        position={[470, 34, 400]}
        color="#fef3c7"
        intensity={0.45}
        distance={120}
        decay={2}
      />
    </>
  );
}
