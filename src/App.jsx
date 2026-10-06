import React, { useEffect, useCallback } from 'react';
import { useWorkspaceStore, workspaceStore } from './state/useWorkspaceStore.js';
import { socketClient } from './networking/socketClient.js';
import { AvatarCustomizer } from './components/ui/AvatarCustomizer.jsx';
import { WorkspaceCanvas } from './components/scene/WorkspaceCanvas.jsx';
import { PresenceList } from './components/ui/PresenceList.jsx';
import { PermissionOverlays } from './components/ui/PermissionOverlays.jsx';
import { ZoneBanner } from './components/ui/ZoneBanner.jsx';
import { MeetingEndedModal } from './components/ui/MeetingEndedModal.jsx';
import { PerformanceStats } from './components/ui/PerformanceStats.jsx';
import { InteractionPrompt } from './components/ui/InteractionPrompt.jsx';
import { WorkspaceLanding } from './components/ui/WorkspaceLanding.jsx';
import { WorkspaceHeader } from './components/ui/WorkspaceHeader.jsx';

export default function App() {
  const { stage, workspaceId } = useWorkspaceStore();

  const handleJoinWorkspace = useCallback(() => {
    const socket = socketClient.getSocket();
    const profile = workspaceStore.getState().profile;
    const currentWorkspaceId = workspaceStore.getState().workspaceId;

    if (socket && currentWorkspaceId) {
      socket.emit('joinWorkspace', {
        workspaceId: currentWorkspaceId,
        isCreator: workspaceStore.getState().isCreator,
        playerInfo: {
          name: profile.name,
          color: profile.color,
          style: profile.style,
          hair: profile.hair
        }
      });
    }
  }, []);

  const handleAvatarContinue = useCallback(() => {
    const socket = socketClient.connect();

    socket.on('connect', () => {
      workspaceStore.setMyId(socket.id);
      handleJoinWorkspace();
    });

    socket.on('joinSuccess', () => {
      workspaceStore.setStage('workspace');
    });

    socket.on('workspaceError', ({ message }) => {
      alert(message);
      workspaceStore.setStage('landing');
      window.history.pushState({}, '', '/');
    });

    socket.on('mapData', (data) => {
      workspaceStore.setMapData(data);
      handleJoinWorkspace();
    });

    socket.on('updateState', (data) => {
      workspaceStore.setSyncState(data);
    });

    socket.on('playerMoved', (data) => {
      workspaceStore.updateRemotePlayerPosition(data);
    });

    socket.on('meetingEnded', () => {
      workspaceStore.setMeetingEnded(true);
    });

    // If socket is already connected, join immediately
    if (socket.connected) {
      workspaceStore.setMyId(socket.id);
      handleJoinWorkspace();
    }
  }, [handleJoinWorkspace]);

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, overflow: 'hidden' }}>
      {stage === 'landing' && (
        <WorkspaceLanding />
      )}

      {stage === 'avatar' && (
        <AvatarCustomizer onContinue={handleAvatarContinue} />
      )}

      {stage === 'workspace' && (
        <>
          <WorkspaceHeader />
          <WorkspaceCanvas />
          <ZoneBanner />
          <PresenceList />
          <PermissionOverlays />
          <MeetingEndedModal />
          <PerformanceStats />
          <InteractionPrompt />
        </>
      )}
    </div>
  );
}
