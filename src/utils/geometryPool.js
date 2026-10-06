import * as THREE from 'three';
import { TILE_SIZE } from '../constants/grid.js';

class GeometryPool {
  constructor() {
    // World Floors
    this.tile = new THREE.BoxGeometry(TILE_SIZE, 1.0, TILE_SIZE);

    // Modern Minimalist Glass Architecture (Large Panoramic Glass, Slim Tracks, Zero Cage Density)
    const wallH = 58.8; // 42 * 1.4 = 58.8
    this.glassPane = new THREE.BoxGeometry(TILE_SIZE, wallH - 0.8, 0.2);
    this.trackBottom = new THREE.BoxGeometry(TILE_SIZE, 0.4, 0.5);
    this.trackTop = new THREE.BoxGeometry(TILE_SIZE, 0.4, 0.5);
    this.wallCornerPost = new THREE.BoxGeometry(0.6, wallH, 0.6);
    this.cornerPostCap = new THREE.BoxGeometry(0.75, 0.5, 0.75);

    // Slim Architectural Structural Columns
    this.pillarShaft = new THREE.BoxGeometry(2.2, wallH, 2.2);
    this.pillarBase = new THREE.BoxGeometry(2.5, 0.6, 2.5);

    // Reusable mullions & frame details
    this.mullionVertical = new THREE.BoxGeometry(0.25, wallH - 0.8, 0.5);
    this.doorThreshold = new THREE.BoxGeometry(TILE_SIZE, 0.08, 0.6);

    // Glass Doorway with Minimalist Jambs
    this.doorHeader = new THREE.BoxGeometry(TILE_SIZE, 0.6, 0.6);
    this.doorFrameTop = this.doorHeader;
    this.doorJamb = new THREE.BoxGeometry(0.6, wallH, 0.6);
    this.glassDoorLeaf = new THREE.BoxGeometry(20, wallH - 1.2, 0.25);
    this.doorHandle = new THREE.CylinderGeometry(0.25, 0.25, 16, 8);
    this.doorHandleStandoff = new THREE.CylinderGeometry(0.15, 0.15, 0.45, 8);
    this.roomSignPlaque = new THREE.BoxGeometry(12, 3.2, 0.4);

    // Human-Scale Workstations & Collaborative Pods
    this.deskTop = new THREE.BoxGeometry(34, 1.6, 18);
    this.deskLeg = new THREE.BoxGeometry(1.2, 12.5, 16);
    this.deskPartition = new THREE.BoxGeometry(34, 8, 0.6); // Acoustic privacy screen
    this.deskScreen = new THREE.BoxGeometry(16, 9.5, 0.5); // Large curved display
    this.deskScreenStand = new THREE.BoxGeometry(2, 5, 2.5);
    this.keyboard = new THREE.BoxGeometry(9.5, 0.25, 3.6);
    this.mousePad = new THREE.BoxGeometry(4.5, 0.1, 4.5);

    // Executive & Ergonomic Mesh Chairs
    this.chairSeat = new THREE.BoxGeometry(8.5, 1.6, 8.5);
    this.chairBack = new THREE.BoxGeometry(8.2, 10, 1.2);
    this.chairArm = new THREE.BoxGeometry(1.0, 5.5, 6.5);
    this.chairPole = new THREE.CylinderGeometry(0.8, 0.8, 6.5, 8);
    this.chairBase = new THREE.CylinderGeometry(4.8, 4.8, 0.6, 6);

    // Modern Mid-Century Club Armchair
    this.loungeArmchairSeat = new THREE.BoxGeometry(16, 3.5, 15);
    this.loungeArmchairBack = new THREE.BoxGeometry(16, 12, 3.5);
    this.loungeArmchairLeg = new THREE.CylinderGeometry(0.4, 0.3, 5, 8);

    // Conference Meeting Suite (Grand Executive Boardroom - 12 Seater)
    this.conferenceTableTop = new THREE.BoxGeometry(144, 2.4, 48);
    this.conferenceTableBase = new THREE.BoxGeometry(24, 12.5, 20);
    this.conferenceCenterHub = new THREE.BoxGeometry(64, 0.3, 10); // Cable connectivity box
    this.presentationScreen = new THREE.BoxGeometry(54, 30, 1.0);
    this.screenFrame = new THREE.BoxGeometry(56, 32, 0.4);

    // Storage Credenza / Sideboard
    this.credenza = new THREE.BoxGeometry(42, 12, 11);
    this.credenzaTop = new THREE.BoxGeometry(44, 1.2, 12);

    // Project Whiteboard on Stand
    this.whiteboardPanel = new THREE.BoxGeometry(44, 26, 0.5);
    this.whiteboardFrame = new THREE.BoxGeometry(46, 28, 0.3);
    this.whiteboardShelf = new THREE.BoxGeometry(42, 0.5, 2.8);
    this.whiteboardWheelBase = new THREE.BoxGeometry(3.0, 1.5, 12);

    // Lounge Area & Sectional Sofas
    this.sofaBase = new THREE.BoxGeometry(48, 4.5, 20);
    this.sofaBack = new THREE.BoxGeometry(48, 14, 5.5);
    this.sofaArm = new THREE.BoxGeometry(6, 10, 20);
    this.sofaCushion = new THREE.BoxGeometry(18, 3.5, 15);
    this.loungeAreaRug = new THREE.BoxGeometry(90, 0.1, 60);
    this.coffeeTableTop = new THREE.BoxGeometry(36, 1.6, 18);
    this.coffeeTableLeg = new THREE.CylinderGeometry(0.6, 0.6, 6.5, 8);
    this.coffeeMug = new THREE.CylinderGeometry(0.8, 0.7, 1.4, 8);

    // Floor Lamp
    this.lampBase = new THREE.CylinderGeometry(3.5, 3.5, 0.4, 12);
    this.lampPole = new THREE.CylinderGeometry(0.3, 0.3, 28, 8);
    this.lampShade = new THREE.CylinderGeometry(3.2, 4.5, 6, 12);

    // Biophilic Architecture Plants & Planter Troughs
    this.plantPot = new THREE.CylinderGeometry(5.2, 3.8, 10, 12);
    this.plantStem = new THREE.CylinderGeometry(0.7, 0.9, 18, 8);
    this.plantFoliage = new THREE.SphereGeometry(5.5, 8, 8);
    this.planterTrough = new THREE.BoxGeometry(36, 6.5, 8);
    this.troughFoliage = new THREE.BoxGeometry(34, 5.5, 7);

    // Reception Counter & "HACKIFY" Slat Branding Backdrop
    this.receptionCounter = new THREE.BoxGeometry(68, 17, 18);
    this.receptionTop = new THREE.BoxGeometry(72, 2.2, 20);
    this.receptionAccent = new THREE.BoxGeometry(64, 1.6, 0.5);
    this.receptionLogoBackdrop = new THREE.BoxGeometry(86, 36, 1.2);
    this.woodSlat = new THREE.BoxGeometry(0.8, 36, 0.8);

    // Pantry / Kitchen & Dining Bar
    this.kitchenIslandCounter = new THREE.BoxGeometry(72, 15.5, 20);
    this.kitchenIslandTop = new THREE.BoxGeometry(76, 2.0, 23);
    this.barStoolSeat = new THREE.CylinderGeometry(3.6, 3.4, 1.6, 12);
    this.barStoolLeg = new THREE.CylinderGeometry(0.35, 0.45, 12.5, 8);
    this.kitchenBackCounter = new THREE.BoxGeometry(90, 14, 14);
    this.kitchenBackTop = new THREE.BoxGeometry(92, 1.6, 15);
    this.kitchenOverheadCabinet = new THREE.BoxGeometry(90, 12, 10);
    this.coffeeMachine = new THREE.BoxGeometry(6.5, 6.5, 6);
    this.microwave = new THREE.BoxGeometry(7, 4.5, 4.5);
    this.diningTableTop = new THREE.BoxGeometry(40, 1.8, 24);
    this.diningTableLeg = new THREE.CylinderGeometry(0.6, 0.8, 12, 8);

    // Meeting Pods & Breakout Round Tables & Poufs
    this.roundTableTop = new THREE.CylinderGeometry(14, 14, 1.6, 24);
    this.roundTablePedestal = new THREE.CylinderGeometry(1.2, 1.8, 12.5, 12);
    this.roundTableBase = new THREE.CylinderGeometry(6.5, 6.5, 0.6, 16);
    this.poufSeat = new THREE.CylinderGeometry(4.8, 4.8, 5.0, 14);
    this.podWallDisplay = new THREE.BoxGeometry(26, 16, 0.6);

    // Lock Indicator Badge
    this.lockBadge = new THREE.BoxGeometry(5.5, 5.5, 0.8);

    // Modern Stylized Humanoid Avatar Geometries (Articulated Skeletal Joint Hierarchy)
    this.avatarTorso = new THREE.BoxGeometry(5.8, 8.8, 3.4);
    this.avatarPelvis = new THREE.BoxGeometry(5.4, 2.6, 3.2);
    this.avatarShoulders = new THREE.BoxGeometry(6.8, 1.8, 3.4);
    this.avatarShirt = new THREE.BoxGeometry(3.6, 6.2, 0.5);
    this.avatarCollar = new THREE.BoxGeometry(3.8, 1.2, 0.6);
    this.avatarTie = new THREE.BoxGeometry(1.2, 4.8, 0.3);
    this.avatarNeck = new THREE.CylinderGeometry(1.0, 1.1, 2.2, 12);
    this.avatarHead = new THREE.SphereGeometry(2.7, 18, 18);
    this.avatarHairShort = new THREE.SphereGeometry(3.05, 16, 16);
    this.avatarHairLong = new THREE.CylinderGeometry(2.9, 3.3, 7.0, 14);
    this.avatarHairCurly = new THREE.SphereGeometry(3.2, 10, 10);
    
    // Articulated Arms
    this.avatarUpperArm = new THREE.CylinderGeometry(0.95, 0.85, 4.8, 12);
    this.avatarElbowJoint = new THREE.SphereGeometry(0.85, 10, 10);
    this.avatarForearm = new THREE.CylinderGeometry(0.85, 0.75, 4.4, 12);
    this.avatarWristJoint = new THREE.SphereGeometry(0.75, 10, 10);
    this.avatarHand = new THREE.SphereGeometry(0.8, 10, 10);
    this.avatarArm = new THREE.CylinderGeometry(0.85, 1.05, 9.2, 12); // Backward compatibility fallback

    // Articulated Legs & Feet
    this.avatarThigh = new THREE.CylinderGeometry(1.25, 1.05, 6.2, 12);
    this.avatarKneeJoint = new THREE.SphereGeometry(1.05, 10, 10);
    this.avatarShin = new THREE.CylinderGeometry(1.05, 0.9, 5.8, 12);
    this.avatarAnkleJoint = new THREE.SphereGeometry(0.85, 10, 10);
    this.avatarLeg = new THREE.CylinderGeometry(1.15, 1.4, 11.2, 12); // Backward compatibility fallback
    this.avatarShoe = new THREE.BoxGeometry(2.5, 1.5, 4.2);
    // Private Executive Office Suite Specific Geometries
    this.woodSlatFeatureBacking = new THREE.BoxGeometry(132, 58.8, 0.4);
    this.woodSlatVerticalBar = new THREE.BoxGeometry(1.2, 58.8, 1.2);
    this.pendantLightBar = new THREE.BoxGeometry(48, 1.4, 2.0);
    this.pendantLightDiffuser = new THREE.BoxGeometry(47.6, 0.2, 1.6);
    this.pendantCable = new THREE.CylinderGeometry(0.08, 0.08, 14, 6);
    this.coffeeTableRoundTop = new THREE.CylinderGeometry(10.5, 10.5, 1.2, 24);
    this.coffeeTableRoundLeg = new THREE.CylinderGeometry(0.35, 0.25, 7.2, 8);
    this.framedArtCanvas = new THREE.BoxGeometry(26, 32, 0.8);
    this.framedArtFrame = new THREE.BoxGeometry(27.2, 33.2, 0.6);
    this.deskPad = new THREE.BoxGeometry(30, 0.08, 14);
    this.deskUltrawideMonitor = new THREE.BoxGeometry(30, 12.5, 1.0);
    this.lampTripodLeg = new THREE.CylinderGeometry(0.25, 0.35, 23, 8);
    this.lampDrumShade = new THREE.CylinderGeometry(4.2, 4.2, 6.5, 16);

    // Lobby & Reception Specific Geometries (Matching Reference Image)
    this.receptionCounterWaterfallTop = new THREE.BoxGeometry(84, 2.2, 22);
    this.receptionCounterWaterfallSide = new THREE.BoxGeometry(2.2, 15.6, 22);
    this.receptionCounterInteriorDesk = new THREE.BoxGeometry(79.6, 1.4, 16);
    this.receptionSlatFrontBacking = new THREE.BoxGeometry(79.6, 14.0, 1.0);
    this.receptionSlatFrontBar = new THREE.BoxGeometry(1.0, 14.0, 1.0);
    this.receptionKickbase = new THREE.BoxGeometry(80, 1.8, 19);
    this.receptionKickGlow = new THREE.BoxGeometry(78, 0.4, 0.4);

    this.featureWallCenterSlab = new THREE.BoxGeometry(64, 58.8, 1.4);
    this.featureWallSideBacking = new THREE.BoxGeometry(38, 58.8, 0.6);
    this.featureWallFrame = new THREE.BoxGeometry(140.8, 59.2, 0.4);
    this.featureWallCoveLight = new THREE.BoxGeometry(0.8, 58.8, 0.8);
    this.featureWallSuspensionBar = new THREE.BoxGeometry(64, 1.2, 1.6);
    this.featureWallCable = new THREE.CylinderGeometry(0.06, 0.06, 16, 6);

    this.imacScreen = new THREE.BoxGeometry(14.2, 8.8, 0.35);
    this.imacGlassBezel = new THREE.BoxGeometry(14.0, 8.6, 0.05);
    this.imacChin = new THREE.BoxGeometry(14.2, 1.6, 0.38);
    this.imacStandStem = new THREE.BoxGeometry(2.4, 4.2, 0.3);
    this.imacStandBase = new THREE.BoxGeometry(6.4, 0.25, 6.0);

    this.lobbyWaitingRug = new THREE.BoxGeometry(115, 0.1, 88);
    this.lobbyRoundRug = new THREE.CylinderGeometry(28, 28, 0.1, 36);

    this.tubChairSeat = new THREE.CylinderGeometry(7.8, 7.8, 3.2, 24);
    this.tubChairShell = new THREE.CylinderGeometry(8.5, 8.5, 11.2, 24, 1, true, Math.PI * 0.4, Math.PI * 1.2);
    this.tubChairShellCap = new THREE.TorusGeometry(8.5, 0.8, 8, 24, Math.PI * 1.2);
    this.tubChairLeg = new THREE.CylinderGeometry(0.35, 0.22, 5.6, 8);

    this.coffeeTableMarbleRoundTop = new THREE.CylinderGeometry(14, 14, 1.4, 32);
    this.coffeeTableMarbleLeg = new THREE.CylinderGeometry(0.35, 0.25, 7.5, 8);
    this.smallRoundTableTop = new THREE.CylinderGeometry(8.5, 8.5, 1.2, 24);
    this.smallRoundTablePedestal = new THREE.CylinderGeometry(0.9, 1.4, 7.0, 12);
    this.smallRoundTableBase = new THREE.CylinderGeometry(5.5, 5.5, 0.5, 16);
  }

  dispose() {
    Object.values(this).forEach((geo) => {
      if (geo && typeof geo.dispose === 'function') {
        geo.dispose();
      }
    });
  }
}

export const geometryPool = new GeometryPool();
