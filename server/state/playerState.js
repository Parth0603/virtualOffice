class PlayerState {
  constructor() {
    this.players = new Map();
  }

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
      isMoving: false,
      lastMoveTimestamp: Date.now()
    });
    return this.players.get(id);
  }

  getPlayer(id) {
    return this.players.get(id);
  }

  hasPlayer(id) {
    return this.players.has(id);
  }

  removePlayer(id) {
    return this.players.delete(id);
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

  count() {
    return this.players.size;
  }

  clear() {
    this.players.clear();
  }
}

export const playerState = new PlayerState();
