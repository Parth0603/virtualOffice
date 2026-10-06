import { TILE_SIZE, PLAYER_RADIUS } from '../constants/grid.js';
import { CANONICAL_WALL_SEGMENTS, WALL_THICKNESS } from './wallGeometry.js';

export class CollisionSystem {
  static obstacles = [];
  static wallSegments = CANONICAL_WALL_SEGMENTS;

  static createCollisionGrid(map) {
    if (!map || !Array.isArray(map)) return [];
    return map.map(row => row.map(zoneId => zoneId !== 0));
  }

  // Register wall segments for precise glass wall collision boundaries
  static registerWalls(segments) {
    this.wallSegments = segments && segments.length > 0 ? segments : CANONICAL_WALL_SEGMENTS;
  }

  static clearWalls() {
    this.wallSegments = [];
  }

  // Register furniture obstacles (desks, tables, credenzas, reception counter)
  static registerObstacles(list) {
    this.obstacles = list || [];
  }

  static addObstacle(obstacle) {
    this.obstacles.push(obstacle);
  }

  static clearObstacles() {
    this.obstacles = [];
  }

  /**
   * Precise player collision against glass wall segments and furniture obstacles.
   * Player boundary (radius) stops and slides directly on the visible glass wall surface.
   * No oversized boxes, no secondary colliders, no artificial offset margins.
   */
  static canMove(collisionGrid, x, y, radius = PLAYER_RADIUS, tileSize = TILE_SIZE, ignoreId = null, fromX = null, fromY = null) {
    const hasFrom = fromX !== null && fromY !== null && Number.isFinite(fromX) && Number.isFinite(fromY);

    // 1. Building Boundary Enforcement (Outer perimeter glass wall bounds)
    // Perimeter glass walls are at X: [16, 1136] and Z: [16, 752]
    const minBoundX = 16 + radius;
    const maxBoundX = 1136 - radius;
    const minBoundZ = 16 + radius;
    const maxBoundZ = 752 - radius;

    if (x < minBoundX || x > maxBoundX || y < minBoundZ || y > maxBoundZ) {
      if (hasFrom) {
        // If already slightly outside or at bound, allow inward movement
        const wasViolatingX = fromX < minBoundX || fromX > maxBoundX;
        const wasViolatingZ = fromY < minBoundZ || fromY > maxBoundZ;
        const movingInwardX = (x > fromX && fromX < minBoundX) || (x < fromX && fromX > maxBoundX);
        const movingInwardZ = (y > fromY && fromY < minBoundZ) || (y < fromY && fromY > maxBoundZ);
        if ((wasViolatingX && movingInwardX) || (wasViolatingZ && movingInwardZ)) {
          // Allow restoring movement
        } else {
          return false;
        }
      } else {
        return false;
      }
    }

    // 2. Glass Wall Segment Collision (Exact visual glass wall = actual collision boundary)
    const segments = this.wallSegments;
    const segCount = segments.length;

    for (let i = 0; i < segCount; i++) {
      const seg = segments[i];
      const { x1, z1, x2, z2 } = seg;

      const segDx = x2 - x1;
      const segDz = z2 - z1;
      const segLenSq = segDx * segDx + segDz * segDz;
      if (segLenSq < 0.0001) continue;

      // Project player position onto wall segment
      const t = Math.max(0, Math.min(1, ((x - x1) * segDx + (y - z1) * segDz) / segLenSq));
      const projX = x1 + t * segDx;
      const projZ = z1 + t * segDz;

      const dx = x - projX;
      const dz = y - projZ;
      const distSq = dx * dx + dz * dz;

      // Exact collision threshold: player radius + half wall thickness
      // Player avatar boundary reaches the wall surface directly with natural contact
      const wallHalfThick = (seg.thickness || WALL_THICKNESS) * 0.5;
      const threshold = radius + wallHalfThick;
      const thresholdSq = threshold * threshold;

      if (distSq < thresholdSq) {
        // If movement is separating (moving away from wall), allow fluid sliding / retreat
        if (hasFrom) {
          const oldT = Math.max(0, Math.min(1, ((fromX - x1) * segDx + (fromY - z1) * segDz) / segLenSq));
          const oldProjX = x1 + oldT * segDx;
          const oldProjZ = z1 + oldT * segDz;
          const oldDx = fromX - oldProjX;
          const oldDz = fromY - oldProjZ;
          const oldDistSq = oldDx * oldDx + oldDz * oldDz;

          if (distSq > oldDistSq) {
            continue; // Movement increases distance from this wall: permit
          }
        }
        return false; // Movement penetrates or remains against wall
      }
    }

    // 3. Lightweight Furniture Obstacles Check (Desks, Tables, Counters, Credenzas)
    if (this.obstacles.length > 0) {
      const radiusSq = radius * radius;

      for (let i = 0; i < this.obstacles.length; i++) {
        const obs = this.obstacles[i];
        if (ignoreId && obs.id === ignoreId) continue;

        // Closest point on obstacle AABB to player position
        const closestX = Math.max(obs.minX, Math.min(obs.maxX, x));
        const closestZ = Math.max(obs.minZ, Math.min(obs.maxZ, y));

        const dx = x - closestX;
        const dz = y - closestZ;
        const distSq = dx * dx + dz * dz;

        if (distSq < radiusSq) {
          // If already touching/penetrating this obstacle, allow movement that separates / increases distance
          if (hasFrom) {
            const oldClosestX = Math.max(obs.minX, Math.min(obs.maxX, fromX));
            const oldClosestZ = Math.max(obs.minZ, Math.min(obs.maxZ, fromY));
            const oldDx = fromX - oldClosestX;
            const oldDz = fromY - oldClosestZ;
            const oldDistSq = oldDx * oldDx + oldDz * oldDz;
            if (distSq > oldDistSq) {
              continue;
            }
          }
          return false;
        }
      }
    }

    return true;
  }
}

