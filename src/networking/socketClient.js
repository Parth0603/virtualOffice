import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      // In dev, frontend connects to backend on port 4001 if not on same origin
      const targetUrl = window.location.port === '4000'
        ? `http://${window.location.hostname}:4001`
        : window.location.origin;

      this.socket = io(targetUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5
      });
    }
    return this.socket;
  }

  getSocket() {
    return this.socket || this.connect();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketClient = new SocketClient();
