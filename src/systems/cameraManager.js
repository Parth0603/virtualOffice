import { useState, useEffect } from 'react';
import { cameraControls } from './cameraControls.js';

let currentMode = 'THIRD_PERSON'; // 'THIRD_PERSON' | 'FIRST_PERSON'
const modeListeners = new Set();

function notifyModeChange() {
  modeListeners.forEach((fn) => fn(currentMode));
}

export const CameraManager = {
  MODE_THIRD_PERSON: 'THIRD_PERSON',
  MODE_FIRST_PERSON: 'FIRST_PERSON',

  getMode() {
    return currentMode;
  },

  isFirstPerson() {
    return currentMode === 'FIRST_PERSON';
  },

  isThirdPerson() {
    return currentMode === 'THIRD_PERSON';
  },

  setMode(newMode) {
    if (newMode !== 'THIRD_PERSON' && newMode !== 'FIRST_PERSON') return;
    if (currentMode === newMode) return;
    currentMode = newMode;
    notifyModeChange();
  },

  toggleMode() {
    const next = currentMode === 'THIRD_PERSON' ? 'FIRST_PERSON' : 'THIRD_PERSON';
    this.setMode(next);
    return next;
  },

  subscribe(listener) {
    modeListeners.add(listener);
    return () => modeListeners.delete(listener);
  }
};

export function useCameraMode() {
  const [mode, setMode] = useState(CameraManager.getMode());

  useEffect(() => {
    return CameraManager.subscribe((newMode) => {
      setMode(newMode);
    });
  }, []);

  return mode;
}

