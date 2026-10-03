export const ROWS = 15;
export const COLS = 20;
export const TILE_SIZE = 32;

/**
 * Returns the zone ID at game world coordinates (x, y)
 */
export function getZoneIdAt(map, x, y, tileSize = TILE_SIZE) {
  if (!map || !Array.isArray(map) || map.length === 0) return null;
  const col = Math.floor(x / tileSize);
  const row = Math.floor(y / tileSize);
  if (row < 0 || row >= map.length) return null;
  if (col < 0 || col >= map[0].length) return null;
  return map[row][col];
}

/**
 * Computes a 2D boolean grid: true = walkable, false = wall (zone 0)
 */
export function precomputeCollisionGrid(map) {
  if (!map || !Array.isArray(map)) return [];
  return map.map(row => row.map(zoneId => zoneId !== 0));
}

/**
 * Fast collision check against precomputed grid with player radius
 */
export function isPositionWalkable(collisionGrid, x, y, radius = 12, tileSize = TILE_SIZE) {
  if (!collisionGrid || collisionGrid.length === 0) return false;
  const rows = collisionGrid.length;
  const cols = collisionGrid[0].length;

  const left = Math.floor((x - radius) / tileSize);
  const right = Math.floor((x + radius) / tileSize);
  const top = Math.floor((y - radius) / tileSize);
  const bottom = Math.floor((y + radius) / tileSize);

  if (top < 0 || left < 0 || bottom >= rows || right >= cols) return false;

  for (let r = top; r <= bottom; r++) {
    for (let c = left; c <= right; c++) {
      if (!collisionGrid[r][c]) {
        const tileCenterX = c * tileSize + tileSize / 2;
        const tileCenterY = r * tileSize + tileSize / 2;
        if (
          Math.abs(x - tileCenterX) <= tileSize / 2 + radius - 2 &&
          Math.abs(y - tileCenterY) <= tileSize / 2 + radius - 2
        ) {
          return false;
        }
      }
    }
  }
  return true;
}

/**
 * Finds spawn position in common zone (Zone 1)
 */
export function getSpawnPoint(map, tileSize = TILE_SIZE) {
  if (map && Array.isArray(map)) {
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        if (map[r][c] === 1) {
          return { x: c * tileSize + tileSize / 2, y: r * tileSize + tileSize / 2 };
        }
      }
    }
  }
  return { x: 2 * tileSize + tileSize / 2, y: 2 * tileSize + tileSize / 2 };
}
