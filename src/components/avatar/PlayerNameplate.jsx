import React, { useMemo } from 'react';
import * as THREE from 'three';

export function PlayerNameplate({ name = 'Guest', isHost = false, isMe = false, position = [0, 36.5, 0] }) {
  const spriteTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 72;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Rounded background pill
    const radius = 16;
    const w = canvas.width - 8;
    const h = canvas.height - 8;
    const x = 4;
    const y = 4;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = isHost ? 'rgba(234, 179, 8, 0.8)' : isMe ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 2.0;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Render Name & Status
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Player name
    ctx.font = 'bold 22px Inter, sans-serif';
    ctx.fillStyle = '#ffffff';
    const displayName = `${isHost ? '👑 ' : ''}${name}${isMe ? ' (You)' : ''}`;
    ctx.fillText(displayName, canvas.width / 2, 28);

    // Status subtitle: Online dot or role
    ctx.font = '500 13px Inter, sans-serif';
    ctx.fillStyle = isMe ? '#38bdf8' : '#4ade80';
    const subtitle = isMe ? '● Active' : '● Online';
    ctx.fillText(subtitle, canvas.width / 2, 50);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, [name, isHost, isMe]);

  if (!spriteTexture) return null;

  return (
    <sprite position={position} scale={[7.5, 2.1, 1]}>
      <spriteMaterial map={spriteTexture} depthTest={false} />
    </sprite>
  );
}
