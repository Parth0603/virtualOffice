import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { AvatarMesh } from './AvatarMesh.jsx';
import { PlayerNameplate } from './PlayerNameplate.jsx';
import { useKeyboardControls } from '../../hooks/useKeyboardControls.js';
import { CollisionSystem } from '../../systems/collision.js';
import { AnimationSystem } from '../../systems/animation.js';
import { NetworkTick } from '../../networking/networkTick.js';
import { socketClient } from '../../networking/socketClient.js';
import { cameraControls } from '../../systems/cameraControls.js';
import { CameraManager, useCameraMode } from '../../systems/cameraManager.js';
import { useWorkspaceStore } from '../../state/useWorkspaceStore.js';
import { PLAYER_RADIUS } from '../../constants/grid.js';
import { interactionRegistry, interactionStore, useInteractionStore } from '../../systems/interactionSystem.js';

export function LocalPlayer({ playerRef }) {
  const { profile, myRole, mapData } = useWorkspaceStore();
  const { isSitting, currentChair } = useInteractionStore();
  const cameraMode = useCameraMode();
  const isFirstPerson = cameraMode === 'FIRST_PERSON';
  const keysRef = useKeyboardControls();
  const avatarRefs = useRef(null);

  // Physics & movement controller state
  const speedRef = useRef(0);
  const maxSpeedRef = useRef(2.3);
  const moveAngleRef = useRef(0);
  const targetRotationRef = useRef(0);
  // Camera mode memory: stores mode before sitting so we can restore on stand-up
  const preSitCameraModeRef = useRef(cameraMode);

  // Smooth seated/standing transition state
  const transitionRef = useRef({
    active: false,
    type: 'sit', // 'sit' | 'stand'
    progress: 0,
    startPos: { x: 0, y: 0, z: 0 },
    startRot: 0,
    targetPos: { x: 0, y: 0, z: 0 },
    targetRot: 0
  });

  const collisionGrid = useMemo(() => {
    return CollisionSystem.createCollisionGrid(mapData?.map);
  }, [mapData]);

  // Network tick throttler (20 updates/second)
  const networkTick = useMemo(() => {
    return new NetworkTick((x, y) => {
      const socket = socketClient.getSocket();
      if (socket && socket.connected) {
        socket.emit('playerMove', {
          x,
          y,
          actionState: interactionStore.getState().actionState,
          rotation: playerRef.current ? playerRef.current.rotation.y : 0,
          chairId: interactionStore.getState().currentChair?.id || null
        });
      }
    });
  }, []);

  useFrame((state, delta) => {
    const group = playerRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.08);
    const keys = keysRef.current;

    // ------------------------------------------------------------------------
    // 1. ACTIVE SITTING / STANDING ANIMATED TRANSITIONS
    // ------------------------------------------------------------------------
    if (transitionRef.current.active) {
      const tr = transitionRef.current;
      tr.progress += dt / (tr.type === 'sit' ? 0.32 : 0.28);
      const t = Math.min(1.0, tr.progress);
      // Smooth cubic ease in-out
      const ease = t * t * (3 - 2 * t);

      group.position.x = tr.startPos.x + (tr.targetPos.x - tr.startPos.x) * ease;
      group.position.y = tr.startPos.y + (tr.targetPos.y - tr.startPos.y) * ease;
      group.position.z = tr.startPos.z + (tr.targetPos.z - tr.startPos.z) * ease;

      let rDiff = tr.targetRot - tr.startRot;
      while (rDiff < -Math.PI) rDiff += Math.PI * 2;
      while (rDiff > Math.PI) rDiff -= Math.PI * 2;
      group.rotation.y = tr.startRot + rDiff * ease;

      if (t >= 1.0) {
        tr.active = false;
        group.position.x = tr.targetPos.x;
        group.position.y = tr.targetPos.y;
        group.position.z = tr.targetPos.z;
        group.rotation.y = tr.targetRot;
        targetRotationRef.current = tr.targetRot;
        moveAngleRef.current = tr.targetRot;
      }

      networkTick.queueMove(group.position.x, group.position.z);
      networkTick.update();
      AnimationSystem.updateAvatarAnimation(avatarRefs.current, 0, dt, tr.type === 'sit' ? 'sitting' : 'standing');
      return;
    }

    // ------------------------------------------------------------------------
    // 2. SEATED STATE BEHAVIOR & CHAIR EXIT
    // ------------------------------------------------------------------------
    if (isSitting && currentChair) {
      // Keep avatar grounded and oriented properly in chair
      group.position.x = currentChair.sitPosition[0];
      group.position.y = currentChair.sitPosition[1];
      group.position.z = currentChair.sitPosition[2];
      group.rotation.y = currentChair.sitRotation;

      // Exit chair on 'F' key OR any movement key (W, A, S, D)
      const hasMoveKey = Boolean(keys.w || keys.a || keys.s || keys.d);
      if (keys.justPressedF || hasMoveKey) {
        keys.justPressedF = false;

        const standPos = currentChair.exitPosition || currentChair.standPosition;
        const standRot = currentChair.exitRotation !== undefined ? currentChair.exitRotation : currentChair.sitRotation;
        transitionRef.current = {
          active: true,
          type: 'stand',
          progress: 0,
          startPos: { x: group.position.x, y: group.position.y, z: group.position.z },
          startRot: group.rotation.y,
          targetPos: { x: standPos[0], y: standPos[1] || 0, z: standPos[2] },
          targetRot: standRot
        };

        interactionStore.standUp();
        // Restore the camera mode that was active before sitting
        CameraManager.setMode(preSitCameraModeRef.current);

        const socket = socketClient.getSocket();
        if (socket && socket.connected) {
          socket.emit('playerMove', {
            x: standPos[0],
            y: standPos[2],
            actionState: 'standing'
          });
        }
      }

      AnimationSystem.updateAvatarAnimation(avatarRefs.current, 0, dt, 'sitting');
      return;
    }

    // ------------------------------------------------------------------------
    // 3. STANDING / WALKING PROXIMITY DETECTION & SIT INTERACTION
    // ------------------------------------------------------------------------
    const curX = group.position.x;
    const curZ = group.position.z;

    const nearestChair = interactionRegistry.findNearestChair(curX, curZ, 26);
    interactionStore.setNearby(nearestChair);

    if (keys.justPressedF && nearestChair) {
      keys.justPressedF = false;

      transitionRef.current = {
        active: true,
        type: 'sit',
        progress: 0,
        startPos: { x: curX, y: group.position.y, z: curZ },
        startRot: group.rotation.y,
        targetPos: {
          x: nearestChair.sitPosition[0],
          y: nearestChair.sitPosition[1],
          z: nearestChair.sitPosition[2]
        },
        targetRot: nearestChair.sitRotation
      };

      interactionStore.sitDown(nearestChair);
      // Remember current camera mode before forcing first person
      preSitCameraModeRef.current = CameraManager.getMode();
      CameraManager.setMode('FIRST_PERSON');
      cameraControls.targetYaw = nearestChair.sitRotation;
      cameraControls.targetPitch = 0.05;

      const socket = socketClient.getSocket();
      if (socket && socket.connected) {
        socket.emit('playerMove', {
          x: nearestChair.sitPosition[0],
          y: nearestChair.sitPosition[2],
          actionState: 'sitting',
          chairId: nearestChair.id
        });
      }

      AnimationSystem.updateAvatarAnimation(avatarRefs.current, 0, dt, 'sitting');
      return;
    }

    // Clear single-frame F press flag if not used
    keys.justPressedF = false;

    // ------------------------------------------------------------------------
    // 4. THIRD-PERSON CHARACTER CONTROLLER & MOVEMENT
    // ------------------------------------------------------------------------
    const isSprinting = Boolean(keys.shift);
    const targetMaxSpeed = isSprinting ? 4.6 : 2.3;
    maxSpeedRef.current += (targetMaxSpeed - maxSpeedRef.current) * Math.min(1.0, 7.0 * dt);

    // Movement direction relative to camera yaw
    const yaw = cameraControls.yaw;
    const forwardX = -Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);
    const rightX = Math.cos(yaw);
    const rightZ = -Math.sin(yaw);

    let inputX = 0;
    let inputZ = 0;
    if (keys.w) { inputX += forwardX; inputZ += forwardZ; }
    if (keys.s) { inputX -= forwardX; inputZ -= forwardZ; }
    if (keys.d) { inputX += rightX;   inputZ += rightZ; }
    if (keys.a) { inputX -= rightX;   inputZ -= rightZ; }

    const inputLen = Math.hypot(inputX, inputZ);
    const hasInput = inputLen > 0.001;

    if (hasInput) {
      if (isFirstPerson) {
        moveAngleRef.current = yaw;
        targetRotationRef.current = yaw;
      } else {
        const dirX = inputX / inputLen;
        const dirZ = inputZ / inputLen;
        // Avatar mesh faces local -Z; calculate world rotation angle around Y to align with (dirX, dirZ)
        const desiredAngle = Math.atan2(-dirX, -dirZ);

        let angleDiff = desiredAngle - moveAngleRef.current;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        moveAngleRef.current += angleDiff * Math.min(1.0, 16.0 * dt);
      }

      const accelRate = isSprinting ? 14.0 : 16.0;
      speedRef.current += (maxSpeedRef.current - speedRef.current) * Math.min(1.0, accelRate * dt);
    } else {
      if (isFirstPerson) {
        moveAngleRef.current = yaw;
        targetRotationRef.current = yaw;
      }
      const frictionRate = 12.0;
      speedRef.current += (0 - speedRef.current) * Math.min(1.0, frictionRate * dt);
      if (speedRef.current < 0.01) {
        speedRef.current = 0;
      }
    }

    const currentSpeed = speedRef.current;
    let vx = 0;
    let vz = 0;

    if (isFirstPerson) {
      if (hasInput) {
        vx = (inputX / inputLen) * currentSpeed;
        vz = (inputZ / inputLen) * currentSpeed;
      }
    } else {
      vx = -Math.sin(moveAngleRef.current) * currentSpeed;
      vz = -Math.cos(moveAngleRef.current) * currentSpeed;
    }

    const stepX = vx * (dt * 60);
    const stepZ = vz * (dt * 60);

    let nextX = curX;
    let nextZ = curZ;

    // Axis-Separated Wall & Furniture Collision Resolution (Smooth Sliding & Anti-Stuck)
    if (currentSpeed > 0.001) {
      // 1. Test X movement independently
      const testX = curX + stepX;
      if (CollisionSystem.canMove(collisionGrid, testX, curZ, PLAYER_RADIUS, undefined, null, curX, curZ)) {
        nextX = testX;
      }

      // 2. Test Z movement independently
      const testZ = curZ + stepZ;
      if (CollisionSystem.canMove(collisionGrid, nextX, testZ, PLAYER_RADIUS, undefined, null, nextX, curZ)) {
        nextZ = testZ;
      }

      group.position.x = nextX;
      group.position.z = nextZ;
      networkTick.queueMove(nextX, nextZ);

      if (!isFirstPerson) {
        targetRotationRef.current = moveAngleRef.current;
      }
    }

    // Body Rotation: locked to camera yaw in 1st person, smooth in 3rd person
    if (isFirstPerson) {
      group.rotation.y = yaw;
    } else {
      let rotDiff = targetRotationRef.current - group.rotation.y;
      while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
      while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
      group.rotation.y += rotDiff * Math.min(1.0, 15.0 * dt);
    }

    networkTick.update();

    // Procedural animation update
    AnimationSystem.updateAvatarAnimation(avatarRefs.current, currentSpeed, dt, 'standing');
  });

  return (
    <group ref={playerRef} scale={[1.2, 1.2, 1.2]} position={[groupPositionInitial(mapData).x, 0, groupPositionInitial(mapData).z]}>
      <AvatarMesh
        ref={avatarRefs}
        color={profile.color}
        style={profile.style}
        hair={profile.hair}
        isHost={myRole === 'host'}
        isFirstPerson={isFirstPerson}
      />
      {!isFirstPerson && (
        <PlayerNameplate
          name={profile.name || 'You'}
          isHost={myRole === 'host'}
          isMe={true}
          position={[0, 31.5, 0]}
        />
      )}
    </group>
  );
}

function groupPositionInitial(mapData) {
  if (mapData && mapData.map) {
    for (let r = 0; r < mapData.map.length; r++) {
      for (let c = 0; c < mapData.map[r].length; c++) {
        if (mapData.map[r][c] === 1) {
          return { x: c * 32 + 16, z: r * 32 + 16 };
        }
      }
    }
  }
  return { x: 80, z: 80 };
}
