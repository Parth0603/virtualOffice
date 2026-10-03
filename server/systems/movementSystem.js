import { workspaceState } from '../state/workspaceState.js';
import { playerState } from '../state/playerState.js';
import { getZoneIdAt, isPositionWalkable } from '../utils/zoneUtils.js';
import { isValidCoordinate } from '../utils/validation.js';
import { PermissionSystem } from './permissionSystem.js';

export class MovementSystem {
  static handlePlayerMove(socketId, { x, y }) {
    if (!isValidCoordinate(x) || !isValidCoordinate(y)) return null;

    const mapData = workspaceState.getMapData();
    const collisionGrid = workspaceState.getCollisionGrid();
    if (!mapData || !collisionGrid) return null;

    const player = playerState.getPlayer(socketId);
    if (!player) return null;

    // Check collision against walls / grid bounds
    if (!isPositionWalkable(collisionGrid, x, y, 12)) {
      return null;
    }

    const zoneId = getZoneIdAt(mapData.map, x, y);
    if (zoneId === null || zoneId === 0) return null;

    // Check permissions
    if (PermissionSystem.canAccessZone(player, zoneId)) {
      playerState.updatePosition(socketId, x, y, zoneId);
      workspaceState.setLastAllowedPosition(socketId, { x, y, zoneId });

      // Clear any pending/denied request if player is in an allowed zone
      if (workspaceState.getZoneRequest(socketId)) {
        workspaceState.deleteZoneRequest(socketId);
      }

      return { moved: true, player, zoneId };
    } else {
      // Player attempting to enter unpermitted zone
      const existingReq = workspaceState.getZoneRequest(socketId);
      if (!existingReq || existingReq.status === 'denied') {
        workspaceState.setZoneRequest(socketId, zoneId, 'pending');
      }

      return { moved: false, player, zoneId, pendingPermission: true };
    }
  }
}
