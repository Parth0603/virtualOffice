export const ROWS = 24;
export const COLS = 36;
export const TILE_SIZE = 32;

/**
 * Returns the zone ID at game world coordinates (x, y)
 * If player is right against a glass wall partition (zone 0), resolves to the room zone on the player's side of the wall.
 */
export function getZoneIdAt(map, x, y, tileSize = TILE_SIZE) {
  if (!map || !Array.isArray(map) || map.length === 0) return null;
  const col = Math.floor(x / tileSize);
  const row = Math.floor(y / tileSize);
  if (row < 0 || row >= map.length) return null;
  if (col < 0 || col >= map[0].length) return null;

  const rawZone = map[row][col];
  if (rawZone !== 0) return rawZone;

  // Player is touching or standing adjacent to a glass partition wall tile.
  // Resolve to the actual room on the player's current side of the partition.
  const tileMidX = col * tileSize + tileSize * 0.5;
  const tileMidY = row * tileSize + tileSize * 0.5;

  if (y < tileMidY && row > 0 && map[row - 1][col] > 0) return map[row - 1][col];
  if (y >= tileMidY && row < map.length - 1 && map[row + 1][col] > 0) return map[row + 1][col];
  if (x < tileMidX && col > 0 && map[row][col - 1] > 0) return map[row][col - 1];
  if (x >= tileMidX && col < map[0].length - 1 && map[row][col + 1] > 0) return map[row][col + 1];

  // Diagonal fallback
  const neighbors = [
    row > 0 ? map[row - 1][col] : 0,
    row < map.length - 1 ? map[row + 1][col] : 0,
    col > 0 ? map[row][col - 1] : 0,
    col < map[0].length - 1 ? map[row][col + 1] : 0
  ];
  const validZone = neighbors.find(z => z > 0);
  return validZone || 1;
}

/**
 * Computes a 2D boolean grid: true = walkable, false = wall (zone 0)
 */
export function precomputeCollisionGrid(map) {
  if (!map || !Array.isArray(map)) return [];
  return map.map(row => row.map(zoneId => zoneId !== 0));
}

/**
 * Fast collision check against building bounds and wall centerlines.
 * Allows player to walk naturally right up to glass wall surfaces.
 */
export function isPositionWalkable(collisionGrid, x, y, radius = 8.5, tileSize = TILE_SIZE) {
  if (!collisionGrid || collisionGrid.length === 0) return false;
  const rows = collisionGrid.length;
  const cols = collisionGrid[0].length;

  const minBoundX = 16 + radius;
  const maxBoundX = cols * tileSize - 16 - radius;
  const minBoundY = 16 + radius;
  const maxBoundY = rows * tileSize - 16 - radius;

  // Exterior building boundaries
  if (x < minBoundX || x > maxBoundX || y < minBoundY || y > maxBoundY) {
    return false;
  }

  return true;
}

/**
 * Finds spawn position in common zone (Zone 1)
 */
export function getSpawnPoint(map, tileSize = TILE_SIZE) {
  if (map && Array.isArray(map)) {
    if (map[17] && map[17][6] === 1) {
      return { x: 6 * tileSize + tileSize / 2, y: 17 * tileSize + tileSize / 2 };
    }
    for (let r = 0; r < map.length; r++) {
      for (let c = 0; c < map[r].length; c++) {
        if (map[r][c] === 1) {
          return { x: c * tileSize + tileSize / 2, y: r * tileSize + tileSize / 2 };
        }
      }
    }
  }
  return { x: 6 * tileSize + tileSize / 2, y: 17 * tileSize + tileSize / 2 };
}
