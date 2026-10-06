import React, { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';

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

// 3D GLB Character Avatar using /char.glb
function GLBModelAvatar({ color, style, hair, isHost, isFirstPerson, avatarRef }) {
  const { scene } = useGLTF('/char.glb');

  // Animation controller state
  const animStateRef = useRef({ speed: 0, dt: 0.016, actionState: 'standing' });
  const blendRef = useRef({
    walkCycle: 0,
    idleCycle: 0,
    walkWeight: 0,
    sitWeight: 0
  });

  // Expose animation update handle to parent (LocalPlayer / RemotePlayers via AnimationSystem)
  useEffect(() => {
    if (!avatarRef) return;
    avatarRef.current = {
      update: (speed, dt, actionState) => {
        animStateRef.current = { speed, dt, actionState };
      }
    };
  }, [avatarRef]);

  // Clone GLB scene and organize articulated limb pivots uniquely per avatar instance
  const {
    cloned,
    leftArmPivot,
    rightArmPivot,
    leftLegPivot,
    rightLegPivot,
    headPivot,
    torsoPivot
  } = useMemo(() => {
    const clone = SkeletonUtils.clone(scene);

    // Height normalization: scale so height matches ~27.5 world units
    // char.glb height is 4.02 units: 4.02 * 6.85 = 27.537 units
    const scaleFactor = 6.85;
    clone.scale.set(scaleFactor, scaleFactor, scaleFactor);
    // Rotate 180 degrees around Y so avatar faces forward (-Z direction in world space)
    clone.rotation.set(0, Math.PI, 0);
    clone.position.set(0, 0, 0);

    const avatarRoot = clone.getObjectByName('ProfessionalAvatar') || clone;
    const turnaround = clone.getObjectByName('Turnaround_Reference');
    if (turnaround) turnaround.visible = false;

    // Materials customization & shadow casting
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          if (
            child.name === 'Torso_Suit' ||
            child.name === 'Jacket_Skirt' ||
            child.name === 'Lapel_Left' ||
            child.name === 'Lapel_Right' ||
            child.name === 'Arm_Left' ||
            child.name === 'Arm_Right'
          ) {
            child.material.color = new THREE.Color(color);
          } else if (child.name === 'Tie_Body' || child.name === 'Tie_Knot') {
            if (isHost) {
              child.material.color = new THREE.Color('#d97706'); // golden amber for host
            } else {
              child.material.color = new THREE.Color(color).clone().multiplyScalar(0.7);
            }
          }
        }
      }
    });

    // Hair visibility toggle based on profile settings
    if (hair === 'bald') {
      const hairNames = [
        'Hair_Back', 'Hair_Base', 'Hair_Left', 'Hair_Right', 'Hair_Quiff', 'Hair_QuiffSweep'
      ];
      hairNames.forEach((name) => {
        const h = clone.getObjectByName(name);
        if (h) h.visible = false;
      });
    }

    // Helper to group meshes into an articulated joint pivot
    const createPivot = (pivotPos, partNames) => {
      const pivot = new THREE.Group();
      pivot.position.copy(pivotPos);
      avatarRoot.add(pivot);
      partNames.forEach((name) => {
        const obj = avatarRoot.getObjectByName(name);
        if (obj) {
          obj.position.sub(pivotPos);
          pivot.add(obj);
        }
      });
      return pivot;
    };

    const leftArm = createPivot(
      new THREE.Vector3(-0.76, 2.50, 0),
      ['Arm_Left', 'Cuff_Left', 'Hand_Left']
    );
    const rightArm = createPivot(
      new THREE.Vector3(0.76, 2.50, 0),
      ['Arm_Right', 'Cuff_Right', 'Hand_Right']
    );
    const leftLeg = createPivot(
      new THREE.Vector3(-0.28, 1.40, 0),
      ['Leg_Left', 'Shoe_Left_Upper', 'Shoe_Left_Toe', 'Shoe_Left_Sole']
    );
    const rightLeg = createPivot(
      new THREE.Vector3(0.28, 1.40, 0),
      ['Leg_Right', 'Shoe_Right_Upper', 'Shoe_Right_Toe', 'Shoe_Right_Sole']
    );
    const head = createPivot(
      new THREE.Vector3(0, 2.95, 0),
      [
        'Head', 'Ear_Left', 'Ear_Right', 'Eye_Left', 'Eye_Right',
        'Eyebrow_Left', 'Eyebrow_Right', 'Smile',
        'Hair_Back', 'Hair_Base', 'Hair_Left', 'Hair_Right', 'Hair_Quiff', 'Hair_QuiffSweep'
      ]
    );
    const torso = createPivot(
      new THREE.Vector3(0, 1.40, 0),
      [
        'Torso_Suit', 'Neck', 'Shirt_Chest', 'Collar_Left', 'Collar_Right',
        'Lapel_Left', 'Lapel_Right', 'Tie_Knot', 'Tie_Body', 'Jacket_Skirt'
      ]
    );

    return {
      cloned: clone,
      leftArmPivot: leftArm,
      rightArmPivot: rightArm,
      leftLegPivot: leftLeg,
      rightLegPivot: rightLeg,
      headPivot: head,
      torsoPivot: torso
    };
  }, [scene, color, hair, isHost]);

  // Execute animation loop and limb posing on every frame tick
  useFrame((state, delta) => {
    if (!cloned) return;
    const dt = Math.min(delta, 0.08);
    const { speed, actionState } = animStateRef.current;
    const blend = blendRef.current;

    const isSitting = actionState === 'sitting';
    const targetSit = isSitting ? 1.0 : 0.0;
    blend.sitWeight += (targetSit - blend.sitWeight) * Math.min(1.0, 10.0 * dt);

    const isMoving = !isSitting && speed > 0.08;
    const targetWalk = isMoving ? 1.0 : 0.0;
    blend.walkWeight += (targetWalk - blend.walkWeight) * Math.min(1.0, 10.0 * dt);

    // Stride frequency and idle cycles
    if (isMoving) {
      const strideRate = (speed * 0.065 + 0.12) * (dt * 60);
      blend.walkCycle += strideRate;
    }
    blend.idleCycle += 0.035 * (dt * 60);

    const cycle = blend.walkCycle;
    const idleTime = blend.idleCycle;
    const w = blend.walkWeight;
    const s = blend.sitWeight;
    const sitEase = s * s * (3 - 2 * s);

    // Sprint/run factor
    const runFactor = THREE.MathUtils.clamp((speed - 2.3) / 2.0, 0.0, 1.0);

    // Dynamic swing angles
    const armSwing = Math.sin(cycle) * THREE.MathUtils.lerp(0.50, 0.82, runFactor) * w;
    const legSwing = Math.sin(cycle) * THREE.MathUtils.lerp(0.45, 0.75, runFactor) * w;
    const bodyBob = Math.sin(cycle * 2) * THREE.MathUtils.lerp(0.06, 0.12, runFactor) * w;
    const idleBob = Math.sin(idleTime) * 0.02 * (1.0 - w);
    const idleArm = Math.sin(idleTime * 0.8) * 0.03 * (1.0 - w);

    if (s > 0.001) {
      // Sitting kinematics:
      // Lower avatar comfortably onto seat cushion, shift back against chair backrest
      cloned.position.y = -5.8 * sitEase;
      cloned.position.z = 1.8 * sitEase;

      // Legs angled comfortably forward onto chair / floor
      leftLegPivot.rotation.x = THREE.MathUtils.lerp(0, 0.95, sitEase);
      rightLegPivot.rotation.x = THREE.MathUtils.lerp(0, 0.95, sitEase);
      leftLegPivot.rotation.z = 0;
      rightLegPivot.rotation.z = 0;

      // Arms resting comfortably on lap / desk
      leftArmPivot.rotation.x = THREE.MathUtils.lerp(0, 0.60, sitEase);
      rightArmPivot.rotation.x = THREE.MathUtils.lerp(0, 0.60, sitEase);
      leftArmPivot.rotation.z = THREE.MathUtils.lerp(0, -0.06, sitEase);
      rightArmPivot.rotation.z = THREE.MathUtils.lerp(0, 0.06, sitEase);

      // Torso & head upright and relaxed
      torsoPivot.rotation.x = THREE.MathUtils.lerp(0, -0.04, sitEase);
      headPivot.rotation.x = THREE.MathUtils.lerp(0, 0.02, sitEase);
    } else {
      // Standing and walking kinematics
      cloned.position.z = 0;
      cloned.position.y = bodyBob + idleBob;

      // Left arm swings forward when right leg steps forward
      leftArmPivot.rotation.x = armSwing + idleArm;
      rightArmPivot.rotation.x = -armSwing - idleArm;
      leftArmPivot.rotation.z = THREE.MathUtils.lerp(0, -0.07, w);
      rightArmPivot.rotation.z = THREE.MathUtils.lerp(0, 0.07, w);

      // Legs swing opposite to each other
      leftLegPivot.rotation.x = -legSwing;
      rightLegPivot.rotation.x = legSwing;
      leftLegPivot.rotation.z = 0;
      rightLegPivot.rotation.z = 0;

      // Dynamic forward lean and pelvic twist when walking/running
      const forwardLean = THREE.MathUtils.lerp(0.02, 0.12, runFactor) * w;
      torsoPivot.rotation.x = forwardLean;
      torsoPivot.rotation.y = Math.sin(cycle) * 0.04 * w;
      headPivot.rotation.x = -forwardLean * 0.4;
      headPivot.rotation.y = -Math.sin(cycle) * 0.02 * w;
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
      <GLBModelAvatar
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
useGLTF.preload('/char.glb');
