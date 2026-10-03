import React, { useRef, useEffect, useMemo } from 'react';
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
        // Keep vertical Y bobbing, neutralize X and Z forward translation
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

// High Quality 3D Model Avatar using Walking.fbx
function FBXModelAvatar({ color, style, hair, isHost, isFirstPerson, avatarRef }) {
  const fbx = useFBX('/Walking.fbx');

  // Clone FBX hierarchy uniquely for this avatar instance
  const { cloned, mixer, walkAction, bonesMap } = useMemo(() => {
    const clone = SkeletonUtils.clone(fbx);

    // Height normalization: scale so height matches ~27.5 world units
    const scaleFactor = 0.155;
    clone.scale.set(scaleFactor, scaleFactor, scaleFactor);
    // Rotate 180 degrees around Y so avatar faces forward (-Z direction)
    clone.rotation.set(0, Math.PI, 0);
    clone.position.set(0, 0, 0);

    const bones = {};
    clone.traverse((child) => {
      if (child.isBone) {
        bones[child.name] = child;
      }
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

    return { cloned: clone, mixer: animMixer, walkAction: action, bonesMap: bones };
  }, [fbx, color, hair]);

  // Expose animation update loop to parent via ref
  useEffect(() => {
    if (!avatarRef) return;

    let currentWeight = 0;
    let idleCycle = 0;

    avatarRef.current = {
      update: (currentSpeed, dt, actionState) => {
        if (!mixer) return;

        if (actionState === 'sitting') {
          // Smooth sit pose: fade out walking animation, fold legs, lower hips
          currentWeight = Math.max(0, currentWeight - 10.0 * dt);
          if (walkAction) walkAction.setEffectiveWeight(0);

          cloned.position.y = -6.5;
          cloned.position.z = 3.5;

          const leftUpLeg = bonesMap['mixamorig7LeftUpLeg'];
          const rightUpLeg = bonesMap['mixamorig7RightUpLeg'];
          const leftLeg = bonesMap['mixamorig7LeftLeg'];
          const rightLeg = bonesMap['mixamorig7RightLeg'];

          if (leftUpLeg) leftUpLeg.rotation.x = Math.PI / 2.2;
          if (rightUpLeg) rightUpLeg.rotation.x = Math.PI / 2.2;
          if (leftLeg) leftLeg.rotation.x = -Math.PI / 2.2;
          if (rightLeg) rightLeg.rotation.x = -Math.PI / 2.2;
        } else {
          // Standing or walking
          cloned.position.y = 0;
          cloned.position.z = 0;

          const isMoving = currentSpeed > 0.08;
          const targetWeight = isMoving ? 1.0 : 0.0;
          currentWeight += (targetWeight - currentWeight) * Math.min(1.0, 10.0 * dt);

          if (walkAction) {
            walkAction.setEffectiveWeight(currentWeight);
            const playbackSpeed = Math.min(2.2, Math.max(0.7, currentSpeed / 2.0));
            walkAction.timeScale = playbackSpeed;
          }

          // Subtle breathing / idle motion when standing still
          idleCycle += 0.04 * (dt * 60);
          if (!isMoving) {
            cloned.position.y = Math.sin(idleCycle) * 0.12;
          }
        }

        mixer.update(dt);
      }
    };
  }, [avatarRef, mixer, walkAction, cloned, bonesMap]);

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
