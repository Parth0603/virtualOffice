import { useEffect, useRef } from 'react';
import { CameraManager } from '../systems/cameraManager.js';

export function useKeyboardControls() {
  const keysRef = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    f: false,
    justPressedF: false
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent triggering game controls while typing in input fields
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keysRef.current[key] = true;
      }
      if (key === 'shift') {
        keysRef.current.shift = true;
      }
      if (key === 'c') {
        CameraManager.toggleMode();
      }
      if (key === 'f') {
        if (!keysRef.current.f) {
          keysRef.current.justPressedF = true;
        }
        keysRef.current.f = true;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd'].includes(key)) {
        keysRef.current[key] = false;
      }
      if (key === 'shift') {
        keysRef.current.shift = false;
      }
      if (key === 'f') {
        keysRef.current.f = false;
      }
    };

    const handleBlur = () => {
      keysRef.current = {
        w: false,
        a: false,
        s: false,
        d: false,
        shift: false,
        f: false,
        justPressedF: false
      };
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return keysRef;
}
