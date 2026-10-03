import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      // In production/deployment, use VITE_BACKEND_URL if specified, otherwise dev fallback or origin
      const targetUrl = import.meta.env.VITE_BACKEND_URL
        || (window.location.port === '4000'
          ? `http://${window.location.hostname}:4002`
          : window.location.origin);

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
