import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { AvatarMesh } from './AvatarMesh.jsx';
import { PlayerNameplate } from './PlayerNameplate.jsx';
import { AnimationSystem } from '../../systems/animation.js';
import { useWorkspaceStore, activePlayersMap } from '../../state/useWorkspaceStore.js';

function RemotePlayerItem({ player }) {
  const groupRef = useRef();
  const avatarRefs = useRef(null);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const data = activePlayersMap.get(player.id);
    if (!data) return;

    const dt = Math.min(delta, 0.08);

    const dx = data.targetX - group.position.x;
    const dz = data.targetY - group.position.z;
    const distance = Math.hypot(dx, dz);

    // Smooth position interpolation (lerp)
    group.position.x += dx * Math.min(1.0, 14.0 * dt);
    group.position.z += dz * Math.min(1.0, 14.0 * dt);

    // Approximate remote player speed for animations
    const isSitting = data.actionState === 'sitting';
    const targetY = isSitting ? 1.2 : 0;
    group.position.y += (targetY - group.position.y) * Math.min(1.0, 14.0 * dt);
    const remoteSpeed = isSitting ? 0 : Math.min(5.0, distance * 10.0);

    // Smoothly rotate avatar towards movement direction (or chair rotation if sitting)
    if (isSitting) {
      if (data.rotation !== undefined) {
        let diff = data.rotation - group.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        group.rotation.y += diff * Math.min(1.0, 14.0 * dt);
      }
    } else if (distance > 0.04) {
      const targetRotation = Math.atan2(-dx, -dz);
      let diff = targetRotation - group.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      group.rotation.y += diff * Math.min(1.0, 14.0 * dt);
    }

    AnimationSystem.updateAvatarAnimation(avatarRefs.current, remoteSpeed, dt, data.actionState || 'standing');
  });

  return (
    <group ref={groupRef} scale={[1.2, 1.2, 1.2]} position={[player.x || 80, 0, player.y || 80]}>
      <AvatarMesh
        ref={avatarRefs}
        color={player.color}
        style={player.style}
        hair={player.hair}
        isHost={player.role === 'host'}
      />
      <PlayerNameplate
        name={player.name || 'Team Member'}
        isHost={player.role === 'host'}
        isMe={false}
        position={[0, 31.5, 0]}
      />
    </group>
  );
}

export function RemotePlayers() {
  const { myId, remotePlayersVersion } = useWorkspaceStore();

  const remoteList = useMemo(() => {
    const list = [];
    for (const [id, player] of activePlayersMap.entries()) {
      if (id !== myId) {
        list.push(player);
      }
    }
    return list;
  }, [myId, remotePlayersVersion]);

  return (
    <group>
      {remoteList.map((player) => (
        <RemotePlayerItem key={player.id} player={player} />
      ))}
    </group>
  );
}
