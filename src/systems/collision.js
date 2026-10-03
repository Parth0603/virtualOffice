import { TILE_SIZE, PLAYER_RADIUS } from '../constants/grid.js';

export class CollisionSystem {
  static obstacles = [];

  static createCollisionGrid(map) {
    if (!map || !Array.isArray(map)) return [];
    return map.map(row => row.map(zoneId => zoneId !== 0));
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

  // Circle-to-AABB collision for walls and furniture objects with fluid sliding
  static canMove(collisionGrid, x, y, radius = PLAYER_RADIUS, tileSize = TILE_SIZE, ignoreId = null) {
    // 1. Grid Wall Collision Check
    if (collisionGrid && collisionGrid.length > 0) {
      const rows = collisionGrid.length;
      const cols = collisionGrid[0].length;

      const left = Math.floor((x - radius) / tileSize);
      const right = Math.floor((x + radius) / tileSize);
      const top = Math.floor((y - radius) / tileSize);
      const bottom = Math.floor((y + radius) / tileSize);

      if (top < 0 || left < 0 || bottom >= rows || right >= cols) return false;

      const radiusSq = radius * radius;
      const halfTile = tileSize / 2;

      for (let r = top; r <= bottom; r++) {
        for (let c = left; c <= right; c++) {
          if (!collisionGrid[r][c]) {
            const tileCenterX = c * tileSize + halfTile;
            const tileCenterY = r * tileSize + halfTile;

            const closestX = Math.max(tileCenterX - halfTile, Math.min(tileCenterX + halfTile, x));
            const closestY = Math.max(tileCenterY - halfTile, Math.min(tileCenterY + halfTile, y));

            const dx = x - closestX;
            const dy = y - closestY;

            if (dx * dx + dy * dy < radiusSq) {
              return false;
            }
          }
        }
      }
    }

    // 2. Lightweight Furniture Obstacles Check (Desks, Tables, Counters, Credenzas)
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

        if (dx * dx + dz * dz < radiusSq) {
          return false;
        }
      }
    }

    return true;
  }
}
