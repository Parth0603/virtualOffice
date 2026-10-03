// Shared camera controls state for game perspective and zoom
export const cameraControls = {
  yaw: 0,              // Azimuth horizontal rotation (radians)
  pitch: 0.38,         // Eye-level third-person perspective (human viewpoint)
  distance: 95,        // Intimate 3rd-person distance (clear character framing)
  targetYaw: 0,
  targetPitch: 0.38,
  targetDistance: 95,  // Desired distance adjusted by scroll wheel
  isPointerLocked: false,

  reset(yaw = 0, pitch = 0.38, distance = 95) {
    this.targetYaw = yaw;
    this.targetPitch = pitch;
    this.targetDistance = distance;
  }
};
