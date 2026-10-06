import * as THREE from 'three';

/**
 * Procedural PBR Floor Texture Generators
 * Creates high-performance, seamless CanvasTextures for Albedo, Normal, and Roughness maps
 * Matches the reference image:
 * 1. Marble / Porcelain Tile (Corridors, Pantry/Kitchen, Lounge Base)
 * 2. Neutral Commercial Carpet Tile (Team Workspace)
 * 3. Premium Dark Carpet (Private Offices & Conference Room)
 * 4. Designer Woven Area Rugs (Lounge, Breakout, Reception, Private Office)
 */

// Helper to create and configure a Three.js CanvasTexture
function makeCanvasTexture(canvas, repeatX = 1, repeatY = 1) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(repeatX, repeatY);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 8;
  return texture;
}

/**
 * 1. MARBLE / PORCELAIN TILE (Light Warm-White, Large Format, Subtle Veins & Seams)
 */
export function createMarblePorcelainTextures(size = 512) {
  // --- ALBEDO MAP ---
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d');

  // Base warm-white / ivory porcelain background with subtle gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#f6f4ee');
  bgGrad.addColorStop(0.5, '#ede9e1');
  bgGrad.addColorStop(1, '#f3f0e8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Soft organic cloudiness (faint tonal modulation)
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rad = 40 + Math.random() * 120;
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    const alpha = 0.03 + Math.random() * 0.04;
    radGrad.addColorStop(0, `rgba(215, 208, 196, ${alpha})`);
    radGrad.addColorStop(0.7, `rgba(235, 230, 222, ${alpha * 0.4})`);
    radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Delicate, elegant marble veining (soft winding bezier paths)
  function drawVein(startX, startY, endX, endY, mainWidth, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(185, 175, 160, ${alpha})`;
    ctx.lineWidth = mainWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const midX = (startX + endX) * 0.5 + (Math.random() - 0.5) * 80;
    const midY = (startY + endY) * 0.5 + (Math.random() - 0.5) * 80;
    const cp1x = startX + (midX - startX) * 0.5 + (Math.random() - 0.5) * 50;
    const cp1y = startY + (midY - startY) * 0.5 + (Math.random() - 0.5) * 50;
    const cp2x = midX + (endX - midX) * 0.5 + (Math.random() - 0.5) * 50;
    const cp2y = midY + (endY - midY) * 0.5 + (Math.random() - 0.5) * 50;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.stroke();

    // Secondary delicate branch
    if (Math.random() > 0.3) {
      ctx.strokeStyle = `rgba(195, 185, 172, ${alpha * 0.6})`;
      ctx.lineWidth = mainWidth * 0.6;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      const bEndX = midX + (Math.random() - 0.5) * 120;
      const bEndY = midY + (Math.random() - 0.5) * 120;
      ctx.quadraticCurveTo(
        midX + (Math.random() - 0.5) * 60,
        midY + (Math.random() - 0.5) * 60,
        bEndX,
        bEndY
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  drawVein(20, 40, size * 0.55, size * 0.45, 1.6, 0.16);
  drawVein(size * 0.4, size * 0.35, size - 30, size * 0.85, 2.0, 0.18);
  drawVein(size * 0.1, size * 0.8, size * 0.6, size * 0.95, 1.2, 0.12);
  drawVein(size * 0.65, size * 0.1, size * 0.92, size * 0.4, 1.4, 0.14);

  // Large-format tile grid seams (2x2 tiles per texture block: 4 large porcelain slabs)
  const half = size * 0.5;
  ctx.save();
  ctx.strokeStyle = 'rgba(190, 182, 172, 0.65)';
  ctx.lineWidth = 1.5;

  // Outer border & center cross
  ctx.strokeRect(0.5, 0.5, size - 1, size - 1);
  ctx.beginPath();
  ctx.moveTo(0, half);
  ctx.lineTo(size, half);
  ctx.moveTo(half, 0);
  ctx.lineTo(half, size);
  ctx.stroke();

  // Subtle bevel ambient occlusion along seams
  ctx.strokeStyle = 'rgba(150, 142, 132, 0.15)';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(0, half);
  ctx.lineTo(size, half);
  ctx.moveTo(half, 0);
  ctx.lineTo(half, size);
  ctx.strokeRect(0, 0, size, size);
  ctx.stroke();
  ctx.restore();

  // --- NORMAL MAP ---
  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d');
  nCtx.fillStyle = 'rgb(128, 128, 255)'; // Neutral flat normal
  nCtx.fillRect(0, 0, size, size);

  // Recessed grout grooves
  nCtx.strokeStyle = 'rgb(140, 120, 240)';
  nCtx.lineWidth = 2.0;
  nCtx.beginPath();
  nCtx.moveTo(0, half);
  nCtx.lineTo(size, half);
  nCtx.moveTo(half, 0);
  nCtx.lineTo(half, size);
  nCtx.strokeRect(0, 0, size, size);
  nCtx.stroke();

  // --- ROUGHNESS MAP ---
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  // High-gloss polished porcelain base (roughness ~0.18 -> rgb 46)
  rCtx.fillStyle = 'rgb(46, 46, 46)';
  rCtx.fillRect(0, 0, size, size);

  // Matte grout lines (roughness ~0.65 -> rgb 166)
  rCtx.strokeStyle = 'rgb(166, 166, 166)';
  rCtx.lineWidth = 2.0;
  rCtx.beginPath();
  rCtx.moveTo(0, half);
  rCtx.lineTo(size, half);
  rCtx.moveTo(half, 0);
  rCtx.lineTo(half, size);
  rCtx.strokeRect(0, 0, size, size);
  rCtx.stroke();

  return {
    map: makeCanvasTexture(albedoCanvas),
    normalMap: makeCanvasTexture(normCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}

/**
 * 2. COMMERCIAL CARPET TILE (Team Workspace - Neutral Grey, Quarter-Turn Modular Weave)
 */
export function createWorkspaceCarpetTextures(size = 512) {
  // --- ALBEDO MAP ---
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d', { willReadFrequently: true });

  ctx.fillStyle = '#525861'; // Medium neutral warm-slate base
  ctx.fillRect(0, 0, size, size);

  const half = size * 0.5;

  // Render 4 quarter-turn tiles with alternating directional linear ribbing
  function drawCarpetQuadrant(x, y, w, h, isHorizontal, tintShift) {
    ctx.save();
    ctx.fillStyle = tintShift ? '#585e68' : '#4d535b';
    ctx.fillRect(x, y, w, h);

    // Fine tufted fabric weave lines
    const lineSpacing = 3;
    if (isHorizontal) {
      for (let py = y; py < y + h; py += lineSpacing) {
        ctx.fillStyle = (Math.floor(py / lineSpacing) % 2 === 0)
          ? 'rgba(105, 113, 124, 0.45)'
          : 'rgba(58, 63, 71, 0.45)';
        ctx.fillRect(x, py, w, 1.5);
      }
    } else {
      for (let px = x; px < x + w; px += lineSpacing) {
        ctx.fillStyle = (Math.floor(px / lineSpacing) % 2 === 0)
          ? 'rgba(105, 113, 124, 0.45)'
          : 'rgba(58, 63, 71, 0.45)';
        ctx.fillRect(px, y, 1.5, h);
      }
    }

    // Micro-noise flecks for heathered wool texture
    const imgData = ctx.getImageData(x, y, w, h);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const n = (Math.random() - 0.5) * 18;
      data[i] = Math.min(255, Math.max(0, data[i] + n));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
    }
    ctx.putImageData(imgData, x, y);
    ctx.restore();
  }

  // Quarter-turn pattern: Q0 (Horiz), Q1 (Vert), Q2 (Vert), Q3 (Horiz)
  drawCarpetQuadrant(0, 0, half, half, true, false);
  drawCarpetQuadrant(half, 0, half, half, false, true);
  drawCarpetQuadrant(0, half, half, half, false, true);
  drawCarpetQuadrant(half, half, half, half, true, false);

  // Subtle tile seams
  ctx.strokeStyle = 'rgba(38, 42, 48, 0.6)';
  ctx.lineWidth = 1.0;
  ctx.beginPath();
  ctx.moveTo(0, half);
  ctx.lineTo(size, half);
  ctx.moveTo(half, 0);
  ctx.lineTo(half, size);
  ctx.strokeRect(0, 0, size, size);
  ctx.stroke();

  // --- NORMAL MAP ---
  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d');
  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, size, size);

  // Carpet tile seams
  nCtx.strokeStyle = 'rgb(120, 120, 230)';
  nCtx.lineWidth = 1.5;
  nCtx.beginPath();
  nCtx.moveTo(0, half);
  nCtx.lineTo(size, half);
  nCtx.moveTo(half, 0);
  nCtx.lineTo(half, size);
  nCtx.strokeRect(0, 0, size, size);
  nCtx.stroke();

  // --- ROUGHNESS MAP ---
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = 'rgb(222, 222, 222)'; // Matte carpet (~0.87)
  rCtx.fillRect(0, 0, size, size);

  return {
    map: makeCanvasTexture(albedoCanvas),
    normalMap: makeCanvasTexture(normCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}

/**
 * 3. PREMIUM DARK CARPET (Conference Room & Private Offices)
 */
export function createDarkCarpetTextures(size = 512, isConference = false) {
  // --- ALBEDO MAP ---
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d', { willReadFrequently: true });

  // Deep executive charcoal base
  const baseColor = isConference ? '#22262c' : '#292d35';
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Fine organic heathered wool twist-pile noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 26;
    const fleck = Math.random() > 0.96 ? 18 : 0; // occasional lighter heathered fleck
    data[i] = Math.min(255, Math.max(0, data[i] + noise + fleck));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise + fleck));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise + fleck * 1.1));
  }
  ctx.putImageData(imgData, 0, 0);

  // Soft low-frequency tonal clouds
  for (let i = 0; i < 15; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rad = 60 + Math.random() * 100;
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    const alpha = 0.04 + Math.random() * 0.04;
    radGrad.addColorStop(0, `rgba(65, 72, 84, ${alpha})`);
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // --- NORMAL MAP ---
  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d', { willReadFrequently: true });
  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, size, size);

  // Dense subtle bump noise
  const nData = nCtx.getImageData(0, 0, size, size);
  const nd = nData.data;
  for (let i = 0; i < nd.length; i += 4) {
    const bn = (Math.random() - 0.5) * 16;
    nd[i] = Math.min(255, Math.max(0, 128 + bn));
    nd[i + 1] = Math.min(255, Math.max(0, 128 + bn));
    nd[i + 2] = 255;
  }
  nCtx.putImageData(nData, 0, 0);

  // --- ROUGHNESS MAP ---
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = 'rgb(235, 235, 235)'; // Highly matte plush wool (~0.92)
  rCtx.fillRect(0, 0, size, size);

  return {
    map: makeCanvasTexture(albedoCanvas),
    normalMap: makeCanvasTexture(normCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}

/**
 * 4. DESIGNER WOVEN AREA RUG (Lounge, Reception, Breakout, Private Office)
 */
export function createAreaRugTextures(size = 512) {
  // --- ALBEDO MAP ---
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d', { willReadFrequently: true });

  // Warm taupe / earthy sand-beige base
  ctx.fillStyle = '#9e9282';
  ctx.fillRect(0, 0, size, size);

  // Layered distressed abrash striations (horizontal linear organic variations)
  for (let y = 0; y < size; y += 3) {
    const bandHeight = 2 + Math.random() * 4;
    const tone = Math.random();
    let color = 'rgba(164, 153, 138, 0.4)';
    if (tone < 0.3) color = 'rgba(125, 114, 100, 0.45)';
    else if (tone > 0.7) color = 'rgba(188, 178, 164, 0.4)';

    ctx.fillStyle = color;
    const startX = Math.random() * (size * 0.3);
    const len = size * 0.4 + Math.random() * (size * 0.6);
    ctx.fillRect(startX, y, len, bandHeight);
  }

  // Cross-grain textile fiber noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 22;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n * 0.9));
  }
  ctx.putImageData(imgData, 0, 0);

  // Refined woven perimeter border hem
  const borderW = 16;
  ctx.save();
  ctx.strokeStyle = '#756858';
  ctx.lineWidth = borderW;
  ctx.strokeRect(borderW * 0.5, borderW * 0.5, size - borderW, size - borderW);

  // Inner border piping
  ctx.strokeStyle = '#baa996';
  ctx.lineWidth = 2.0;
  ctx.strokeRect(borderW, borderW, size - borderW * 2, size - borderW * 2);
  ctx.restore();

  // --- NORMAL MAP ---
  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d');
  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, size, size);

  // Border ridge
  nCtx.strokeStyle = 'rgb(140, 125, 245)';
  nCtx.lineWidth = 3.0;
  nCtx.strokeRect(borderW, borderW, size - borderW * 2, size - borderW * 2);

  // --- ROUGHNESS MAP ---
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = 'rgb(210, 210, 210)'; // Soft woven rug (~0.82)
  rCtx.fillRect(0, 0, size, size);

  return {
    map: makeCanvasTexture(albedoCanvas),
    normalMap: makeCanvasTexture(normCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}

/**
 * 5. LOBBY POLISHED IVORY MARBLE FLOOR (Matching Reference Image)
 * Large format polished marble slabs (warm cream/ivory base, delicate beige/gray veins,
 * subtle individual tile variation, realistic polished roughness ~0.20 with soft highlights,
 * crisp recessed grout seams).
 */
export function createLobbyMarbleTextures(size = 1024) {
  // --- ALBEDO MAP ---
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d', { willReadFrequently: true });

  // Rich warm champagne / crema marfil base gradient (prevents lighting burnout)
  const bgGrad = ctx.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#e2dacd');
  bgGrad.addColorStop(0.3, '#dad2c4');
  bgGrad.addColorStop(0.7, '#d2c9ba');
  bgGrad.addColorStop(1, '#ddd5c8');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, size, size);

  // Soft organic stone cloudiness (tonal depth across slabs)
  for (let i = 0; i < 45; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rad = 70 + Math.random() * 190;
    const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    const alpha = 0.04 + Math.random() * 0.05;
    radGrad.addColorStop(0, `rgba(185, 174, 158, ${alpha})`);
    radGrad.addColorStop(0.6, `rgba(218, 209, 195, ${alpha * 0.5})`);
    radGrad.addColorStop(1, 'rgba(235, 228, 218, 0)');
    ctx.fillStyle = radGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Large-format 2x2 tile grid (each tile is 512x512)
  const half = size * 0.5;

  // Individual tile subtle tone cast (gives authentic architectural slab variation)
  const tileOffsets = [
    { x: 0, y: 0, color: 'rgba(232, 224, 212, 0.16)' },
    { x: half, y: 0, color: 'rgba(212, 202, 188, 0.18)' },
    { x: 0, y: half, color: 'rgba(224, 216, 203, 0.14)' },
    { x: half, y: half, color: 'rgba(218, 208, 195, 0.17)' }
  ];
  tileOffsets.forEach(({ x, y, color }) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, half, half);
  });

  // Delicate Calacatta & Crema Marfil veining (warm grey & honey/taupe paths)
  function drawLobbyVein(startX, startY, endX, endY, mainWidth, alpha, veinColor = '138, 126, 110') {
    ctx.save();
    ctx.strokeStyle = `rgba(${veinColor}, ${alpha})`;
    ctx.lineWidth = mainWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const midX = (startX + endX) * 0.5 + (Math.random() - 0.5) * 110;
    const midY = (startY + endY) * 0.5 + (Math.random() - 0.5) * 110;
    const cp1x = startX + (midX - startX) * 0.5 + (Math.random() - 0.5) * 65;
    const cp1y = startY + (midY - startY) * 0.5 + (Math.random() - 0.5) * 65;
    const cp2x = midX + (endX - midX) * 0.5 + (Math.random() - 0.5) * 65;
    const cp2y = midY + (endY - midY) * 0.5 + (Math.random() - 0.5) * 65;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    ctx.stroke();

    // Secondary fine feather branch
    if (Math.random() > 0.20) {
      ctx.strokeStyle = `rgba(${veinColor}, ${alpha * 0.6})`;
      ctx.lineWidth = mainWidth * 0.5;
      ctx.beginPath();
      ctx.moveTo(midX, midY);
      const bEndX = midX + (Math.random() - 0.5) * 150;
      const bEndY = midY + (Math.random() - 0.5) * 150;
      ctx.quadraticCurveTo(
        midX + (Math.random() - 0.5) * 75,
        midY + (Math.random() - 0.5) * 75,
        bEndX,
        bEndY
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  // Draw natural multi-tone veining
  drawLobbyVein(40, 80, size * 0.6, size * 0.45, 2.4, 0.28, '132, 120, 104');
  drawLobbyVein(size * 0.45, size * 0.38, size - 50, size * 0.9, 3.0, 0.30, '140, 128, 112');
  drawLobbyVein(size * 0.1, size * 0.82, size * 0.55, size * 0.96, 2.0, 0.24, '148, 136, 120');
  drawLobbyVein(size * 0.7, size * 0.08, size * 0.95, size * 0.42, 2.2, 0.26, '135, 122, 106');
  drawLobbyVein(size * 0.2, size * 0.2, size * 0.35, size * 0.6, 1.4, 0.20, '150, 138, 122');
  drawLobbyVein(size * 0.55, size * 0.65, size * 0.85, size * 0.75, 1.6, 0.22, '142, 130, 114');

  // Crisp Tile Seams & Grout Lines
  ctx.save();
  // Ambient occlusion shadow along seams
  ctx.strokeStyle = 'rgba(95, 85, 74, 0.26)';
  ctx.lineWidth = 3.8;
  ctx.beginPath();
  ctx.moveTo(0, half);
  ctx.lineTo(size, half);
  ctx.moveTo(half, 0);
  ctx.lineTo(half, size);
  ctx.strokeRect(0, 0, size, size);
  ctx.stroke();

  // Precise thin grout seam
  ctx.strokeStyle = 'rgba(152, 142, 130, 0.85)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(0, half);
  ctx.lineTo(size, half);
  ctx.moveTo(half, 0);
  ctx.lineTo(half, size);
  ctx.strokeRect(0.9, 0.9, size - 1.8, size - 1.8);
  ctx.stroke();
  ctx.restore();

  // --- NORMAL MAP ---
  const normCanvas = document.createElement('canvas');
  normCanvas.width = size;
  normCanvas.height = size;
  const nCtx = normCanvas.getContext('2d');
  nCtx.fillStyle = 'rgb(128, 128, 255)'; // Neutral flat normal
  nCtx.fillRect(0, 0, size, size);

  // Recessed grout grooves with bevel
  nCtx.strokeStyle = 'rgb(148, 118, 245)';
  nCtx.lineWidth = 2.6;
  nCtx.beginPath();
  nCtx.moveTo(0, half);
  nCtx.lineTo(size, half);
  nCtx.moveTo(half, 0);
  nCtx.lineTo(half, size);
  nCtx.strokeRect(0, 0, size, size);
  nCtx.stroke();

  // --- ROUGHNESS MAP ---
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  // High-end polished marble base: roughness ~0.19 -> rgb(48, 48, 48)
  rCtx.fillStyle = 'rgb(48, 48, 48)';
  rCtx.fillRect(0, 0, size, size);

  // Subtle tile-to-tile variation in polished sheen
  rCtx.fillStyle = 'rgba(60, 60, 60, 0.08)';
  rCtx.fillRect(0, 0, half, half);
  rCtx.fillStyle = 'rgba(40, 40, 40, 0.06)';
  rCtx.fillRect(half, 0, half, half);
  rCtx.fillStyle = 'rgba(44, 44, 44, 0.05)';
  rCtx.fillRect(0, half, half, half);
  rCtx.fillStyle = 'rgba(54, 54, 54, 0.07)';
  rCtx.fillRect(half, half, half, half);

  // Matte grout seams: roughness ~0.74 -> rgb(188, 188, 188)
  rCtx.strokeStyle = 'rgb(188, 188, 188)';
  rCtx.lineWidth = 2.6;
  rCtx.beginPath();
  rCtx.moveTo(0, half);
  rCtx.lineTo(size, half);
  rCtx.moveTo(half, 0);
  rCtx.lineTo(half, size);
  rCtx.strokeRect(0, 0, size, size);
  rCtx.stroke();

  return {
    map: makeCanvasTexture(albedoCanvas),
    normalMap: makeCanvasTexture(normCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}

/**
 * 6. FEATURE WALL "SYNTRRA" BRANDING TEXTURE ON POLISHED WHITE MARBLE
 * Exactly reproduces the geometric hexagon logo and "SYNTRRA" modern typography
 * from the reference image onto a Calacatta marble slab.
 */
export function createFeatureWallBrandingTextures(width = 1024, height = 1024) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Normal & Roughness canvases
  const normCanvas = document.createElement('canvas');
  normCanvas.width = width;
  normCanvas.height = height;
  const nCtx = normCanvas.getContext('2d');
  nCtx.fillStyle = 'rgb(128, 128, 255)';
  nCtx.fillRect(0, 0, width, height);

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = width;
  roughCanvas.height = height;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = 'rgb(46, 46, 46)'; // Polished stone ~0.18
  rCtx.fillRect(0, 0, width, height);

  // 1. Polished white/cream marble background
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#faf8f4');
  bgGrad.addColorStop(0.5, '#f4efe5');
  bgGrad.addColorStop(1, '#f8f4ec');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Faint marble clouds
  for (let i = 0; i < 28; i++) {
    const cx = Math.random() * width;
    const cy = Math.random() * height;
    const rad = 80 + Math.random() * 200;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    grad.addColorStop(0, 'rgba(215, 205, 192, 0.08)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Subtle marble veins
  ctx.strokeStyle = 'rgba(182, 172, 156, 0.22)';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(80, 140);
  ctx.bezierCurveTo(340, 270, 640, 210, 940, 460);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(175, 164, 148, 0.18)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(60, 780);
  ctx.bezierCurveTo(380, 640, 740, 710, 960, 880);
  ctx.stroke();

  // 2. Geometric Hexagon Logo
  const centerX = width * 0.5;
  const centerY = height * 0.36;
  const outerR = 105;

  function getHexCorner(cx, cy, r, i) {
    const angle = -Math.PI / 2 + (i * Math.PI / 3);
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  }

  function drawHexagonPath(targetCtx, cx, cy, r) {
    targetCtx.beginPath();
    for (let i = 0; i < 6; i++) {
      const [x, y] = getHexCorner(cx, cy, r, i);
      if (i === 0) targetCtx.moveTo(x, y);
      else targetCtx.lineTo(x, y);
    }
    targetCtx.closePath();
  }

  function renderHexagonLogo(targetCtx, strokeStyle, outerW, midW, innerW, strutW) {
    targetCtx.save();
    targetCtx.lineCap = 'round';
    targetCtx.lineJoin = 'round';
    targetCtx.strokeStyle = strokeStyle;

    // Outer bold hexagon
    targetCtx.lineWidth = outerW;
    drawHexagonPath(targetCtx, centerX, centerY, outerR);
    targetCtx.stroke();

    // Middle faceted hexagon
    targetCtx.lineWidth = midW;
    drawHexagonPath(targetCtx, centerX, centerY, outerR * 0.68);
    targetCtx.stroke();

    // Inner nested hexagon
    targetCtx.lineWidth = innerW;
    drawHexagonPath(targetCtx, centerX, centerY, outerR * 0.36);
    targetCtx.stroke();

    // Geometric connecting struts
    targetCtx.lineWidth = strutW;
    for (let i = 0; i < 6; i += 2) {
      const [x1, y1] = getHexCorner(centerX, centerY, outerR * 0.36, i);
      const [x2, y2] = getHexCorner(centerX, centerY, outerR * 0.68, i);
      targetCtx.beginPath();
      targetCtx.moveTo(x1, y1);
      targetCtx.lineTo(x2, y2);
      targetCtx.stroke();
    }
    for (let i = 1; i < 6; i += 2) {
      const [x1, y1] = getHexCorner(centerX, centerY, outerR * 0.68, i);
      const [x2, y2] = getHexCorner(centerX, centerY, outerR, i);
      targetCtx.beginPath();
      targetCtx.moveTo(x1, y1);
      targetCtx.lineTo(x2, y2);
      targetCtx.stroke();
    }
    targetCtx.restore();
  }

  // Draw Albedo Logo: Deep dark architectural charcoal / bronze
  renderHexagonLogo(ctx, '#141417', 15, 11, 8.5, 9);

  // Draw Normal Map Emboss for Logo
  renderHexagonLogo(nCtx, 'rgb(148, 120, 240)', 17, 13, 10, 10.5);

  // Draw Roughness Map (Matte metal logo ~0.42 -> rgb(108, 108, 108))
  renderHexagonLogo(rCtx, 'rgb(108, 108, 108)', 15, 11, 8.5, 9);

  // 3. Modern Typography: "SYNTRRA"
  function renderBrandingText(targetCtx, fillStyle) {
    targetCtx.save();
    targetCtx.fillStyle = fillStyle;
    targetCtx.font = 'bold 84px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    targetCtx.textAlign = 'center';
    targetCtx.textBaseline = 'middle';

    const text = 'SYNTRRA';
    const letterSpacing = 28;
    const textY = height * 0.54;

    let totalW = 0;
    for (let i = 0; i < text.length; i++) {
      totalW += targetCtx.measureText(text[i]).width + (i < text.length - 1 ? letterSpacing : 0);
    }

    let curX = centerX - totalW * 0.5;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charW = targetCtx.measureText(char).width;
      targetCtx.fillText(char, curX + charW * 0.5, textY);
      curX += charW + letterSpacing;
    }
    targetCtx.restore();
  }

  // Albedo Text
  renderBrandingText(ctx, '#141417');

  // Normal Map Emboss for Text
  nCtx.save();
  nCtx.strokeStyle = 'rgb(148, 120, 240)';
  nCtx.lineWidth = 3.0;
  renderBrandingText(nCtx, 'rgb(140, 125, 245)');
  nCtx.restore();

  // Roughness Map Text
  renderBrandingText(rCtx, 'rgb(108, 108, 108)');

  return {
    map: makeCanvasTexture(canvas),
    normalMap: makeCanvasTexture(normCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}

/**
 * 7. LOBBY ROUND WOVEN AREA RUG (Second Seating Area)
 * Heathered charcoal/warm-grey circular woven rug with concentric woven ridges
 * and perimeter binding.
 */
export function createLobbyRoundRugTextures(size = 512) {
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d', { willReadFrequently: true });

  const center = size * 0.5;
  const radius = size * 0.48;

  // Background neutral
  ctx.fillStyle = '#42454b';
  ctx.fillRect(0, 0, size, size);

  // Circular clip
  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.clip();

  // Heathered woven gradient
  const grad = ctx.createRadialGradient(center, center, 0, center, center, radius);
  grad.addColorStop(0, '#565a62');
  grad.addColorStop(0.6, '#464950');
  grad.addColorStop(1, '#3a3d43');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Concentric woven ridges
  for (let r = 8; r < radius - 8; r += 6) {
    ctx.strokeStyle = (Math.floor(r / 6) % 2 === 0) ? 'rgba(75, 79, 87, 0.45)' : 'rgba(40, 42, 46, 0.45)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(center, center, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Micro textile fiber noise
  const imgData = ctx.getImageData(0, 0, size, size);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = (Math.random() - 0.5) * 20;
    data[i] = Math.min(255, Math.max(0, data[i] + n));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + n));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + n));
  }
  ctx.putImageData(imgData, 0, 0);

  // Outer woven perimeter border
  ctx.strokeStyle = '#2f3136';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(center, center, radius - 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // Roughness Map
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = 'rgb(215, 215, 215)'; // Matte woven textile ~0.84
  rCtx.fillRect(0, 0, size, size);

  return {
    map: makeCanvasTexture(albedoCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}

/**
 * 8. LOBBY WAITING AREA LARGE RECTANGULAR WOVEN RUG
 * Heathered warm taupe / grey-beige low-contrast designer woven rug.
 */
export function createLobbyWaitingRugTextures(size = 512) {
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const ctx = albedoCanvas.getContext('2d');

  // Base warm heathered grey-taupe
  ctx.fillStyle = '#67645f';
  ctx.fillRect(0, 0, size, size);

  // Linear woven bands
  for (let y = 0; y < size; y += 4) {
    const isDark = (Math.floor(y / 4) % 2 === 0);
    ctx.fillStyle = isDark ? '#5c5954' : '#726f6a';
    ctx.fillRect(0, y, size, 3);
  }

  // Subtle tonal cloudiness (natural mottled look like reference image)
  for (let i = 0; i < 20; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rad = 40 + Math.random() * 120;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    grad.addColorStop(0, 'rgba(125, 120, 114, 0.15)');
    grad.addColorStop(1, 'rgba(75, 72, 68, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  // Woven border hem
  const bW = 16;
  ctx.strokeStyle = '#4e4b47';
  ctx.lineWidth = bW;
  ctx.strokeRect(bW * 0.5, bW * 0.5, size - bW, size - bW);

  // Roughness Map
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d');
  rCtx.fillStyle = 'rgb(212, 212, 212)'; // ~0.83 matte fabric
  rCtx.fillRect(0, 0, size, size);

  return {
    map: makeCanvasTexture(albedoCanvas),
    roughnessMap: makeCanvasTexture(roughCanvas)
  };
}
