import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useFBX } from '@react-three/drei';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';

// Pre-process walking animation clip to remove root-motion so walk is in-place
function prepareInPlaceClip(rawClip) {
  if (!rawClip) return null;
  const clip = rawClip.clone();
  for (const track of clip.tracks) {
    if (track.name.endsWith('.position')) {
      const vals = track.values;
      for (let i = 0; i < track.times.length; i++) {
        // Keep vertical Y bobbing, neutralize forward X and Z translation
        vals[i * 3 + 0] = 0;
        vals[i * 3 + 2] = 0;
      }
    }
  }
  return clip;
}

// Procedural fallback avatar component shown while 3D model loads
function ProceduralFallbackAvatar({ color, style, hair, isHost, isFirstPerson, avatarGroupRef }) {
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const jacketRef = useRef();
  const headRef = useRef();
  const leftShoeRef = useRef();
  const rightShoeRef = useRef();

  const suitMaterial = materialPool.getSuitMaterial(color, style, isHost);
  const pantsMaterial = materialPool.getPantsMaterial(style, isHost);
  const tieMaterial = materialPool.getTieMaterial(color, style, isHost);

  useEffect(() => {
    if (avatarGroupRef) {
      avatarGroupRef.current = {
        leftArm: leftArmRef.current,
        rightArm: rightArmRef.current,
        leftLeg: leftLegRef.current,
        rightLeg: rightLegRef.current,
        jacket: jacketRef.current,
        head: headRef.current,
        leftShoe: leftShoeRef.current,
        rightShoe: rightShoeRef.current,
        walkCycle: 0,
        idleCycle: 0
      };
    }
  }, [avatarGroupRef, style, hair]);

  const hairGeo = hair === 'long'
    ? geometryPool.avatarHairLong
    : hair === 'curly'
      ? geometryPool.avatarHairCurly
      : geometryPool.avatarHairShort;

  return (
    <group visible={!isFirstPerson}>
      {/* Torso Group */}
      <group ref={jacketRef} position={[0, 18, 0]}>
        <mesh geometry={geometryPool.avatarTorso} material={suitMaterial} castShadow receiveShadow />
        <mesh position={[0, 3.8, 0]} geometry={geometryPool.avatarShoulders} material={suitMaterial} castShadow />
        <mesh position={[0, 1.2, -1.8]} geometry={geometryPool.avatarShirt} material={materialPool.shirt} />
        <mesh position={[0, 3.8, -1.8]} geometry={geometryPool.avatarCollar} material={materialPool.shirt} />
        {style !== 'creative' && (
          <mesh position={[0, 1.0, -2.1]} geometry={geometryPool.avatarTie} material={tieMaterial} />
        )}
      </group>

      {/* Neck & Head Group */}
      <group ref={headRef} position={[0, 25.5, 0]}>
        <mesh position={[0, -2.2, 0]} geometry={geometryPool.avatarNeck} material={materialPool.skin} />
        <mesh position={[0, 0, 0]} geometry={geometryPool.avatarHead} material={materialPool.skin} castShadow receiveShadow />
        <group position={[0, 0.4, -2.5]}>
          <mesh position={[-0.9, 0, 0]} castShadow>
            <boxGeometry args={[0.9, 0.5, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0.9, 0, 0]} castShadow>
            <boxGeometry args={[0.9, 0.5, 0.3]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[0.6, 0.15, 0.2]} />
            <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.8} />
          </mesh>
        </group>
        {hair !== 'bald' && (
          <group position={[0, hair === 'long' ? 0.6 : 0.4, 0.25]}>
            <mesh geometry={hairGeo} material={materialPool.hair} castShadow />
          </group>
        )}
      </group>

      {/* Arms */}
      <group ref={leftArmRef} position={[-3.8, 21.5, 0]}>
        <mesh position={[0, -4.5, 0]} geometry={geometryPool.avatarArm} material={suitMaterial} castShadow />
        <mesh position={[0, -9.5, 0]} geometry={geometryPool.avatarHand} material={materialPool.skin} castShadow />
      </group>
      <group ref={rightArmRef} position={[3.8, 21.5, 0]}>
        <mesh position={[0, -4.5, 0]} geometry={geometryPool.avatarArm} material={suitMaterial} castShadow />
        <mesh position={[0, -9.5, 0]} geometry={geometryPool.avatarHand} material={materialPool.skin} castShadow />
      </group>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[-1.5, 7.8, 0]} geometry={geometryPool.avatarLeg} material={pantsMaterial} castShadow receiveShadow />
      <mesh ref={rightLegRef} position={[1.5, 7.8, 0]} geometry={geometryPool.avatarLeg} material={pantsMaterial} castShadow receiveShadow />

      {/* Shoes */}
      <group ref={leftShoeRef} position={[-1.5, 1.5, -0.6]}>
        <mesh geometry={geometryPool.avatarShoe} material={materialPool.shoe} castShadow />
        <mesh position={[0, -0.65, 0]} geometry={geometryPool.avatarShoeSole} material={materialPool.shirt} />
      </group>
      <group ref={rightShoeRef} position={[1.5, 1.5, -0.6]}>
        <mesh geometry={geometryPool.avatarShoe} material={materialPool.shoe} castShadow />
        <mesh position={[0, -0.65, 0]} geometry={geometryPool.avatarShoeSole} material={materialPool.shirt} />
      </group>
    </group>
  );
}

// Exact anatomically validated resting arm quaternions (hands down naturally at sides)
const REST_ARM_QUATS = {
  mixamorig7LeftShoulder: new THREE.Quaternion(0.663, 0.334, -0.559, 0.370),
  mixamorig7LeftArm: new THREE.Quaternion(0.356, -0.032, -0.210, 0.910),
  mixamorig7LeftForeArm: new THREE.Quaternion(0.087, 0.173, 0.214, 0.958),
  mixamorig7LeftHand: new THREE.Quaternion(-0.083, 0.219, 0.082, 0.969),
  mixamorig7RightShoulder: new THREE.Quaternion(0.647, -0.350, 0.569, 0.368),
  mixamorig7RightArm: new THREE.Quaternion(0.326, 0.139, 0.010, 0.935),
  mixamorig7RightForeArm: new THREE.Quaternion(0.134, -0.070, -0.334, 0.930),
  mixamorig7RightHand: new THREE.Quaternion(-0.085, -0.224, 0.110, 0.965),
};

// Exact physically accurate sitting quaternions:
// - Thighs horizontal forward above chair seat
// - Calves vertically straight down touching floor
// - Arms down resting naturally on lap / thighs
const SIT_QUATS = {
  mixamorig7LeftUpLeg: new THREE.Quaternion(-0.0285, 0.6870, 0.7256, -0.0270),
  mixamorig7RightUpLeg: new THREE.Quaternion(0.0285, 0.6875, 0.7252, 0.0270),
  mixamorig7LeftLeg: new THREE.Quaternion(-0.7241, 0.0036, -0.0034, 0.6896),
  mixamorig7RightLeg: new THREE.Quaternion(-0.7193, -0.0036, 0.0034, 0.6947),
  mixamorig7LeftShoulder: new THREE.Quaternion(0.663, 0.334, -0.559, 0.370),
  mixamorig7LeftArm: new THREE.Quaternion(0.356, -0.032, -0.210, 0.910),
  mixamorig7LeftForeArm: new THREE.Quaternion(0.187, 0.173, 0.350, 0.895),
  mixamorig7LeftHand: new THREE.Quaternion(-0.083, 0.219, 0.082, 0.969),
  mixamorig7RightShoulder: new THREE.Quaternion(0.647, -0.350, 0.569, 0.368),
  mixamorig7RightArm: new THREE.Quaternion(0.326, 0.139, 0.010, 0.935),
  mixamorig7RightForeArm: new THREE.Quaternion(0.234, -0.070, -0.420, 0.874),
  mixamorig7RightHand: new THREE.Quaternion(-0.085, -0.224, 0.110, 0.965),
};

// High Quality 3D Model Avatar with Natural Rest Pose & Physically Accurate Sitting
function FBXModelAvatar({ color, style, hair, isHost, isFirstPerson, avatarRef }) {
  const fbx = useFBX('/Walking.fbx');

  // Track animation state from controller
  const animStateRef = useRef({ speed: 0, dt: 0.016, actionState: 'standing' });
  const blendWeightsRef = useRef({ walk: 0, sit: 0, idleCycle: 0 });

  // Expose animation update loop to parent via ref
  useEffect(() => {
    if (!avatarRef) return;
    avatarRef.current = {
      update: (speed, dt, actionState) => {
        animStateRef.current = { speed, dt, actionState };
      }
    };
  }, [avatarRef]);

  // Clone FBX hierarchy uniquely for this avatar instance
  const { cloned, mixer, walkAction, bonesMap } = useMemo(() => {
    const clone = SkeletonUtils.clone(fbx);

    // Height normalization: scale so height matches ~27.5 world units
    const scaleFactor = 0.155;
    clone.scale.set(scaleFactor, scaleFactor, scaleFactor);
    // Rotate 180 degrees around Y so avatar faces forward (-Z direction in world space)
    clone.rotation.set(0, Math.PI, 0);
    clone.position.set(0, 0, 0);

    // The Mixamo FBX contains DUPLICATE bone hierarchies (e.g. Suit and Shirt each
    // reference their own copy of LeftArm). If only one copy is posed/animated, the
    // other meshes stay behind and the arms render twisted. Rebind every skinned
    // mesh to ONE canonical bone per name (same lookup the AnimationMixer uses).
    // Duplicates share identical bind matrices, so existing boneInverses stay valid.
    const bones = {};
    clone.traverse((child) => {
      if (child.isBone && !bones[child.name]) {
        bones[child.name] = clone.getObjectByName(child.name);
      }
    });
    clone.traverse((child) => {
      if (child.isSkinnedMesh && child.skeleton) {
        const unified = child.skeleton.bones.map((b) => bones[b.name] || b);
        child.bind(new THREE.Skeleton(unified, child.skeleton.boneInverses), child.bindMatrix);
      }
    });

    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          // Clone material so styling this avatar does not affect other instances
          child.material = child.material.clone();
          if (child.name === 'Ch33_Suit' || child.name === 'Ch33_Tie') {
            child.material.color = new THREE.Color(color);
          }
        }
      }
    });

    if (hair === 'bald') {
      const hairMesh = clone.getObjectByName('Ch33_Hair');
      if (hairMesh) hairMesh.visible = false;
    }

    // Immediately put bones into rest position on initialization so there is zero initial T-pose
    for (const [name, targetQ] of Object.entries(REST_ARM_QUATS)) {
      if (bones[name]) {
        bones[name].quaternion.copy(targetQ);
      }
    }

    // Setup animation mixer & action
    const animMixer = new THREE.AnimationMixer(clone);
    let action = null;
    if (fbx.animations && fbx.animations.length > 0) {
      const inPlaceClip = prepareInPlaceClip(fbx.animations[0]);
      if (inPlaceClip) {
        action = animMixer.clipAction(inPlaceClip);
        action.setEffectiveWeight(0);
        action.play();
      }
    }

    return {
      cloned: clone,
      mixer: animMixer,
      walkAction: action,
      bonesMap: bones
    };
  }, [fbx, color, hair]);

  // Execute animation loop and bone posing on EVERY single frame tick
  useFrame((state, delta) => {
    if (!mixer) return;

    const dt = Math.min(delta, 0.08);
    const { speed, actionState } = animStateRef.current;
    const weights = blendWeightsRef.current;

    const isSitting = actionState === 'sitting';
    const targetSit = isSitting ? 1.0 : 0.0;
    weights.sit += (targetSit - weights.sit) * Math.min(1.0, 10.0 * dt);

    const isMoving = !isSitting && speed > 0.08;
    const targetWalk = isMoving ? 1.0 : 0.0;
    weights.walk += (targetWalk - weights.walk) * Math.min(1.0, 10.0 * dt);

    // Update walk animation weight
    if (walkAction) {
      const effectiveWalk = weights.walk * (1.0 - weights.sit);
      walkAction.setEffectiveWeight(effectiveWalk);
      const playbackSpeed = Math.min(2.2, Math.max(0.7, speed / 2.0));
      walkAction.timeScale = playbackSpeed;
    }

    // Advance mixer clock
    mixer.update(dt);

    // -------------------------------------------------------------------------
    // APPLY REAL PHYSICS & NATURAL BONE POSING AFTER MIXER (NEVER T-POSE)
    // -------------------------------------------------------------------------

    if (weights.sit > 0.001) {
      // Smooth cubic ease for sitting transition
      const sitEase = weights.sit * weights.sit * (3 - 2 * weights.sit);

      // 1. Vertical placement:
      // In world space, chair seat is at Y=6.2. LocalPlayer sets group.y=-2.5.
      // Setting cloned.y = -5.8 places thighs directly on chair seat (Y~7.5-8.5)
      // and lower legs vertically straight down touching floor (Y=0.0).
      cloned.position.y = -5.8 * sitEase;
      cloned.position.z = 1.8 * sitEase; // Hips sit back against backrest

      // 2. Thighs horizontal, calves vertically straight down, hands on lap
      for (const [name, targetQ] of Object.entries(SIT_QUATS)) {
        const bone = bonesMap[name];
        if (bone) {
          bone.quaternion.slerp(targetQ, sitEase);
        }
      }
    } else {
      // Standing or walking
      cloned.position.z = 0;

      // Subtle idle breathing motion when stopped
      weights.idleCycle += 0.04 * (dt * 60);
      if (!isMoving) {
        cloned.position.y = Math.sin(weights.idleCycle) * 0.12;
      } else {
        cloned.position.y = 0;
      }

      // -----------------------------------------------------------------------
      // HANDS DOWN IN REST POSITION WHEN STANDING (ZERO T-POSE)
      // -----------------------------------------------------------------------
      // When standing still, restBlend = 1.0 -> arms are 100% resting down at sides.
      // When walking, restBlend -> 0.0 -> arms naturally swing with the walk cycle.
      const restBlend = Math.max(0, 1.0 - weights.walk) * (1.0 - weights.sit);
      if (restBlend > 0.001) {
        for (const [name, targetQ] of Object.entries(REST_ARM_QUATS)) {
          const bone = bonesMap[name];
          if (bone) {
            bone.quaternion.slerp(targetQ, restBlend);
          }
        }
      }
    }
  });

  return <primitive object={cloned} visible={!isFirstPerson} />;
}

// Main AvatarMesh component with Suspense fallback
export const AvatarMesh = React.forwardRef(function AvatarMesh(
  { color = '#3182ce', style = 'casual', hair = 'short', isHost = false, isFirstPerson = false },
  ref
) {
  return (
    <React.Suspense
      fallback={
        <ProceduralFallbackAvatar
          color={color}
          style={style}
          hair={hair}
          isHost={isHost}
          isFirstPerson={isFirstPerson}
          avatarGroupRef={ref}
        />
      }
    >
      <FBXModelAvatar
        color={color}
        style={style}
        hair={hair}
        isHost={isHost}
        isFirstPerson={isFirstPerson}
        avatarRef={ref}
      />
    </React.Suspense>
  );
});

// Preload the character model
useFBX.preload('/Walking.fbx');
