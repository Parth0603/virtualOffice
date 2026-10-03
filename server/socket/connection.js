import { workspaceState } from '../state/workspaceState.js';
import { registerPlayerEvents } from './playerEvents.js';
import { registerZoneEvents } from './zoneEvents.js';

export function setupSocketServer(io) {
  io.on('connection', (socket) => {
    // If map already exists, send it immediately to newly connected client
    const mapData = workspaceState.getMapData();
    if (mapData) {
      socket.emit('mapData', mapData);
    }

    registerZoneEvents(socket, io);
    registerPlayerEvents(socket, io);
  });
}
