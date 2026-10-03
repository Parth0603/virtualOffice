import { NETWORK_TICK_INTERVAL } from '../constants/grid.js';

export class NetworkTick {
  constructor(emitFn) {
    this.emitFn = emitFn;
    this.lastEmitTime = 0;
    this.pendingMove = null;
    this.lastSentX = null;
    this.lastSentY = null;
  }

  queueMove(x, y) {
    this.pendingMove = { x, y };
  }

  update(now = performance.now()) {
    if (!this.pendingMove) return;

    if (now - this.lastEmitTime >= NETWORK_TICK_INTERVAL) {
      const { x, y } = this.pendingMove;
      // Only emit if position actually changed from last sent
      if (Math.abs(x - this.lastSentX) > 0.1 || Math.abs(y - this.lastSentY) > 0.1) {
        this.emitFn(x, y);
        this.lastSentX = x;
        this.lastSentY = y;
        this.lastEmitTime = now;
      }
    }
  }

  forceImmediate(x, y) {
    this.emitFn(x, y);
    this.lastSentX = x;
    this.lastSentY = y;
    this.lastEmitTime = performance.now();
    this.pendingMove = null;
  }
}
