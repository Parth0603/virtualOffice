import React, { useRef, useEffect } from 'react';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';

export const AvatarMesh = React.forwardRef(function AvatarMesh(
  { color = '#3182ce', style = 'casual', hair = 'short', isHost = false, isFirstPerson = false },
  ref
) {
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
    if (ref) {
      ref.current = {
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
  }, [ref, style, hair]);

  const hairGeo = hair === 'long'
    ? geometryPool.avatarHairLong
    : hair === 'curly'
      ? geometryPool.avatarHairCurly
      : geometryPool.avatarHairShort;

  return (
    <group>
      {/* Torso Group (Blazer / Jacket / Knit Sweater) */}
      <group ref={jacketRef} position={[0, 18, 0]}>
        {/* Main Body */}
        <mesh
          geometry={geometryPool.avatarTorso}
          material={suitMaterial}
          castShadow
          receiveShadow
        />

        {/* Defined Shoulders */}
        <mesh
          position={[0, 3.8, 0]}
          geometry={geometryPool.avatarShoulders}
          material={suitMaterial}
          castShadow
        />

        {/* Crisp Shirt Front (Facing -Z Forward) */}
        <mesh
          position={[0, 1.2, -1.8]}
          geometry={geometryPool.avatarShirt}
          material={materialPool.shirt}
        />

        {/* Smart Dress Collar */}
        <mesh
          position={[0, 3.8, -1.8]}
          geometry={geometryPool.avatarCollar}
          material={materialPool.shirt}
        />

        {/* Modern Slim Tie (for business/casual) */}
        {style !== 'creative' && (
          <mesh
            position={[0, 1.0, -2.1]}
            geometry={geometryPool.avatarTie}
            material={tieMaterial}
          />
        )}
      </group>

      {/* Neck & Head Group */}
      <group ref={headRef} position={[0, 25.5, 0]} visible={!isFirstPerson}>
        {/* Neck */}
        <mesh
          position={[0, -2.2, 0]}
          geometry={geometryPool.avatarNeck}
          material={materialPool.skin}
        />

        {/* Stylized Head */}
        <mesh
          position={[0, 0, 0]}
          geometry={geometryPool.avatarHead}
          material={materialPool.skin}
          castShadow
          receiveShadow
        />

        {/* Modern Stylized Minimalist Glasses / Eyes (Facing -Z Forward) */}
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

        {/* Styled Modern Hair (Full Coverage, No Gaps) */}
        {hair !== 'bald' && (
          <group position={[0, hair === 'long' ? 0.6 : 0.4, 0.25]}>
            <mesh
              geometry={hairGeo}
              material={materialPool.hair}
              castShadow
            />
          </group>
        )}
      </group>

      {/* Left Arm & Hand with Shoulder Pivot */}
      <group ref={leftArmRef} position={[-3.8, 21.5, 0]}>
        <mesh
          position={[0, -4.5, 0]}
          geometry={geometryPool.avatarArm}
          material={suitMaterial}
          castShadow
        />
        <mesh
          position={[0, -9.5, 0]}
          geometry={geometryPool.avatarHand}
          material={materialPool.skin}
          castShadow
        />
      </group>

      {/* Right Arm & Hand with Shoulder Pivot */}
      <group ref={rightArmRef} position={[3.8, 21.5, 0]}>
        <mesh
          position={[0, -4.5, 0]}
          geometry={geometryPool.avatarArm}
          material={suitMaterial}
          castShadow
        />
        <mesh
          position={[0, -9.5, 0]}
          geometry={geometryPool.avatarHand}
          material={materialPool.skin}
          castShadow
        />
      </group>

      {/* Left Leg (Slacks / Trousers) */}
      <mesh
        ref={leftLegRef}
        position={[-1.5, 7.8, 0]}
        geometry={geometryPool.avatarLeg}
        material={pantsMaterial}
        castShadow
        receiveShadow
      />

      {/* Right Leg (Slacks / Trousers) */}
      <mesh
        ref={rightLegRef}
        position={[1.5, 7.8, 0]}
        geometry={geometryPool.avatarLeg}
        material={pantsMaterial}
        castShadow
        receiveShadow
      />

      {/* Left Shoe with White Sole (Modern Sneaker / Oxford) */}
      <group ref={leftShoeRef} position={[-1.5, 1.5, -0.6]}>
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

      {/* Right Shoe with White Sole */}
      <group ref={rightShoeRef} position={[1.5, 1.5, -0.6]}>
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
  );
});
