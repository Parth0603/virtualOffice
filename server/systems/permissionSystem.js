import { workspaceState } from '../state/workspaceState.js';
import { playerState } from '../state/playerState.js';

export class PermissionSystem {
  static canAccessZone(player, zoneId) {
    if (!player) return false;
    if (player.role === 'host') return true;
    if (zoneId === 1) return true; // Common zone is always open
    return Boolean(player.permissions && player.permissions[zoneId]);
  }

  static handleResponse(hostSocketId, { userId, zoneId, approved }) {
    if (!workspaceState.isHost(hostSocketId)) return false;
    const targetPlayer = playerState.getPlayer(userId);
    if (!targetPlayer) return false;

    if (approved) {
      playerState.setPermission(userId, zoneId, true);
      workspaceState.deleteZoneRequest(userId);
    } else {
      workspaceState.setZoneRequest(userId, zoneId, 'denied');
      const lastPos = workspaceState.getLastAllowedPosition(userId);
      if (lastPos) {
        playerState.updatePosition(userId, lastPos.x, lastPos.y, lastPos.zoneId);
      }

      // Auto-clear denial notification after 2 seconds
      setTimeout(() => {
        const req = workspaceState.getZoneRequest(userId);
        if (req && req.status === 'denied') {
          workspaceState.deleteZoneRequest(userId);
        }
      }, 2000);
    }

    return true;
  }
}
