import { precomputeCollisionGrid } from '../utils/zoneUtils.js';
import { DEFAULT_OFFICE_MAP, DEFAULT_ZONE_COLORS } from '../constants/defaultMap.js';

class Workspace {
  constructor(id, hostSocketId) {
    this.id = id;
    this.mapData = { map: DEFAULT_OFFICE_MAP, zoneColors: DEFAULT_ZONE_COLORS };
    this.collisionGrid = precomputeCollisionGrid(DEFAULT_OFFICE_MAP);
    this.hostId = hostSocketId || null;
    this.zoneRequests = new Map();
    this.lastAllowedPositions = new Map();
    this.players = new Map();
    this.lastActivity = Date.now();
  }

  touch() {
    this.lastActivity = Date.now();
  }

  // --- Map & Host ---
  setMap(map, zoneColors, hostSocketId) {
    this.mapData = { map, zoneColors };
    this.collisionGrid = precomputeCollisionGrid(map);
    if (hostSocketId) {
      this.hostId = hostSocketId;
    }
    this.touch();
  }

  getMapData() { return this.mapData; }
  getCollisionGrid() { return this.collisionGrid; }
  getHostId() { return this.hostId; }
  setHostId(hostId) { this.hostId = hostId; this.touch(); }
  isHost(socketId) { return this.hostId === socketId; }

  // --- Players ---
  addPlayer(id, playerData) {
    this.players.set(id, {
      id,
      name: playerData.name,
      color: playerData.color,
      style: playerData.style,
      hair: playerData.hair,
      x: playerData.x,
      y: playerData.y,
      zoneId: playerData.zoneId || 1,
      role: playerData.role || 'user',
      permissions: playerData.permissions || { 1: true },
      actionState: playerData.actionState || 'standing',
      rotation: playerData.rotation || 0,
      isMoving: false,
      lastMoveTimestamp: Date.now()
    });
    this.touch();
    return this.players.get(id);
  }
  getPlayer(id) { return this.players.get(id); }
  hasPlayer(id) { return this.players.has(id); }
  removePlayer(id) {
    const res = this.players.delete(id);
    this.touch();
    return res;
  }
  updatePosition(id, x, y, zoneId) {
    const player = this.players.get(id);
    if (!player) return null;
    player.x = x;
    player.y = y;
    if (zoneId !== undefined) {
      player.zoneId = zoneId;
    }
    player.lastMoveTimestamp = Date.now();
    this.touch();
    return player;
  }
  setPermission(id, zoneId, granted) {
    const player = this.players.get(id);
    if (!player) return;
    if (!player.permissions) player.permissions = { 1: true };
    if (granted) {
      player.permissions[zoneId] = true;
    } else {
      delete player.permissions[zoneId];
    }
    this.touch();
  }
  getPlayersMap() {
    const obj = {};
    for (const [id, player] of this.players.entries()) {
      obj[id] = player;
    }
    return obj;
  }
  getZoneRoster() {
    const roster = {};
    for (const player of this.players.values()) {
      if (!player.zoneId) continue;
      if (!roster[player.zoneId]) roster[player.zoneId] = [];
      roster[player.zoneId].push({
        id: player.id,
        name: player.name,
        color: player.color,
        style: player.style,
        hair: player.hair,
        role: player.role
      });
    }
    return roster;
  }
  getPlayerCount() { return this.players.size; }

  // --- Zone Requests ---
  setZoneRequest(userId, zoneId, status = 'pending') {
    this.zoneRequests.set(userId, { zoneId, status });
    this.touch();
  }
  getZoneRequest(userId) { return this.zoneRequests.get(userId); }
  deleteZoneRequest(userId) { 
    this.zoneRequests.delete(userId); 
    this.touch();
  }
  getAllZoneRequests() {
    const obj = {};
    for (const [userId, req] of this.zoneRequests.entries()) {
      obj[userId] = req;
    }
    return obj;
  }

  // --- Last Allowed Positions ---
  setLastAllowedPosition(userId, pos) {
    this.lastAllowedPositions.set(userId, { ...pos });
    this.touch();
  }
  getLastAllowedPosition(userId) { return this.lastAllowedPositions.get(userId); }
  deleteLastAllowedPosition(userId) { 
    this.lastAllowedPositions.delete(userId); 
    this.touch();
  }

  // --- Lifecycle ---
  reassignHostIfNeeded() {
    if (!this.players.has(this.hostId)) {
      if (this.players.size > 0) {
        // Assign next available player as host
        const nextPlayer = Array.from(this.players.values())[0];
        this.hostId = nextPlayer.id;
        nextPlayer.role = 'host';
        return this.hostId;
      } else {
        this.hostId = null;
      }
    }
    return null;
  }
}

class WorkspaceManager {
  constructor() {
    this.workspaces = new Map();
    // Clean up empty workspaces periodically
    setInterval(() => this.cleanupWorkspaces(), 1000 * 60 * 5); // every 5 minutes
  }

  createWorkspace(id, hostSocketId) {
    if (this.workspaces.has(id)) return this.workspaces.get(id);
    const workspace = new Workspace(id, hostSocketId);
    this.workspaces.set(id, workspace);
    return workspace;
  }

  getWorkspace(id) {
    return this.workspaces.get(id);
  }

  deleteWorkspace(id) {
    return this.workspaces.delete(id);
  }

  cleanupWorkspaces() {
    const now = Date.now();
    for (const [id, workspace] of this.workspaces.entries()) {
      const isIdle = (now - workspace.lastActivity) > 1000 * 60 * 60 * 24; // 24 hours
      if (workspace.getPlayerCount() === 0 && isIdle) {
        this.deleteWorkspace(id);
      }
    }
  }
}

export const workspaceManager = new WorkspaceManager();
