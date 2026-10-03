import { workspaceState } from '../state/workspaceState.js';
import { PermissionSystem } from '../systems/permissionSystem.js';
import { playerState } from '../state/playerState.js';
import { ZoneSystem } from '../systems/zoneSystem.js';

export function broadcastState(io) {
  io.emit('updateState', {
    players: playerState.getPlayersMap(),
    zoneRoster: ZoneSystem.getRosters(),
    hostId: workspaceState.getHostId(),
    zoneRequests: workspaceState.getAllZoneRequests()
  });
}

export function registerZoneEvents(socket, io) {
  socket.on('submitMap', (data) => {
    if (!data || !Array.isArray(data.map) || !Array.isArray(data.zoneColors)) return;
    if (!workspaceState.getMapData()) {
      workspaceState.setMap(data.map, data.zoneColors, socket.id);
      io.emit('mapData', workspaceState.getMapData());
    }
  });

  socket.on('zonePermissionResponse', ({ userId, zoneId, approved }) => {
    const success = PermissionSystem.handleResponse(socket.id, { userId, zoneId, approved });
    if (success) {
      broadcastState(io);
    }
  });
}
