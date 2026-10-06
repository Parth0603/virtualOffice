import React, { useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { materialPool } from '../../utils/materialPool.js';
import { ContinuousGlassWall, WallCornerPost, GlassDoorway, StructuralPillar } from './GlassPartitionWall.jsx';
import { getOfficeWallLayout } from '../../systems/wallGeometry.js';
import { CollisionSystem } from '../../systems/collision.js';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';

/**
 * Architectural Zone Floor Slab
 * Creates an exact floor slab matching the room's interior boundary defined by the walls.
 * Uses world-aligned UV mapping so all PBR textures maintain realistic 1:1 physical scale.
 */
function ZoneFloorSlab({ floorDef }) {
  const { id, x1, z1, x2, z2, materialKey } = floorDef;
  const width = x2 - x1;
  const depth = z2 - z1;
  const midX = (x1 + x2) * 0.5;
  const midZ = (z1 + z2) * 0.5;

  const geometry = useMemo(() => {
    // 1.0 thickness slab with top surface exactly at Y = 1.0 (when center is at Y = 0.5)
    const geo = new THREE.BoxGeometry(width, 1.0, depth);
    const uvAttr = geo.attributes.uv;

    // Top face is vertices 8 to 11 in Three.js BoxGeometry
    // World coordinates aligned: 1 UV repeat = 32 world units
    uvAttr.setXY(8, x1 / 32, z1 / 32);
    uvAttr.setXY(9, x2 / 32, z1 / 32);
    uvAttr.setXY(10, x1 / 32, z2 / 32);
    uvAttr.setXY(11, x2 / 32, z2 / 32);
    uvAttr.needsUpdate = true;

    return geo;
  }, [width, depth, x1, z1, x2, z2]);

  const material = materialPool[materialKey] || materialPool.floorCorridorMarble;

  return (
    <mesh
      key={id}
      position={[midX, 0.5, midZ]}
      geometry={geometry}
      material={material}
      receiveShadow
    />
  );
}

export function WorldTiles({ mapData }) {
  const { myRole } = useWorkspaceStore();

  const hasAccessToPrivate = useMemo(() => {
    if (myRole === 'host') return true;
    const store = useWorkspaceStore.getState ? useWorkspaceStore.getState() : {};
    return Boolean(store.permissions && store.permissions[5]);
  }, [myRole]);

  // Unified canonical wall geometry, pillars, doorways & exact zone floor polygons
  const { wallSegments, cornerPosts, doorways, structuralPillars = [], zoneFloors = [] } = useMemo(() => {
    return getOfficeWallLayout();
  }, []);

  // Register the EXACT same wall definitions with CollisionSystem
  useEffect(() => {
    CollisionSystem.registerWalls(wallSegments);
    return () => {
      CollisionSystem.registerWalls([]);
    };
  }, [wallSegments]);

  return (
    <group>
      {/* Clean Exterior Foundation Slab (Terrace Podium) */}
      <mesh position={[576, -0.6, 384]} receiveShadow>
        <boxGeometry args={[1200, 1.2, 816]} />
        <meshLambertMaterial color="#e2e8f0" />
      </mesh>

      {/* Exact Architectural Zone Floors terminating precisely at glass wall boundaries */}
      <group>
        {zoneFloors.map((floor) => (
          <ZoneFloorSlab key={floor.id} floorDef={floor} />
        ))}
      </group>

      {/* Unified Continuous Panoramic Glass Walls with Clean Connected Geometry */}
      <group>
        {wallSegments.map((wall) => (
          <ContinuousGlassWall
            key={wall.id}
            x1={wall.x1}
            z1={wall.z1}
            x2={wall.x2}
            z2={wall.z2}
            height={wall.height}
            thickness={wall.thickness}
            isFrosted={wall.isFrosted}
            isPerimeter={wall.isPerimeter}
          />
        ))}
      </group>

      {/* Architectural Corner & Junction Mullion Posts (Zero-gap 90° Connections) */}
      <group>
        {cornerPosts.map((post) => (
          <WallCornerPost
            key={post.id}
            x={post.x}
            z={post.z}
          />
        ))}
      </group>

      {/* Slim Elegant Structural Pillars at Major Corners, Room Boundaries & Wall Intersections */}
      <group>
        {structuralPillars.map((pillar) => (
          <StructuralPillar
            key={pillar.id}
            x={pillar.x}
            z={pillar.z}
          />
        ))}
      </group>

      {/* Architectural Glass Doorways Flush with Adjoining Wall Segments */}
      <group>
        {doorways.map((door) => (
          <GlassDoorway
            key={door.id}
            position={door.position}
            rotation={door.rotation}
            isRestricted={door.isRestricted}
            hasAccess={hasAccessToPrivate}
            roomSign={door.roomSign}
          />
        ))}
      </group>
    </group>
  );
}


