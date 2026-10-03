import React, { useEffect } from 'react';
import * as THREE from 'three';
import { geometryPool } from '../../utils/geometryPool.js';
import { materialPool } from '../../utils/materialPool.js';
import { interactionRegistry, InteractableObject } from '../../systems/interactionSystem.js';
import { CollisionSystem } from '../../systems/collision.js';

// Ergonomic Mesh & Leather Office Chair
function OfficeChair({ position, rotation = [0, 0, 0], color = 'navy' }) {
  const fabricMat = color === 'cream' ? materialPool.fabricCream : materialPool.fabricNavy;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 6.2, 0]} geometry={geometryPool.chairSeat} material={fabricMat} castShadow receiveShadow />
      <mesh position={[0, 11.2, 3.6]} geometry={geometryPool.chairBack} material={fabricMat} castShadow />
      <mesh position={[-4.2, 8.5, 0.5]} geometry={geometryPool.chairArm} material={materialPool.metal} />
      <mesh position={[4.2, 8.5, 0.5]} geometry={geometryPool.chairArm} material={materialPool.metal} />
      <mesh position={[0, 3.1, 0]} geometry={geometryPool.chairPole} material={materialPool.metalChrome} />
      <mesh position={[0, 0.6, 0]} geometry={geometryPool.chairBase} material={materialPool.metalChrome} />
    </group>
  );
}

// Mid-Century Modern Club Lounge Armchair (Back at +Z, facing -Z)
function ClubArmchair({ position, rotation = [0, 0, 0], color = 'cream' }) {
  const fabricMat = color === 'cream' ? materialPool.fabricCream : materialPool.fabricTeal;

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 5.5, 0]} geometry={geometryPool.loungeArmchairSeat} material={fabricMat} castShadow receiveShadow />
      <mesh position={[0, 12, 6.5]} geometry={geometryPool.loungeArmchairBack} material={fabricMat} castShadow />
      {/* Tapered black metal legs */}
      <mesh position={[-6.8, 2.5, 6]} geometry={geometryPool.loungeArmchairLeg} material={materialPool.metal} />
      <mesh position={[6.8, 2.5, 6]} geometry={geometryPool.loungeArmchairLeg} material={materialPool.metal} />
      <mesh position={[-6.8, 2.5, -6]} geometry={geometryPool.loungeArmchairLeg} material={materialPool.metal} />
      <mesh position={[6.8, 2.5, -6]} geometry={geometryPool.loungeArmchairLeg} material={materialPool.metal} />
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

// Modern Storage Credenza / Sideboard
function StorageCredenza({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 6, 0]} geometry={geometryPool.credenza} material={materialPool.metal} castShadow receiveShadow />
      <mesh position={[0, 12.6, 0]} geometry={geometryPool.credenzaTop} material={materialPool.wood} castShadow receiveShadow />
      {/* Decorative Ceramic Coffee Mug */}
      <mesh position={[-12, 13.9, 0]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
    </group>
  );
}

// Human-Scale Collaborative 4-Person Desk Pod with Acoustic Screens
function TeamDeskCluster({ position }) {
  return (
    <group position={position}>
      {/* Central Acoustic Privacy Divider Screen */}
      <mesh position={[0, 16, 0]} geometry={geometryPool.deskPartition} material={materialPool.fabricNavy} />

      {/* North Facing Desks (2 workstations side by side) */}
      <group position={[0, 0, -10]}>
        {/* Left Desk */}
        <group position={[-18, 0, 0]}>
          <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
          <mesh position={[-15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          <mesh position={[15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          {/* Dual curved screens */}
          <mesh position={[-6, 17, 5]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[-6, 14, 5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          <mesh position={[7, 17, 4.5]} rotation={[0, 0.25, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[7, 14, 4.5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          {/* Keyboard & Mousepad */}
          <mesh position={[-4, 12.8, -2]} geometry={geometryPool.keyboard} material={materialPool.metal} />
          <mesh position={[7, 12.7, -2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
          {/* Chair */}
          <OfficeChair position={[0, 0, -14]} rotation={[0, Math.PI, 0]} color="navy" />
        </group>

        {/* Right Desk */}
        <group position={[18, 0, 0]}>
          <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
          <mesh position={[-15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          <mesh position={[15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          <mesh position={[-6, 17, 5]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[-6, 14, 5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          <mesh position={[7, 17, 4.5]} rotation={[0, 0.25, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[7, 14, 4.5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          <mesh position={[-4, 12.8, -2]} geometry={geometryPool.keyboard} material={materialPool.metal} />
          <mesh position={[7, 12.7, -2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
          <mesh position={[-12, 13.5, 3]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
          <OfficeChair position={[0, 0, -14]} rotation={[0, Math.PI, 0]} color="cream" />
        </group>
      </group>

      {/* South Facing Desks (2 workstations facing the other way) */}
      <group position={[0, 0, 10]} rotation={[0, Math.PI, 0]}>
        {/* Left Desk */}
        <group position={[-18, 0, 0]}>
          <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
          <mesh position={[-15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          <mesh position={[15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          <mesh position={[-6, 17, 5]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[-6, 14, 5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          <mesh position={[7, 17, 4.5]} rotation={[0, 0.25, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[7, 14, 4.5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          <mesh position={[-4, 12.8, -2]} geometry={geometryPool.keyboard} material={materialPool.metal} />
          <mesh position={[7, 12.7, -2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
          <OfficeChair position={[0, 0, -14]} rotation={[0, Math.PI, 0]} color="cream" />
        </group>

        {/* Right Desk */}
        <group position={[18, 0, 0]}>
          <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.wood} castShadow receiveShadow />
          <mesh position={[-15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          <mesh position={[15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
          <mesh position={[-6, 17, 5]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[-6, 14, 5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          <mesh position={[7, 17, 4.5]} rotation={[0, 0.25, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
          <mesh position={[7, 14, 4.5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
          <mesh position={[-4, 12.8, -2]} geometry={geometryPool.keyboard} material={materialPool.metal} />
          <mesh position={[7, 12.7, -2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
          <OfficeChair position={[0, 0, -14]} rotation={[0, Math.PI, 0]} color="navy" />
        </group>
      </group>
    </group>
  );
}

// Executive Single Workstation (For Private Suite / Studio)
function ExecutiveWorkstation({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 12, 0]} geometry={geometryPool.deskTop} material={materialPool.woodDark} castShadow receiveShadow />
      <mesh position={[-15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />
      <mesh position={[15, 6, 0]} geometry={geometryPool.deskLeg} material={materialPool.metal} castShadow />

      {/* Dual Curved Executive Screens */}
      <mesh position={[-7, 17, -4]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
      <mesh position={[-7, 14, -4.5]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />
      <mesh position={[8, 17, -3.5]} rotation={[0, -0.25, 0]} geometry={geometryPool.deskScreen} material={materialPool.screen} castShadow />
      <mesh position={[8, 14, -4]} geometry={geometryPool.deskScreenStand} material={materialPool.metal} />

      {/* Keyboard & Mousepad */}
      <mesh position={[-4, 12.8, 2]} geometry={geometryPool.keyboard} material={materialPool.metal} />
      <mesh position={[7, 12.7, 2]} geometry={geometryPool.mousePad} material={materialPool.fabricNavy} />
      <mesh position={[12, 13.5, 3]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />

      {/* Executive Leather Chair */}
      <OfficeChair position={[0, 0, 14]} rotation={[0, 0, 0]} color="navy" />

      {/* Guest / Visitor Chairs Facing the Desk */}
      <ClubArmchair position={[-12, 0, -18]} rotation={[0, Math.PI, 0]} color="cream" />
      <ClubArmchair position={[12, 0, -18]} rotation={[0, Math.PI, 0]} color="cream" />
    </group>
  );
}

// Grand Executive Boardroom Conference Suite (8-10 Seater with Presentation Hub)
function ConferenceBoardroomSuite({ position }) {
  return (
    <group position={position}>
      {/* Grand Executive Conference Table */}
      <mesh position={[0, 12, 0]} geometry={geometryPool.conferenceTableTop} material={materialPool.wood} castShadow receiveShadow />
      <mesh position={[-22, 6, 0]} geometry={geometryPool.conferenceTableBase} material={materialPool.metal} castShadow />
      <mesh position={[22, 6, 0]} geometry={geometryPool.conferenceTableBase} material={materialPool.metal} castShadow />
      {/* Central Cable Connectivity Hub */}
      <mesh position={[0, 13.2, 0]} geometry={geometryPool.conferenceCenterHub} material={materialPool.metal} />

      {/* 3 North Chairs */}
      {[-24, 0, 24].map((x, i) => (
        <OfficeChair key={`cn_${i}`} position={[x, 0, -18]} rotation={[0, Math.PI, 0]} color="cream" />
      ))}

      {/* 3 South Chairs */}
      {[-24, 0, 24].map((x, i) => (
        <OfficeChair key={`cs_${i}`} position={[x, 0, 18]} rotation={[0, 0, 0]} color="cream" />
      ))}

      {/* 1 West Head Chair */}
      <OfficeChair position={[-42, 0, 0]} rotation={[0, -Math.PI / 2, 0]} color="navy" />

      {/* 1 East Head Chair */}
      <OfficeChair position={[42, 0, 0]} rotation={[0, Math.PI / 2, 0]} color="navy" />
    </group>
  );
}

// Biophilic Architectural Indoor Plant (Ficus / Monstera)
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

// Modern Lounge Suite with Sofa, Oak Coffee Table, Armchairs, and Lamp
function LoungeArea({ position }) {
  return (
    <group position={position}>
      {/* 3-Seater Modern Sectional Sofa */}
      <group position={[0, 0, -18]}>
        <mesh position={[0, 2.5, 0]} geometry={geometryPool.sofaBase} material={materialPool.fabricNavy} castShadow receiveShadow />
        <mesh position={[0, 9.5, -7]} geometry={geometryPool.sofaBack} material={materialPool.fabricNavy} castShadow />
        <mesh position={[-21, 6.5, 0]} geometry={geometryPool.sofaArm} material={materialPool.fabricNavy} castShadow />
        <mesh position={[21, 6.5, 0]} geometry={geometryPool.sofaArm} material={materialPool.fabricNavy} castShadow />
        {/* Soft Designer Accent Cushions */}
        <mesh position={[-12, 5.5, 1]} geometry={geometryPool.sofaCushion} material={materialPool.fabricTeal} />
        <mesh position={[0, 5.5, 1]} geometry={geometryPool.sofaCushion} material={materialPool.fabricNavy} />
        <mesh position={[12, 5.5, 1]} geometry={geometryPool.sofaCushion} material={materialPool.fabricTeal} />
      </group>

      {/* Low Blonde Oak Coffee Table */}
      <group position={[0, 0, 10]}>
        <mesh position={[0, 6, 0]} geometry={geometryPool.coffeeTableTop} material={materialPool.wood} castShadow receiveShadow />
        <mesh position={[-10, 3, -6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        <mesh position={[10, 3, -6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        <mesh position={[-10, 3, 6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        <mesh position={[10, 3, 6]} geometry={geometryPool.coffeeTableLeg} material={materialPool.metal} />
        {/* Coffee Mugs */}
        <mesh position={[-4, 7.5, -2]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
        <mesh position={[5, 7.5, 1]} geometry={geometryPool.coffeeMug} material={materialPool.coffeeMug} />
      </group>

      {/* Flanking Mid-Century Armchairs Facing the Coffee Table */}
      <ClubArmchair position={[-34, 0, 10]} rotation={[0, -Math.PI / 2, 0]} color="cream" />
      <ClubArmchair position={[34, 0, 10]} rotation={[0, Math.PI / 2, 0]} color="cream" />

      {/* Designer Floor Lamp */}
      <FloorLamp position={[34, 0, -20]} />
    </group>
  );
}

// Corporate Headquarters Reception Desk & Entrance Suite
function ReceptionSuite({ position }) {
  return (
    <group position={position}>
      {/* Front Reception Counter with Sleek Black Marble Front and Blonde Oak Ledge */}
      <mesh position={[0, 8.5, 0]} geometry={geometryPool.receptionCounter} material={materialPool.receptionFront} castShadow receiveShadow />
      <mesh position={[0, 17.5, 0]} geometry={geometryPool.receptionTop} material={materialPool.wood} castShadow receiveShadow />
      <mesh position={[0, 9, 9.2]} geometry={geometryPool.receptionAccent} material={materialPool.receptionAccent} />

      {/* Receptionist Ergonomic Chair Facing South Toward Counter and Lobby */}
      <OfficeChair position={[0, 0, -14]} rotation={[0, Math.PI, 0]} color="navy" />

      {/* Branding Wall Backdrop */}
      <group position={[0, 0, -26]}>
        <mesh position={[0, 18, 0]} geometry={geometryPool.receptionLogoBackdrop} material={materialPool.blackAluminum} />
        {/* Glowing Ambient Cyan Accent Line */}
        <mesh position={[0, 18, 0.5]} scale={[0.85, 0.08, 1]} geometry={geometryPool.receptionLogoBackdrop} material={materialPool.receptionAccent} />
      </group>

      {/* Flanking Biophilic Lush Trees */}
      <LushPlant position={[-38, 0, 0]} />
      <LushPlant position={[38, 0, 0]} />
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
      {/* Mobile Caster Wheel Bases */}
      <mesh position={[-18, 1, 0]} geometry={geometryPool.whiteboardWheelBase} material={materialPool.metal} />
      <mesh position={[18, 1, 0]} geometry={geometryPool.whiteboardWheelBase} material={materialPool.metal} />
    </group>
  );
}

// Wall-Mounted 85" Ultra-HD Presentation Screen
function PresentationWallScreen({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 24, 0]} geometry={geometryPool.screenFrame} material={materialPool.metal} />
      <mesh position={[0, 24, 0.4]} geometry={geometryPool.presentationScreen} material={materialPool.screenPresentation} />
    </group>
  );
}

// The Full Curated Workspace Environment Furniture Layout with Interaction & Collision Registration
export function WorkspaceFurniture({ mapData }) {
  useEffect(() => {
    // 1. Register all interactable chairs into the Interaction Registry
    const chairs = [
      // Lobby (Zone 1)
      new InteractableObject({
        id: 'chair_reception',
        position: [160, 0, 54],
        chairPosition: [160, 0, 54],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [160, -2.5, 54],
        sitRotation: Math.PI,
        exitPosition: [160, 0, 42],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_lobby_w1',
        position: [75, 0, 115],
        chairPosition: [75, 0, 115],
        chairRotation: [0, -Math.PI / 2, 0],
        sitPosition: [75, -2.5, 115],
        sitRotation: -Math.PI / 2,
        exitPosition: [63, 0, 115],
        exitRotation: -Math.PI / 2
      }),
      new InteractableObject({
        id: 'chair_lobby_w2',
        position: [115, 0, 115],
        chairPosition: [115, 0, 115],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [115, -2.5, 115],
        sitRotation: Math.PI / 2,
        exitPosition: [127, 0, 115],
        exitRotation: Math.PI / 2
      }),

      // Team Workspace (Zone 2) - 4-Person Pod
      new InteractableObject({
        id: 'chair_team_nl',
        position: [132, 0, 232],
        chairPosition: [132, 0, 232],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [132, -2.5, 232],
        sitRotation: Math.PI,
        exitPosition: [132, 0, 220],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_team_nr',
        position: [168, 0, 232],
        chairPosition: [168, 0, 232],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [168, -2.5, 232],
        sitRotation: Math.PI,
        exitPosition: [168, 0, 220],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_team_sl',
        position: [132, 0, 280],
        chairPosition: [132, 0, 280],
        chairRotation: [0, 0, 0],
        sitPosition: [132, -2.5, 280],
        sitRotation: 0,
        exitPosition: [132, 0, 292],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_team_sr',
        position: [168, 0, 280],
        chairPosition: [168, 0, 280],
        chairRotation: [0, 0, 0],
        sitPosition: [168, -2.5, 280],
        sitRotation: 0,
        exitPosition: [168, 0, 292],
        exitRotation: 0
      }),

      // Boardroom Conference Suite (Zone 3) - 8 Chairs
      new InteractableObject({
        id: 'chair_boardroom_n1',
        position: [440, 0, 238],
        chairPosition: [440, 0, 238],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [440, -2.5, 238],
        sitRotation: Math.PI,
        exitPosition: [440, 0, 226],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_boardroom_n2',
        position: [464, 0, 238],
        chairPosition: [464, 0, 238],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [464, -2.5, 238],
        sitRotation: Math.PI,
        exitPosition: [464, 0, 226],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_boardroom_n3',
        position: [488, 0, 238],
        chairPosition: [488, 0, 238],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [488, -2.5, 238],
        sitRotation: Math.PI,
        exitPosition: [488, 0, 226],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_boardroom_s1',
        position: [440, 0, 274],
        chairPosition: [440, 0, 274],
        chairRotation: [0, 0, 0],
        sitPosition: [440, -2.5, 274],
        sitRotation: 0,
        exitPosition: [440, 0, 286],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_boardroom_s2',
        position: [464, 0, 274],
        chairPosition: [464, 0, 274],
        chairRotation: [0, 0, 0],
        sitPosition: [464, -2.5, 274],
        sitRotation: 0,
        exitPosition: [464, 0, 286],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_boardroom_s3',
        position: [488, 0, 274],
        chairPosition: [488, 0, 274],
        chairRotation: [0, 0, 0],
        sitPosition: [488, -2.5, 274],
        sitRotation: 0,
        exitPosition: [488, 0, 286],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_boardroom_w',
        position: [422, 0, 256],
        chairPosition: [422, 0, 256],
        chairRotation: [0, -Math.PI / 2, 0],
        sitPosition: [422, -2.5, 256],
        sitRotation: -Math.PI / 2,
        exitPosition: [410, 0, 256],
        exitRotation: -Math.PI / 2
      }),
      new InteractableObject({
        id: 'chair_boardroom_e',
        position: [506, 0, 256],
        chairPosition: [506, 0, 256],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [506, -2.5, 256],
        sitRotation: Math.PI / 2,
        exitPosition: [518, 0, 256],
        exitRotation: Math.PI / 2
      }),

      // Project Lab (Zone 4) - 4-Person Pod
      new InteractableObject({
        id: 'chair_proj_nl',
        position: [132, 0, 376],
        chairPosition: [132, 0, 376],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [132, -2.5, 376],
        sitRotation: Math.PI,
        exitPosition: [132, 0, 364],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_proj_nr',
        position: [168, 0, 376],
        chairPosition: [168, 0, 376],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [168, -2.5, 376],
        sitRotation: Math.PI,
        exitPosition: [168, 0, 364],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_proj_sl',
        position: [132, 0, 424],
        chairPosition: [132, 0, 424],
        chairRotation: [0, 0, 0],
        sitPosition: [132, -2.5, 424],
        sitRotation: 0,
        exitPosition: [132, 0, 436],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_proj_sr',
        position: [168, 0, 424],
        chairPosition: [168, 0, 424],
        chairRotation: [0, 0, 0],
        sitPosition: [168, -2.5, 424],
        sitRotation: 0,
        exitPosition: [168, 0, 436],
        exitRotation: 0
      }),

      // Private Executive Suite (Zone 5)
      new InteractableObject({
        id: 'chair_exec_main',
        position: [470, 0, 409],
        chairPosition: [470, 0, 409],
        chairRotation: [0, 0, 0],
        sitPosition: [470, -2.5, 409],
        sitRotation: 0,
        exitPosition: [470, 0, 421],
        exitRotation: 0
      }),
      new InteractableObject({
        id: 'chair_exec_v1',
        position: [458, 0, 377],
        chairPosition: [458, 0, 377],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [458, -2.5, 377],
        sitRotation: Math.PI,
        exitPosition: [458, 0, 365],
        exitRotation: Math.PI
      }),
      new InteractableObject({
        id: 'chair_exec_v2',
        position: [482, 0, 377],
        chairPosition: [482, 0, 377],
        chairRotation: [0, Math.PI, 0],
        sitPosition: [482, -2.5, 377],
        sitRotation: Math.PI,
        exitPosition: [482, 0, 365],
        exitRotation: Math.PI
      }),

      // Lounge Area (Zone 6)
      new InteractableObject({
        id: 'chair_lounge_1',
        position: [430, 0, 106],
        chairPosition: [430, 0, 106],
        chairRotation: [0, -Math.PI / 2, 0],
        sitPosition: [430, -2.5, 106],
        sitRotation: -Math.PI / 2,
        exitPosition: [418, 0, 106],
        exitRotation: -Math.PI / 2
      }),
      new InteractableObject({
        id: 'chair_lounge_2',
        position: [498, 0, 106],
        chairPosition: [498, 0, 106],
        chairRotation: [0, Math.PI / 2, 0],
        sitPosition: [498, -2.5, 106],
        sitRotation: Math.PI / 2,
        exitPosition: [510, 0, 106],
        exitRotation: Math.PI / 2
      })
    ];

    chairs.forEach(chair => interactionRegistry.register(chair));

    // 2. Register furniture collision obstacles (desks, tables, credenzas, counters)
    const obstacles = [
      // Reception Counter
      { id: 'obs_reception', minX: 132, maxX: 188, minZ: 59, maxZ: 77 },
      // Team Desk Cluster
      { id: 'obs_team_desk', minX: 114, maxX: 186, minZ: 246, maxZ: 266 },
      // Project Desk Cluster
      { id: 'obs_proj_desk', minX: 114, maxX: 186, minZ: 390, maxZ: 410 },
      // Conference Boardroom Table
      { id: 'obs_conf_table', minX: 424, maxX: 504, minZ: 240, maxZ: 272 },
      // Executive Desk
      { id: 'obs_exec_desk', minX: 452, maxX: 488, minZ: 386, maxZ: 404 },
      // Lounge Coffee Table & Sofa
      { id: 'obs_lounge_table', minX: 450, maxX: 478, minZ: 100, maxZ: 116 },
      { id: 'obs_lounge_sofa', minX: 440, maxX: 488, minZ: 70, maxZ: 86 },
      // Storage Credenzas
      { id: 'obs_cred_team', minX: 66, maxX: 78, minZ: 198, maxZ: 242 },
      { id: 'obs_cred_board', minX: 442, maxX: 486, minZ: 198, maxZ: 210 },
      { id: 'obs_cred_proj', minX: 192, maxX: 238, minZ: 358, maxZ: 372 },
      { id: 'obs_cred_exec', minX: 448, maxX: 492, minZ: 428, maxZ: 442 },
      { id: 'obs_cred_lounge', minX: 342, maxX: 388, minZ: 58, maxZ: 72 },
      // Whiteboards
      { id: 'obs_wb_team', minX: 224, maxX: 246, minZ: 270, maxZ: 290 },
      { id: 'obs_wb_proj', minX: 66, maxX: 78, minZ: 380, maxZ: 420 }
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
      {/* ZONE 1: LOBBY & RECEPTION                                     */}
      {/* ============================================================== */}
      <group>
        <ReceptionSuite position={[160, 0, 68]} />
        <ClubArmchair position={[75, 0, 115]} rotation={[0, Math.PI / 4, 0]} color="cream" />
        <ClubArmchair position={[115, 0, 115]} rotation={[0, -Math.PI / 4, 0]} color="cream" />
        <mesh position={[95, 4, 115]} geometry={geometryPool.coffeeTableTop} scale={[0.5, 1, 0.5]} material={materialPool.wood} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 2: TEAM WORKSPACE                                        */}
      {/* ============================================================== */}
      <group>
        <TeamDeskCluster position={[150, 0, 256]} />
        <AgileWhiteboard position={[235, 0, 280]} rotation={[0, -Math.PI / 6, 0]} />
        <StorageCredenza position={[72, 0, 220]} rotation={[0, Math.PI / 2, 0]} />
        <LushPlant position={[235, 0, 215]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 3: MEETING ROOM & BOARDROOM                              */}
      {/* ============================================================== */}
      <group>
        <ConferenceBoardroomSuite position={[464, 0, 256]} />
        <PresentationWallScreen position={[596, 0, 256]} rotation={[0, -Math.PI / 2, 0]} />
        <StorageCredenza position={[464, 0, 204]} rotation={[0, 0, 0]} />
        <LushPlant position={[350, 0, 210]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 4: PROJECT LAB & SPRINT ROOM                             */}
      {/* ============================================================== */}
      <group>
        <TeamDeskCluster position={[150, 0, 400]} />
        <AgileWhiteboard position={[72, 0, 400]} rotation={[0, Math.PI / 2, 0]} />
        <StorageCredenza position={[215, 0, 365]} rotation={[0, 0, 0]} />
        <LushPlant position={[235, 0, 425]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 5: PRIVATE EXECUTIVE SUITE (RESTRICTED)                  */}
      {/* ============================================================== */}
      <group>
        <ExecutiveWorkstation position={[470, 0, 395]} rotation={[0, 0, 0]} />
        <StorageCredenza position={[470, 0, 435]} rotation={[0, 0, 0]} />
        <FloorLamp position={[545, 0, 430]} />
        <LushPlant position={[380, 0, 430]} />
      </group>

      {/* ============================================================== */}
      {/* ZONE 6: LOUNGE & SOCIAL CHILL AREA                            */}
      {/* ============================================================== */}
      <group>
        <LoungeArea position={[464, 0, 96]} />
        <StorageCredenza position={[365, 0, 65]} rotation={[0, 0, 0]} />
        <LushPlant position={[350, 0, 125]} />
        <LushPlant position={[570, 0, 125]} />
      </group>
    </group>
  );
}
