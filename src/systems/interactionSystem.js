import { useState, useEffect } from 'react';

// Extensible Interactable Object representation
export class InteractableObject {
  constructor({
    id,
    type = 'chair',
    position = [0, 0, 0],
    chairPosition = null,
    rotation = [0, 0, 0],
    chairRotation = null,
    interactionRadius = 26,
    sitPosition = null,
    sitRotation = 0,
    exitPosition = null,
    standPosition = null,
    exitRotation = null,
    label = 'Press F to Sit',
    onInteract = null
  }) {
    this.id = id;
    this.type = type;
    this.position = chairPosition || position;
    this.chairPosition = this.position;
    this.rotation = chairRotation || rotation;
    this.chairRotation = this.rotation;
    this.interactionRadius = interactionRadius;
    this.sitPosition = sitPosition || [this.position[0], 2.8, this.position[2]];
    this.sitRotation = sitRotation !== undefined ? sitRotation : (this.rotation[1] || 0);

    // Default exit position placed 14 units in front of chair based on sitRotation
    const forwardX = -Math.sin(this.sitRotation);
    const forwardZ = -Math.cos(this.sitRotation);
    this.exitPosition = exitPosition || standPosition || [
      this.position[0] + forwardX * 14,
      0,
      this.position[2] + forwardZ * 14
    ];
    this.standPosition = this.exitPosition;
    this.exitRotation = exitRotation !== null && exitRotation !== undefined ? exitRotation : this.sitRotation;

    this.occupied = false;
    this.occupiedBy = null;
    this.label = label;
    this.onInteract = onInteract;
  }
}

// Global registry of all interactable objects in the workspace
class InteractionRegistry {
  constructor() {
    this.interactables = new Map();
  }

  register(item) {
    if (!item || !item.id) return;
    this.interactables.set(item.id, item);
  }

  unregister(id) {
    this.interactables.delete(id);
  }

  get(id) {
    return this.interactables.get(id);
  }

  getAll() {
    return Array.from(this.interactables.values());
  }

  findNearestChair(x, z, maxDist = 26) {
    let nearest = null;
    let minDist = maxDist;

    for (const item of this.interactables.values()) {
      if (item.type !== 'chair' || item.occupied) continue;

      const dx = x - item.position[0];
      const dz = z - item.position[2];
      const dist = Math.hypot(dx, dz);

      if (dist < minDist && dist <= item.interactionRadius) {
        minDist = dist;
        nearest = item;
      }
    }
    return nearest;
  }

  setOccupied(id, isOccupied, playerId = null) {
    const item = this.interactables.get(id);
    if (item) {
      item.occupied = isOccupied;
      item.occupiedBy = isOccupied ? playerId : null;
    }
  }

  clear() {
    this.interactables.clear();
  }
}

export const interactionRegistry = new InteractionRegistry();

// Reactive Interaction State Store for HUD Prompts & Controller State
let interactionState = {
  nearbyInteractable: null,
  isSitting: false,
  currentChair: null,
  actionState: 'standing'
};

const listeners = new Set();

function notify() {
  listeners.forEach(fn => fn(interactionState));
}

export const interactionStore = {
  getState: () => interactionState,

  setNearby: (interactable) => {
    if (interactionState.nearbyInteractable?.id === interactable?.id) return;
    interactionState = {
      ...interactionState,
      nearbyInteractable: interactable
    };
    notify();
  },

  sitDown: (chair) => {
    if (!chair) return;
    interactionRegistry.setOccupied(chair.id, true, 'local');
    interactionState = {
      ...interactionState,
      isSitting: true,
      currentChair: chair,
      nearbyInteractable: null,
      actionState: 'sitting'
    };
    notify();
  },

  standUp: () => {
    if (interactionState.currentChair) {
      interactionRegistry.setOccupied(interactionState.currentChair.id, false, null);
    }
    interactionState = {
      ...interactionState,
      isSitting: false,
      currentChair: null,
      actionState: 'standing'
    };
    notify();
  },

  subscribe: (fn) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }
};

export function useInteractionStore() {
  const [state, setState] = useState(interactionStore.getState());

  useEffect(() => {
    return interactionStore.subscribe(setState);
  }, []);

  return state;
}
