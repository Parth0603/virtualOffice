import { io } from 'socket.io-client';

export function getBackendUrl() {
  const url = import.meta.env.VITE_BACKEND_URL
    || (window.location.port === '4000' || window.location.port === '9333'
      ? `http://${window.location.hostname}:4001`
      : window.location.origin);
  return url.replace(/\/+$/, '');
}

class SocketClient {
  constructor() {
    this.socket = null;
  }

  connect() {
    if (!this.socket) {
      const targetUrl = getBackendUrl();

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
