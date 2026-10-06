import React, { useRef, useEffect } from 'react';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';

export const AvatarMesh = React.forwardRef(function AvatarMesh(
  { color = '#3182ce', style = 'casual', hair = 'short', isHost = false, isFirstPerson = false },
  ref
) {
  // Skeleton Joint Refs
  const rootPelvisRef = useRef();
  const spineRef = useRef();
  const chestRef = useRef();
  const neckRef = useRef();
  const headRef = useRef();

  // Arm Joint Refs
  const leftShoulderRef = useRef();
  const rightShoulderRef = useRef();
  const leftElbowRef = useRef();
  const rightElbowRef = useRef();
  const leftWristRef = useRef();
  const rightWristRef = useRef();

  // Leg Joint Refs
  const leftThighRef = useRef();
  const rightThighRef = useRef();
  const leftKneeRef = useRef();
  const rightKneeRef = useRef();
  const leftAnkleRef = useRef();
  const rightAnkleRef = useRef();

  const suitMaterial = materialPool.getSuitMaterial(color, style, isHost);
  const pantsMaterial = materialPool.getPantsMaterial(style, isHost);
  const tieMaterial = materialPool.getTieMaterial(color, style, isHost);

  useEffect(() => {
    if (ref) {
      ref.current = {
        // Core Skeletal Joints
        pelvis: rootPelvisRef.current,
        spine: spineRef.current,
        chest: chestRef.current,
        neck: neckRef.current,
        head: headRef.current,

        // Articulated Arms
        leftShoulder: leftShoulderRef.current,
        rightShoulder: rightShoulderRef.current,
        leftElbow: leftElbowRef.current,
        rightElbow: rightElbowRef.current,
        leftWrist: leftWristRef.current,
        rightWrist: rightWristRef.current,

        // Articulated Legs
        leftThigh: leftThighRef.current,
        rightThigh: rightThighRef.current,
        leftKnee: leftKneeRef.current,
        rightKnee: rightKneeRef.current,
        leftAnkle: leftAnkleRef.current,
        rightAnkle: rightAnkleRef.current,

        // Backward-compatible accessors
        leftArm: leftShoulderRef.current,
        rightArm: rightShoulderRef.current,
        leftLeg: leftThighRef.current,
        rightLeg: rightThighRef.current,
        jacket: spineRef.current,

        walkCycle: 0,
        idleCycle: 0,
        sitBlend: 0,
        moveBlend: 0
      };
    }
  }, [ref, style, hair]);

  const hairGeo = hair === 'long'
    ? geometryPool.avatarHairLong
    : hair === 'curly'
      ? geometryPool.avatarHairCurly
      : geometryPool.avatarHairShort;

  return (
    <group>
      {/* ================================================================ */}
      {/* ROOT PELVIS / HIPS (Controls lower body translation & base)      */}
      {/* Default standing height: Y = 13.5                                */}
      {/* ================================================================ */}
      <group ref={rootPelvisRef} position={[0, 13.5, 0]}>
        {/* Pelvis / Waistband Mesh */}
        <mesh
          position={[0, 0, 0]}
          geometry={geometryPool.avatarPelvis}
          material={pantsMaterial}
          castShadow
          receiveShadow
        />

        {/* -------------------------------------------------------------- */}
        {/* UPPER BODY: SPINE → CHEST → NECK → HEAD + SHOULDERS → ELBOWS   */}
        {/* -------------------------------------------------------------- */}
        <group ref={spineRef} position={[0, 1.3, 0]}>
          {/* Lower Torso / Jacket */}
          <mesh
            position={[0, 3.2, 0]}
            geometry={geometryPool.avatarTorso}
            material={suitMaterial}
            castShadow
            receiveShadow
          />

          {/* Chest & Shoulders Hub */}
          <group ref={chestRef} position={[0, 4.0, 0]}>
            {/* Defined Shoulders */}
            <mesh
              position={[0, 2.8, 0]}
              geometry={geometryPool.avatarShoulders}
              material={suitMaterial}
              castShadow
            />

            {/* Crisp Shirt Front (Facing -Z Forward) */}
            <mesh
              position={[0, 0.2, -1.8]}
              geometry={geometryPool.avatarShirt}
              material={materialPool.shirt}
            />

            {/* Smart Dress Collar */}
            <mesh
              position={[0, 2.8, -1.8]}
              geometry={geometryPool.avatarCollar}
              material={materialPool.shirt}
            />

            {/* Modern Slim Tie */}
            {style !== 'creative' && (
              <mesh
                position={[0, 0.0, -2.1]}
                geometry={geometryPool.avatarTie}
                material={tieMaterial}
              />
            )}

            {/* Neck & Head Hierarchy */}
            <group ref={neckRef} position={[0, 3.2, 0]} visible={!isFirstPerson}>
              <mesh
                position={[0, 0.9, 0]}
                geometry={geometryPool.avatarNeck}
                material={materialPool.skin}
              />

              <group ref={headRef} position={[0, 2.3, 0]}>
                {/* Stylized Head */}
                <mesh
                  position={[0, 0, 0]}
                  geometry={geometryPool.avatarHead}
                  material={materialPool.skin}
                  castShadow
                  receiveShadow
                />

                {/* Minimalist Glasses / Eyes */}
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

                {/* Hair */}
                {hair !== 'bald' && (
                  <group position={[0, hair === 'long' ? 0.6 : 0.4, 0.25]}>
                    <mesh geometry={hairGeo} material={materialPool.hair} castShadow />
                  </group>
                )}
              </group>
            </group>

            {/* LEFT ARM: SHOULDER → ELBOW → WRIST → HAND */}
            <group ref={leftShoulderRef} position={[-3.6, 2.8, 0]}>
              {/* Upper Arm Mesh (Center at [0, -2.4, 0], length 4.8) */}
              <mesh
                position={[0, -2.4, 0]}
                geometry={geometryPool.avatarUpperArm}
                material={suitMaterial}
                castShadow
              />

              {/* Left Elbow Joint */}
              <group ref={leftElbowRef} position={[0, -4.8, 0]}>
                <mesh geometry={geometryPool.avatarElbowJoint} material={suitMaterial} />
                {/* Forearm Mesh (Center at [0, -2.2, 0], length 4.4) */}
                <mesh
                  position={[0, -2.2, 0]}
                  geometry={geometryPool.avatarForearm}
                  material={suitMaterial}
                  castShadow
                />

                {/* Left Wrist & Hand */}
                <group ref={leftWristRef} position={[0, -4.4, 0]}>
                  <mesh
                    position={[0, -0.6, 0]}
                    geometry={geometryPool.avatarHand}
                    material={materialPool.skin}
                    castShadow
                  />
                </group>
              </group>
            </group>

            {/* RIGHT ARM: SHOULDER → ELBOW → WRIST → HAND */}
            <group ref={rightShoulderRef} position={[3.6, 2.8, 0]}>
              {/* Upper Arm Mesh (Center at [0, -2.4, 0], length 4.8) */}
              <mesh
                position={[0, -2.4, 0]}
                geometry={geometryPool.avatarUpperArm}
                material={suitMaterial}
                castShadow
              />

              {/* Right Elbow Joint */}
              <group ref={rightElbowRef} position={[0, -4.8, 0]}>
                <mesh geometry={geometryPool.avatarElbowJoint} material={suitMaterial} />
                {/* Forearm Mesh (Center at [0, -2.2, 0], length 4.4) */}
                <mesh
                  position={[0, -2.2, 0]}
                  geometry={geometryPool.avatarForearm}
                  material={suitMaterial}
                  castShadow
                />

                {/* Right Wrist & Hand */}
                <group ref={rightWristRef} position={[0, -4.4, 0]}>
                  <mesh
                    position={[0, -0.6, 0]}
                    geometry={geometryPool.avatarHand}
                    material={materialPool.skin}
                    castShadow
                  />
                </group>
              </group>
            </group>
          </group>
        </group>

        {/* -------------------------------------------------------------- */}
        {/* LOWER BODY: LEFT LEG (THIGH → KNEE → SHIN → ANKLE → FOOT)     */}
        {/* -------------------------------------------------------------- */}
        <group ref={leftThighRef} position={[-1.6, -1.0, 0]}>
          {/* Thigh Mesh (length 6.2, center at [0, -3.1, 0]) */}
          <mesh
            position={[0, -3.1, 0]}
            geometry={geometryPool.avatarThigh}
            material={pantsMaterial}
            castShadow
            receiveShadow
          />

          {/* Left Knee Joint */}
          <group ref={leftKneeRef} position={[0, -6.2, 0]}>
            <mesh geometry={geometryPool.avatarKneeJoint} material={pantsMaterial} />
            {/* Shin / Lower Leg Mesh (length 5.8, center at [0, -2.9, 0]) */}
            <mesh
              position={[0, -2.9, 0]}
              geometry={geometryPool.avatarShin}
              material={pantsMaterial}
              castShadow
              receiveShadow
            />

            {/* Left Ankle Joint & Foot */}
            <group ref={leftAnkleRef} position={[0, -5.8, 0]}>
              <mesh geometry={geometryPool.avatarAnkleJoint} material={pantsMaterial} />
              {/* Shoe & Sole extending forward (-Z) */}
              <group position={[0, 0, -0.6]}>
                <mesh
                  geometry={geometryPool.avatarShoe}
                  material={materialPool.shoe}
                  castShadow
                />
                <mesh
                  position={[0, -0.65, 0]}
                  geometry={geometryPool.avatarShoeSole}
                  material={materialPool.shirt}
                />
              </group>
            </group>
          </group>
        </group>

        {/* -------------------------------------------------------------- */}
        {/* LOWER BODY: RIGHT LEG (THIGH → KNEE → SHIN → ANKLE → FOOT)    */}
        {/* -------------------------------------------------------------- */}
        <group ref={rightThighRef} position={[1.6, -1.0, 0]}>
          {/* Thigh Mesh (length 6.2, center at [0, -3.1, 0]) */}
          <mesh
            position={[0, -3.1, 0]}
            geometry={geometryPool.avatarThigh}
            material={pantsMaterial}
            castShadow
            receiveShadow
          />

          {/* Right Knee Joint */}
          <group ref={rightKneeRef} position={[0, -6.2, 0]}>
            <mesh geometry={geometryPool.avatarKneeJoint} material={pantsMaterial} />
            {/* Shin / Lower Leg Mesh (length 5.8, center at [0, -2.9, 0]) */}
            <mesh
              position={[0, -2.9, 0]}
              geometry={geometryPool.avatarShin}
              material={pantsMaterial}
              castShadow
              receiveShadow
            />

            {/* Right Ankle Joint & Foot */}
            <group ref={rightAnkleRef} position={[0, -5.8, 0]}>
              <mesh geometry={geometryPool.avatarAnkleJoint} material={pantsMaterial} />
              {/* Shoe & Sole extending forward (-Z) */}
              <group position={[0, 0, -0.6]}>
                <mesh
                  geometry={geometryPool.avatarShoe}
                  material={materialPool.shoe}
                  castShadow
                />
                <mesh
                  position={[0, -0.65, 0]}
                  geometry={geometryPool.avatarShoeSole}
                  material={materialPool.shirt}
                />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

