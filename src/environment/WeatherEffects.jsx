/**
 * WeatherEffects
 * Ultra-lightweight GPU/CPU particle system for rain and storm effects.
 * Uses a single THREE.Points draw call bounded strictly around the active player.
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RAIN_COUNT = 900;
const BOUNDS_RADIUS = 130;
const BOUNDS_HEIGHT = 85;

// Generate a subtle elongated droplet texture on an in-memory canvas
function createRainDropTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(8, 0, 8, 64);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
  gradient.addColorStop(0.4, 'rgba(224, 242, 254, 0.4)');
  gradient.addColorStop(0.8, 'rgba(186, 230, 253, 0.9)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

  ctx.fillStyle = gradient;
  ctx.fillRect(4, 0, 8, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

export function WeatherEffects({ weatherState, targetPosition = [160, 0, 200] }) {
  const pointsRef = useRef();
  const materialRef = useRef();
  const currentOpacityRef = useRef(0);

  const rainTexture = useMemo(() => createRainDropTexture(), []);

  // Pre-allocate buffer geometry and particle velocity offsets
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(RAIN_COUNT * 3);
    const vel = new Float32Array(RAIN_COUNT);

    for (let i = 0; i < RAIN_COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * BOUNDS_RADIUS * 2;
      pos[i3 + 1] = Math.random() * BOUNDS_HEIGHT;
      pos[i3 + 2] = (Math.random() - 0.5) * BOUNDS_RADIUS * 2;
      vel[i] = 120 + Math.random() * 80; // fall speed units/sec
    }

    return { positions: pos, velocities: vel };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || !materialRef.current) return;

    const { rainIntensity, isStorm, windVector } = weatherState;

    // Target opacity smoothly interpolated
    const targetOpacity = rainIntensity > 0 ? (isStorm ? 0.8 : 0.55 * rainIntensity) : 0.0;
    currentOpacityRef.current += (targetOpacity - currentOpacityRef.current) * Math.min(1, delta * 3.0);
    materialRef.current.opacity = currentOpacityRef.current;

    // If completely invisible, skip particle position math for zero CPU overhead
    if (currentOpacityRef.current <= 0.01) {
      pointsRef.current.visible = false;
      return;
    }
    pointsRef.current.visible = true;

    const [targetX, , targetZ] = targetPosition || [160, 0, 200];
    const posAttr = pointsRef.current.geometry.attributes.position;
    const array = posAttr.array;

    const speedMultiplier = isStorm ? 1.45 : 1.0;
    const windX = (windVector?.x || 0) * (isStorm ? 35 : 18);
    const windZ = (windVector?.z || 0) * (isStorm ? 35 : 18);

    for (let i = 0; i < RAIN_COUNT; i++) {
      const i3 = i * 3;
      const speed = velocities[i] * speedMultiplier;

      // Fall down
      array[i3 + 1] -= speed * delta;

      // Wind drift
      array[i3] += windX * delta;
      array[i3 + 2] += windZ * delta;

      // Bounds wrapping relative to player center
      const dx = array[i3] - targetX;
      const dz = array[i3 + 2] - targetZ;

      if (array[i3 + 1] < 0 || Math.abs(dx) > BOUNDS_RADIUS || Math.abs(dz) > BOUNDS_RADIUS) {
        array[i3 + 1] = BOUNDS_HEIGHT + (Math.random() * 10);
        array[i3] = targetX + (Math.random() - 0.5) * BOUNDS_RADIUS * 2;
        array[i3 + 2] = targetZ + (Math.random() - 0.5) * BOUNDS_RADIUS * 2;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={RAIN_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={2.4}
        map={rainTexture}
        transparent
        opacity={0}
        depthWrite={false}
        color="#bae6fd"
        blending={THREE.NormalBlending}
      />
    </points>
  );
}
