import { precomputeCollisionGrid } from '../utils/zoneUtils.js';
import { DEFAULT_OFFICE_MAP, DEFAULT_ZONE_COLORS } from '../constants/defaultMap.js';

class WorkspaceState {
  constructor() {
    this.mapData = { map: DEFAULT_OFFICE_MAP, zoneColors: DEFAULT_ZONE_COLORS };
    this.collisionGrid = precomputeCollisionGrid(DEFAULT_OFFICE_MAP);
    this.hostId = null;
    this.zoneRequests = new Map();
    this.lastAllowedPositions = new Map();
  }

  setMap(map, zoneColors, hostSocketId) {
    this.mapData = { map, zoneColors };
    this.collisionGrid = precomputeCollisionGrid(map);
    if (hostSocketId) {
      this.hostId = hostSocketId;
    }
  }

  getMapData() {
    return this.mapData;
  }

  getCollisionGrid() {
    return this.collisionGrid;
  }

  getHostId() {
    return this.hostId;
  }

  setHostId(hostId) {
    this.hostId = hostId;
  }

  isHost(socketId) {
    return this.hostId === socketId;
  }

  setZoneRequest(userId, zoneId, status = 'pending') {
    this.zoneRequests.set(userId, { zoneId, status });
  }

  getZoneRequest(userId) {
    return this.zoneRequests.get(userId);
  }

  deleteZoneRequest(userId) {
    this.zoneRequests.delete(userId);
  }

  getAllZoneRequests() {
    const obj = {};
    for (const [userId, req] of this.zoneRequests.entries()) {
      obj[userId] = req;
    }
    return obj;
  }

  setLastAllowedPosition(userId, pos) {
    this.lastAllowedPositions.set(userId, { ...pos });
  }

  getLastAllowedPosition(userId) {
    return this.lastAllowedPositions.get(userId);
  }

  deleteLastAllowedPosition(userId) {
    this.lastAllowedPositions.delete(userId);
  }

  reset() {
    this.mapData = { map: DEFAULT_OFFICE_MAP, zoneColors: DEFAULT_ZONE_COLORS };
    this.collisionGrid = precomputeCollisionGrid(DEFAULT_OFFICE_MAP);
    this.hostId = null;
    this.zoneRequests.clear();
    this.lastAllowedPositions.clear();
  }
}

export const workspaceState = new WorkspaceState();
