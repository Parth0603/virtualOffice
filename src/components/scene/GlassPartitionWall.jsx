import React, { useMemo } from 'react';
import * as THREE from 'three';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';
import { WALL_HEIGHT, WALL_THICKNESS } from '../../systems/wallGeometry.js';

// Minimalist Architectural Room Sign Plaque with Sleek Acrylic Plaque & Blue Accent
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

/**
 * Slim Architectural Structural Pillar (Crisp Off-White Vertical Column)
 * Positioned at major corners, room boundaries, and wall intersections.
 * Matches realistic corporate office columns from reference photography.
 */
export function StructuralPillar({
  x, z,
  height = WALL_HEIGHT,
  size = 2.2
}) {
  return (
    <group position={[x, 0, z]}>
      {/* Main Structural Column Shaft */}
      <mesh
        position={[0, height * 0.5, 0]}
        geometry={geometryPool.pillarShaft}
        material={materialPool.pillarWhite}
        castShadow
        receiveShadow
      />

      {/* Recessed Architectural Base Plinth */}
      <mesh
        position={[0, 0.3, 0]}
        geometry={geometryPool.pillarBase}
        material={materialPool.pillarTrim}
        castShadow
        receiveShadow
      />

      {/* Ceiling Capital Collar */}
      <mesh
        position={[0, height - 0.3, 0]}
        geometry={geometryPool.pillarBase}
        material={materialPool.pillarTrim}
        castShadow
      />
    </group>
  );
}

/**
 * High-Performance Continuous Architectural Glass Wall
 * Clean floor-to-ceiling glass with slim black aluminum floor/ceiling tracks and vertical mullions.
 * Uses shared geometries and materials for locked 60+ FPS performance.
 */
export function ContinuousGlassWall({
  x1, z1, x2, z2,
  height = WALL_HEIGHT,
  thickness = WALL_THICKNESS,
  isFrosted = false,
  isPerimeter = false
}) {
  const glassMat = isFrosted ? materialPool.glassFrosted : materialPool.glassClear;

  const dx = x2 - x1;
  const dz = z2 - z1;
  const length = Math.hypot(dx, dz);
  const midX = (x1 + x2) * 0.5;
  const midZ = (z1 + z2) * 0.5;

  const isHorizontal = Math.abs(dz) < 0.001;
  const isVertical = Math.abs(dx) < 0.001;

  // Architectural modular vertical mullions spaced at ~32-unit modules
  const mullions = useMemo(() => {
    if (length <= 36) return [];
    const count = Math.floor(length / 32);
    const step = length / (count + 1);
    const list = [];
    for (let i = 1; i <= count; i++) {
      list.push(i * step - length * 0.5);
    }
    return list;
  }, [length]);

  if (isHorizontal) {
    return (
      <group>
        {/* Slim Bottom Aluminum Track */}
        <mesh position={[midX, 0.2, midZ]} castShadow receiveShadow material={materialPool.blackAluminum}>
          <boxGeometry args={[length, 0.4, thickness]} />
        </mesh>

        {/* Slim Top Aluminum Track */}
        <mesh position={[midX, height - 0.2, midZ]} castShadow material={materialPool.blackAluminum}>
          <boxGeometry args={[length, 0.4, thickness]} />
        </mesh>

        {/* Panoramic Glass Pane (Floor-to-Ceiling) */}
        <mesh position={[midX, height * 0.5, midZ]} material={glassMat}>
          <boxGeometry args={[length, height - 0.8, 0.2]} />
        </mesh>

        {/* Slim Vertical Mullions */}
        {mullions.map((offset, idx) => (
          <mesh
            key={idx}
            position={[midX + offset, height * 0.5, midZ]}
            geometry={geometryPool.mullionVertical}
            material={materialPool.blackAluminum}
          />
        ))}
      </group>
    );
  }

  if (isVertical) {
    return (
      <group>
        {/* Slim Bottom Aluminum Track */}
        <mesh position={[midX, 0.2, midZ]} castShadow receiveShadow material={materialPool.blackAluminum}>
          <boxGeometry args={[thickness, 0.4, length]} />
        </mesh>

        {/* Slim Top Aluminum Track */}
        <mesh position={[midX, height - 0.2, midZ]} castShadow material={materialPool.blackAluminum}>
          <boxGeometry args={[thickness, 0.4, length]} />
        </mesh>

        {/* Panoramic Glass Pane (Floor-to-Ceiling) */}
        <mesh position={[midX, height * 0.5, midZ]} material={glassMat}>
          <boxGeometry args={[0.2, height - 0.8, length]} />
        </mesh>

        {/* Slim Vertical Mullions */}
        {mullions.map((offset, idx) => (
          <mesh
            key={idx}
            position={[midX, height * 0.5, midZ + offset]}
            rotation={[0, Math.PI / 2, 0]}
            geometry={geometryPool.mullionVertical}
            material={materialPool.blackAluminum}
          />
        ))}
      </group>
    );
  }

  // Angled wall fallback
  const rotY = -Math.atan2(dz, dx);
  return (
    <group position={[midX, 0, midZ]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.2, 0]} material={materialPool.blackAluminum}>
        <boxGeometry args={[length, 0.4, thickness]} />
      </mesh>
      <mesh position={[0, height - 0.2, 0]} material={materialPool.blackAluminum}>
        <boxGeometry args={[length, 0.4, thickness]} />
      </mesh>
      <mesh position={[0, height * 0.5, 0]} material={glassMat}>
        <boxGeometry args={[length, height - 0.8, 0.2]} />
      </mesh>
      {mullions.map((offset, idx) => (
        <mesh
          key={idx}
          position={[offset, height * 0.5, 0]}
          geometry={geometryPool.mullionVertical}
          material={materialPool.blackAluminum}
        />
      ))}
    </group>
  );
}

/**
 * Architectural Vertical Mullion Corner / Junction Post
 * Connects adjoining wall segments flush at 90° and T-intersections
 */
export function WallCornerPost({
  x, z,
  height = WALL_HEIGHT,
  size = WALL_THICKNESS
}) {
  return (
    <mesh
      position={[x, height * 0.5, z]}
      geometry={geometryPool.wallCornerPost}
      material={materialPool.blackAluminum}
      castShadow
      receiveShadow
    />
  );
}

/**
 * Modular Office Glass Doorway with Minimalist Jambs and Stainless Pull Handle
 * Seamlessly abuts adjacent wall segments with flush zero-gap frame alignment
 */
export function GlassDoorway({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = WALL_HEIGHT,
  isRestricted = false,
  hasAccess = false,
  roomSign = null
}) {
  const doorGlassMat = isRestricted
    ? (hasAccess ? materialPool.glassClear : materialPool.glassRestricted)
    : materialPool.glassClear;

  return (
    <group position={position} rotation={rotation}>
      {/* Top Doorway Header - exactly 32 width, spans -16 to +16 */}
      <mesh
        position={[0, height - 0.3, 0]}
        geometry={geometryPool.doorHeader}
        material={materialPool.blackAluminum}
        castShadow
      >
        <boxGeometry args={[32, 0.6, 0.6]} />
      </mesh>

      {/* Slim Door Threshold Strip on Floor */}
      <mesh
        position={[0, 0.04, 0]}
        geometry={geometryPool.doorThreshold}
        material={materialPool.blackAluminum}
        receiveShadow
      />

      {/* Left Slim Door Jamb - outer edge at -16.0 flush with preceding wall segment */}
      <mesh
        position={[-15.7, height * 0.5, 0]}
        geometry={geometryPool.doorJamb}
        material={materialPool.blackAluminum}
        castShadow
      />

      {/* Right Slim Door Jamb - outer edge at +16.0 flush with following wall segment */}
      <mesh
        position={[15.7, height * 0.5, 0]}
        geometry={geometryPool.doorJamb}
        material={materialPool.blackAluminum}
        castShadow
      />

      {/* Glass Door Leaf (Ajar / Welcoming Entry) */}
      <group position={[-5, 0, 0.4]}>
        <mesh
          position={[0, (height - 1.2) * 0.5, 0]}
          geometry={geometryPool.glassDoorLeaf}
          material={doorGlassMat}
        />

        {/* Stainless Steel Vertical Architectural Pull Handle */}
        <mesh
          position={[7.5, height * 0.5 - 5, 0.8]}
          geometry={geometryPool.doorHandle}
          material={materialPool.doorHandle}
        />
        {/* Top Handle Standoff */}
        <mesh
          position={[7.5, height * 0.5 + 2, 0.5]}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={geometryPool.doorHandleStandoff}
          material={materialPool.doorHandle}
        />
        {/* Bottom Handle Standoff */}
        <mesh
          position={[7.5, height * 0.5 - 12, 0.5]}
          rotation={[Math.PI / 2, 0, 0]}
          geometry={geometryPool.doorHandleStandoff}
          material={materialPool.doorHandle}
        />
      </group>

      {/* Physical Room Sign Plaque on Door Header */}
      {roomSign && (
        <ArchitecturalSign
          text={roomSign.title}
          subtitle={roomSign.code}
          position={[0, height - 4.5, 0.8]}
        />
      )}

      {/* Restricted Room Holographic Lock Status Badge */}
      {isRestricted && (
        <mesh
          position={[0, height - 10, 0.7]}
          geometry={geometryPool.lockBadge}
          material={hasAccess ? materialPool.unlockedBadge : materialPool.lockedBadge}
        />
      )}
    </group>
  );
}

// Backward-compatible individual panel if referenced elsewhere
export function GlassWallPanel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  height = WALL_HEIGHT,
  isFrosted = false,
  isPerimeter = false
}) {
  const glassMat = isFrosted ? materialPool.glassFrosted : materialPool.glassClear;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.2, 0]} geometry={geometryPool.trackBottom} material={materialPool.blackAluminum} castShadow receiveShadow />
      <mesh position={[0, height - 0.2, 0]} geometry={geometryPool.trackTop} material={materialPool.blackAluminum} castShadow />
      <mesh position={[0, height * 0.5, 0]} geometry={geometryPool.glassPane} material={glassMat} />
    </group>
  );
}
