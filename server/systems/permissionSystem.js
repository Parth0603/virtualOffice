export class PermissionSystem {
  static canAccessZone(player, zoneId) {
    if (!player) return false;
    if (player.role === 'host') return true;
    if (zoneId === 1) return true; // Common zone is always open
    return Boolean(player.permissions && player.permissions[zoneId]);
  }

  static handleResponse(workspace, hostSocketId, { userId, zoneId, approved }) {
    if (!workspace.isHost(hostSocketId)) return false;
    const targetPlayer = workspace.getPlayer(userId);
    if (!targetPlayer) return false;

    if (approved) {
      workspace.setPermission(userId, zoneId, true);
      workspace.deleteZoneRequest(userId);
    } else {
      workspace.setZoneRequest(userId, zoneId, 'denied');
      const lastPos = workspace.getLastAllowedPosition(userId);
      if (lastPos) {
        workspace.updatePosition(userId, lastPos.x, lastPos.y, lastPos.zoneId);
      }

      // Auto-clear denial notification after 2 seconds
      setTimeout(() => {
        const req = workspace.getZoneRequest(userId);
        if (req && req.status === 'denied') {
          workspace.deleteZoneRequest(userId);
        }
      }, 2000);
    }

    return true;
  }
}
