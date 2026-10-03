import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { geometryPool } from '../../utils/geometryPool.js';
import { getZoneMetadata } from '../../constants/zoneColors.js';
import { TILE_SIZE } from '../../constants/grid.js';
import { GlassWallPanel, GlassDoorway } from './GlassPartitionWall.jsx';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';

export function WorldTiles({ mapData }) {
  const floorMeshRef = useRef();
  const { myRole } = useWorkspaceStore();

  const hasAccessToPrivate = useMemo(() => {
    if (myRole === 'host') return true;
    const store = useWorkspaceStore.getState ? useWorkspaceStore.getState() : {};
    return Boolean(store.permissions && store.permissions[5]);
  }, [myRole]);

  const { tileInstances, wallPanels, doorways, rows, cols } = useMemo(() => {
    if (!mapData || !mapData.map) {
      return { tileInstances: [], wallPanels: [], doorways: [], rows: 15, cols: 20 };
    }

    const map = mapData.map;
    const rCount = map.length;
    const cCount = map[0].length;
    const tiles = [];
    const walls = [];
    const doors = [];

    // Process every tile in the grid
    for (let r = 0; r < rCount; r++) {
      for (let c = 0; c < cCount; c++) {
        const zoneId = map[r][c];
        const x = c * TILE_SIZE + TILE_SIZE / 2;
        const z = r * TILE_SIZE + TILE_SIZE / 2;
        const isPerimeter = (r === 0 || r === rCount - 1 || c === 0 || c === cCount - 1);

        if (zoneId === 0) {
          // Glass Partition Wall Tile
          const hasV = (r > 0 && map[r - 1][c] === 0) || (r < rCount - 1 && map[r + 1][c] === 0);
          const hasH = (c > 0 && map[r][c - 1] === 0) || (c < cCount - 1 && map[r][c + 1] === 0);

          // Check if adjacent to Private Room (Zone 5) for privacy frosting
          const neighbors = [
            r > 0 ? map[r - 1][c] : 0,
            r < rCount - 1 ? map[r + 1][c] : 0,
            c > 0 ? map[r][c - 1] : 0,
            c < cCount - 1 ? map[r][c + 1] : 0
          ];
          const isFrosted = neighbors.some(id => id === 5);

          // Determine orientation
          let rotY = 0;
          if (hasV && !hasH) {
            rotY = Math.PI / 2;
          } else if (isPerimeter) {
            rotY = (c === 0 || c === cCount - 1) ? Math.PI / 2 : 0;
          }

          walls.push({
            id: `wall_${r}_${c}`,
            position: [x, 0, z],
            rotation: [0, rotY, 0],
            isFrosted,
            isPerimeter
          });

          // Continuous architectural flooring extending seamlessly under glass partition
          let neighborZone = neighbors.find(n => n > 0) || 1;
          let wallFloorColor = 0xf1f5f9;
          if (neighborZone === 1) wallFloorColor = 0xf8fafc;
          else if (neighborZone === 2) wallFloorColor = 0x64748b;
          else if (neighborZone === 3) wallFloorColor = 0x1e293b;
          else if (neighborZone === 4) wallFloorColor = 0x94a3b8;
          else if (neighborZone === 5) wallFloorColor = 0x5c3a21;
          else if (neighborZone === 6) wallFloorColor = 0xd4a373;

          tiles.push({ x, y: 0.5, z, color: wallFloorColor, zoneId: 0 });
        } else {
          // Curated Flooring Materials per Zone
          let floorColorHex = 0xf1f5f9; // Default transition
          if (zoneId === 1) floorColorHex = 0xf8fafc; // Lobby: Polished bright terrazzo tile
          else if (zoneId === 2) floorColorHex = 0x64748b; // Team Workspace: Modern slate acoustic carpet
          else if (zoneId === 3) floorColorHex = 0x1e293b; // Meeting Room: Executive deep navy/charcoal carpet
          else if (zoneId === 4) floorColorHex = 0x94a3b8; // Project Room: Studio collaboration floor
          else if (zoneId === 5) floorColorHex = 0x5c3a21; // Private Room: Rich executive walnut hardwood
          else if (zoneId === 6) floorColorHex = 0xd4a373; // Lounge: Warm blonde oak parquet

          tiles.push({ x, y: 0.5, z, color: floorColorHex, zoneId });

          // Doorways with physical architectural signs
          if (r === 5 && c === 4) {
            doors.push({
              id: `door_${r}_${c}`,
              position: [x, 0, z],
              rotation: [0, 0, 0],
              isRestricted: false,
              roomSign: { title: 'Team Workspace', code: 'Suite 02' }
            });
          } else if (r === 5 && c === 14) {
            doors.push({
              id: `door_${r}_${c}`,
              position: [x, 0, z],
              rotation: [0, 0, 0],
              isRestricted: false,
              roomSign: { title: 'Boardroom', code: 'Suite 03' }
            });
          } else if (r === 10 && c === 4) {
            doors.push({
              id: `door_${r}_${c}`,
              position: [x, 0, z],
              rotation: [0, 0, 0],
              isRestricted: false,
              roomSign: { title: 'Project Lab', code: 'Suite 04' }
            });
          } else if (r === 10 && c === 14) {
            doors.push({
              id: `door_${r}_${c}`,
              position: [x, 0, z],
              rotation: [0, 0, 0],
              isRestricted: true,
              roomSign: { title: 'Private Suite', code: 'Restricted' }
            });
          } else if (r === 12 && c === 9) {
            doors.push({
              id: `door_${r}_${c}`,
              position: [x, 0, z],
              rotation: [0, Math.PI / 2, 0],
              isRestricted: true,
              roomSign: { title: 'Private Suite', code: 'Keycard Only' }
            });
          } else if (r === 2 && c === 9) {
            doors.push({
              id: `door_${r}_${c}`,
              position: [x, 0, z],
              rotation: [0, Math.PI / 2, 0],
              isRestricted: false,
              roomSign: { title: 'Lounge & Social', code: 'Zone 06' }
            });
          }
        }
      }
    }

    return { tileInstances: tiles, wallPanels: walls, doorways: doors, rows: rCount, cols: cCount };
  }, [mapData]);

  // Apply matrix and colors to Instanced Floor Mesh (1 single draw call for all floors)
  useLayoutEffect(() => {
    const dummy = new THREE.Object3D();

    if (floorMeshRef.current && tileInstances.length > 0) {
      tileInstances.forEach((inst, i) => {
        dummy.position.set(inst.x, inst.y, inst.z);
        dummy.updateMatrix();
        floorMeshRef.current.setMatrixAt(i, dummy.matrix);
        floorMeshRef.current.setColorAt(i, new THREE.Color(inst.color));
      });
      floorMeshRef.current.instanceMatrix.needsUpdate = true;
      if (floorMeshRef.current.instanceColor) {
        floorMeshRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [tileInstances]);

  const worldWidth = cols * TILE_SIZE;
  const worldDepth = rows * TILE_SIZE;

  return (
    <group>
      {/* Clean Exterior Foundation Slab (Terrace Podium) */}
      <mesh position={[worldWidth / 2, -0.6, worldDepth / 2]} receiveShadow>
        <boxGeometry args={[worldWidth + 80, 1.2, worldDepth + 80]} />
        <meshLambertMaterial color="#e2e8f0" />
      </mesh>

      {/* Instanced Architectural Floors (1 single draw call) */}
      {tileInstances.length > 0 && (
        <instancedMesh
          ref={floorMeshRef}
          args={[geometryPool.tile, undefined, tileInstances.length]}
          receiveShadow
        >
          <meshLambertMaterial />
        </instancedMesh>
      )}

      {/* Minimalist Panoramic Glass Partition Walls with Slim Aluminum Tracks */}
      <group>
        {wallPanels.map((wall) => (
          <GlassWallPanel
            key={wall.id}
            position={wall.position}
            rotation={wall.rotation}
            isFrosted={wall.isFrosted}
            isPerimeter={wall.isPerimeter}
          />
        ))}
      </group>

      {/* Architectural Glass Doorways with Room Signs and Status Badges */}
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
