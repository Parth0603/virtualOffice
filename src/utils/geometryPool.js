import * as THREE from 'three';
import { TILE_SIZE } from '../constants/grid.js';

class GeometryPool {
  constructor() {
    // World Floors
    this.tile = new THREE.BoxGeometry(TILE_SIZE, 1.0, TILE_SIZE);

    // Modern Minimalist Glass Architecture (Large Panoramic Glass, Slim Tracks, Zero Cage Density)
    const wallH = 42;
    this.glassPane = new THREE.BoxGeometry(TILE_SIZE, wallH - 0.8, 0.2);
    this.trackBottom = new THREE.BoxGeometry(TILE_SIZE, 0.4, 0.5);
    this.trackTop = new THREE.BoxGeometry(TILE_SIZE, 0.4, 0.5);
    this.wallCornerPost = new THREE.BoxGeometry(0.5, wallH, 0.5);

    // Glass Doorway with Minimalist Jambs
    this.doorHeader = new THREE.BoxGeometry(TILE_SIZE, 0.6, 0.6);
    this.doorFrameTop = this.doorHeader;
    this.doorJamb = new THREE.BoxGeometry(0.6, wallH, 0.6);
    this.glassDoorLeaf = new THREE.BoxGeometry(20, wallH - 1.2, 0.25);
    this.doorHandle = new THREE.CylinderGeometry(0.25, 0.25, 16, 8);
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

    // Conference Meeting Suite (Grand Executive Boardroom)
    this.conferenceTableTop = new THREE.BoxGeometry(76, 2.2, 32);
    this.conferenceTableBase = new THREE.BoxGeometry(20, 12.5, 12);
    this.conferenceCenterHub = new THREE.BoxGeometry(28, 0.3, 8); // Cable connectivity box
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

    // Lounge Area
    this.sofaBase = new THREE.BoxGeometry(48, 4.5, 20);
    this.sofaBack = new THREE.BoxGeometry(48, 14, 5.5);
    this.sofaArm = new THREE.BoxGeometry(6, 10, 20);
    this.sofaCushion = new THREE.BoxGeometry(18, 3.5, 15);
    this.coffeeTableTop = new THREE.BoxGeometry(28, 1.6, 16);
    this.coffeeTableLeg = new THREE.CylinderGeometry(0.6, 0.6, 6.5, 8);
    this.coffeeMug = new THREE.CylinderGeometry(0.8, 0.7, 1.4, 8);

    // Floor Lamp
    this.lampBase = new THREE.CylinderGeometry(3.5, 3.5, 0.4, 12);
    this.lampPole = new THREE.CylinderGeometry(0.3, 0.3, 28, 8);
    this.lampShade = new THREE.CylinderGeometry(3.2, 4.5, 6, 12);

    // Biophilic Architecture Plants
    this.plantPot = new THREE.CylinderGeometry(5.2, 3.8, 10, 12);
    this.plantStem = new THREE.CylinderGeometry(0.7, 0.9, 18, 8);
    this.plantFoliage = new THREE.SphereGeometry(5.5, 8, 8);

    // Reception Counter & Branding
    this.receptionCounter = new THREE.BoxGeometry(56, 17, 18);
    this.receptionTop = new THREE.BoxGeometry(60, 2.2, 20);
    this.receptionAccent = new THREE.BoxGeometry(54, 1.6, 0.5);
    this.receptionLogoBackdrop = new THREE.BoxGeometry(50, 14, 0.8);

    // Lock Indicator Badge
    this.lockBadge = new THREE.BoxGeometry(5.5, 5.5, 0.8);

    // Modern Stylized Humanoid Avatar Geometries
    this.avatarTorso = new THREE.BoxGeometry(5.8, 8.8, 3.4);
    this.avatarShoulders = new THREE.BoxGeometry(6.8, 1.8, 3.4);
    this.avatarShirt = new THREE.BoxGeometry(3.6, 6.2, 0.5);
    this.avatarCollar = new THREE.BoxGeometry(3.8, 1.2, 0.6);
    this.avatarTie = new THREE.BoxGeometry(1.2, 4.8, 0.3);
    this.avatarNeck = new THREE.CylinderGeometry(1.0, 1.1, 2.2, 12);
    this.avatarHead = new THREE.SphereGeometry(2.7, 18, 18);
    this.avatarHairShort = new THREE.SphereGeometry(3.05, 16, 16);
    this.avatarHairLong = new THREE.CylinderGeometry(2.9, 3.3, 7.0, 14);
    this.avatarHairCurly = new THREE.SphereGeometry(3.2, 10, 10);
    this.avatarArm = new THREE.CylinderGeometry(0.85, 1.05, 9.2, 12);
    this.avatarHand = new THREE.SphereGeometry(0.8, 10, 10);
    this.avatarLeg = new THREE.CylinderGeometry(1.15, 1.4, 11.2, 12);
    this.avatarShoe = new THREE.BoxGeometry(2.5, 1.5, 4.2);
    this.avatarShoeSole = new THREE.BoxGeometry(2.6, 0.45, 4.3);
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
