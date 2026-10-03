import { getZoneIdAt, isPositionWalkable } from '../utils/zoneUtils.js';
import { isValidCoordinate } from '../utils/validation.js';
import { PermissionSystem } from './permissionSystem.js';

export class MovementSystem {
  static handlePlayerMove(workspace, socketId, { x, y }) {
    if (!isValidCoordinate(x) || !isValidCoordinate(y)) return null;

    const mapData = workspace.getMapData();
    const collisionGrid = workspace.getCollisionGrid();
    if (!mapData || !collisionGrid) return null;

    const player = workspace.getPlayer(socketId);
    if (!player) return null;

    // Check collision against walls / grid bounds
    if (!isPositionWalkable(collisionGrid, x, y, 12)) {
      return null;
    }

    const zoneId = getZoneIdAt(mapData.map, x, y);
    if (zoneId === null || zoneId === 0) return null;

    // Check permissions
    if (PermissionSystem.canAccessZone(player, zoneId)) {
      workspace.updatePosition(socketId, x, y, zoneId);
      workspace.setLastAllowedPosition(socketId, { x, y, zoneId });

      // Clear any pending/denied request if player is in an allowed zone
      if (workspace.getZoneRequest(socketId)) {
        workspace.deleteZoneRequest(socketId);
      }

      return { moved: true, player, zoneId };
    } else {
      // Player attempting to enter unpermitted zone
      const existingReq = workspace.getZoneRequest(socketId);
      if (!existingReq || existingReq.status === 'denied') {
        workspace.setZoneRequest(socketId, zoneId, 'pending');
      }

      return { moved: false, player, zoneId, pendingPermission: true };
    }
  }
}
