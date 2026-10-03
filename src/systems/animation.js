import * as THREE from 'three';

export class AnimationSystem {
  static updateAvatarAnimation(avatarRefs, currentSpeed = 0, delta = 0.016, actionState = 'standing') {
    if (!avatarRefs) return;

    const {
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
      jacket,
      head,
      leftShoe,
      rightShoe
    } = avatarRefs;

    const dt = Math.min(delta, 0.08);

    // Initialize animation tracking properties
    if (avatarRefs.moveBlend === undefined) avatarRefs.moveBlend = 0;
    if (avatarRefs.walkCycle === undefined) avatarRefs.walkCycle = 0;
    if (avatarRefs.idleCycle === undefined) avatarRefs.idleCycle = 0;
    if (avatarRefs.sitBlend === undefined) avatarRefs.sitBlend = 0;

    // Sitting state blend (0 = standing, 1 = sitting)
    const targetSitBlend = actionState === 'sitting' ? 1.0 : 0.0;
    avatarRefs.sitBlend += (targetSitBlend - avatarRefs.sitBlend) * Math.min(1.0, 10.0 * dt);
    const sitBlend = avatarRefs.sitBlend;

    // Movement state thresholds
    const isMoving = actionState !== 'sitting' && currentSpeed > 0.08;

    // Smooth movement blend weight (0 = fully idle, 1 = fully moving)
    const targetBlend = isMoving ? 1.0 : 0.0;
    avatarRefs.moveBlend += (targetBlend - avatarRefs.moveBlend) * Math.min(1.0, 10.0 * dt);
    const blend = avatarRefs.moveBlend;

    // Advance idle breathing cycle continuously
    avatarRefs.idleCycle += 0.035 * (dt * 60);
    const idleTime = avatarRefs.idleCycle;
    const breathBob = Math.sin(idleTime) * 0.16;

    // Advance walk/run stride cycle when moving
    if (isMoving) {
      const strideRate = (currentSpeed * 0.065 + 0.12) * (dt * 60);
      avatarRefs.walkCycle += strideRate;
    }
    const cycle = avatarRefs.walkCycle;

    // Run factor: 0.0 = walking (<= 2.3 speed), 1.0 = sprinting (>= 4.2 speed)
    const runFactor = THREE.MathUtils.clamp((currentSpeed - 2.3) / 2.0, 0.0, 1.0);

    // Standing Movement Amplitudes
    const walkArmSwing = Math.sin(cycle) * THREE.MathUtils.lerp(0.40, 0.72, runFactor);
    const walkLegSwing = Math.sin(cycle) * THREE.MathUtils.lerp(0.35, 0.62, runFactor);
    const walkBodyBob = Math.sin(cycle * 2) * THREE.MathUtils.lerp(0.28, 0.52, runFactor);
    const walkLean = THREE.MathUtils.lerp(0.04, 0.15, runFactor);
    const footLift = THREE.MathUtils.lerp(0.35, 0.65, runFactor);

    // Standing Idle Poses
    const idleArm = Math.sin(idleTime * 0.8) * 0.04;
    const standingArmL = THREE.MathUtils.lerp(idleArm, walkArmSwing, blend);
    const standingArmR = THREE.MathUtils.lerp(-idleArm, -walkArmSwing, blend);
    const standingLegL = THREE.MathUtils.lerp(0, -walkLegSwing, blend);
    const standingLegR = THREE.MathUtils.lerp(0, walkLegSwing, blend);
    const standingBodyBob = THREE.MathUtils.lerp(breathBob, walkBodyBob, blend);
    const standingLean = THREE.MathUtils.lerp(0, walkLean, blend);

    const leftLift = Math.max(0, Math.sin(cycle + Math.PI) * footLift);
    const rightLift = Math.max(0, Math.sin(cycle) * footLift);
    const standingShoeYL = 1.5 + THREE.MathUtils.lerp(0, leftLift, blend);
    const standingShoeYR = 1.5 + THREE.MathUtils.lerp(0, rightLift, blend);

    // Sitting Pose Angles & Positions
    // Avatar faces -Z. Legs bend so feet go toward +Z (behind/under the seat),
    // thighs rotated +90° around X to fold toward the chair seat.
    const sitLegX = Math.PI / 2.2; // Thighs bent ~82° backward/downward - feet tucked under seat
    const sitArmX = 0.55;          // Arms lean forward at desk height (toward -Z)
    const sitShoeY = 1.2;
    const sitShoeZ = 4.2;          // Feet rest behind/under knees toward +Z

    // Apply Blended Rotations between Standing and Sitting
    if (leftArm) {
      leftArm.rotation.x = THREE.MathUtils.lerp(standingArmL, sitArmX, sitBlend);
      leftArm.rotation.z = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0, runFactor * -0.12, blend), -0.12, sitBlend);
    }
    if (rightArm) {
      rightArm.rotation.x = THREE.MathUtils.lerp(standingArmR, sitArmX, sitBlend);
      rightArm.rotation.z = THREE.MathUtils.lerp(THREE.MathUtils.lerp(0, runFactor * 0.12, blend), 0.12, sitBlend);
    }

    if (leftLeg) {
      leftLeg.rotation.x = THREE.MathUtils.lerp(standingLegL, sitLegX, sitBlend);
    }
    if (rightLeg) {
      rightLeg.rotation.x = THREE.MathUtils.lerp(standingLegR, sitLegX, sitBlend);
    }

    if (jacket) {
      jacket.position.y = 18 + THREE.MathUtils.lerp(standingBodyBob, breathBob * 0.8, sitBlend);
      jacket.rotation.x = THREE.MathUtils.lerp(-standingLean, -0.02, sitBlend);
    }
    if (head) {
      head.position.y = 25.5 + THREE.MathUtils.lerp(standingBodyBob * 1.15, breathBob * 0.9, sitBlend);
      head.rotation.x = THREE.MathUtils.lerp(standingLean * 0.4, 0, sitBlend);
    }

    if (leftShoe) {
      leftShoe.position.y = THREE.MathUtils.lerp(standingShoeYL, sitShoeY, sitBlend);
      leftShoe.position.z = THREE.MathUtils.lerp(-0.6, sitShoeZ, sitBlend);
    }
    if (rightShoe) {
      rightShoe.position.y = THREE.MathUtils.lerp(standingShoeYR, sitShoeY, sitBlend);
      rightShoe.position.z = THREE.MathUtils.lerp(-0.6, sitShoeZ, sitBlend);
    }
  }
}
