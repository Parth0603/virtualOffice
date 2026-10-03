import { useState, useEffect } from 'react';

// Central non-reactive store for high-frequency player entities (Three.js sync)
export const activePlayersMap = new Map();

let globalState = {
  stage: 'landing', // 'landing' | 'avatar' | 'map_editor' | 'workspace'
  workspaceId: null,
  isCreator: false,
  profile: {
    name: localStorage.getItem('playerName') || '',
    color: localStorage.getItem('playerColor') || '#3182ce',
    style: localStorage.getItem('playerStyle') || 'casual',
    hair: localStorage.getItem('playerHair') || 'short'
  },
  myId: null,
  hostId: null,
  myRole: 'user',
  mapData: null,
  zoneRoster: {},
  zoneRequests: {},
  isCameraLocked: true,
  meetingEnded: false,
  myCurrentZone: 1,
  remotePlayersVersion: 0 // Incremented only when players join/leave/re-perm, not per step
};

const listeners = new Set();

function notify() {
  listeners.forEach(fn => fn(globalState));
}

export const workspaceStore = {
  getState: () => globalState,
  
  setProfile: (profile) => {
    localStorage.setItem('playerName', profile.name);
    localStorage.setItem('playerColor', profile.color);
    localStorage.setItem('playerStyle', profile.style);
    localStorage.setItem('playerHair', profile.hair);
    globalState = { ...globalState, profile: { ...profile } };
    notify();
  },

  setStage: (stage) => {
    globalState = { ...globalState, stage };
    notify();
  },

  setWorkspaceId: (workspaceId) => {
    globalState = { ...globalState, workspaceId };
    notify();
  },

  setIsCreator: (isCreator) => {
    globalState = { ...globalState, isCreator };
    notify();
  },

  setMapData: (mapData) => {
    globalState = { ...globalState, mapData };
    notify();
  },

  setSyncState: (data) => {
    const { players = {}, zoneRoster = {}, hostId, zoneRequests = {} } = data;
    const myId = globalState.myId;
    const myPlayer = players[myId];
    const myRole = myPlayer ? myPlayer.role : (hostId === myId ? 'host' : 'user');
    const myCurrentZone = myPlayer ? myPlayer.zoneId : 1;

    // Update non-reactive activePlayersMap
    let playerListChanged = false;
    const currentKeys = new Set(Object.keys(players));
    
    // Remove disconnected
    for (const key of activePlayersMap.keys()) {
      if (!currentKeys.has(key)) {
        activePlayersMap.delete(key);
        playerListChanged = true;
      }
    }

    // Add or update metadata
    for (const [id, p] of Object.entries(players)) {
      if (!activePlayersMap.has(id)) {
        activePlayersMap.set(id, {
          ...p,
          targetX: p.x,
          targetY: p.y,
          currentX: p.x,
          currentY: p.y,
          isMoving: false
        });
        playerListChanged = true;
      } else {
        const existing = activePlayersMap.get(id);
        existing.targetX = p.x;
        existing.targetY = p.y;
        existing.zoneId = p.zoneId;
        existing.role = p.role;
        existing.permissions = p.permissions;
      }
    }

    globalState = {
      ...globalState,
      hostId,
      myRole,
      myCurrentZone,
      zoneRoster,
      zoneRequests,
      remotePlayersVersion: playerListChanged ? globalState.remotePlayersVersion + 1 : globalState.remotePlayersVersion
    };
    notify();
  },

  updateRemotePlayerPosition: ({ id, x, y, zoneId, actionState, rotation }) => {
    const player = activePlayersMap.get(id);
    if (player) {
      player.targetX = x;
      player.targetY = y;
      if (zoneId !== undefined) {
        player.zoneId = zoneId;
      }
      if (actionState !== undefined) {
        player.actionState = actionState;
      }
      if (rotation !== undefined) {
        player.rotation = rotation;
      }
    }
  },

  setMyId: (id) => {
    globalState = { ...globalState, myId: id };
    notify();
  },

  toggleCameraLock: () => {
    globalState = { ...globalState, isCameraLocked: !globalState.isCameraLocked };
    notify();
  },

  setMeetingEnded: (ended = true) => {
    globalState = { ...globalState, meetingEnded: ended };
    notify();
  },

  reset: () => {
    activePlayersMap.clear();
    globalState = {
      ...globalState,
      stage: 'avatar',
      myId: null,
      hostId: null,
      myRole: 'user',
      mapData: null,
      zoneRoster: {},
      zoneRequests: {},
      meetingEnded: false
    };
    notify();
  }
};

export function useWorkspaceStore() {
  const [state, setState] = useState(workspaceStore.getState());

  useEffect(() => {
    listeners.add(setState);
    return () => listeners.delete(setState);
  }, []);

  return state;
}
