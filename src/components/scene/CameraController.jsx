import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraControls } from '../../systems/cameraControls.js';
import { CameraManager, useCameraMode } from '../../systems/cameraManager.js';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';
import { useInteractionStore } from '../../systems/interactionSystem.js';
import { CollisionSystem } from '../../systems/collision.js';
import { TILE_SIZE, COLS, ROWS } from '../../constants/grid.js';

// Pre-allocated vectors to prevent per-frame garbage collection
const vTarget = new THREE.Vector3();
const vEyePos = new THREE.Vector3();
const v3rdPos = new THREE.Vector3();
const vIdealPos = new THREE.Vector3();
const vLookAt3rd = new THREE.Vector3();
const vLookAt1st = new THREE.Vector3();
const vFinalLookAt = new THREE.Vector3();

export function CameraController({ localPlayerRef }) {
  const { camera, gl } = useThree();
  const { mapData } = useWorkspaceStore();
  const { isSitting, currentChair } = useInteractionStore();
  const cameraMode = useCameraMode();
  const isFirstPerson = cameraMode === 'FIRST_PERSON';

  useEffect(() => {
    window.__CAMERA_CONTROLS__ = cameraControls;
  }, []);

  const cameraTargetRef = useRef(new THREE.Vector3(80, 16, 80));
  const initializedTargetRef = useRef(false);
  const actualDistanceRef = useRef(cameraControls.distance);
  const modeBlendRef = useRef(isFirstPerson ? 1.0 : 0.0);
  const prevModeRef = useRef(cameraMode);
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // On mode change while sitting, if switching to 3rd person, align yaw behind chair
  useEffect(() => {
    if (prevModeRef.current !== cameraMode) {
      if (cameraMode === 'THIRD_PERSON' && isSitting && currentChair) {
        // Position camera behind chair facing forward
        cameraControls.targetYaw = currentChair.sitRotation;
        cameraControls.targetPitch = 0.28;
      }
      prevModeRef.current = cameraMode;
    }
  }, [cameraMode, isSitting, currentChair]);

  useEffect(() => {
    const dom = gl.domElement;

    const handlePointerLockChange = () => {
      cameraControls.isPointerLocked = document.pointerLockElement === dom;
    };

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (document.pointerLockElement === dom) {
        const sensitivity = 0.0028;
        cameraControls.targetYaw -= e.movementX * sensitivity;
        cameraControls.targetPitch += e.movementY * sensitivity;
        return;
      }

      if (isDraggingRef.current) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        lastMousePos.current = { x: e.clientX, y: e.clientY };

        const sensitivity = 0.0035;
        cameraControls.targetYaw -= dx * sensitivity;
        cameraControls.targetPitch += dy * sensitivity;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      // Scroll zoom in third person (or transitioning to third person)
      if (CameraManager.isThirdPerson() || modeBlendRef.current < 0.8) {
        const zoomFactor = 0.16;
        cameraControls.targetDistance = Math.max(35, Math.min(220, cameraControls.targetDistance + e.deltaY * zoomFactor));
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleClick = (e) => {
      // Only request pointer lock when clicking directly on the 3D canvas,
      // not when the user is clicking on overlay UI buttons
      if (e.target !== dom) return;
      if (!cameraControls.isPointerLocked && dom.requestPointerLock) {
        dom.requestPointerLock();
      }
    };

    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('contextmenu', handleContextMenu);
    dom.addEventListener('click', handleClick);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('contextmenu', handleContextMenu);
      dom.removeEventListener('click', handleClick);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, [gl.domElement]);

  useFrame((state, delta) => {
    const playerGroup = localPlayerRef.current;
    if (!playerGroup) return;

    const dt = Math.min(delta, 0.08);

    // ------------------------------------------------------------------------
    // 1. GLOBAL FIRST-PERSON VS THIRD-PERSON SMOOTH TRANSITION
    // ------------------------------------------------------------------------
    const targetModeBlend = isFirstPerson ? 1.0 : 0.0;
    modeBlendRef.current += (targetModeBlend - modeBlendRef.current) * Math.min(1.0, 8.5 * dt);
    const blend = modeBlendRef.current;

    // ------------------------------------------------------------------------
    // 2. HEAD ROTATION / PITCH CLAMPING CONSTRAINTS
    // ------------------------------------------------------------------------
    if (isSitting && currentChair) {
      if (isFirstPerson) {
        // Seated neck rotation limits (realistic look cone ±75 degrees from chair facing direction)
        const baseYaw = currentChair.sitRotation;
        let yawOffset = cameraControls.targetYaw - baseYaw;
        while (yawOffset < -Math.PI) yawOffset += Math.PI * 2;
        while (yawOffset > Math.PI) yawOffset -= Math.PI * 2;

        const maxNeckYaw = 1.3; // ~75 degrees
        yawOffset = Math.max(-maxNeckYaw, Math.min(maxNeckYaw, yawOffset));
        cameraControls.targetYaw = baseYaw + yawOffset;

        // Seated vertical pitch limits (-20° to +25°)
        cameraControls.targetPitch = Math.max(-0.35, Math.min(0.38, cameraControls.targetPitch));
      } else {
        // Seated third-person mode: allow orbit around seated avatar with comfortable height pitch
        cameraControls.targetPitch = Math.max(0.12, Math.min(0.55, cameraControls.targetPitch));
      }
    } else {
      if (isFirstPerson) {
        // Standing first-person: full 360 yaw freedom, realistic vertical look range (-70° to +70°)
        cameraControls.targetPitch = Math.max(-1.2, Math.min(1.2, cameraControls.targetPitch));
      } else {
        // Standing third-person: orbit camera above ground
        cameraControls.targetPitch = Math.max(0.08, Math.min(Math.PI / 2 - 0.1, cameraControls.targetPitch));
      }
    }

    // ------------------------------------------------------------------------
    // 3. TARGET POSITION TRACKING
    // ------------------------------------------------------------------------
    const map = mapData?.map;
    const numCols = (map && map[0] && map[0].length) || COLS;
    const numRows = (map && map.length) || ROWS;
    const minBoundX = TILE_SIZE * 0.5;
    const maxBoundX = (numCols - 0.5) * TILE_SIZE;
    const minBoundZ = TILE_SIZE * 0.5;
    const maxBoundZ = (numRows - 0.5) * TILE_SIZE;

    const clampedX = Math.max(minBoundX, Math.min(maxBoundX, playerGroup.position.x));
    const clampedZ = Math.max(minBoundZ, Math.min(maxBoundZ, playerGroup.position.z));

    if (isSitting && currentChair) {
      vTarget.set(
        currentChair.sitPosition[0],
        currentChair.sitPosition[1] + 22,  // torso/chest level above group root
        currentChair.sitPosition[2]
      );
    } else {
      vTarget.set(clampedX, 16, clampedZ);
    }

    if (!initializedTargetRef.current && (playerGroup.position.x !== 0 || playerGroup.position.z !== 0)) {
      cameraTargetRef.current.copy(vTarget);
      initializedTargetRef.current = true;
    } else {
      cameraTargetRef.current.lerp(vTarget, Math.min(1.0, 9.0 * dt));
    }

    // Smooth camera distance, pitch, and yaw damping
    // Allow full zoom in / zoom out freedom whether standing or seated
    const targetDist = cameraControls.targetDistance;

    cameraControls.distance += (targetDist - cameraControls.distance) * Math.min(1.0, 10.0 * dt);
    cameraControls.pitch += (cameraControls.targetPitch - cameraControls.pitch) * Math.min(1.0, 14.0 * dt);
    cameraControls.yaw += (cameraControls.targetYaw - cameraControls.yaw) * Math.min(1.0, 14.0 * dt);

    const d = cameraControls.distance;
    const p = cameraControls.pitch;
    const y = cameraControls.yaw;

    // Ray direction from target to camera (3rd person orbit)
    const dirX = Math.sin(y) * Math.cos(p);
    const dirY = Math.sin(p);
    const dirZ = Math.cos(y) * Math.cos(p);

    // ------------------------------------------------------------------------
    // 4. THIRD-PERSON OBSTACLE & WALL COLLISION CLEARANCE
    // ------------------------------------------------------------------------
    let maxClearDistance = d;

    if (blend < 0.8) {
      const originX = cameraTargetRef.current.x;
      const originY = cameraTargetRef.current.y + 6;
      const originZ = cameraTargetRef.current.z;

      const stepSize = 4.0;
      const numSteps = Math.floor(d / stepSize);

      for (let i = 2; i <= numSteps; i++) {
        const testDist = i * stepSize;
        const testX = originX + dirX * testDist;
        const testY = originY + dirY * testDist;
        const testZ = originZ + dirZ * testDist;

        // Check map boundary walls
        if (map && map.length > 0 && testY < 58.8) {
          const rows = map.length;
          const cols = map[0].length;
          const col = Math.floor(testX / TILE_SIZE);
          const row = Math.floor(testZ / TILE_SIZE);

          if (row < 0 || row >= rows || col < 0 || col >= cols || map[row][col] === 0) {
            maxClearDistance = Math.min(maxClearDistance, Math.max(16, testDist - 5));
            break;
          }
        }

        // Check furniture obstacles (only if ray height is at or below furniture top level <= 20)
        if (testY <= 20 && CollisionSystem.obstacles && CollisionSystem.obstacles.length > 0) {
          let hitFurniture = false;
          for (const obs of CollisionSystem.obstacles) {
            // Ignore current chair's immediate parent if sitting to allow close viewing
            if (testX >= obs.minX && testX <= obs.maxX && testZ >= obs.minZ && testZ <= obs.maxZ) {
              maxClearDistance = Math.min(maxClearDistance, Math.max(16, testDist - 6));
              hitFurniture = true;
              break;
            }
          }
          if (hitFurniture) break;
        }
      }
    }

    actualDistanceRef.current += (maxClearDistance - actualDistanceRef.current) * Math.min(1.0, 16.0 * dt);

    // ------------------------------------------------------------------------
    // 5. FIRST PERSON EYE POSITION
    // ------------------------------------------------------------------------
    if (isSitting && currentChair) {
      // Chair sit position + seated eye height + forward along sit facing direction
      const sitRot = currentChair.sitRotation;
      const fx = -Math.sin(sitRot);
      const fz = -Math.cos(sitRot);
      vEyePos.set(
        currentChair.sitPosition[0] + fx * 1.8,
        currentChair.sitPosition[1] + 30,  // head/eye level above group root
        currentChair.sitPosition[2] + fz * 1.8
      );
    } else {
      // Standing player position + standing eye height + forward along view yaw
      const fx = -Math.sin(y);
      const fz = -Math.cos(y);
      vEyePos.set(
        playerGroup.position.x + fx * 2.2,
        playerGroup.position.y + 30.5,
        playerGroup.position.z + fz * 2.2
      );
    }

    // ------------------------------------------------------------------------
    // 6. THIRD PERSON POSITION & LOOKAT
    // ------------------------------------------------------------------------
    const headHeightOffset = 8 * (1 - blend);
    v3rdPos.set(
      cameraTargetRef.current.x + actualDistanceRef.current * dirX,
      cameraTargetRef.current.y + headHeightOffset + actualDistanceRef.current * dirY,
      cameraTargetRef.current.z + actualDistanceRef.current * dirZ
    );

    vLookAt3rd.set(
      cameraTargetRef.current.x,
      cameraTargetRef.current.y + 8,
      cameraTargetRef.current.z
    );

    // ------------------------------------------------------------------------
    // 7. FIRST PERSON LOOKAT TARGET
    // ------------------------------------------------------------------------
    const forwardLookX = -Math.sin(y) * Math.cos(p);
    const forwardLookY = -Math.sin(p);
    const forwardLookZ = -Math.cos(y) * Math.cos(p);

    vLookAt1st.set(
      vEyePos.x + forwardLookX * 100,
      vEyePos.y + forwardLookY * 100,
      vEyePos.z + forwardLookZ * 100
    );

    // ------------------------------------------------------------------------
    // 8. SMOOTH LERP TRANSITION BETWEEN THIRD PERSON & FIRST PERSON
    // ------------------------------------------------------------------------
    vIdealPos.lerpVectors(v3rdPos, vEyePos, blend);

    // When fully in first-person mode (blend > 0.98), lock camera directly to eye position
    // with 0 lag so running/sprinting never causes the body to clip into the camera!
    if (blend > 0.98) {
      camera.position.copy(vIdealPos);
    } else {
      camera.position.lerp(vIdealPos, Math.min(1.0, 16.0 * dt));
    }

    vFinalLookAt.lerpVectors(vLookAt3rd, vLookAt1st, blend);
    camera.lookAt(vFinalLookAt.x, vFinalLookAt.y, vFinalLookAt.z);
  });

  return null;
}
