import React, { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';
import { interactionRegistry, InteractableObject } from '../../systems/interactionSystem.js';
import { CollisionSystem } from '../../systems/collision.js';
import {
  OfficeChairModel,
  GamingChairModel,
  DoctorsChairModel,
  DublinChairModel,
  BasketSwingChairModel,
  SmallMeetingTableModel,
  LongSofaModel,
  SofaChairModel,
  LedScreenModel
} from '../../systems/modelManager.jsx';

// ============================================================================
// MODULAR REUSABLE FURNITURE COMPONENTS
// ============================================================================

// Ergonomic Mesh & Leather Office Chair (3D Model Asset)
function OfficeChair({ position, rotation = [0, 0, 0] }) {
  return <OfficeChairModel position={position} rotation={rotation} castShadow={true} />;
}

// Mid-Century Modern Club Lounge Armchair (3D Model Asset: Dublin Chair)
function ClubArmchair({ position, rotation = [0, 0, 0], variant = 'dark' }) {
  return <DublinChairModel position={position} rotation={rotation} variant={variant} castShadow={true} />;
}

// Modern Bar Stool (scaled 40% up to realistic human proportions with island bar)
function BarStool({ position, rotation = [0, 0, 0], color = 'navy' }) {
  const fabricMat = color === 'cream' ? materialPool.fabricCream : materialPool.fabricNavy;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 13.5, 0]} scale={[1.75, 1.25, 1.75]} geometry={geometryPool.barStoolSeat} material={fabricMat} castShadow receiveShadow />
      <mesh position={[-4.2, 6.5, -4.2]} scale={[1.2, 1.05, 1.2]} geometry={geometryPool.barStoolLeg} material={materialPool.metal} />
      <mesh position={[4.2, 6.5, -4.2]} scale={[1.2, 1.05, 1.2]} geometry={geometryPool.barStoolLeg} material={materialPool.metal} />
      <mesh position={[-4.2, 6.5, 4.2]} scale={[1.2, 1.05, 1.2]} geometry={geometryPool.barStoolLeg} material={materialPool.metal} />
      <mesh position={[4.2, 6.5, 4.2]} scale={[1.2, 1.05, 1.2]} geometry={geometryPool.barStoolLeg} material={materialPool.metal} />
    </group>
  );
}

// Casual Soft Pouf / Ottoman (scaled 40% up)
function SoftPouf({ position, color = 'teal' }) {
  const fabricMat = color === 'cream' ? materialPool.fabricCream : (color === 'navy' ? materialPool.fabricNavy : materialPool.fabricTeal);

  return (
    <group position={position}>
      <mesh position={[0, 3.5, 0]} scale={[1.4, 1.4, 1.4]} geometry={geometryPool.poufSeat} material={fabricMat} castShadow receiveShadow />
    </group>
  );
}

// Modern Minimalist Floor Lamp with Warm Glow
function FloorLamp({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.2, 0]} geometry={geometryPool.lampBase} material={materialPool.blackAluminum} />
      <mesh position={[0, 14, 0]} geometry={geometryPool.lampPole} material={materialPool.blackAluminum} />
      <mesh position={[0, 26, 0]} geometry={geometryPool.lampShade} material={materialPool.lampGlow} />
    </group>
  );
}

// Storage Credenza / Sideboard
function StorageCredenza({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 6, 0]} geometry={geometryPool.credenza} material={materialPool.metal} castShadow receiveShadow />
      <mesh position={[0, 12.6, 0]} geometry={geometryPool.credenzaTop} material={materialPool.wood} castShadow receiveShadow />
      <mesh position={[-12, 13.9, 0]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
    </group>
  );
}

// Biophilic Potted Indoor Plant
function LushPlant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]} geometry={geometryPool.plantPot} material={materialPool.plantPot} castShadow receiveShadow />
      <mesh position={[0, 13, 0]} geometry={geometryPool.plantStem} material={materialPool.woodDark} />
      <mesh position={[0, 20, 0]} geometry={geometryPool.plantFoliage} material={materialPool.plantLeaf} castShadow />
      <mesh position={[-3, 16.5, 1.5]} scale={[0.85, 0.85, 0.85]} geometry={geometryPool.plantFoliage} material={materialPool.plantLeaf} />
      <mesh position={[3, 17.5, -1.5]} scale={[0.8, 0.8, 0.8]} geometry={geometryPool.plantFoliage} material={materialPool.plantLeaf} />
    </group>
  );
}

// Biophilic Planter Divider Trough
function PlanterTrough({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 3.25, 0]} geometry={geometryPool.planterTrough} material={materialPool.blackAluminum} castShadow receiveShadow />
      <mesh position={[0, 7.5, 0]} geometry={geometryPool.troughFoliage} material={materialPool.plantLeaf} castShadow />
    </group>
  );
}

// Mobile Agile Sprint Whiteboard
function AgileWhiteboard({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 22, 0]} geometry={geometryPool.whiteboardFrame} material={materialPool.metalChrome} />
      <mesh position={[0, 22, 0.2]} geometry={geometryPool.whiteboardPanel} material={materialPool.whiteboard} receiveShadow />
      <mesh position={[0, 9.5, 1.5]} geometry={geometryPool.whiteboardShelf} material={materialPool.metal} />
      <mesh position={[-18, 1, 0]} geometry={geometryPool.whiteboardWheelBase} material={materialPool.metal} />
      <mesh position={[18, 1, 0]} geometry={geometryPool.whiteboardWheelBase} material={materialPool.metal} />
    </group>
  );
}

// Wall-Mounted LED Presentation Screen Suite (3D Model Asset: screen_led.glb)
function PresentationWallScreen({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Architectural Dark Acoustic Wall Backing Panel mounted flush to North wall */}
      <mesh position={[0, 22, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[74, 34, 0.6]} />
        <meshStandardMaterial color="#1a202c" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Solid Steel Mounting Bracket Frame anchoring the display to the wall */}
      <mesh position={[0, 22, 0.8]} castShadow>
        <boxGeometry args={[46, 22, 0.4]} />
        <meshStandardMaterial color="#2d3748" roughness={0.4} metalness={0.8} />
      </mesh>

      {/* 3D LED Presentation Screen Asset (screen_led.glb) facing South towards table */}
      <LedScreenModel position={[0, 22, 1.4]} rotation={[0, 0, 0]} />

      {/* Grounded Conference Video Soundbar & Integrated Camera beneath the display */}
      <group position={[0, 5.8, 1.3]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[28, 2.2, 2.2]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
        </mesh>
        {/* Camera Lens */}
        <mesh position={[0, 0, 1.15]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.2, 16]} />
          <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.9} />
        </mesh>
        {/* Status Indicator LED */}
        <mesh position={[3.5, 0, 1.16]}>
          <circleGeometry args={[0.15, 12]} />
          <meshBasicMaterial color="#10b981" />
        </mesh>
      </group>
    </group>
  );
}

// Wall-Mounted Meeting Pod Display Screen
function PodWallDisplay({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 22, 0]} geometry={geometryPool.podWallDisplay} material={materialPool.screen} />
      <mesh position={[0, 22, 0.35]} scale={[0.92, 0.88, 1]} geometry={geometryPool.podWallDisplay} material={materialPool.screenPresentation} />
    </group>
  );
}

// Ergonomic 4-Person Collaboration Desk Pod with Acoustic Dividers & Multi-Monitor Workstations
function TeamDeskCluster({ position }) {
  return (
    <group position={position}>
      {/* Central Acoustic Privacy Divider Screen with Modern Felt Texture */}
      <mesh position={[0, 16.5, 0]} scale={[2.35, 1.1, 1]} geometry={geometryPool.deskPartition} material={materialPool.fabricNavy} castShadow />

      {/* Central Cable Management Raceway Spine */}
      <mesh position={[0, 10.5, 0]} castShadow>
        <boxGeometry args={[78, 2.5, 3.5]} />
        <meshStandardMaterial color="#1a202c" roughness={0.5} metalness={0.6} />
      </mesh>

      {/* ============================================================== */}
      {/* NORTH WORKSTATIONS (Desks at Z = -10, Chairs at Z = -23, facing South toward desk) */}
      {/* ============================================================== */}
      {/* NW Workstation */}
      <group position={[-20, 0, -10]}>
        <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
        <mesh position={[-16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        <mesh position={[16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        {/* Dual Display Setup facing South */}
        <mesh position={[-4, 17.5, 5]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
        <mesh position={[-4, 14, 5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
        <mesh position={[8, 17.5, 4.4]} rotation={[0, 0.25, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
        <mesh position={[8, 14, 4.4]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
        {/* Peripherals & Accessories */}
        <mesh position={[-2, 12.8, -2]} geometry={geometryPool.keyboard} material={materialPool.metal} />
        <mesh position={[9, 12.75, -2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
        <mesh position={[-13, 13.5, 3]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
        {/* Office Chair facing South toward desk */}
        <OfficeChair position={[0, 0, -14.5]} rotation={[0, 0, 0]} />
      </group>

      {/* NE Workstation */}
      <group position={[20, 0, -10]}>
        <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
        <mesh position={[-16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        <mesh position={[16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        {/* Ultra-Wide Curved Display Setup facing South */}
        <mesh position={[0, 17.8, 5]} scale={[1.25, 1.05, 1]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
        <mesh position={[0, 14, 5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
        {/* Peripherals & Modern Desk Note Pad */}
        <mesh position={[-1, 12.8, -2]} geometry={geometryPool.keyboard} material={materialPool.metal} />
        <mesh position={[10, 12.75, -2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
        <mesh position={[-12, 12.85, 2]} castShadow>
          <boxGeometry args={[5, 0.2, 7]} />
          <meshStandardMaterial color="#cbd5e0" roughness={0.4} />
        </mesh>
        {/* Office Chair facing South toward desk */}
        <OfficeChair position={[0, 0, -14.5]} rotation={[0, 0, 0]} />
      </group>

      {/* ============================================================== */}
      {/* SOUTH WORKSTATIONS (Desks at Z = +10, Chairs at Z = +24.5, facing North toward desk) */}
      {/* ============================================================== */}
      {/* SW Workstation */}
      <group position={[-20, 0, 10]}>
        <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
        <mesh position={[-16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        <mesh position={[16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        {/* Dual Display Setup facing North */}
        <mesh position={[-4, 17.5, -5]} rotation={[0, Math.PI, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
        <mesh position={[-4, 14, -5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
        <mesh position={[8, 17.5, -4.4]} rotation={[0, Math.PI - 0.25, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
        <mesh position={[8, 14, -4.4]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
        {/* Peripherals & Accessories */}
        <mesh position={[-2, 12.8, 2]} rotation={[0, Math.PI, 0]} geometry={geometryPool.keyboard} material={materialPool.metal} />
        <mesh position={[9, 12.75, 2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
        <mesh position={[-13, 13.5, -3]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
        {/* Office Chair facing North toward desk */}
        <OfficeChair position={[0, 0, 14.5]} rotation={[0, Math.PI, 0]} />
      </group>

      {/* SE Workstation */}
      <group position={[20, 0, 10]}>
        <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
        <mesh position={[-16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        <mesh position={[16, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
        {/* Ultra-Wide Curved Display Setup facing North */}
        <mesh position={[0, 17.8, -5]} rotation={[0, Math.PI, 0]} scale={[1.25, 1.05, 1]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
        <mesh position={[0, 14, -5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
        {/* Peripherals & Modern Desk Succulent */}
        <mesh position={[-1, 12.8, 2]} rotation={[0, Math.PI, 0]} geometry={geometryPool.keyboard} material={materialPool.metal} />
        <mesh position={[10, 12.75, 2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
        <mesh position={[-12, 13.2, -3]} castShadow>
          <cylinderGeometry args={[1.2, 1.0, 1.5, 12]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Office Chair facing North toward desk */}
        <OfficeChair position={[0, 0, 14.5]} rotation={[0, Math.PI, 0]} />
      </group>
    </group>
  );
}

// Abstract Art Canvas Texture (Memoized Canvas Texture matching the Reference Image)
const abstractArtTexture = (() => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Background cream / warm beige gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 640);
  bgGrad.addColorStop(0, '#f8f4ee');
  bgGrad.addColorStop(0.4, '#ebe3d5');
  bgGrad.addColorStop(1, '#dfd3c3');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 512, 640);

  // Soft distant mountain washes
  ctx.fillStyle = '#b7b7a4';
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(190, 250);
  ctx.lineTo(340, 360);
  ctx.lineTo(512, 270);
  ctx.lineTo(512, 640);
  ctx.lineTo(0, 640);
  ctx.closePath();
  ctx.fill();

  // Warm terracotta / ochre midground ridge
  ctx.fillStyle = '#cb997e';
  ctx.beginPath();
  ctx.moveTo(0, 480);
  ctx.lineTo(150, 330);
  ctx.lineTo(300, 420);
  ctx.lineTo(430, 320);
  ctx.lineTo(512, 380);
  ctx.lineTo(512, 640);
  ctx.lineTo(0, 640);
  ctx.closePath();
  ctx.fill();

  // Bold dark charcoal / slate foreground mountain peak
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.moveTo(50, 640);
  ctx.lineTo(250, 210);
  ctx.lineTo(390, 370);
  ctx.lineTo(490, 640);
  ctx.closePath();
  ctx.fill();

  // Warm ochre geometric circle accent
  ctx.fillStyle = 'rgba(217, 119, 6, 0.45)';
  ctx.beginPath();
  ctx.arc(360, 175, 48, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
})();

// Framed Wall Art Piece on Glass Wall
function FramedWallArt({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={geometryPool.framedArtFrame} castShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.2]} geometry={geometryPool.framedArtCanvas}>
        <meshStandardMaterial map={abstractArtTexture} roughness={0.85} metalness={0.0} />
      </mesh>
    </group>
  );
}

// Suspended Linear LED Light Bar
function LinearSuspensionLight({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh geometry={geometryPool.pendantLightBar} castShadow>
        <meshStandardMaterial color="#121417" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, -0.71, 0]} geometry={geometryPool.pendantLightDiffuser}>
        <meshStandardMaterial color="#fffbeb" emissive="#fef3c7" emissiveIntensity={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[-18, 7.5, 0]} geometry={geometryPool.pendantCable}>
        <meshStandardMaterial color="#27272a" roughness={0.5} />
      </mesh>
      <mesh position={[18, 7.5, 0]} geometry={geometryPool.pendantCable}>
        <meshStandardMaterial color="#27272a" roughness={0.5} />
      </mesh>
      <pointLight position={[0, -2, 0]} color="#fff7ed" intensity={0.75} distance={50} decay={2} />
    </group>
  );
}

// Executive Storage Credenza / Cabinet with Books & Sculpture
function ExecutiveCredenza({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 5.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[52, 11.6, 11.6]} />
        <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.2} />
      </mesh>
      {[-13, 0, 13].map((x, i) => (
        <mesh key={i} position={[x, 5.8, 5.85]}>
          <boxGeometry args={[0.3, 10.5, 0.2]} />
          <meshStandardMaterial color="#09090b" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[0, 12.0, 0]} castShadow receiveShadow>
        <boxGeometry args={[53.6, 1.4, 12.6]} />
        <primitive object={materialPool.wood} attach="material" />
      </mesh>
      {/* Decorative Books */}
      <group position={[-16, 13.4, 0]}>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[7.5, 0.8, 9.5]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
        <mesh position={[0.2, 1.2, 0.3]} castShadow>
          <boxGeometry args={[7.0, 0.8, 9.0]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>
        <mesh position={[-0.2, 1.9, -0.1]} castShadow>
          <boxGeometry args={[6.5, 0.6, 8.5]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
      </group>
      {/* Modern Metallic Sculpture */}
      <group position={[4, 14.2, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.8, 1.0, 16]} />
          <meshStandardMaterial color="#18181b" roughness={0.4} />
        </mesh>
        <mesh position={[0, 2.2, 0]} rotation={[0.4, 0.5, 0.2]} castShadow>
          <torusGeometry args={[1.8, 0.35, 12, 24]} />
          <meshStandardMaterial color="#d4af37" roughness={0.25} metalness={0.8} />
        </mesh>
      </group>
      {/* Small Potted Succulent */}
      <group position={[18, 13.6, 0]}>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[2.8, 2.0, 2.8]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <sphereGeometry args={[1.4, 8, 8]} />
          <primitive object={materialPool.plantLeaf} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

// Round Contemporary Oak Coffee Table
function RoundCoffeeTable({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 7.4, 0]} geometry={geometryPool.coffeeTableRoundTop} castShadow receiveShadow>
        <primitive object={materialPool.wood} attach="material" />
      </mesh>
      {[
        [-6.5, 3.6, -6.5],
        [6.5, 3.6, -6.5],
        [-6.5, 3.6, 6.5],
        [6.5, 3.6, 6.5]
      ].map((legPos, i) => (
        <mesh key={i} position={legPos} geometry={geometryPool.coffeeTableRoundLeg} castShadow>
          <meshStandardMaterial color="#18181b" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[7.5, 7.5, 0.4, 16]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} metalness={0.8} />
      </mesh>
      {/* Accessories */}
      <group position={[0, 8.4, 2]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.8, 1.4, 1.4, 16]} />
          <meshStandardMaterial color="#f4f4f5" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <sphereGeometry args={[1.5, 8, 8]} />
          <primitive object={materialPool.plantLeaf} attach="material" />
        </mesh>
      </group>
      <group position={[-4, 8.2, -2]} rotation={[0, 0.15, 0]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[4.8, 0.4, 6.4]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.5} />
        </mesh>
        <mesh position={[0.2, 0.6, 0.1]} castShadow>
          <boxGeometry args={[4.6, 0.4, 6.0]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
      </group>
      <mesh position={[4.2, 8.1, -1]} rotation={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[2.5, 2.5, 0.3, 20]} />
        <meshStandardMaterial color="#27272a" roughness={0.7} />
      </mesh>
    </group>
  );
}

// Tripod Floor Lamp with Warm Ambient Glow
function TripodFloorLamp({ position = [0, 0, 0] }) {
  return (
    <group position={position}>
      <mesh position={[0, 11.5, -2.4]} rotation={[0.15, 0, 0]} geometry={geometryPool.lampTripodLeg} castShadow>
        <meshStandardMaterial color="#5c3d2e" roughness={0.6} />
      </mesh>
      <mesh position={[-2.1, 11.5, 1.2]} rotation={[-0.08, 0, 0.14]} geometry={geometryPool.lampTripodLeg} castShadow>
        <meshStandardMaterial color="#5c3d2e" roughness={0.6} />
      </mesh>
      <mesh position={[2.1, 11.5, 1.2]} rotation={[-0.08, 0, -0.14]} geometry={geometryPool.lampTripodLeg} castShadow>
        <meshStandardMaterial color="#5c3d2e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 22.8, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 1.2, 12]} />
        <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 26.5, 0]} geometry={geometryPool.lampDrumShade} castShadow>
        <meshStandardMaterial color="#fdf4e7" emissive="#fed7aa" emissiveIntensity={0.35} roughness={0.8} />
      </mesh>
      <pointLight position={[0, 26.5, 0]} color="#fed7aa" intensity={0.7} distance={38} decay={2} />
    </group>
  );
}

// Large Executive Desk (Workstation)
function ExecutiveWorkstation({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Warm Natural Oak Desktop (62 wide x 28 deep x 2.2 thick) */}
      <mesh position={[0, 13.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[62, 2.2, 28]} />
        <primitive object={materialPool.wood} attach="material" />
      </mesh>

      {/* Left Pedestal Drawers (Width 13, Height 13.5, Depth 25) */}
      <group position={[-23.5, 6.75, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[13, 13.5, 25]} />
          <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.2} />
        </mesh>
        {[-2.2, 2.2].map((y, i) => (
          <mesh key={i} position={[0, y, 12.55]}>
            <boxGeometry args={[11, 0.25, 0.2]} />
            <meshStandardMaterial color="#09090b" roughness={0.9} />
          </mesh>
        ))}
        {[-3.5, 0.8, 4.8].map((y, i) => (
          <mesh key={i} position={[0, y, 12.7]}>
            <boxGeometry args={[4.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Right Pedestal Drawers */}
      <group position={[23.5, 6.75, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[13, 13.5, 25]} />
          <meshStandardMaterial color="#18181b" roughness={0.35} metalness={0.2} />
        </mesh>
        {[-2.2, 2.2].map((y, i) => (
          <mesh key={i} position={[0, y, 12.55]}>
            <boxGeometry args={[11, 0.25, 0.2]} />
            <meshStandardMaterial color="#09090b" roughness={0.9} />
          </mesh>
        ))}
        {[-3.5, 0.8, 4.8].map((y, i) => (
          <mesh key={i} position={[0, y, 12.7]}>
            <boxGeometry args={[4.2, 0.4, 0.4]} />
            <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.8} />
          </mesh>
        ))}
      </group>

      {/* Center Modesty Panel (Facing South into Room) */}
      <mesh position={[0, 8.2, 10.5]} castShadow receiveShadow>
        <boxGeometry args={[34, 10.5, 1.2]} />
        <meshStandardMaterial color="#18181b" roughness={0.4} />
      </mesh>

      {/* Ultrawide Curved Executive Display (Facing North toward Chair) */}
      <group position={[0, 15.0, 7.5]}>
        <mesh position={[0, 6.25, 0]} rotation={[0, Math.PI, 0]} geometry={geometryPool.deskUltrawideMonitor} castShadow>
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
        </mesh>
        <mesh position={[0, 6.25, -0.55]} rotation={[0, Math.PI, 0]}>
          <boxGeometry args={[29.2, 11.8, 0.1]} />
          <meshStandardMaterial color="#0369a1" emissive="#0284c7" emissiveIntensity={0.25} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.2, 0.4]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
      </group>

      {/* Executive Leather Desk Pad */}
      <mesh position={[0, 14.95, -2.5]} geometry={geometryPool.deskPad} receiveShadow>
        <meshStandardMaterial color="#1e293b" roughness={0.85} />
      </mesh>

      {/* Keyboard & Mouse on Pad */}
      <mesh position={[-2, 15.02, -2.5]} rotation={[0, Math.PI, 0]} geometry={geometryPool.keyboard} material={materialPool.metal} />
      <mesh position={[10, 15.01, -2.5]} geometry={geometryPool.mousePad} material={materialPool.blackAluminum} />

      {/* Small Desk Plant on Right Side */}
      <group position={[23, 15.0, 5]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.6, 1.2, 1.8, 14]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <sphereGeometry args={[1.5, 8, 8]} />
          <primitive object={materialPool.plantLeaf} attach="material" />
        </mesh>
      </group>

      {/* Minimalist Desk Ceramic Mug / Pen Organizer on Left Side */}
      <mesh position={[-22, 15.0, 5]} castShadow>
        <cylinderGeometry args={[1.2, 1.0, 2.0, 12]} />
        <meshStandardMaterial color="#0f172a" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Complete Private Executive Office Suite Assembly
function PrivateExecutiveOfficeSuite() {
  return (
    <group>
      {/* 1. Architectural Vertical Wood Slat Feature Wall along North Wall */}
      <group position={[900, 0, 17.5]}>
        <mesh position={[0, 29.4, 0]} geometry={geometryPool.woodSlatFeatureBacking}>
          <meshStandardMaterial color="#18181b" roughness={0.8} />
        </mesh>
        {Array.from({ length: 50 }, (_, i) => -63.7 + i * 2.6).map((x, i) => (
          <mesh
            key={i}
            position={[x, 29.4, 0.8]}
            geometry={geometryPool.woodSlatVerticalBar}
            material={materialPool.wood}
            castShadow
            receiveShadow
          />
        ))}
      </group>

      {/* 2. Suspended Linear LED Light Bar */}
      <LinearSuspensionLight position={[900, 43, 52]} />

      {/* 3. Executive Credenza against Wood Slat Wall */}
      <ExecutiveCredenza position={[900, 0, 27]} />

      {/* 4. Tall Luxury Indoor Plant in Left Corner */}
      <LushPlant position={[838, 0, 32]} />

      {/* 5. Executive Workstation (Main Desk) */}
      <ExecutiveWorkstation position={[900, 0, 78]} />

      {/* 6. Executive Office Chair centered behind desk */}
      <OfficeChair position={[900, 0, 52]} rotation={[0, 0, 0]} />

      {/* 7. Visitor Seating Area (Right Side of Office) */}
      {/* Designer Area Rug */}
      <mesh position={[942, 0.08, 142]} geometry={geometryPool.loungeAreaRug} scale={[1.15, 1.0, 1.4]} material={materialPool.areaRug} receiveShadow />

      {/* Contemporary Visitor Sofa (sofa_-_long_sofa.glb) */}
      <LongSofaModel position={[974, 0, 142]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Round Warm Oak Coffee Table */}
      <RoundCoffeeTable position={[934, 0, 142]} />

      {/* Corner Tripod Floor Lamp */}
      <TripodFloorLamp position={[984, 0, 188]} />

      {/* Leafy Plant in Sofa Corner */}
      <LushPlant position={[986, 0, 98]} />

      {/* Framed Wall Art on East Glass Wall */}
      <FramedWallArt position={[1007.2, 32, 78]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

// Sound-Insulated Meeting Pod Suite (Round Table + 3 Chairs + Display)
function MeetingPodSuite({ position }) {
  return (
    <group position={position}>
      {/* Round Collaboration Table */}
      <mesh position={[0, 12, 0]} geometry={geometryPool.roundTableTop} material={materialPool.wood} castShadow receiveShadow />
      <mesh position={[0, 6, 0]} geometry={geometryPool.roundTablePedestal} material={materialPool.metal} />
      <mesh position={[0, 0.3, 0]} geometry={geometryPool.roundTableBase} material={materialPool.metal} />

      {/* 3 Ergonomic Chairs facing table center */}
      {/* North Chair (facing South towards table) */}
      <OfficeChair position={[0, 0, -21]} rotation={[0, 0, 0]} color="cream" />
      {/* Southwest Chair (facing Northeast towards table) */}
      <OfficeChair position={[-18, 0, 14]} rotation={[0, 3 * Math.PI / 4, 0]} color="navy" />
      {/* Southeast Chair (facing Northwest towards table) */}
      <OfficeChair position={[18, 0, 14]} rotation={[0, -3 * Math.PI / 4, 0]} color="navy" />

      {/* Coffee Mugs on table */}
      <mesh position={[-3, 13.5, -2]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
      <mesh position={[3, 13.5, 2]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
    </group>
  );
}

// 12-Seater Grand Executive Conference Boardroom Suite
function ConferenceBoardroomSuite({ position }) {
  return (
    <group position={position}>
      {/* Grand 144x48 Executive Boardroom Table */}
      <mesh position={[0, 13.7, 0]} geometry={geometryPool.conferenceTableTop} material={materialPool.wood} castShadow receiveShadow />
      <mesh position={[-42, 6.25, 0]} geometry={geometryPool.conferenceTableBase} material={materialPool.metal} castShadow />
      <mesh position={[42, 6.25, 0]} geometry={geometryPool.conferenceTableBase} material={materialPool.metal} castShadow />
      {/* Central Cable Connectivity Hub */}
      <mesh position={[0, 15.0, 0]} geometry={geometryPool.conferenceCenterHub} material={materialPool.metal} />

      {/* Central Omnidirectional Conference Pod Microphone */}
      <group position={[0, 15.2, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[2.5, 3.2, 0.6, 20]} />
          <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Subtle illuminated active ring */}
        <mesh position={[0, 0.32, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.6, 2.0, 24]} />
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>

      {/* Executive Leather Place Mats / Blotters */}
      {[-52, -26, 0, 26, 52].map((x, i) => (
        <group key={`blotter_n_${i}`} position={[x, 15.0, -15]}>
          <mesh receiveShadow>
            <boxGeometry args={[16, 0.1, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {[-52, -26, 0, 26, 52].map((x, i) => (
        <group key={`blotter_s_${i}`} position={[x, 15.0, 15]}>
          <mesh receiveShadow>
            <boxGeometry args={[16, 0.1, 10]} />
            <meshStandardMaterial color="#1e293b" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* West and East Head Blotters */}
      <mesh position={[-58, 15.0, 0]} receiveShadow>
        <boxGeometry args={[10, 0.1, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
      <mesh position={[58, 15.0, 0]} receiveShadow>
        <boxGeometry args={[10, 0.1, 16]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>

      {/* 5 North Chairs (facing South towards table) */}
      {[-52, -26, 0, 26, 52].map((x, i) => (
        <OfficeChair key={`conf_n_${i}`} position={[x, 0, -33]} rotation={[0, 0, 0]} />
      ))}

      {/* 5 South Chairs (facing North towards table) */}
      {[-52, -26, 0, 26, 52].map((x, i) => (
        <OfficeChair key={`conf_s_${i}`} position={[x, 0, 33]} rotation={[0, Math.PI, 0]} />
      ))}

      {/* 1 West Head Chair (facing East towards table) */}
      <OfficeChair position={[-82, 0, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* 1 East Head Chair (facing West towards table) */}
      <OfficeChair position={[82, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
    </group>
  );
}

// Modern Curved Barrel Tub Armchair (Emerald Velvet & Cognac Leather)
function ModernTubArmchair({ position, rotation = [0, 0, 0], material, castShadow = true }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 4 Angled Sleek Tapered Black Metal Legs */}
      {[
        [-5.2, 2.8, -5.2, -0.14, -0.14],
        [5.2, 2.8, -5.2, -0.14, 0.14],
        [-5.2, 2.8, 5.2, 0.14, -0.14],
        [5.2, 2.8, 5.2, 0.14, 0.14]
      ].map(([lx, ly, lz, rx, rz], i) => (
        <mesh key={i} position={[lx, ly, lz]} rotation={[rx, 0, rz]} geometry={geometryPool.tubChairLeg} material={materialPool.metal} castShadow />
      ))}
      {/* Plush Rounded Seat Cushion */}
      <mesh position={[0, 6.8, 0]} geometry={geometryPool.tubChairSeat} material={material} castShadow receiveShadow />
      {/* Curved Barrel Back / Arm Shell */}
      <mesh position={[0, 11.2, 0]} geometry={geometryPool.tubChairShell} material={material} castShadow />
      <mesh position={[0, 16.8, 0]} rotation={[-Math.PI / 2, 0, 0]} geometry={geometryPool.tubChairShellCap} material={material} castShadow />
      {/* Backrest Inner Cushion Accent */}
      <mesh position={[0, 10.8, -4.2]} rotation={[0.08, 0, 0]} castShadow>
        <boxGeometry args={[11, 8.5, 2.4]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}

// Apple iMac Style Desktop Workstation with Keyboard & Mousepad
function ImacWorkstation({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Aluminum Stand Base & Stem */}
      <mesh position={[0, 0.12, 0]} geometry={geometryPool.imacStandBase} material={materialPool.metalChrome} />
      <mesh position={[0, 2.2, -0.8]} rotation={[0.2, 0, 0]} geometry={geometryPool.imacStandStem} material={materialPool.metalChrome} />
      {/* Display Screen */}
      <group position={[0, 6.2, 0]}>
        <mesh geometry={geometryPool.imacScreen} material={materialPool.metalChrome} castShadow />
        <mesh position={[0, 0.8, -0.2]} geometry={geometryPool.imacGlassBezel} material={materialPool.screen} />
        <mesh position={[0, -3.6, -0.2]} geometry={geometryPool.imacChin} material={materialPool.metalChrome} />
      </group>
      {/* Keyboard & Mousepad */}
      <mesh position={[-0.5, 0.15, 6.5]} geometry={geometryPool.keyboard} material={materialPool.metalChrome} />
      <mesh position={[9.5, 0.05, 6.5]} geometry={geometryPool.mousePad} material={materialPool.blackAluminum} />
    </group>
  );
}

// Grand Reception Desk with "SYNTRRA" Feature Wall & Linear Suspension Lighting
function ReceptionSuite({ position = [208, 0, 680] }) {
  const frontSlats = useMemo(() => {
    const arr = [];
    for (let x = -38; x <= 38; x += 2.2) {
      arr.push(x);
    }
    return arr;
  }, []);

  const featureSlatsLeft = useMemo(() => {
    const arr = [];
    for (let x = -65; x <= -35; x += 2.2) {
      arr.push(x);
    }
    return arr;
  }, []);

  const featureSlatsRight = useMemo(() => {
    const arr = [];
    for (let x = 35; x <= 65; x += 2.2) {
      arr.push(x);
    }
    return arr;
  }, []);

  return (
    <group position={position}>
      {/* ============================================================== */}
      {/* 1. ARCHITECTURAL FEATURE WALL WITH "SYNTRRA" BRANDING (Z = 68) */}
      {/* ============================================================== */}
      <group position={[0, 0, 68]} rotation={[0, Math.PI, 0]}>
        {/* Outer Dark Architectural Frame / Backing */}
        <mesh position={[0, 29.4, -0.6]} geometry={geometryPool.featureWallFrame} material={materialPool.blackAluminum} />

        {/* Top Architectural Header / Pelmet Trim with Integrated Downlight Slot */}
        <mesh position={[0, 58.4, 0.6]} castShadow>
          <boxGeometry args={[141.2, 1.8, 2.6]} />
          <primitive object={materialPool.blackAluminum} attach="material" />
        </mesh>
        {/* Bottom Architectural Base Plinth Trim */}
        <mesh position={[0, 0.8, 0.6]} receiveShadow>
          <boxGeometry args={[141.2, 1.6, 2.6]} />
          <primitive object={materialPool.blackAluminum} attach="material" />
        </mesh>

        {/* Left Wood Slat Flank */}
        <mesh position={[-50, 29.4, -0.2]} geometry={geometryPool.featureWallSideBacking} material={materialPool.blackAluminum} />
        {featureSlatsLeft.map((xVal, idx) => (
          <mesh key={`slat_l_${idx}`} position={[xVal, 29.4, 0.4]} geometry={geometryPool.woodSlatVerticalBar} material={materialPool.oakSlats} castShadow />
        ))}

        {/* Right Wood Slat Flank */}
        <mesh position={[50, 29.4, -0.2]} geometry={geometryPool.featureWallSideBacking} material={materialPool.blackAluminum} />
        {featureSlatsRight.map((xVal, idx) => (
          <mesh key={`slat_r_${idx}`} position={[xVal, 29.4, 0.4]} geometry={geometryPool.woodSlatVerticalBar} material={materialPool.oakSlats} castShadow />
        ))}

        {/* Center Polished White Marble Slab with Stylized Hexagon & "SYNTRRA" */}
        <mesh position={[0, 29.4, 0.9]} geometry={geometryPool.featureWallCenterSlab} material={materialPool.featureWallBranding} castShadow receiveShadow />

        {/* Hidden Cove Backlight Strips on Left & Right Behind Marble Center Slab */}
        <mesh position={[-32.4, 29.4, 0.2]} geometry={geometryPool.featureWallCoveLight} material={materialPool.coveGlow} />
        <mesh position={[32.4, 29.4, 0.2]} geometry={geometryPool.featureWallCoveLight} material={materialPool.coveGlow} />
        <pointLight position={[-36, 32, 5]} color="#ffd8a8" intensity={0.75} distance={55} decay={2} />
        <pointLight position={[36, 32, 5]} color="#ffd8a8" intensity={0.75} distance={55} decay={2} />
        {/* Warm Architectural Downlight Grazing Marble Logo & Slats */}
        <pointLight position={[0, 53, 12]} color="#fff3e0" intensity={1.15} distance={62} decay={2} />
      </group>

      {/* ============================================================== */}
      {/* 2. SUSPENDED MINIMALIST LINEAR LED LIGHT BAR OVER DESK         */}
      {/* ============================================================== */}
      <group position={[0, 44, 0]}>
        <mesh geometry={geometryPool.featureWallSuspensionBar} material={materialPool.blackAluminum} castShadow />
        <mesh position={[0, -0.6, 0]}>
          <boxGeometry args={[63.6, 0.2, 1.4]} />
          <primitive object={materialPool.coveGlow} attach="material" />
        </mesh>
        {/* Thin Aircraft Suspension Cables extending up to ceiling at Y = 58.8 */}
        <mesh position={[-24, 7.4, 0]} geometry={geometryPool.featureWallCable} material={materialPool.blackAluminum} />
        <mesh position={[24, 7.4, 0]} geometry={geometryPool.featureWallCable} material={materialPool.blackAluminum} />
        {/* Warm Architectural Downlight casting soft light onto the desk & floor */}
        <pointLight position={[0, -3, 0]} color="#fff2df" intensity={1.1} distance={55} decay={2} />
      </group>

      {/* ============================================================== */}
      {/* 3. LARGE WATERFALL MARBLE RECEPTION DESK                       */}
      {/* ============================================================== */}
      <group position={[0, 0, 0]}>
        {/* Polished White Marble Waterfall Countertop */}
        <mesh position={[0, 16.7, 0]} geometry={geometryPool.receptionCounterWaterfallTop} material={materialPool.receptionMarble} castShadow receiveShadow />
        {/* Left Waterfall Side Slab */}
        <mesh position={[-40.9, 8.8, 0]} geometry={geometryPool.receptionCounterWaterfallSide} material={materialPool.receptionMarble} castShadow receiveShadow />
        {/* Right Waterfall Side Slab */}
        <mesh position={[40.9, 8.8, 0]} geometry={geometryPool.receptionCounterWaterfallSide} material={materialPool.receptionMarble} castShadow receiveShadow />

        {/* Front Recessed Backing & Warm Vertical Wood Slats */}
        <mesh position={[0, 8.8, -9.5]} geometry={geometryPool.receptionSlatFrontBacking} material={materialPool.blackAluminum} />
        {frontSlats.map((xVal, idx) => (
          <mesh key={`f_slat_${idx}`} position={[xVal, 8.8, -9.8]} geometry={geometryPool.receptionSlatFrontBar} material={materialPool.oakSlats} castShadow />
        ))}

        {/* Recessed Dark Base / Kickplate with Warm LED Under-glow */}
        <mesh position={[0, 0.9, -1.0]} geometry={geometryPool.receptionKickbase} material={materialPool.receptionKickbase} />
        <mesh position={[0, 0.5, -9.6]} geometry={geometryPool.receptionKickGlow} material={materialPool.coveGlow} />
        <pointLight position={[0, 1.5, -11.0]} color="#ffcca0" intensity={0.9} distance={30} decay={2} />

        {/* Receptionist Working Desk Surface (Interior at Y = 13.0) */}
        <mesh position={[0, 13.0, 2.0]} geometry={geometryPool.receptionCounterInteriorDesk} material={materialPool.wood} receiveShadow />

        {/* 2 Apple iMac Desktop Workstations */}
        <ImacWorkstation position={[-18, 13.8, 0]} rotation={[0, Math.PI, 0]} />
        <ImacWorkstation position={[18, 13.8, 0]} rotation={[0, Math.PI, 0]} />

        {/* Minimalist Desk Succulent & Ceramic Organizer on Countertop */}
        <group position={[-33, 17.8, -2]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.5, 1.2, 1.8, 14]} />
            <meshStandardMaterial color="#f4f4f5" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.3, 0]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <primitive object={materialPool.plantLeaf} attach="material" />
          </mesh>
        </group>
        <group position={[33, 17.8, -2]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.6, 1.4, 2.0, 14]} />
            <meshStandardMaterial color="#f4f4f5" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[1.4, 8, 8]} />
            <primitive object={materialPool.plantLeaf} attach="material" />
          </mesh>
        </group>
      </group>

      {/* 2 Receptionist Office Chairs Behind Desk Facing North toward Desk */}
      <OfficeChair position={[-14, 0, 24]} rotation={[0, Math.PI, 0]} />
      <OfficeChair position={[14, 0, 24]} rotation={[0, Math.PI, 0]} />

      {/* Tall Biophilic Planters Flanking Reception Wall */}
      <LushPlant position={[-73, 0, 55]} />
      <LushPlant position={[73, 0, 55]} />
    </group>
  );
}

// Executive Waiting Lounge Suite (West Side - Cream Sofa, Emerald Tub Chairs, Marble Table)
function LobbyPrimaryLounge({ position = [95, 0, 560] }) {
  return (
    <group position={position}>
      {/* 1. Large Premium Designer Woven Area Rug sitting flush on marble floor at Y=1.08 */}
      <mesh position={[0, 1.08, 0]} geometry={geometryPool.lobbyWaitingRug} material={materialPool.lobbyWaitingRug} receiveShadow />

      {/* 2. Contemporary Cream Sofa along West Wall facing East (+X) toward Coffee Table */}
      <LongSofaModel position={[-42, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* Tailored Dark Slate Designer Accent Throw Pillows */}
      <mesh position={[-39, 7.2, -14]} rotation={[0.12, 0.35, 0.2]} castShadow>
        <boxGeometry args={[3.8, 5.8, 5.8]} />
        <meshStandardMaterial color="#2d3748" roughness={0.68} />
      </mesh>
      <mesh position={[-39, 7.2, 14]} rotation={[-0.12, -0.35, -0.2]} castShadow>
        <boxGeometry args={[3.8, 5.8, 5.8]} />
        <meshStandardMaterial color="#2d3748" roughness={0.68} />
      </mesh>

      {/* 3. Center: Large Round White Calacatta Marble Coffee Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 8.2, 0]} geometry={geometryPool.coffeeTableMarbleRoundTop} material={materialPool.receptionMarble} castShadow receiveShadow />
        {[
          [-8.5, 4.0, -8.5],
          [8.5, 4.0, -8.5],
          [-8.5, 4.0, 8.5],
          [8.5, 4.0, 8.5]
        ].map(([lx, ly, lz], i) => (
          <mesh key={i} position={[lx, ly, lz]} geometry={geometryPool.coffeeTableMarbleLeg} material={materialPool.metal} castShadow />
        ))}

        {/* Stacked Hardcover Art & Architecture Books */}
        <mesh position={[-3, 9.2, 1.5]} rotation={[0, 0.12, 0]} castShadow>
          <boxGeometry args={[8.5, 0.5, 6]} />
          <meshStandardMaterial color="#2d3748" roughness={0.6} />
        </mesh>
        <mesh position={[-2.5, 9.7, 1.7]} rotation={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[7.8, 0.45, 5.5]} />
          <meshStandardMaterial color="#cbd5e0" roughness={0.5} />
        </mesh>
        {/* Minimalist Ceramic Tray & Bud Vase */}
        <mesh position={[4, 9.2, -1]} rotation={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[6.5, 0.35, 8.5]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        <mesh position={[4, 10.8, -1]} castShadow>
          <cylinderGeometry args={[1.2, 1.6, 2.8, 14]} />
          <meshStandardMaterial color="#475569" roughness={0.3} />
        </mesh>
      </group>

      {/* 4. Two Deep Emerald Green Curved Tub Lounge Armchairs facing Inward toward Coffee Table */}
      <ModernTubArmchair position={[40, 0, -28]} rotation={[0, -Math.PI * 0.28, 0]} material={materialPool.emeraldFabric} />
      <ModernTubArmchair position={[40, 0, 28]} rotation={[0, -Math.PI * 0.72, 0]} material={materialPool.emeraldFabric} />

      {/* 5. Tripod Floor Lamp in Corner with Warm Ambient Glow */}
      <TripodFloorLamp position={[-56, 0, -42]} />

      {/* 6. Lush Leafy Indoor Plant in Modern Cylindrical Planter */}
      <LushPlant position={[-56, 0, 48]} />
    </group>
  );
}

// Second Seating Area (East Side - Cognac Leather Tub Armchairs, Round Table & Rug)
function LobbySecondaryLounge({ position = [335, 0, 540] }) {
  return (
    <group position={position}>
      {/* 1. Round Woven Charcoal Area Rug flush on marble floor at Y=1.08 */}
      <mesh position={[0, 1.08, 0]} geometry={geometryPool.lobbyRoundRug} material={materialPool.lobbyRoundRug} receiveShadow />

      {/* 2. Two Warm Cognac Leather Curved Tub Armchairs Angled Inward toward Table */}
      <ModernTubArmchair position={[-16, 0, -18]} rotation={[0, Math.PI * 0.25, 0]} material={materialPool.cognacLeather} />
      <ModernTubArmchair position={[16, 0, 18]} rotation={[0, -Math.PI * 0.75, 0]} material={materialPool.cognacLeather} />

      {/* 3. Small Round Dark Marble Coffee Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 8.0, 0]} geometry={geometryPool.smallRoundTableTop} material={materialPool.darkMarble} castShadow receiveShadow />
        <mesh position={[0, 4.1, 0]} geometry={geometryPool.smallRoundTablePedestal} material={materialPool.metal} />
        <mesh position={[0, 0.4, 0]} geometry={geometryPool.smallRoundTableBase} material={materialPool.metal} />
        {/* Ceramic Bud Vase / Succulent */}
        <group position={[0, 9.2, 1.5]}>
          <mesh castShadow>
            <cylinderGeometry args={[1.4, 1.1, 1.6, 12]} />
            <meshStandardMaterial color="#f4f4f5" roughness={0.3} />
          </mesh>
          <mesh position={[0, 1.1, 0]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <primitive object={materialPool.plantLeaf} attach="material" />
          </mesh>
        </group>
        {/* Design Book */}
        <mesh position={[-1.5, 8.8, -1.8]} rotation={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[4.8, 0.35, 6.2]} />
          <meshStandardMaterial color="#1e293b" roughness={0.5} />
        </mesh>
      </group>

      {/* 4. Tall Biophilic Plant in Modern Planter */}
      <LushPlant position={[38, 0, -22]} />
    </group>
  );
}

// Relaxed Social Lounge Area (3D Long Sofas, Dublin Lounge Chairs, Coffee Table, Rug)
function LoungeSuite({ position }) {
  return (
    <group position={position}>
      {/* Designer Area Rug */}
      <mesh position={[0, 0.1, 0]} geometry={geometryPool.loungeAreaRug} scale={[1.4, 1.0, 1.4]} material={materialPool.areaRug} receiveShadow />

      {/* 3D Long Sofa (North side, facing South towards coffee table) */}
      <LongSofaModel position={[0, 0, -32]} rotation={[0, 0, 0]} />

      {/* Low Blonde Oak Coffee Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, 6, 0]} geometry={geometryPool.coffeeTableTop} material={materialPool.wood} castShadow receiveShadow />
        <mesh position={[-14, 3, -6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        <mesh position={[14, 3, -6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        <mesh position={[-14, 3, 6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        <mesh position={[14, 3, 6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        <mesh position={[-4, 7.5, -2]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
        <mesh position={[5, 7.5, 1]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
      </group>

      {/* 3D Long Sofa (South side, facing North towards coffee table) */}
      <LongSofaModel position={[0, 0, 32]} rotation={[0, Math.PI, 0]} />

      {/* Flanking Mid-Century Dublin Armchairs Facing Inwards towards coffee table */}
      <DublinChairModel position={[-42, 0, 0]} rotation={[0, Math.PI / 2, 0]} variant="dark" />
      <DublinChairModel position={[42, 0, 0]} rotation={[0, -Math.PI / 2, 0]} variant="dark" />

      {/* Designer Floor Lamps */}
      <FloorLamp position={[-42, 0, -32]} />
      <FloorLamp position={[42, 0, 32]} />
    </group>
  );
}

// Pantry / Kitchen Suite (Island Counter + Bar Stools + Back Cabinets + Dining Table)
function PantryKitchenSuite({ position }) {
  return (
    <group position={position}>
      {/* Back Kitchen Counter & Overhead Cabinets (South Wall) */}
      <group position={[0, 0, 48]}>
        <mesh position={[0, 7, 0]} geometry={geometryPool.kitchenBackCounter} material={materialPool.metal} castShadow receiveShadow />
        <mesh position={[0, 14.8, 0]} geometry={geometryPool.kitchenBackTop} material={materialPool.wood} castShadow receiveShadow />
        {/* Overhead Wall Cabinets */}
        <mesh position={[0, 30, 0]} geometry={geometryPool.kitchenOverheadCabinet} material={materialPool.metal} castShadow />
        {/* Appliances */}
        <mesh position={[-24, 18, 0]} geometry={geometryPool.coffeeMachine} material={materialPool.blackAluminum} />
        <mesh position={[22, 17.5, 0]} geometry={geometryPool.microwave} material={materialPool.metalChrome} />
        {/* Ceramic Mugs */}
        <mesh position={[-6, 16.2, 0]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
        <mesh position={[4, 16.2, 0]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
      </group>

      {/* Central High Island Bar Counter */}
      <group position={[0, 0, -60]}>
        <mesh position={[0, 7.75, 0]} geometry={geometryPool.kitchenIslandCounter} material={materialPool.metal} castShadow receiveShadow />
        <mesh position={[0, 16.5, 0]} geometry={geometryPool.kitchenIslandTop} material={materialPool.wood} castShadow receiveShadow />

        {/* 2 Bar Stools North (facing South towards counter) */}
        <BarStool position={[-19, 0, -18]} rotation={[0, 0, 0]} color="navy" />
        <BarStool position={[19, 0, -18]} rotation={[0, 0, 0]} color="cream" />

        {/* 2 Bar Stools South (facing North towards counter) */}
        <BarStool position={[-19, 0, 18]} rotation={[0, Math.PI, 0]} color="cream" />
        <BarStool position={[19, 0, 18]} rotation={[0, Math.PI, 0]} color="navy" />
      </group>

      {/* Casual Dining Table (North side) */}
      <group position={[0, 0, -125]}>
        <mesh position={[0, 12, 0]} geometry={geometryPool.diningTableTop} material={materialPool.wood} castShadow receiveShadow />
        <mesh position={[-16, 6, -8]} geometry={geometryPool.diningTableLeg} material={materialPool.metal} />
        <mesh position={[16, 6, -8]} geometry={geometryPool.diningTableLeg} material={materialPool.metal} />
        <mesh position={[-16, 6, 8]} geometry={geometryPool.diningTableLeg} material={materialPool.metal} />
        <mesh position={[16, 6, 8]} geometry={geometryPool.diningTableLeg} material={materialPool.metal} />

        {/* 4 Dining Chairs */}
        <OfficeChair position={[-13, 0, -18]} rotation={[0, 0, 0]} />
        <OfficeChair position={[13, 0, -18]} rotation={[0, 0, 0]} />
        <OfficeChair position={[-13, 0, 18]} rotation={[0, Math.PI, 0]} />
        <OfficeChair position={[13, 0, 18]} rotation={[0, Math.PI, 0]} />
      </group>
    </group>
  );
}

// Breakout & Creative Casual Collaboration Space (3D Small Meeting Table Set: sm_chair_table.glb)
function BreakoutSuite({ position }) {
  return (
    <group position={position}>
      {/* Designer Area Rug */}
      <mesh position={[0, 0.1, -10]} geometry={geometryPool.loungeAreaRug} scale={[1.2, 1.0, 1.2]} material={materialPool.areaRug} receiveShadow />

      {/* Brainstorm Whiteboard */}
      <AgileWhiteboard position={[0, 0, 48]} rotation={[0, 0, 0]} />

      {/* 3D Small Meeting Table with Chairs */}
      <SmallMeetingTableModel position={[0, 0, -10]} rotation={[0, 0, 0]} />
    </group>
  );
}

// ============================================================================
// MAIN WORKSPACE FURNITURE ENVIRONMENT & REGISTRATIONS
// ============================================================================

export function WorkspaceFurniture({ mapData }) {
  useEffect(() => {
    // ------------------------------------------------------------------------
    // 1. REGISTER ALL CHAIRS & INTERACTABLE SEATS INTO INTERACTION REGISTRY
    // ------------------------------------------------------------------------
    const chairs = [
      // --- LOBBY (Zone 1) ---
      // Receptionist Chair (faces North toward entrance/desk)
      new InteractableObject({
        id: 'chair_receptionist',
        position: [208, 0, 704],
        chairPosition: [208, 0, 704],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [208, -0.5, 702],
        sitRotation: 0,
        exitPosition: [156, 0, 680],
        exitRotation: -Math.PI / 2,
        label: 'Press F to Sit at Reception'
      }),
      // Executive Waiting Lounge Sofa (West side - 3 seats, facing East toward coffee table)
      new InteractableObject({
        id: 'chair_lobby_sofa_l',
        position: [53, 0, 540],
        chairPosition: [53, 0, 540],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [53, -0.5, 540],
        sitRotation: -Math.PI / 2,
        exitPosition: [76, 0, 540],
        exitRotation: -Math.PI / 2,
        label: 'Press F to Sit on Sofa'
      }),
      new InteractableObject({
        id: 'chair_lobby_sofa_c',
        position: [53, 0, 560],
        chairPosition: [53, 0, 560],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [53, -0.5, 560],
        sitRotation: -Math.PI / 2,
        exitPosition: [76, 0, 560],
        exitRotation: -Math.PI / 2,
        label: 'Press F to Sit on Sofa'
      }),
      new InteractableObject({
        id: 'chair_lobby_sofa_r',
        position: [53, 0, 580],
        chairPosition: [53, 0, 580],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [53, -0.5, 580],
        sitRotation: -Math.PI / 2,
        exitPosition: [76, 0, 580],
        exitRotation: -Math.PI / 2,
        label: 'Press F to Sit on Sofa'
      }),
      // Waiting Area Emerald Tub Armchairs (West side - 2 chairs, facing inward toward coffee table)
      new InteractableObject({
        id: 'chair_lobby_emerald_1',
        position: [135, 0, 532],
        chairPosition: [135, 0, 532],
        chairRotation: [0, -Math.PI * 0.28, 0],
        sitPosition: [135, -0.5, 532],
        sitRotation: Math.PI * 0.72,
        exitPosition: [116, 0, 532],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_lobby_emerald_2',
        position: [135, 0, 588],
        chairPosition: [135, 0, 588],
        chairRotation: [0, -Math.PI * 0.72, 0],
        sitPosition: [135, -0.5, 588],
        sitRotation: Math.PI * 0.28,
        exitPosition: [116, 0, 588],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      // Second Seating Area Cognac Leather Armchairs (East side - 2 chairs, facing inward toward round table)
      new InteractableObject({
        id: 'chair_lobby_cognac_1',
        position: [319, 0, 522],
        chairPosition: [319, 0, 522],
        chairRotation: [0, Math.PI * 0.25, 0],
        sitPosition: [319, -0.5, 522],
        sitRotation: -Math.PI * 0.75,
        exitPosition: [333, 0, 528],
        exitRotation: Math.PI * 0.25,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_lobby_cognac_2',
        position: [351, 0, 558],
        chairPosition: [351, 0, 558],
        chairRotation: [0, -Math.PI * 0.75, 0],
        sitPosition: [351, -0.5, 558],
        sitRotation: Math.PI * 0.25,
        exitPosition: [337, 0, 552],
        exitRotation: -Math.PI * 0.75,
        label: 'Press F to Sit'
      }),

      // --- CONFERENCE ROOM (Zone 3, 12 Chairs) ---
      // 5 North Chairs (face South towards table at Z=192, step North into wide aisle)
      new InteractableObject({
        id: 'chair_conf_n1',
        position: [140, 0, 159],
        chairPosition: [140, 0, 159],
        chairRotation: [0, 0, 0],
        sitPosition: [140, -0.5, 159],
        sitRotation: Math.PI,
        exitPosition: [140, 0, 142],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_n2',
        position: [166, 0, 159],
        chairPosition: [166, 0, 159],
        chairRotation: [0, 0, 0],
        sitPosition: [166, -0.5, 159],
        sitRotation: Math.PI,
        exitPosition: [166, 0, 142],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_n3',
        position: [192, 0, 159],
        chairPosition: [192, 0, 159],
        chairRotation: [0, 0, 0],
        sitPosition: [192, -0.5, 159],
        sitRotation: Math.PI,
        exitPosition: [192, 0, 142],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_n4',
        position: [218, 0, 159],
        chairPosition: [218, 0, 159],
        chairRotation: [0, 0, 0],
        sitPosition: [218, -0.5, 159],
        sitRotation: Math.PI,
        exitPosition: [218, 0, 142],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_n5',
        position: [244, 0, 159],
        chairPosition: [244, 0, 159],
        chairRotation: [0, 0, 0],
        sitPosition: [244, -0.5, 159],
        sitRotation: Math.PI,
        exitPosition: [244, 0, 142],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      // 5 South Chairs (face North towards table at Z=192, step South into wide aisle)
      new InteractableObject({
        id: 'chair_conf_s1',
        position: [140, 0, 225],
        chairPosition: [140, 0, 225],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [140, -0.5, 225],
        sitRotation: 0,
        exitPosition: [140, 0, 242],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_s2',
        position: [166, 0, 225],
        chairPosition: [166, 0, 225],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [166, -0.5, 225],
        sitRotation: 0,
        exitPosition: [166, 0, 242],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_s3',
        position: [192, 0, 225],
        chairPosition: [192, 0, 225],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [192, -0.5, 225],
        sitRotation: 0,
        exitPosition: [192, 0, 242],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_s4',
        position: [218, 0, 225],
        chairPosition: [218, 0, 225],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [218, -0.5, 225],
        sitRotation: 0,
        exitPosition: [218, 0, 242],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_conf_s5',
        position: [244, 0, 225],
        chairPosition: [244, 0, 225],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [244, -0.5, 225],
        sitRotation: 0,
        exitPosition: [244, 0, 242],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      // West Head Chair (faces East towards table, steps West into clear aisle)
      new InteractableObject({
        id: 'chair_conf_w',
        position: [110, 0, 192],
        chairPosition: [110, 0, 192],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [110, -0.5, 192],
        sitRotation: -Math.PI / 2,
        exitPosition: [93, 0, 192],
        exitRotation: -Math.PI / 2,
        label: 'Press F to Sit'
      }),
      // East Head Chair (faces West towards table, steps East into clear aisle)
      new InteractableObject({
        id: 'chair_conf_e',
        position: [274, 0, 192],
        chairPosition: [274, 0, 192],
        chairRotation: [0, -Math.PI / 2, 0],
        sitPosition: [274, -0.5, 192],
        sitRotation: Math.PI / 2,
        exitPosition: [291, 0, 192],
        exitRotation: Math.PI / 2,
        label: 'Press F to Sit'
      }),

      // --- TEAM WORKSPACE (Zone 2: 4 Desk Clusters, 16 Workstations) ---
      // Pod 1 (West North Cluster at [470, 0, 120])
      new InteractableObject({
        id: 'chair_team_1_nw',
        position: [450, 0, 95.5],
        chairPosition: [450, 0, 95.5],
        chairRotation: [0, 0, 0],
        sitPosition: [450, -0.5, 96],
        sitRotation: Math.PI,
        exitPosition: [450, 0, 78],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_1_ne',
        position: [490, 0, 95.5],
        chairPosition: [490, 0, 95.5],
        chairRotation: [0, 0, 0],
        sitPosition: [490, -0.5, 96],
        sitRotation: Math.PI,
        exitPosition: [490, 0, 78],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_1_sw',
        position: [450, 0, 144.5],
        chairPosition: [450, 0, 144.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [450, -0.5, 144],
        sitRotation: 0,
        exitPosition: [450, 0, 162],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_1_se',
        position: [490, 0, 144.5],
        chairPosition: [490, 0, 144.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [490, -0.5, 144],
        sitRotation: 0,
        exitPosition: [490, 0, 162],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),

      // Pod 2 (West South Cluster at [470, 0, 260])
      new InteractableObject({
        id: 'chair_team_2_nw',
        position: [450, 0, 235.5],
        chairPosition: [450, 0, 235.5],
        chairRotation: [0, 0, 0],
        sitPosition: [450, -0.5, 236],
        sitRotation: Math.PI,
        exitPosition: [450, 0, 218],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_2_ne',
        position: [490, 0, 235.5],
        chairPosition: [490, 0, 235.5],
        chairRotation: [0, 0, 0],
        sitPosition: [490, -0.5, 236],
        sitRotation: Math.PI,
        exitPosition: [490, 0, 218],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_2_sw',
        position: [450, 0, 284.5],
        chairPosition: [450, 0, 284.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [450, -0.5, 284],
        sitRotation: 0,
        exitPosition: [450, 0, 302],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_2_se',
        position: [490, 0, 284.5],
        chairPosition: [490, 0, 284.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [490, -0.5, 284],
        sitRotation: 0,
        exitPosition: [490, 0, 302],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),

      // Pod 3 (East North Cluster at [710, 0, 120])
      new InteractableObject({
        id: 'chair_team_3_nw',
        position: [690, 0, 95.5],
        chairPosition: [690, 0, 95.5],
        chairRotation: [0, 0, 0],
        sitPosition: [690, -0.5, 96],
        sitRotation: Math.PI,
        exitPosition: [690, 0, 78],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_3_ne',
        position: [730, 0, 95.5],
        chairPosition: [730, 0, 95.5],
        chairRotation: [0, 0, 0],
        sitPosition: [730, -0.5, 96],
        sitRotation: Math.PI,
        exitPosition: [730, 0, 78],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_3_sw',
        position: [690, 0, 144.5],
        chairPosition: [690, 0, 144.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [690, -0.5, 144],
        sitRotation: 0,
        exitPosition: [690, 0, 162],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_3_se',
        position: [730, 0, 144.5],
        chairPosition: [730, 0, 144.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [730, -0.5, 144],
        sitRotation: 0,
        exitPosition: [730, 0, 162],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),

      // Pod 4 (East South Cluster at [710, 0, 260])
      new InteractableObject({
        id: 'chair_team_4_nw',
        position: [690, 0, 235.5],
        chairPosition: [690, 0, 235.5],
        chairRotation: [0, 0, 0],
        sitPosition: [690, -0.5, 236],
        sitRotation: Math.PI,
        exitPosition: [690, 0, 218],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_4_ne',
        position: [730, 0, 235.5],
        chairPosition: [730, 0, 235.5],
        chairRotation: [0, 0, 0],
        sitPosition: [730, -0.5, 236],
        sitRotation: Math.PI,
        exitPosition: [730, 0, 218],
        exitRotation: Math.PI,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_4_sw',
        position: [690, 0, 284.5],
        chairPosition: [690, 0, 284.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [690, -0.5, 284],
        sitRotation: 0,
        exitPosition: [690, 0, 302],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),
      new InteractableObject({
        id: 'chair_team_4_se',
        position: [730, 0, 284.5],
        chairPosition: [730, 0, 284.5],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [730, -0.5, 284],
        sitRotation: 0,
        exitPosition: [730, 0, 302],
        exitRotation: 0,
        label: 'Press F to Sit'
      }),

      // --- PRIVATE OFFICE EXECUTIVE SUITE (Recreated from Reference Image) ---
      // 1. Executive Chair (office_chair.glb) centered behind desk facing South (+Z)
      new InteractableObject({
        id: 'chair_exec',
        position: [900, 0, 52],
        chairPosition: [900, 0, 52],
        chairRotation: [0, 0, 0],
        sitPosition: [900, -0.5, 52],
        sitRotation: Math.PI,
        exitPosition: [864, 0, 52],
        exitRotation: -Math.PI / 2,
        label: 'Press F to Sit at Executive Desk'
      }),
      // 2. Contemporary Visitor Sofa (sofa_-_long_sofa.glb) facing West (-X) toward coffee table & desk
      new InteractableObject({
        id: 'sofa_private_guest',
        position: [964, 0, 142],
        chairPosition: [964, 0, 142],
        chairRotation: [0, -Math.PI / 2, 0],
        sitPosition: [964, -0.5, 142],
        sitRotation: Math.PI / 2,
        exitPosition: [942, 0, 142],
        exitRotation: Math.PI / 2,
        label: 'Press F to Sit on Guest Sofa'
      }),

      // --- MEETING PODS (Zone 5, Pod 1 at Z=96, Pod 2 at Z=270) ---
      // Pod 1
      new InteractableObject({
        id: 'chair_pod_1_n',
        position: [1072, 0, 75],
        chairPosition: [1072, 0, 75],
        chairRotation: [0, 0, 0],
        sitPosition: [1072, -0.5, 75],
        sitRotation: Math.PI,
        exitPosition: [1072, 0, 54],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_pod_1_sw',
        position: [1054, 0, 110],
        chairPosition: [1054, 0, 110],
        chairRotation: [0, 3 * Math.PI / 4, 0],
        sitPosition: [1054, -0.5, 110],
        sitRotation: -Math.PI / 4,
        exitPosition: [1034, 0, 130],
        exitRotation: -Math.PI / 4
      }),
      new InteractableObject({
        id: 'chair_pod_1_se',
        position: [1090, 0, 110],
        chairPosition: [1090, 0, 110],
        chairRotation: [0, -3 * Math.PI / 4, 0],
        sitPosition: [1090, -0.5, 110],
        sitRotation: Math.PI / 4,
        exitPosition: [1110, 0, 130],
        exitRotation: Math.PI / 4
      }),
      // Pod 2
      new InteractableObject({
        id: 'chair_pod_2_n',
        position: [1072, 0, 249],
        chairPosition: [1072, 0, 249],
        chairRotation: [0, 0, 0],
        sitPosition: [1072, -0.5, 249],
        sitRotation: Math.PI,
        exitPosition: [1072, 0, 228],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_pod_2_sw',
        position: [1054, 0, 284],
        chairPosition: [1054, 0, 284],
        chairRotation: [0, 3 * Math.PI / 4, 0],
        sitPosition: [1054, -0.5, 284],
        sitRotation: -Math.PI / 4,
        exitPosition: [1034, 0, 304],
        exitRotation: -Math.PI / 4
      }),
      new InteractableObject({
        id: 'chair_pod_2_se',
        position: [1090, 0, 284],
        chairPosition: [1090, 0, 284],
        chairRotation: [0, -3 * Math.PI / 4, 0],
        sitPosition: [1090, -0.5, 284],
        sitRotation: Math.PI / 4,
        exitPosition: [1110, 0, 304],
        exitRotation: Math.PI / 4
      }),

      // --- LOUNGE AREA (Zone 6) ---
      new InteractableObject({
        id: 'chair_lounge_w',
        position: [534, 0, 610],
        chairPosition: [534, 0, 610],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [534, -0.5, 610],
        sitRotation: -Math.PI / 2,
        exitPosition: [508, 0, 610],
        exitRotation: -Math.PI / 2
      }),
      new InteractableObject({
        id: 'chair_lounge_e',
        position: [618, 0, 610],
        chairPosition: [618, 0, 610],
        chairRotation: [0, -Math.PI / 2, 0],
        sitPosition: [618, -0.5, 610],
        sitRotation: Math.PI / 2,
        exitPosition: [644, 0, 610],
        exitRotation: Math.PI / 2
      }),
      new InteractableObject({
        id: 'chair_lounge_sofa_n',
        position: [576, 0, 578],
        chairPosition: [576, 0, 578],
        chairRotation: [0, 0, 0],
        sitPosition: [576, -0.5, 578],
        sitRotation: Math.PI,
        exitPosition: [576, 0, 554],
        exitRotation: Math.PI,
        label: 'Press F to Sit on Lounge Sofa'
      }),
      new InteractableObject({
        id: 'chair_lounge_sofa_s',
        position: [576, 0, 642],
        chairPosition: [576, 0, 642],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [576, -0.5, 642],
        sitRotation: 0,
        exitPosition: [576, 0, 666],
        exitRotation: 0,
        label: 'Press F to Sit on Lounge Sofa'
      }),

      // --- PANTRY / KITCHEN (Zone 6) ---
      // Island Bar Stools
      new InteractableObject({
        id: 'chair_stool_n1',
        position: [845, 0, 592],
        chairPosition: [845, 0, 592],
        chairRotation: [0, 0, 0],
        sitPosition: [845, 1.5, 592],
        sitRotation: Math.PI,
        exitPosition: [845, 0, 570],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_stool_n2',
        position: [883, 0, 592],
        chairPosition: [883, 0, 592],
        chairRotation: [0, 0, 0],
        sitPosition: [883, 1.5, 592],
        sitRotation: Math.PI,
        exitPosition: [883, 0, 570],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_stool_s1',
        position: [845, 0, 628],
        chairPosition: [845, 0, 628],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [845, 1.5, 628],
        sitRotation: 0,
        exitPosition: [845, 0, 650],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_stool_s2',
        position: [883, 0, 628],
        chairPosition: [883, 0, 628],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [883, 1.5, 628],
        sitRotation: 0,
        exitPosition: [883, 0, 650],
        exitRotation: 0
      }),
      // Dining Chairs
      new InteractableObject({
        id: 'chair_dining_n1',
        position: [851, 0, 527],
        chairPosition: [851, 0, 527],
        chairRotation: [0, 0, 0],
        sitPosition: [851, -0.5, 527],
        sitRotation: Math.PI,
        exitPosition: [851, 0, 504],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_dining_n2',
        position: [877, 0, 527],
        chairPosition: [877, 0, 527],
        chairRotation: [0, 0, 0],
        sitPosition: [877, -0.5, 527],
        sitRotation: Math.PI,
        exitPosition: [877, 0, 504],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_dining_s1',
        position: [851, 0, 563],
        chairPosition: [851, 0, 563],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [851, -0.5, 563],
        sitRotation: 0,
        exitPosition: [851, 0, 586],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_dining_s2',
        position: [877, 0, 563],
        chairPosition: [877, 0, 563],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [877, -0.5, 563],
        sitRotation: 0,
        exitPosition: [877, 0, 586],
        exitRotation: 0
      }),
      // Breakout Small Meeting Table Set (Zone 4)
      new InteractableObject({
        id: 'chair_breakout_n',
        position: [1056, 0, 611],
        chairPosition: [1056, 0, 611],
        chairRotation: [0, 0, 0],
        sitPosition: [1056, -0.5, 611],
        sitRotation: Math.PI,
        exitPosition: [1056, 0, 590],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_breakout_s',
        position: [1056, 0, 649],
        chairPosition: [1056, 0, 649],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [1056, -0.5, 649],
        sitRotation: 0,
        exitPosition: [1056, 0, 670],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_breakout_w',
        position: [1037, 0, 630],
        chairPosition: [1037, 0, 630],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [1037, -0.5, 630],
        sitRotation: -Math.PI / 2,
        exitPosition: [1016, 0, 630],
        exitRotation: -Math.PI / 2
      }),
      new InteractableObject({
        id: 'chair_breakout_e',
        position: [1075, 0, 630],
        chairPosition: [1075, 0, 630],
        chairRotation: [0, -Math.PI / 2, 0],
        sitPosition: [1075, -0.5, 630],
        sitRotation: Math.PI / 2,
        exitPosition: [1096, 0, 630],
        exitRotation: Math.PI / 2
      })
    ];

    chairs.forEach(chair => interactionRegistry.register(chair));

    // ------------------------------------------------------------------------
    // 2. REGISTER FURNITURE COLLISION OBSTACLES (Exact Bounding Boxes)
    // ------------------------------------------------------------------------
    const obstacles = [
      // Lobby Reception Counter & Wall
      { id: 'obs_reception_counter', minX: 165, maxX: 251, minZ: 668, maxZ: 692 },
      { id: 'obs_reception_wall', minX: 136, maxX: 280, minZ: 746, maxZ: 752 },
      { id: 'obs_reception_plant_l', minX: 126, maxX: 144, minZ: 726, maxZ: 744 },
      { id: 'obs_reception_plant_r', minX: 272, maxX: 290, minZ: 726, maxZ: 744 },
      // Lobby Primary Waiting Area Furniture
      { id: 'obs_lobby_sofa', minX: 38, maxX: 68, minZ: 524, maxZ: 596 },
      { id: 'obs_lobby_table', minX: 80, maxX: 110, minZ: 545, maxZ: 575 },
      { id: 'obs_lobby_emerald_chairs', minX: 124, maxX: 146, minZ: 520, maxZ: 600 },
      { id: 'obs_lobby_lamp', minX: 30, maxX: 42, minZ: 510, maxZ: 522 },
      { id: 'obs_lobby_plant_w', minX: 30, maxX: 42, minZ: 602, maxZ: 614 },
      // Lobby Second Seating Area
      { id: 'obs_lobby_cognac_chairs', minX: 308, maxX: 362, minZ: 510, maxZ: 570 },
      { id: 'obs_lobby_second_table', minX: 326, maxX: 344, minZ: 531, maxZ: 549 },
      { id: 'obs_lobby_plant_e', minX: 366, maxX: 386, minZ: 510, maxZ: 526 },

      // Conference Room
      { id: 'obs_conf_table', minX: 120, maxX: 264, minZ: 168, maxZ: 216 },
      { id: 'obs_conf_credenza', minX: 352, maxX: 364, minZ: 171, maxZ: 213 },

      // Team Workspace (4 Clusters + Planters + Storage)
      { id: 'obs_team_desk_1', minX: 431, maxX: 509, minZ: 101, maxZ: 139 },
      { id: 'obs_team_desk_2', minX: 431, maxX: 509, minZ: 241, maxZ: 279 },
      { id: 'obs_team_desk_3', minX: 671, maxX: 749, minZ: 101, maxZ: 139 },
      { id: 'obs_team_desk_4', minX: 671, maxX: 749, minZ: 241, maxZ: 279 },
      { id: 'obs_team_cred_1', minX: 449, maxX: 491, minZ: 42, maxZ: 54 },
      { id: 'obs_team_cred_2', minX: 689, maxX: 731, minZ: 42, maxZ: 54 },
      { id: 'obs_team_planter_1', minX: 535, maxX: 545, minZ: 102, maxZ: 138 },
      { id: 'obs_team_planter_2', minX: 535, maxX: 545, minZ: 242, maxZ: 278 },
      { id: 'obs_team_planter_3', minX: 635, maxX: 645, minZ: 102, maxZ: 138 },
      { id: 'obs_team_planter_4', minX: 635, maxX: 645, minZ: 242, maxZ: 278 },

      // Private Office (Unified matching reference image)
      { id: 'obs_exec_desk', minX: 866, maxX: 934, minZ: 64, maxZ: 92 },
      { id: 'obs_exec_credenza', minX: 872, maxX: 928, minZ: 20, maxZ: 33 },
      { id: 'obs_exec_left_plant', minX: 832, maxX: 846, minZ: 26, maxZ: 42 },
      { id: 'obs_visitor_sofa', minX: 962, maxX: 988, minZ: 114, maxZ: 170 },
      { id: 'obs_coffee_table', minX: 923, maxX: 945, minZ: 131, maxZ: 153 },
      { id: 'obs_floor_lamp', minX: 978, maxX: 990, minZ: 182, maxZ: 194 },
      { id: 'obs_sofa_plant', minX: 980, maxX: 992, minZ: 92, maxZ: 104 },

      // Meeting Pods
      { id: 'obs_pod_table_1', minX: 1058, maxX: 1086, minZ: 82, maxZ: 110 },
      { id: 'obs_pod_table_2', minX: 1058, maxX: 1086, minZ: 256, maxZ: 284 },

      // Lounge Area
      { id: 'obs_lounge_sofa_n', minX: 555, maxX: 597, minZ: 566, maxZ: 590 },
      { id: 'obs_lounge_sofa_s', minX: 555, maxX: 597, minZ: 630, maxZ: 654 },
      { id: 'obs_lounge_table', minX: 558, maxX: 594, minZ: 601, maxZ: 619 },
      { id: 'obs_basket_swing', minX: 666, maxX: 684, minZ: 661, maxZ: 679 },

      // Kitchen & Pantry
      { id: 'obs_kitchen_back', minX: 818, maxX: 910, minZ: 708, maxZ: 725 },
      { id: 'obs_kitchen_island', minX: 826, maxX: 902, minZ: 598, maxZ: 622 },
      { id: 'obs_dining_table', minX: 844, maxX: 884, minZ: 533, maxZ: 557 },

      // Breakout Area
      { id: 'obs_breakout_table', minX: 1035, maxX: 1077, minZ: 609, maxZ: 651 },
      { id: 'obs_breakout_wb', minX: 1033, maxX: 1079, minZ: 712, maxZ: 718 }
    ];

    CollisionSystem.registerObstacles(obstacles);

    return () => {
      interactionRegistry.clear();
      CollisionSystem.clearObstacles();
    };
  }, []);

  return (
    <group>
      {/* ============================================================== */}
      {/* ZONE 1: LOBBY & GRAND ENTRANCE RECEPTION                       */}
      {/* Exact Visual Recreation matching Reference Image              */}
      {/* ============================================================== */}
      <group>
        {/* 1. Reception Desk & "SYNTRRA" Slatted Feature Wall */}
        <ReceptionSuite position={[208, 0, 680]} />

        {/* 2. Executive Waiting Lounge Suite (West Side - Cream Sofa, Emerald Tub Chairs, Marble Table) */}
        <LobbyPrimaryLounge position={[95, 0, 560]} />

        {/* 3. Second Seating Area (East Side - Cognac Leather Tub Chairs, Dark Marble Table, Round Rug) */}
        <LobbySecondaryLounge position={[335, 0, 540]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 3: LARGE CONFERENCE BOARDROOM (12 SEATER)                 */}
      {/* ============================================================== */}
      <group>
        {/* Central 12-Seater Boardroom Suite (Table center at visual & geometric room center [192, 0, 192]) */}
        <ConferenceBoardroomSuite position={[192, 0, 192]} />
        {/* Wall-Mounted Ultra-HD Presentation Screen Suite on North Wall (Z = 16, centered at X = 192) */}
        <PresentationWallScreen position={[192, 0, 16]} rotation={[0, 0, 0]} />
        {/* Sideboard Storage Credenza against East Wall Glass Partition */}
        <StorageCredenza position={[358, 0, 192]} rotation={[0, -Math.PI / 2, 0]} />
        {/* Biophilic Corner Plants */}
        <LushPlant position={[45, 0, 45]} />
        <LushPlant position={[45, 0, 335]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 2: LARGE TEAM WORKSPACE (COLLABORATIVE DESK PODS)         */}
      {/* ============================================================== */}
      <group>
        {/* West Wing: 2 Organized 4-Person Desk Clusters (North at Z=120, South at Z=260) */}
        <TeamDeskCluster position={[470, 0, 120]} />
        <TeamDeskCluster position={[470, 0, 260]} />

        {/* East Wing: 2 Organized 4-Person Desk Clusters (North at Z=120, South at Z=260) */}
        <TeamDeskCluster position={[710, 0, 120]} />
        <TeamDeskCluster position={[710, 0, 260]} />

        {/* Biophilic Planter Partitions Flanking the 160-Unit Wide Central Avenue */}
        <PlanterTrough position={[540, 0, 120]} rotation={[0, Math.PI / 2, 0]} />
        <PlanterTrough position={[540, 0, 260]} rotation={[0, Math.PI / 2, 0]} />
        <PlanterTrough position={[640, 0, 120]} rotation={[0, Math.PI / 2, 0]} />
        <PlanterTrough position={[640, 0, 260]} rotation={[0, Math.PI / 2, 0]} />

        {/* Sprint Agile Whiteboards on Perimeter Walls */}
        <AgileWhiteboard position={[395, 0, 120]} rotation={[0, Math.PI / 2, 0]} />
        <AgileWhiteboard position={[395, 0, 260]} rotation={[0, Math.PI / 2, 0]} />
        <AgileWhiteboard position={[789, 0, 120]} rotation={[0, -Math.PI / 2, 0]} />
        <AgileWhiteboard position={[789, 0, 260]} rotation={[0, -Math.PI / 2, 0]} />

        {/* Storage Units along North Wall */}
        <StorageCredenza position={[470, 0, 48]} rotation={[0, 0, 0]} />
        <StorageCredenza position={[710, 0, 48]} rotation={[0, 0, 0]} />

        {/* Architectural Corner Greenery */}
        <LushPlant position={[395, 0, 48]} />
        <LushPlant position={[395, 0, 335]} />
        <LushPlant position={[789, 0, 48]} />
        <LushPlant position={[789, 0, 335]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 5: PRIVATE OFFICES & MEETING PODS (RESTRICTED)            */}
      {/* ============================================================== */}
      <group>
        {/* Private Executive Suite (Accurate Recreation from Reference Image) */}
        <PrivateExecutiveOfficeSuite />

        {/* Meeting Pod 1 (North) */}
        <group>
          <MeetingPodSuite position={[1072, 0, 96]} />
          <PodWallDisplay position={[1115, 0, 96]} rotation={[0, -Math.PI / 2, 0]} />
        </group>

        {/* Meeting Pod 2 (South) */}
        <group>
          <MeetingPodSuite position={[1072, 0, 270]} />
          <PodWallDisplay position={[1115, 0, 270]} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      </group>

      {/* ============================================================== */}
      {/* ZONE 6: LOUNGE & RELAXATION AREA                               */}
      {/* ============================================================== */}
      <group>
        <LoungeSuite position={[576, 0, 610]} />
        {/* Luxury Accent Basket Swing in Relaxation Corner */}
        <BasketSwingChairModel position={[675, 0, 670]} rotation={[0, -Math.PI * 0.75, 0]} />
        <StorageCredenza position={[435, 0, 530]} rotation={[0, Math.PI / 2, 0]} />
        <LushPlant position={[435, 0, 715]} />
        <LushPlant position={[715, 0, 715]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 6 (EAST): PANTRY & KITCHEN DINING SUITE                   */}
      {/* ============================================================== */}
      <group>
        <PantryKitchenSuite position={[864, 0, 670]} />
        <LushPlant position={[940, 0, 505]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 4: BREAKOUT & CASUAL CREATIVE COLLABORATION               */}
      {/* ============================================================== */}
      <group>
        <BreakoutSuite position={[1056, 0, 640]} />
        <LushPlant position={[1100, 0, 505]} />
      </group>
    </group>
  );
}
