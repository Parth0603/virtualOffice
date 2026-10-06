import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Global cache for parsed segment geometries & materials
let cachedSegmentsPromise = null;
let cachedSegments = null;

const SCALE = 11.5;
const Y_OFFSET = 1.311;

/**
 * Loads and partitions charactermodel.glb into articulated skeletal segments.
 * All original textures, materials, and UV coordinates are preserved 100%.
 */
function loadAndPartitionModel() {
  if (cachedSegments) {
    return Promise.resolve(cachedSegments);
  }
  if (cachedSegmentsPromise) {
    return cachedSegmentsPromise;
  }

  cachedSegmentsPromise = new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      '/3dModels/charactermodel.glb',
      (gltf) => {
        try {
          const segments = {
            pelvis: [],
            spine: [],
            chest: [],
            head: [],
            leftShoulder: [],
            rightShoulder: [],
            leftForearm: [],
            rightForearm: [],
            leftThigh: [],
            rightThigh: [],
            leftShin: [],
            rightShin: [],
            leftShoe: [],
            rightShoe: []
          };

          // Find root matrix for Sketchfab model
          let rootMat = new THREE.Matrix4();
          gltf.scene.traverse((child) => {
            if (child.name === 'Sketchfab_model' && child.matrix) {
              rootMat.copy(child.matrix);
            }
          });

          // Helper to transform vertex to world avatar space
          const tmpV = new THREE.Vector3();
          function getAvatarPos(posAttr, idx) {
            tmpV.set(posAttr.getX(idx), posAttr.getY(idx), posAttr.getZ(idx));
            tmpV.applyMatrix4(rootMat);
            tmpV.y = (tmpV.y + Y_OFFSET) * SCALE;
            tmpV.x = tmpV.x * SCALE;
            tmpV.z = tmpV.z * SCALE;
            return tmpV;
          }

          // Traverse all meshes and segment triangles into body parts
          gltf.scene.traverse((child) => {
            if (!child.isMesh || !child.geometry) return;

            const geom = child.geometry;
            const pos = geom.attributes.position;
            const index = geom.index;
            if (!pos || !index) return;

            // Map this mesh's triangles into target segment buckets
            const bucketIndices = {};

            const triCount = index.count / 3;
            for (let t = 0; t < triCount; t++) {
              const i0 = index.getX(t * 3);
              const i1 = index.getX(t * 3 + 1);
              const i2 = index.getX(t * 3 + 2);

              const v0 = getAvatarPos(pos, i0);
              const cx0 = v0.x, cy0 = v0.y, cz0 = v0.z;
              const v1 = getAvatarPos(pos, i1);
              const cx1 = v1.x, cy1 = v1.y, cz1 = v1.z;
              const v2 = getAvatarPos(pos, i2);
              const cx2 = v2.x, cy2 = v2.y, cz2 = v2.z;

              const avgX = (cx0 + cx1 + cx2) / 3;
              const avgY = (cy0 + cy1 + cy2) / 3;
              const avgZ = (cz0 + cz1 + cz2) / 3;

              let target = 'chest';
              const name = child.name;

              if (name === 'Object_2' || name === 'Object_4' || name === 'Object_8') {
                // Head, Beard, Glasses
                target = 'head';
              } else if (name === 'Object_7') {
                // Shoes
                target = avgX < 0 ? 'leftShoe' : 'rightShoe';
              } else if (name === 'Object_6') {
                // Hands / Forearms
                target = avgX < 0 ? 'leftForearm' : 'rightForearm';
              } else if (name === 'Object_5') {
                // Pants / Legs
                if (avgY > 13.5) {
                  target = 'pelvis';
                } else if (avgX < 0) {
                  target = avgY > 8.0 ? 'leftThigh' : 'leftShin';
                } else {
                  target = avgY > 8.0 ? 'rightThigh' : 'rightShin';
                }
              } else if (name === 'Object_3') {
                // Torso & Upper Arms
                if (avgX < -3.0) {
                  target = 'leftUpperArm';
                } else if (avgX > 3.0) {
                  target = 'rightUpperArm';
                } else if (avgY > 21.0) {
                  target = 'head';
                } else if (avgY > 16.5) {
                  target = 'chest';
                } else {
                  target = 'spine';
                }
              }

              if (!bucketIndices[target]) bucketIndices[target] = [];
              bucketIndices[target].push(i0, i1, i2);
            }

            // Create sub-geometries with transformed positions for each bucket
            // Pre-transform vertex positions by rootMat and SCALE so they reside in avatar coordinates
            const bakedGeom = geom.clone();
            const bakedPos = bakedGeom.attributes.position.clone();
            for (let i = 0; i < bakedPos.count; i++) {
              tmpV.set(bakedPos.getX(i), bakedPos.getY(i), bakedPos.getZ(i));
              tmpV.applyMatrix4(rootMat);
              tmpV.y = (tmpV.y + Y_OFFSET) * SCALE;
              tmpV.x = tmpV.x * SCALE;
              tmpV.z = tmpV.z * SCALE;
              bakedPos.setXYZ(i, tmpV.x, tmpV.y, tmpV.z);
            }
            bakedGeom.setAttribute('position', bakedPos);
            bakedGeom.computeVertexNormals();

            // Material handling
            const mat = child.material;
            if (mat) {
              mat.depthWrite = true;
              mat.roughness = Math.min(mat.roughness ?? 0.6, 0.75);
              if (mat.map) {
                mat.map.colorSpace = THREE.SRGBColorSpace;
              }
            }

            for (const [part, indices] of Object.entries(bucketIndices)) {
              if (indices.length === 0) continue;
              const subGeom = bakedGeom.clone();
              subGeom.setIndex(indices);
              segments[part].push({ geometry: subGeom, material: mat });
            }
          });

          cachedSegments = segments;
          resolve(segments);
        } catch (err) {
          console.error('[GlbCharacterModel] Failed partitioning GLB model:', err);
          reject(err);
        }
      },
      undefined,
      (err) => {
        console.error('[GlbCharacterModel] Failed loading GLB:', err);
        reject(err);
      }
    );
  });

  return cachedSegmentsPromise;
}

export const GlbCharacterModel = React.forwardRef(function GlbCharacterModel(
  { isHost = false, isFirstPerson = false },
  ref
) {
  const [segments, setSegments] = useState(cachedSegments);

  // Skeletal Joint Refs
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

  useEffect(() => {
    let mounted = true;
    loadAndPartitionModel().then((segs) => {
      if (mounted) setSegments(segs);
    }).catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

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
  }, [ref, segments]);

  if (!segments) {
    return null;
  }

  // Render a list of geometry/material pairs at a specific negative joint rest offset
  const renderPart = (partList, offset) => {
    if (!partList || partList.length === 0) return null;
    return (
      <group position={offset}>
        {partList.map((item, idx) => (
          <mesh
            key={idx}
            geometry={item.geometry}
            material={item.material}
            castShadow
            receiveShadow
          />
        ))}
      </group>
    );
  };

  return (
    <group>
      {/* ================================================================ */}
      {/* ROOT PELVIS / HIPS (Standing height: Y = 13.5)                   */}
      {/* ================================================================ */}
      <group ref={rootPelvisRef} position={[0, 13.5, 0]}>
        {/* Pelvis / Waistband Mesh (Rest origin: [0, 13.5, 0]) */}
        {renderPart(segments.pelvis, [0, -13.5, 0])}

        {/* -------------------------------------------------------------- */}
        {/* UPPER BODY: SPINE → CHEST → NECK → HEAD + SHOULDERS → ELBOWS   */}
        {/* -------------------------------------------------------------- */}
        <group ref={spineRef} position={[0, 1.8, 0]}>
          {/* Lower Torso / Waist (Rest origin: [0, 15.3, 0]) */}
          {renderPart(segments.spine, [0, -15.3, 0])}

          {/* Chest & Shoulders Hub */}
          <group ref={chestRef} position={[0, 3.2, 0]}>
            {/* Chest Mesh (Rest origin: [0, 18.5, 0]) */}
            {renderPart(segments.chest, [0, -18.5, 0])}

            {/* Neck & Head Hierarchy (Rest origin: [0, 21.5, 0]) */}
            <group ref={neckRef} position={[0, 3.0, 0]} visible={!isFirstPerson}>
              <group ref={headRef} position={[0, 0, 0]}>
                {renderPart(segments.head, [0, -21.5, 0])}
              </group>
            </group>

            {/* LEFT ARM: SHOULDER → ELBOW → WRIST (Rest origin: [-3.4, 20.8, 0]) */}
            <group ref={leftShoulderRef} position={[-3.4, 2.3, 0]}>
              {renderPart(segments.leftUpperArm, [3.4, -20.8, 0])}

              {/* Left Elbow Joint (Rest origin: [-3.4, 16.5, 0]) */}
              <group ref={leftElbowRef} position={[0, -4.3, 0]}>
                {renderPart(segments.leftForearm, [3.4, -16.5, 0])}
                <group ref={leftWristRef} position={[0, -3.0, 0]} />
              </group>
            </group>

            {/* RIGHT ARM: SHOULDER → ELBOW → WRIST (Rest origin: [3.4, 20.8, 0]) */}
            <group ref={rightShoulderRef} position={[3.4, 2.3, 0]}>
              {renderPart(segments.rightUpperArm, [-3.4, -20.8, 0])}

              {/* Right Elbow Joint (Rest origin: [3.4, 16.5, 0]) */}
              <group ref={rightElbowRef} position={[0, -4.3, 0]}>
                {renderPart(segments.rightForearm, [-3.4, -16.5, 0])}
                <group ref={rightWristRef} position={[0, -3.0, 0]} />
              </group>
            </group>
          </group>
        </group>

        {/* -------------------------------------------------------------- */}
        {/* LOWER BODY: LEFT LEG (THIGH → KNEE → SHIN → ANKLE → FOOT)     */}
        {/* -------------------------------------------------------------- */}
        {/* Left Thigh (Rest origin: [-1.6, 12.5, 0]) */}
        <group ref={leftThighRef} position={[-1.6, -1.0, 0]}>
          {renderPart(segments.leftThigh, [1.6, -12.5, 0])}

          {/* Left Knee Joint (Rest origin: [-1.6, 6.3, 0]) */}
          <group ref={leftKneeRef} position={[0, -6.2, 0]}>
            {renderPart(segments.leftShin, [1.6, -6.3, 0])}

            {/* Left Ankle Joint & Foot (Rest origin: [-1.6, 0.5, 0]) */}
            <group ref={leftAnkleRef} position={[0, -5.8, 0]}>
              {renderPart(segments.leftShoe, [1.6, -0.5, 0])}
            </group>
          </group>
        </group>

        {/* -------------------------------------------------------------- */}
        {/* LOWER BODY: RIGHT LEG (THIGH → KNEE → SHIN → ANKLE → FOOT)    */}
        {/* -------------------------------------------------------------- */}
        {/* Right Thigh (Rest origin: [1.6, 12.5, 0]) */}
        <group ref={rightThighRef} position={[1.6, -1.0, 0]}>
          {renderPart(segments.rightThigh, [-1.6, -12.5, 0])}

          {/* Right Knee Joint (Rest origin: [1.6, 6.3, 0]) */}
          <group ref={rightKneeRef} position={[0, -6.2, 0]}>
            {renderPart(segments.rightShin, [-1.6, -6.3, 0])}

            {/* Right Ankle Joint & Foot (Rest origin: [1.6, 0.5, 0]) */}
            <group ref={rightAnkleRef} position={[0, -5.8, 0]}>
              {renderPart(segments.rightShoe, [-1.6, -0.5, 0])}
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});
