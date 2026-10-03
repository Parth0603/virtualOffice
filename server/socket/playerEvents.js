import { workspaceManager } from '../state/WorkspaceManager.js';
import { getSpawnPoint } from '../utils/zoneUtils.js';
import { sanitizePlayerInfo } from '../utils/validation.js';
import { MovementSystem } from '../systems/movementSystem.js';
import { broadcastState } from './zoneEvents.js';

export function registerPlayerEvents(socket, io) {
    // Check if workspace exists
  socket.on('checkWorkspace', ({ workspaceId }, callback) => {
    const exists = !!workspaceManager.getWorkspace(workspaceId);
    if (typeof callback === 'function') {
      callback({ exists });
    } else {
      socket.emit('workspaceCheckResult', { workspaceId, exists });
    }
  });

  // Client requests to join a specific workspace
  socket.on('joinWorkspace', ({ workspaceId, isCreator, playerInfo }) => {
    if (!workspaceId) return;
    
    // Leave previous workspace if any
    if (socket.workspaceId && socket.workspaceId !== workspaceId) {
      const prevWorkspace = workspaceManager.getWorkspace(socket.workspaceId);
      if (prevWorkspace) {
        prevWorkspace.removePlayer(socket.id);
        socket.leave(socket.workspaceId);
        broadcastState(io, socket.workspaceId);
      }
    }

    let workspace = workspaceManager.getWorkspace(workspaceId);
    if (!workspace) {
      if (isCreator) {
        workspace = workspaceManager.createWorkspace(workspaceId, socket.id);
      } else {
        socket.emit('workspaceError', { message: 'Workspace does not exist or has expired.' });
        return;
      }
    }
    
    socket.join(workspaceId);
    socket.workspaceId = workspaceId;

    // Send map immediately upon joining
    socket.emit('mapData', workspace.getMapData());

    const mapData = workspace.getMapData();
    const spawn = getSpawnPoint(mapData.map);
    const sanitized = sanitizePlayerInfo(playerInfo);

    // Host assignment
    let currentHost = workspace.getHostId();
    if (!currentHost || !workspace.hasPlayer(currentHost)) {
      workspace.setHostId(socket.id);
      currentHost = socket.id;
    }
    const isHost = socket.id === currentHost;

    workspace.addPlayer(socket.id, {
      ...sanitized,
      x: spawn.x,
      y: spawn.y,
      zoneId: 1,
      role: isHost ? 'host' : 'user',
      permissions: isHost ? null : { 1: true }
    });

    workspace.setLastAllowedPosition(socket.id, {
      x: spawn.x,
      y: spawn.y,
      zoneId: 1
    });

    socket.emit('joinSuccess', { workspaceId, role: isHost ? 'host' : 'user' });

    broadcastState(io, workspaceId);
  });

  socket.on('playerMove', ({ x, y, actionState, rotation }) => {
    if (!socket.workspaceId) return;
    const workspace = workspaceManager.getWorkspace(socket.workspaceId);
    if (!workspace) return;

    const result = MovementSystem.handlePlayerMove(workspace, socket.id, { x, y });
    if (!result) return;

    if (result.moved) {
      if (actionState !== undefined) {
        result.player.actionState = actionState;
      }
      if (rotation !== undefined) {
        result.player.rotation = rotation;
      }
      
      // Broadcast compact delta to the room
      socket.to(socket.workspaceId).emit('playerMoved', {
        id: socket.id,
        x: result.player.x,
        y: result.player.y,
        zoneId: result.zoneId,
        actionState: result.player.actionState || 'standing',
        rotation: result.player.rotation
      });
      
      // Also broadcast state if a request was cleared or on zone change
      if (result.player.zoneId !== result.zoneId) {
        broadcastState(io, socket.workspaceId);
      }
    } else if (result.pendingPermission) {
      // Permission request updated, notify host & user
      broadcastState(io, socket.workspaceId);
    }
  });

  socket.on('disconnect', () => {
    if (!socket.workspaceId) return;
    const workspace = workspaceManager.getWorkspace(socket.workspaceId);
    if (!workspace) return;

    if (workspace.isHost(socket.id)) {
      workspace.removePlayer(socket.id);
      const newHost = workspace.reassignHostIfNeeded();
      
      if (!newHost) {
        // No players left, workspace manager will clean it up later or we can delete it now
      } else {
        broadcastState(io, socket.workspaceId);
      }
    } else {
      workspace.removePlayer(socket.id);
      workspace.deleteZoneRequest(socket.id);
      workspace.deleteLastAllowedPosition(socket.id);
      broadcastState(io, socket.workspaceId);
    }
  });
}
