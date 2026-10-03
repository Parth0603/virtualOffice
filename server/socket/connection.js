import { registerPlayerEvents } from './playerEvents.js';
import { registerZoneEvents } from './zoneEvents.js';

export function setupSocketServer(io) {
  io.on('connection', (socket) => {
    registerZoneEvents(socket, io);
    registerPlayerEvents(socket, io);
  });
}
