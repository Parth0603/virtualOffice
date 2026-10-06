/**
 * AssetModels
 * Loads and provides pre-scaled, pivot-corrected, and orientation-aligned
 * 3D GLB models from the provided /Assets_lib library.
 * Reuses geometries and PBR materials efficiently with Drei useGLTF / Clone.
 */

import React, { useMemo } from 'react';
import { useGLTF, Clone } from '@react-three/drei';
import * as THREE from 'three';

// Asset paths relative to public root
const ASSET_PATHS = {
  officeChair: '/Assets_lib/office_chair.glb',
  sofaChair: '/Assets_lib/sofa_chair.glb',
  longSofa: '/Assets_lib/sofa_-_long_sofa.glb',
  basketSwingChair: '/Assets_lib/basket_swing_chair.glb',
  dublinChair: '/Assets_lib/dublin_chair.glb',
  chairTable: '/Assets_lib/sm_chair_table.glb',
  gamingChair: '/Assets_lib/gaming_chair.glb',
  doctorsChair: '/Assets_lib/doctors_chair.glb'
};

// Eagerly preload all assets so they are cached in memory
Object.values(ASSET_PATHS).forEach((path) => {
  useGLTF.preload(path);
});

function applyShadows(scene) {
  scene.traverse((c) => {
    if (c.isMesh) {
      c.castShadow = true;
      c.receiveShadow = true;
      // Ensure depth writing and standard materials are properly set
      if (c.material) {
        c.material.depthWrite = true;
        c.material.needsUpdate = true;
      }
    }
  });
  return scene;
}

/**
 * Ergonomic High-Back Office Task Chair with 5-star Castor Wheels
 * Replaces procedural mesh chair at workstations, reception, and project desks.
 */
export function OfficeChairModel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(ASSET_PATHS.officeChair);

  useMemo(() => {
    applyShadows(scene);
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* 
        Normalized transform:
        Scale: 14.0 (Height: 16.2 units, Seat height: 6.2 units)
        Position: [0, 0.64, -0.9] (rests perfectly on floor Y=0)
        Rotation: [0, Math.PI, 0] (backrest at +Z, front faces -Z)
      */}
      <group position={[0, 0.64, -0.9]} rotation={[0, Math.PI, 0]} scale={[14.0, 14.0, 14.0]}>
        <primitive object={scene.clone()} />
      </group>
    </group>
  );
}

/**
 * Designer Club Armchair with Plush Cushions
 * Replaces procedural lounge club armchairs in Lounge, Lobby, and Executive Suite.
 */
export function ClubArmchairModel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(ASSET_PATHS.sofaChair);

  useMemo(() => {
    applyShadows(scene);
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* 
        Normalized transform:
        Scale: 10.5 (Width: 17.8, Height: 15.1 units, Seat height: 5.5 units)
        Position: [0, 3.9, -1.0] (rests on floor Y=0)
        Rotation: [0, Math.PI, 0] (backrest at +Z, front faces -Z)
      */}
      <group position={[0, 3.9, -1.0]} rotation={[0, Math.PI, 0]} scale={[10.5, 10.5, 10.5]}>
        <primitive object={scene.clone()} />
      </group>
    </group>
  );
}

/**
 * 3-Seater Modern Executive Sectional Lounge Sofa
 * Replaces procedural sofa in Lounge area.
 */
export function LongSofaModel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(ASSET_PATHS.longSofa);

  useMemo(() => {
    applyShadows(scene);
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* 
        Normalized transform:
        Scale: 6.6 (Length: 49.0 units, Height: 18.3 units, Depth: 22.9 units)
        Position: [0, 0.05, 0] (rests on floor Y=0)
        Rotation: [0, Math.PI / 2, 0] (aligns long side across X, seating facing +Z)
      */}
      <group position={[0, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} scale={[6.6, 6.6, 6.6]}>
        <primitive object={scene.clone()} />
      </group>
    </group>
  );
}

/**
 * Sleek Dublin Executive Sleigh-Leg Conference Chair
 * Used for executive boardroom seating.
 */
export function DublinChairModel({ position = [0, 0, 0], rotation = [0, 0, 0], variant = 'white' }) {
  const { scene } = useGLTF(ASSET_PATHS.dublinChair);

  const chairNode = useMemo(() => {
    const chair = scene.getObjectByName(variant === 'black' ? 'black_chair' : 'white_chair') || scene;
    const cloned = chair.clone(true);
    applyShadows(cloned);
    // Reset local root offset from multi-object GLB
    cloned.position.set(0, 0, 0);
    return cloned;
  }, [scene, variant]);

  return (
    <group position={position} rotation={rotation}>
      {/* 
        Normalized transform:
        Scale: 0.185 (Height: 16.0 units, Seat height: 6.0 units)
        Position: [0, 0.1, 0]
        Rotation: [0, Math.PI, 0] (faces -Z)
      */}
      <group position={[0, 0.1, 0]} rotation={[0, Math.PI, 0]} scale={[0.185, 0.185, 0.185]}>
        <primitive object={chairNode} />
      </group>
    </group>
  );
}

/**
 * Biophilic Basket Egg Swing Relaxation Chair
 * Adds a modern relaxed lounge element.
 */
export function SwingChairModel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(ASSET_PATHS.basketSwingChair);

  useMemo(() => {
    applyShadows(scene);
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      {/* 
        Normalized transform:
        Scale: 8.5 (Height: 23.2 units, Base diameter: 17.8 units)
        Position: [0, 0.4, 0]
        Rotation: [0, Math.PI, 0]
      */}
      <group position={[0, 0.4, 0]} rotation={[0, Math.PI, 0]} scale={[8.5, 8.5, 8.5]}>
        <primitive object={scene.clone()} />
      </group>
    </group>
  );
}

/**
 * Collaborative Meeting Table with 4 Attached Chairs
 */
export function ChairTableModel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const { scene } = useGLTF(ASSET_PATHS.chairTable);

  useMemo(() => {
    applyShadows(scene);
  }, [scene]);

  return (
    <group position={position} rotation={rotation}>
      <group position={[0, 0.05, 0]} scale={[16.0, 16.0, 16.0]}>
        <primitive object={scene.clone()} />
      </group>
    </group>
  );
}
