import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { WorldLighting } from './WorldLighting.jsx';
import { WorldTiles } from './WorldTiles.jsx';
import { WorkspaceFurniture } from './WorkspaceFurniture.jsx';
import { LocalPlayer } from '../avatar/LocalPlayer.jsx';
import { RemotePlayers } from '../avatar/RemotePlayers.jsx';
import { CameraController } from './CameraController.jsx';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';

export function WorkspaceCanvas() {
  const { mapData } = useWorkspaceStore();
  const localPlayerRef = useRef();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [140, 110, 210], fov: 55, near: 1, far: 3000 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05
        }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0xf1f5f9);
        }}
      >
        <WorldLighting />
        <WorldTiles mapData={mapData} />
        <WorkspaceFurniture mapData={mapData} />
        <LocalPlayer playerRef={localPlayerRef} />
        <RemotePlayers />
        <CameraController localPlayerRef={localPlayerRef} />
      </Canvas>
    </div>
  );
}
