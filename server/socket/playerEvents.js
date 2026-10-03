import { workspaceState } from '../state/workspaceState.js';
import { playerState } from '../state/playerState.js';
import { getSpawnPoint } from '../utils/zoneUtils.js';
import { sanitizePlayerInfo } from '../utils/validation.js';
import { MovementSystem } from '../systems/movementSystem.js';
import { broadcastState } from './zoneEvents.js';

export function registerPlayerEvents(socket, io) {
  socket.on('joinAfterMap', (playerInfo) => {
    const mapData = workspaceState.getMapData();
    if (!mapData) return;

    const spawn = getSpawnPoint(mapData.map);
    const sanitized = sanitizePlayerInfo(playerInfo);

    // If no host exists yet, assign first player as host
    let currentHost = workspaceState.getHostId();
    if (!currentHost || !playerState.getPlayer(currentHost)) {
      workspaceState.setHostId(socket.id);
      currentHost = socket.id;
    }
    const isHost = socket.id === currentHost;

    playerState.addPlayer(socket.id, {
      ...sanitized,
      x: spawn.x,
      y: spawn.y,
      zoneId: 1,
      role: isHost ? 'host' : 'user',
      permissions: isHost ? null : { 1: true }
    });

    workspaceState.setLastAllowedPosition(socket.id, {
      x: spawn.x,
      y: spawn.y,
      zoneId: 1
    });

    broadcastState(io);
  });

  socket.on('playerMove', ({ x, y, actionState, rotation }) => {
    const result = MovementSystem.handlePlayerMove(socket.id, { x, y });
    if (!result) return;

    if (result.moved) {
      if (actionState !== undefined) {
        result.player.actionState = actionState;
      }
      if (rotation !== undefined) {
        result.player.rotation = rotation;
      }
      // Broadcast compact delta to other clients to save bandwidth
      socket.broadcast.emit('playerMoved', {
        id: socket.id,
        x: result.player.x,
        y: result.player.y,
        zoneId: result.zoneId,
        actionState: result.player.actionState || 'standing',
        rotation: result.player.rotation
      });
      // Also broadcast state if a request was cleared or on zone change
      if (result.player.zoneId !== result.zoneId) {
        broadcastState(io);
      }
    } else if (result.pendingPermission) {
      // Permission request updated, notify host & user
      broadcastState(io);
    }
  });

  socket.on('disconnect', () => {
    if (workspaceState.isHost(socket.id)) {
      io.emit('meetingEnded', { reason: 'Host left the meeting' });
      workspaceState.reset();
      playerState.clear();
    } else {
      playerState.removePlayer(socket.id);
      workspaceState.deleteZoneRequest(socket.id);
      workspaceState.deleteLastAllowedPosition(socket.id);
      broadcastState(io);
    }
  });
}
