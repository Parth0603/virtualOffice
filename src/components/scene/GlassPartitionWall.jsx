import React, { useMemo } from 'react';
import * as THREE from 'three';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';

// Minimalist Architectural Room Sign Plaque
export function ArchitecturalSign({ text = '', subtitle = '', position = [0, 36, 0], rotation = [0, 0, 0] }) {
  const signMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 140;
    const ctx = canvas.getContext('2d');
    if (!ctx) return materialPool.blackAluminum;

    // Dark sleek acrylic plaque
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle brushed border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, canvas.width - 8, canvas.height - 8);

    // Modern left accent bar
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(8, 8, 10, canvas.height - 16);

    // Text styling
    ctx.textAlign = 'left';

    if (subtitle) {
      ctx.font = '600 24px Inter, sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(subtitle.toUpperCase(), 36, 44);
    }

    ctx.font = '700 42px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text.toUpperCase(), 36, subtitle ? 96 : 78);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return new THREE.MeshPhongMaterial({
      map: texture,
      shininess: 60
    });
  }, [text, subtitle]);

  return (
    <mesh
      position={position}
      rotation={rotation}
      geometry={geometryPool.roomSignPlaque}
      material={signMaterial}
      castShadow
    />
  );
}

// Minimalist Panoramic Glass Wall Panel
// Replaces heavy cage frames with clean floor-to-ceiling glass and slim top/bottom tracks
export function GlassWallPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isFrosted = false,
  isPerimeter = false
}) {
  const glassMat = isFrosted ? materialPool.glassFrosted : materialPool.glassClear;

  return (
    <group position={position} rotation={rotation}>
      {/* Slim Matte Black Bottom Track */}
      <mesh
        position={[0, 0.2, 0]}
        geometry={geometryPool.trackBottom}
        material={materialPool.blackAluminum}
        castShadow
        receiveShadow
      />

      {/* Slim Matte Black Top Track */}
      <mesh
        position={[0, 41.8, 0]}
        geometry={geometryPool.trackTop}
        material={materialPool.blackAluminum}
        castShadow
      />

      {/* Minimalist Panoramic Glass Pane (Full Height, No Dense Cage Bars) */}
      <mesh
        position={[0, 21, 0]}
        geometry={geometryPool.glassPane}
        material={glassMat}
      />
    </group>
  );
}

// Modular Office Glass Doorway with Minimalist Jambs and Room Header
export function GlassDoorway({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  isRestricted = false,
  hasAccess = false,
  roomSign = null
}) {
  const doorGlassMat = isRestricted
    ? (hasAccess ? materialPool.glassClear : materialPool.glassRestricted)
    : materialPool.glassClear;

  return (
    <group position={position} rotation={rotation}>
      {/* Top Doorway Header */}
      <mesh
        position={[0, 41.5, 0]}
        geometry={geometryPool.doorHeader}
        material={materialPool.blackAluminum}
        castShadow
      />

      {/* Left Slim Door Jamb */}
      <mesh
        position={[-15.5, 21, 0]}
        geometry={geometryPool.doorJamb}
        material={materialPool.blackAluminum}
        castShadow
      />

      {/* Right Slim Door Jamb */}
      <mesh
        position={[15.5, 21, 0]}
        geometry={geometryPool.doorJamb}
        material={materialPool.blackAluminum}
        castShadow
      />

      {/* Glass Door Leaf (Ajar / Welcoming Entry) */}
      <group position={[-5, 0, 0.4]}>
        <mesh
          position={[0, 20.5, 0]}
          geometry={geometryPool.glassDoorLeaf}
          material={doorGlassMat}
        />
        {/* Sleek Stainless Steel Vertical Handle */}
        <mesh
          position={[7.5, 20, 0.8]}
          geometry={geometryPool.doorHandle}
          material={materialPool.doorHandle}
        />
      </group>

      {/* Physical Room Sign Plaque on Door Header */}
      {roomSign && (
        <ArchitecturalSign
          text={roomSign.title}
          subtitle={roomSign.code}
          position={[0, 37.5, 0.8]}
        />
      )}

      {/* Restricted Room Holographic Lock Status Badge */}
      {isRestricted && (
        <mesh
          position={[0, 32, 0.7]}
          geometry={geometryPool.lockBadge}
          material={hasAccess ? materialPool.unlockedBadge : materialPool.lockedBadge}
        />
      )}
    </group>
  );
}
