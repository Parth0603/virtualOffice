import * as THREE from 'three';
import { parseHexColor } from '../constants/zoneColors.js';
import {
  createMarblePorcelainTextures,
  createWorkspaceCarpetTextures,
  createDarkCarpetTextures,
  createAreaRugTextures,
  createLobbyMarbleTextures,
  createFeatureWallBrandingTextures,
  createLobbyRoundRugTextures,
  createLobbyWaitingRugTextures
} from './floorTextures.js';

class MaterialPool {
  constructor() {
    // --- Premium Architectural Flooring PBR Materials (Matching Reference Image) ---
    const marbleTextures = createMarblePorcelainTextures(512);
    this.floorCorridorMarble = new THREE.MeshStandardMaterial({
      map: marbleTextures.map,
      normalMap: marbleTextures.normalMap,
      roughnessMap: marbleTextures.roughnessMap,
      roughness: 0.22, // Polished, slightly reflective porcelain/marble
      metalness: 0.02
    });

    // Dedicated Lobby Polished Ivory/Cream Marble Floor (Zone 1)
    const lobbyMarbleTextures = createLobbyMarbleTextures(1024);
    this.floorLobbyMarble = new THREE.MeshStandardMaterial({
      map: lobbyMarbleTextures.map,
      normalMap: lobbyMarbleTextures.normalMap,
      roughnessMap: lobbyMarbleTextures.roughnessMap,
      roughness: 0.16, // Polished, elegant reflections, reacts to warm lighting
      metalness: 0.03
    });

    // Feature Wall Center Slab with Syntra Hexagon Logo & Typography
    const featureWallTextures = createFeatureWallBrandingTextures(1024, 1024);
    this.featureWallBranding = new THREE.MeshStandardMaterial({
      map: featureWallTextures.map,
      normalMap: featureWallTextures.normalMap,
      roughnessMap: featureWallTextures.roughnessMap,
      roughness: 0.14,
      metalness: 0.03
    });

    // Lobby Area Rugs (Waiting Area & Second Seating Area)
    const waitingRugTextures = createLobbyWaitingRugTextures(512);
    this.lobbyWaitingRug = new THREE.MeshStandardMaterial({
      map: waitingRugTextures.map,
      roughnessMap: waitingRugTextures.roughnessMap,
      roughness: 0.82,
      metalness: 0.0
    });

    const roundRugTextures = createLobbyRoundRugTextures(512);
    this.lobbyRoundRug = new THREE.MeshStandardMaterial({
      map: roundRugTextures.map,
      roughnessMap: roundRugTextures.roughnessMap,
      roughness: 0.82,
      metalness: 0.0
    });

    // Reception Desk Waterfall Marble
    this.receptionMarble = new THREE.MeshStandardMaterial({
      map: lobbyMarbleTextures.map,
      normalMap: lobbyMarbleTextures.normalMap,
      roughness: 0.12,
      metalness: 0.03
    });

    // Lobby Executive Materials (Emerald Velvet & Cognac Leather)
    this.emeraldFabric = new THREE.MeshStandardMaterial({
      color: 0x14402a, // Deep rich emerald green velvet
      roughness: 0.58,
      metalness: 0.02,
      side: THREE.DoubleSide
    });

    this.cognacLeather = new THREE.MeshStandardMaterial({
      color: 0xaa6832, // Warm cognac / saddle leather
      roughness: 0.38,
      metalness: 0.06,
      side: THREE.DoubleSide
    });

    this.darkMarble = new THREE.MeshStandardMaterial({
      color: 0x222428, // Polished black / dark charcoal marble
      roughness: 0.18,
      metalness: 0.04
    });

    this.oakSlats = new THREE.MeshStandardMaterial({
      color: 0xdca86b, // Warm blonde/natural oak wood slats with rich grain tone
      roughness: 0.44,
      metalness: 0.02
    });

    this.coveGlow = new THREE.MeshBasicMaterial({
      color: 0xffebd2 // Warm 3000K architectural cove backlight
    });

    this.receptionKickbase = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.6
    });

    const workspaceTextures = createWorkspaceCarpetTextures(512);
    this.floorWorkspaceCarpet = new THREE.MeshStandardMaterial({
      map: workspaceTextures.map,
      normalMap: workspaceTextures.normalMap,
      roughnessMap: workspaceTextures.roughnessMap,
      roughness: 0.88, // Matte commercial carpet tile
      metalness: 0.0
    });

    const confCarpetTextures = createDarkCarpetTextures(512, true);
    this.floorConferenceCarpet = new THREE.MeshStandardMaterial({
      map: confCarpetTextures.map,
      normalMap: confCarpetTextures.normalMap,
      roughnessMap: confCarpetTextures.roughnessMap,
      roughness: 0.92, // Executive dark slate carpet
      metalness: 0.0
    });

    const privCarpetTextures = createDarkCarpetTextures(512, false);
    this.floorPrivateOfficeCarpet = new THREE.MeshStandardMaterial({
      map: privCarpetTextures.map,
      normalMap: privCarpetTextures.normalMap,
      roughnessMap: privCarpetTextures.roughnessMap,
      roughness: 0.90, // Dark charcoal / warm-gray carpet
      metalness: 0.0
    });

    this.floorLoungeStone = new THREE.MeshStandardMaterial({
      map: marbleTextures.map,
      normalMap: marbleTextures.normalMap,
      roughnessMap: marbleTextures.roughnessMap,
      roughness: 0.28, // Light porcelain / stone tile base for lounge
      metalness: 0.02
    });

    this.floorKitchenTile = new THREE.MeshStandardMaterial({
      map: marbleTextures.map,
      normalMap: marbleTextures.normalMap,
      roughnessMap: marbleTextures.roughnessMap,
      roughness: 0.25, // Large-format light porcelain tile
      metalness: 0.02
    });

    this.floorBreakoutCarpet = new THREE.MeshStandardMaterial({
      map: workspaceTextures.map,
      normalMap: workspaceTextures.normalMap,
      roughnessMap: workspaceTextures.roughnessMap,
      roughness: 0.82, // Neutral breakout flooring
      metalness: 0.0
    });

    const rugTextures = createAreaRugTextures(512);
    this.areaRug = new THREE.MeshStandardMaterial({
      map: rugTextures.map,
      normalMap: rugTextures.normalMap,
      roughnessMap: rugTextures.roughnessMap,
      roughness: 0.82, // Designer warm taupe / grey-beige woven rug
      metalness: 0.0
    });

    // Modern Glass Office Architectural Materials (High-Performance Locked 60 FPS)
    this.blackAluminum = new THREE.MeshPhongMaterial({
      color: 0x18181b, // Sleek matte black aluminum frame
      shininess: 40
    });

    this.frameTrackDark = new THREE.MeshPhongMaterial({
      color: 0x121417, // Deep dark aluminum track
      shininess: 30
    });

    this.pillarWhite = new THREE.MeshPhongMaterial({
      color: 0x18181b, // Sleek architectural matte black column finish
      shininess: 35
    });

    this.pillarTrim = new THREE.MeshPhongMaterial({
      color: 0x27272a, // Deep charcoal aluminum plinth and capital trim
      shininess: 25
    });

    this.glassClear = new THREE.MeshPhysicalMaterial({
      color: 0x47515e, // Refined charcoal grey tint
      transparent: true,
      opacity: 0.38, // High-clarity translucent tint: interior rooms, furniture & avatars clearly visible
      roughness: 0.18, // Clean architectural glazed sheen
      metalness: 0.05,
      reflectivity: 0.50,
      clearcoat: 0.35,
      clearcoatRoughness: 0.20,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    this.glassFrosted = new THREE.MeshPhysicalMaterial({
      color: 0x3e4652, // Elegant charcoal grey privacy tint (not solid black)
      transparent: true,
      opacity: 0.46, // Soft translucent frosted privacy glass
      roughness: 0.40, // Diffused frosted texture
      metalness: 0.04,
      reflectivity: 0.45,
      clearcoat: 0.20,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    this.glassRestricted = new THREE.MeshPhysicalMaterial({
      color: 0x3d2a2d, // Charcoal tint with subtle ruby warning undertone
      transparent: true,
      opacity: 0.48,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.15,
      roughness: 0.30,
      metalness: 0.05,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    this.doorHandle = new THREE.MeshPhongMaterial({
      color: 0xe4e4e7, // Brushed stainless steel
      shininess: 90
    });

    this.lockedBadge = new THREE.MeshPhongMaterial({
      color: 0xdc2626,
      emissive: 0xef4444,
      emissiveIntensity: 0.6
    });

    this.unlockedBadge = new THREE.MeshPhongMaterial({
      color: 0x16a34a,
      emissive: 0x22c55e,
      emissiveIntensity: 0.6
    });

    // Warm Light Hardwood & Modern Office Materials
    this.wood = new THREE.MeshPhongMaterial({
      color: 0xd9b897, // Warm natural blonde oak (like reference photo)
      shininess: 15
    });

    this.woodDark = new THREE.MeshPhongMaterial({
      color: 0x6b4423, // Executive walnut accent
      shininess: 20
    });

    this.woodFloor = new THREE.MeshPhongMaterial({
      color: 0xede0d4, // Natural blonde hardwood plank tone
      shininess: 25
    });

    this.metal = new THREE.MeshPhongMaterial({
      color: 0x27272a, // Dark graphite metal
      shininess: 45
    });

    this.metalChrome = new THREE.MeshPhongMaterial({
      color: 0xa1a1aa, // Brushed aluminum
      shininess: 85
    });

    this.screen = new THREE.MeshPhongMaterial({
      color: 0x09090b,
      emissive: 0x18181b,
      emissiveIntensity: 0.3,
      shininess: 85
    });

    this.screenPresentation = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x2563eb,
      emissiveIntensity: 0.45,
      shininess: 70
    });

    this.whiteboard = new THREE.MeshPhongMaterial({
      color: 0xfafafa,
      shininess: 75
    });

    this.fabricNavy = new THREE.MeshPhongMaterial({
      color: 0x18181b,
      shininess: 10
    });

    this.fabricTeal = new THREE.MeshPhongMaterial({
      color: 0x0f766e,
      shininess: 10
    });

    this.fabricCream = new THREE.MeshPhongMaterial({
      color: 0xf4f4f5, // Designer white boucle / cream chair (like photo 3 & 4)
      shininess: 15
    });

    this.plantPot = new THREE.MeshPhongMaterial({
      color: 0xf4f4f5,
      shininess: 25
    });

    this.plantLeaf = new THREE.MeshPhongMaterial({
      color: 0x2d6a4f,
      shininess: 15
    });

    this.receptionFront = new THREE.MeshPhongMaterial({
      color: 0x18181b,
      shininess: 40
    });

    this.receptionAccent = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6
    });

    this.coffeeMug = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 60
    });

    this.lampGlow = new THREE.MeshPhongMaterial({
      color: 0xfef08a,
      emissive: 0xfbbf24,
      emissiveIntensity: 0.8,
      shininess: 90
    });

    // Avatar Baseline Materials
    this.shirt = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      shininess: 30
    });

    this.skin = new THREE.MeshPhongMaterial({
      color: 0xfdbcb4,
      shininess: 20
    });

    this.hair = new THREE.MeshPhongMaterial({
      color: 0x27272a,
      shininess: 15
    });

    this.shoe = new THREE.MeshPhongMaterial({
      color: 0x09090b,
      shininess: 70
    });

    this.cache = new Map();
  }

  getSuitMaterial(color, style, isHost) {
    const key = `suit_${color}_${style}_${isHost}`;
    if (!this.cache.has(key)) {
      const colorNum = parseHexColor(color);
      let jacketColor;
      if (style === 'business') jacketColor = 0x18181b;
      else if (style === 'creative') jacketColor = colorNum;
      else jacketColor = 0x27272a;

      const mat = new THREE.MeshPhongMaterial({
        color: jacketColor,
        emissive: isHost ? 0x3b82f6 : 0x000000,
        emissiveIntensity: isHost ? 0.25 : 0,
        shininess: 45
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key);
  }

  getPantsMaterial(style, isHost) {
    const key = `pants_${style}_${isHost}`;
    if (!this.cache.has(key)) {
      const mat = new THREE.MeshPhongMaterial({
        color: style === 'business' ? 0x09090b : 0x27272a,
        emissive: isHost ? 0x3b82f6 : 0x000000,
        emissiveIntensity: isHost ? 0.2 : 0,
        shininess: 35
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key);
  }

  getTieMaterial(color, style, isHost) {
    const key = `tie_${color}_${style}_${isHost}`;
    if (!this.cache.has(key)) {
      const colorNum = parseHexColor(color);
      const tieColor = style === 'business' ? 0x991b1b : colorNum;
      const mat = new THREE.MeshPhongMaterial({
        color: tieColor,
        emissive: isHost ? 0x3b82f6 : 0x000000,
        emissiveIntensity: isHost ? 0.2 : 0
      });
      this.cache.set(key, mat);
    }
    return this.cache.get(key);
  }

  dispose() {
    Object.values(this).forEach((item) => {
      if (item && typeof item.dispose === 'function') {
        item.dispose();
      }
    });
    for (const mat of this.cache.values()) {
      mat.dispose();
    }
    this.cache.clear();
  }
}

export const materialPool = new MaterialPool();
