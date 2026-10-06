import React from 'react';
import { EnvironmentManager } from '../../environment/EnvironmentManager.jsx';

export function WorldLighting({ playerRef }) {
  return <EnvironmentManager playerRef={playerRef} />;
}
