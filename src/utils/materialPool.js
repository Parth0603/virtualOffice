import * as THREE from 'three';
import { parseHexColor } from '../constants/zoneColors.js';

class MaterialPool {
  constructor() {
    // Modern Glass Office Architectural Materials
    this.blackAluminum = new THREE.MeshPhongMaterial({
      color: 0x18181b, // Sleek matte black aluminum frame
      shininess: 35
    });

    this.glassClear = new THREE.MeshPhongMaterial({
      color: 0xe0f2fe, // Subtle clean ice tint
      transparent: true,
      opacity: 0.18,
      shininess: 95,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    this.glassFrosted = new THREE.MeshPhongMaterial({
      color: 0xe2e8f0, // Frosted architectural privacy glass
      transparent: true,
      opacity: 0.52,
      shininess: 30,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    this.glassRestricted = new THREE.MeshPhongMaterial({
      color: 0xfecaca, // Tinted warning glass for restricted suite
      transparent: true,
      opacity: 0.55,
      emissive: 0xef4444,
      emissiveIntensity: 0.15,
      shininess: 60,
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
