import { workspaceManager } from '../state/WorkspaceManager.js';
import { PermissionSystem } from '../systems/permissionSystem.js';
import { ZoneSystem } from '../systems/zoneSystem.js';

export function broadcastState(io, workspaceId) {
  const workspace = workspaceManager.getWorkspace(workspaceId);
  if (!workspace) return;
  io.to(workspaceId).emit('updateState', {
    players: workspace.getPlayersMap(),
    zoneRoster: ZoneSystem.getRosters(workspace),
    hostId: workspace.getHostId(),
    zoneRequests: workspace.getAllZoneRequests()
  });
}

export function registerZoneEvents(socket, io) {
  socket.on('submitMap', (data) => {
    if (!socket.workspaceId) return;
    const workspace = workspaceManager.getWorkspace(socket.workspaceId);
    if (!workspace) return;
    
    if (!data || !Array.isArray(data.map) || !Array.isArray(data.zoneColors)) return;
    // We allow setting the map if we don't have one, or maybe the host can update it
    workspace.setMap(data.map, data.zoneColors, socket.id);
    io.to(socket.workspaceId).emit('mapData', workspace.getMapData());
  });

  socket.on('zonePermissionResponse', ({ userId, zoneId, approved }) => {
    if (!socket.workspaceId) return;
    const workspace = workspaceManager.getWorkspace(socket.workspaceId);
    if (!workspace) return;

    const success = PermissionSystem.handleResponse(workspace, socket.id, { userId, zoneId, approved });
    if (success) {
      broadcastState(io, socket.workspaceId);
    }
  });
}
