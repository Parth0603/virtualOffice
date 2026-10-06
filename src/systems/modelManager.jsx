import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';

// ============================================================================
// 1. ASSET INVENTORY & CONFIGURATION
// ============================================================================
export const MODEL_ASSETS = {
  officeChair: '/3dModels/office_chair.glb',
  gamingChair: '/3dModels/gaming_chair.glb',
  doctorsChair: '/3dModels/doctors_chair.glb',
  dublinChair: '/3dModels/dublin_chair.glb',
  basketChair: '/3dModels/basket_swing_chair.glb',
  smallMeeting: '/3dModels/sm_chair_table.glb',
  longSofa: '/3dModels/sofa_-_long_sofa.glb',
  sofaChair: '/3dModels/sofa_chair.glb',
  ledScreen: '/3dModels/screen_led.glb'
};

// ============================================================================
// 2. CENTRALIZED ASSET CACHE & LOADER
// ============================================================================
class ModelAssetLoader {
  constructor() {
    this.loader = new GLTFLoader();
    this.cache = new Map(); // url -> Promise<THREE.Group>
    this.scenes = new Map(); // url -> THREE.Group
  }

  load(url) {
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    const loadPromise = new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          const scene = gltf.scene || gltf.scenes[0];
          // Pre-process materials and geometries for optimal WebGL performance
          scene.traverse((child) => {
            if (child.isMesh) {
              child.frustumCulled = true;
              if (child.material) {
                // Ensure correct depth testing and encoding
                child.material.depthWrite = true;
                if (child.material.map) {
                  child.material.map.colorSpace = THREE.SRGBColorSpace;
                }
              }
            }
          });
          this.scenes.set(url, scene);
          resolve(scene);
        },
        undefined,
        (err) => {
          console.warn(`[ModelAssetLoader] Failed to load ${url}:`, err);
          reject(err);
        }
      );
    });

    this.cache.set(url, loadPromise);
    return loadPromise;
  }

  getLoadedScene(url) {
    return this.scenes.get(url) || null;
  }

  cloneModel(url, { castShadow = false, receiveShadow = false } = {}) {
    const original = this.scenes.get(url);
    if (!original) return null;

    // Fast hierarchy clone sharing geometries and materials
    const cloned = SkeletonUtils.clone(original);
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.frustumCulled = true;
        child.castShadow = castShadow;
        child.receiveShadow = receiveShadow;
      }
    });
    return cloned;
  }

  preloadAll() {
    Object.values(MODEL_ASSETS).forEach((url) => {
      this.load(url).catch(() => {});
    });
  }
}

export const modelAssetLoader = new ModelAssetLoader();

// Auto-trigger preload in browser environment
if (typeof window !== 'undefined') {
  modelAssetLoader.preloadAll();
}

// ============================================================================
// 3. REACT HOOK FOR REUSING CLONED ASSETS
// ============================================================================
export function useModelAsset(url, options = {}) {
  const [model, setModel] = useState(() => modelAssetLoader.cloneModel(url, options));

  useEffect(() => {
    let isMounted = true;
    if (!modelAssetLoader.getLoadedScene(url)) {
      modelAssetLoader.load(url).then(() => {
        if (isMounted) {
          setModel(modelAssetLoader.cloneModel(url, options));
        }
      }).catch((err) => {
        console.warn(`Failed loading model for ${url}`, err);
      });
    } else if (!model) {
      setModel(modelAssetLoader.cloneModel(url, options));
    }

    return () => {
      isMounted = false;
    };
  }, [url]);

  return model;
}

// ============================================================================
// 4. NORMALIZED 3D MODEL COMPONENTS WITH PRECISE HUMAN SCALE & GROUNDING
// ============================================================================

/**
 * 1. Standard Office Chair (office_chair.glb)
 * Raw bounds: [0.725, 1.160, 0.713], min Y: -0.045
 * Scale 13.5 -> Height: 15.66 units, Seat Height: ~7.2 units, Width: 9.79 units
 * Naturally faces +Z (South).
 */
export function OfficeChairModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true }) {
  const cloned = useModelAsset(MODEL_ASSETS.officeChair, { castShadow, receiveShadow: false });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group position={[0, 0.85, 0]} scale={[18.9, 18.9, 18.9]}>
          <primitive object={cloned} />
        </group>
      )}
    </group>
  );
}

/**
 * 2. Gaming / Developer Focus Chair (gaming_chair.glb)
 * Raw bounds: [0.600, 1.113, 0.634], min Y: -0.008
 * Scale 13.5 -> Height: 15.0 units, Seat Height: ~6.2 units, Width: 8.1 units
 * Naturally faces +Z (South).
 */
export function GamingChairModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true }) {
  const cloned = useModelAsset(MODEL_ASSETS.gamingChair, { castShadow, receiveShadow: false });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group position={[0, 0.15, 0]} scale={[18.9, 18.9, 18.9]}>
          <primitive object={cloned} />
        </group>
      )}
    </group>
  );
}

/**
 * 3. Doctors / Large Executive Chair (doctors_chair.glb)
 * Raw bounds: [462.63, 537.22, 448.63], center: [-108.96, 274.14, -103.07], min Y: 5.54
 * Scale 0.034 -> Height: 18.26 units, Width: 15.73 units, Backrest Height: 18.3 units
 * Model naturally faces +X and is offset from origin.
 * Center translation + rotation to face +Z.
 */
export function DoctorsChairModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true }) {
  const cloned = useModelAsset(MODEL_ASSETS.doctorsChair, { castShadow, receiveShadow: false });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group rotation={[0, -Math.PI / 2, 0]}>
          <group position={[5.18, -0.27, 4.90]} scale={[0.0476, 0.0476, 0.0476]}>
            <primitive object={cloned} />
          </group>
        </group>
      )}
    </group>
  );
}

/**
 * 4. Dublin Lounge Chair (dublin_chair.glb)
 * Contains white and dark leather variants.
 * We isolate the dark leather armchair, center its pivot and ground it at Y=0.
 * Scale 0.19 -> Height: 16.39 units, Width: 19.05 units, Depth: 18.41 units
 * Normalized to face +Z (South).
 */
export function DublinChairModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true, variant = 'dark' }) {
  const cloned = useModelAsset(MODEL_ASSETS.dublinChair, { castShadow, receiveShadow: false });

  // Hide the opposing variant meshes so a clean, single armchair renders
  useEffect(() => {
    if (!cloned) return;
    cloned.traverse((child) => {
      if (child.isMesh) {
        if (variant === 'dark') {
          if (child.name.includes('white') || child.name === 'legs_metal_Leg_0') {
            child.visible = false;
          } else {
            child.visible = true;
          }
        } else {
          if (child.name.includes('dark') || child.name === 'legs001_metal_Leg_0') {
            child.visible = false;
          } else {
            child.visible = true;
          }
        }
      }
    });
  }, [cloned, variant]);

  // Transform offsets to center the selected chair at [0, 0, 0] (scaled 40% up)
  const centerOffset = variant === 'dark'
    ? [45.75 * 0.266, 0.14, -51.03 * 0.266]
    : [-61.71 * 0.266, 0.14, 32.39 * 0.266];
  const internalRot = variant === 'dark' ? Math.PI : 0;

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group rotation={[0, internalRot, 0]}>
          <group position={centerOffset} scale={[0.266, 0.266, 0.266]}>
            <primitive object={cloned} />
          </group>
        </group>
      )}
    </group>
  );
}

/**
 * 5. Basket Swing Chair (basket_swing_chair.glb)
 * Raw bounds: [2.093, 2.737, 2.092], min Y: -0.047
 * Scale 9.0 -> Height: 24.6 units, Footprint: 18.8 units
 * Model naturally faces -X. Rotation [0, -Math.PI / 2, 0] aligns opening to face +Z.
 */
export function BasketSwingChairModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true }) {
  const cloned = useModelAsset(MODEL_ASSETS.basketChair, { castShadow, receiveShadow: false });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group rotation={[0, -Math.PI / 2, 0]}>
          <group position={[0, 0.59, 0]} scale={[12.6, 12.6, 12.6]}>
            <primitive object={cloned} />
          </group>
        </group>
      )}
    </group>
  );
}

/**
 * 6. Small Meeting Table Set (sm_chair_table.glb)
 * Table with 4 surrounding chairs.
 * Scale 17.5 -> Chair Height: 15.77 units (matches office chairs), Seat Width: 8.05 units, Table Height: 13.28 units
 */
export function SmallMeetingTableModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true }) {
  const cloned = useModelAsset(MODEL_ASSETS.smallMeeting, { castShadow, receiveShadow: true });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group position={[-0.17, 0, -1.13]} scale={[24.5, 24.5, 24.5]}>
          <primitive object={cloned} />
        </group>
      )}
    </group>
  );
}

/**
 * 7. Long Lounge Sofa (sofa_-_long_sofa.glb)
 * Raw bounds: X: 3.47, Y: 2.77, Z: 7.43 (runs along Z, faces +X)
 * Scale 6.8 -> Length: 50.5 units, Depth: 23.6 units, Height: 18.84 units
 * When rotation=[0, 0, 0], model runs along X and faces +Z (South).
 */
export function LongSofaModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true }) {
  const cloned = useModelAsset(MODEL_ASSETS.longSofa, { castShadow, receiveShadow: true });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group rotation={[0, -Math.PI / 2, 0]}>
          <group position={[0, 0.05, 0]} scale={[7.6, 7.6, 7.6]}>
            <primitive object={cloned} />
          </group>
        </group>
      )}
    </group>
  );
}

/**
 * 8. Single Lounge Sofa Chair (sofa_chair.glb)
 * Raw bounds: [1.691, 1.436, 1.601], min Y: -0.373
 * Scale 12.5 -> Height: 17.95 units, Width: 21.1 units, Depth: 20.0 units
 * Ground offset 4.66 places feet flush with floor at Y=0.
 */
export function SofaChairModel({ position = [0, 0, 0], rotation = [0, 0, 0], castShadow = true }) {
  const cloned = useModelAsset(MODEL_ASSETS.sofaChair, { castShadow, receiveShadow: false });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group position={[0, 4.66, 0]} scale={[12.5, 12.5, 12.5]}>
          <primitive object={cloned} />
        </group>
      )}
    </group>
  );
}

/**
 * 9. LED Presentation Screen (screen_led.glb)
 * Raw bounds: [8.947, 5.076, 0.224]
 * Scale 5.8 -> Width: 51.9 units, Height: 29.4 units, Depth: 1.3 units
 * Screen display faces +Z. Center Y at wall height ~22.
 */
export function LedScreenModel({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const cloned = useModelAsset(MODEL_ASSETS.ledScreen, { castShadow: false, receiveShadow: false });

  return (
    <group position={position} rotation={rotation}>
      {cloned && (
        <group position={[0, 0.54, 0]} scale={[5.8, 5.8, 5.8]}>
          <primitive object={cloned} />
        </group>
      )}
    </group>
  );
}
