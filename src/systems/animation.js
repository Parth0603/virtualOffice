import * as THREE from 'three';

export class AnimationSystem {
  /**
   * Analytical 2-bone Inverse Kinematics solver.
   * Solves hip -> knee -> ankle pitch angles so that the ankle reaches target (dy, dz)
   * in the hip's reference frame (where hip is at origin (0, 0, 0)).
   *
   * @param {number} l1 - Upper segment length (thigh)
   * @param {number} l2 - Lower segment length (shin)
   * @param {number} dy - Target ankle Y relative to hip (negative when below hip)
   * @param {number} dz - Target ankle Z relative to hip (negative when in front of avatar)
   * @returns {{ thighAngle: number, kneeAngle: number, ankleAngle: number }}
   */
  static solveLegIK(l1, l2, dy, dz) {
    const distSq = dy * dy + dz * dz;
    let dist = Math.sqrt(distSq);

    // Clamp distance within reachable kinematic limits
    const maxReach = l1 + l2 - 0.005;
    const minReach = Math.abs(l1 - l2) + 0.005;
    dist = THREE.MathUtils.clamp(dist, minReach, maxReach);

    // Law of Cosines
    // cos(alpha) = (l1^2 + dist^2 - l2^2) / (2 * l1 * dist)
    const cosAlpha = THREE.MathUtils.clamp((l1 * l1 + dist * dist - l2 * l2) / (2 * l1 * dist), -1, 1);
    const alpha = Math.acos(cosAlpha);

    // cos(beta) = (l1^2 + l2^2 - dist^2) / (2 * l1 * l2)
    const cosBeta = THREE.MathUtils.clamp((l1 * l1 + l2 * l2 - dist * dist) / (2 * l1 * l2), -1, 1);
    const beta = Math.acos(cosBeta);

    // Angle of target vector relative to vertical down (-Y)
    // Forward is -Z, so dz is negative. -dz > 0.
    const phi = Math.atan2(-dz, -dy);

    // Thigh pitch forward (-X rotation in three.js coordinate space)
    const thighAngle = -(phi + alpha);

    // Knee interior angle flex (bending shin back towards +Z / down to floor)
    const kneeAngle = Math.PI - beta;

    // Ankle pitch to keep foot parallel to horizontal floor (world pitch ~ 0)
    const ankleAngle = -(thighAngle + kneeAngle);

    return { thighAngle, kneeAngle, ankleAngle };
  }

  static updateAvatarAnimation(avatarRefs, currentSpeed = 0, delta = 0.016, actionState = 'standing') {
    if (!avatarRefs) return;

    const {
      pelvis,
      spine,
      chest,
      neck,
      head,
      leftShoulder,
      rightShoulder,
      leftElbow,
      rightElbow,
      leftWrist,
      rightWrist,
      leftThigh,
      rightThigh,
      leftKnee,
      rightKnee,
      leftAnkle,
      rightAnkle
    } = avatarRefs;

    const dt = Math.min(delta, 0.08);

    // Initialize animation tracking properties on avatarRefs
    if (avatarRefs.moveBlend === undefined) avatarRefs.moveBlend = 0;
    if (avatarRefs.walkCycle === undefined) avatarRefs.walkCycle = 0;
    if (avatarRefs.idleCycle === undefined) avatarRefs.idleCycle = 0;
    if (avatarRefs.sitBlend === undefined) avatarRefs.sitBlend = 0;

    // Sitting state blend (0 = standing, 1 = sitting) with smooth transition
    const targetSitBlend = actionState === 'sitting' ? 1.0 : 0.0;
    avatarRefs.sitBlend += (targetSitBlend - avatarRefs.sitBlend) * Math.min(1.0, 9.0 * dt);
    const sitBlend = avatarRefs.sitBlend;

    // Movement state thresholds
    const isMoving = actionState !== 'sitting' && currentSpeed > 0.08;

    // Smooth movement blend weight (0 = fully idle, 1 = fully moving)
    const targetBlend = isMoving ? 1.0 : 0.0;
    avatarRefs.moveBlend += (targetBlend - avatarRefs.moveBlend) * Math.min(1.0, 10.0 * dt);
    const moveBlend = avatarRefs.moveBlend;

    // Continuous idle breathing cycle
    avatarRefs.idleCycle += 0.035 * (dt * 60);
    const idleTime = avatarRefs.idleCycle;
    const breathBob = Math.sin(idleTime) * 0.15;
    const breathSway = Math.cos(idleTime * 0.7) * 0.02;

    // Stride locomotion cycle
    if (isMoving) {
      const strideRate = (currentSpeed * 0.065 + 0.12) * (dt * 60);
      avatarRefs.walkCycle += strideRate;
    }
    const cycle = avatarRefs.walkCycle;

    // Run factor: 0.0 = walking (<= 2.3 speed), 1.0 = sprinting (>= 4.2 speed)
    const runFactor = THREE.MathUtils.clamp((currentSpeed - 2.3) / 2.0, 0.0, 1.0);

    // ------------------------------------------------------------------------
    // 1. STANDING / LOCOMOTION KINEMATICS
    // ------------------------------------------------------------------------
    const walkPelvisBob = Math.sin(cycle * 2) * THREE.MathUtils.lerp(0.24, 0.48, runFactor);
    const walkLean = THREE.MathUtils.lerp(0.04, 0.16, runFactor);
    const walkSpineTwist = Math.sin(cycle) * THREE.MathUtils.lerp(0.05, 0.12, runFactor);

    // Leg stride angles for walking/running
    const legSwingMax = THREE.MathUtils.lerp(0.42, 0.85, runFactor);
    const legSwingL = Math.sin(cycle) * legSwingMax;
    const legSwingR = -legSwingL;

    // Natural biomechanical knee kinematics:
    // When the leg pushes off backward (legSwing > 0), the knee flexes upward to lift the foot.
    // When the leg swings forward (legSwing < 0), the knee extends forward naturally into heel strike.
    const kneeFlexL = Math.max(0, legSwingL * 0.85) + (runFactor * 0.35 * Math.max(0, legSwingL));
    const kneeFlexR = Math.max(0, legSwingR * 0.85) + (runFactor * 0.35 * Math.max(0, legSwingR));

    // Arm swing for walking/running (in opposition to legs)
    const armSwingMax = THREE.MathUtils.lerp(0.40, 0.78, runFactor);
    const armSwingL = -Math.sin(cycle) * armSwingMax;
    const armSwingR = Math.sin(cycle) * armSwingMax;
    const elbowFlexL = THREE.MathUtils.lerp(0.12, 0.25 + Math.max(0, armSwingL * 0.6), moveBlend);
    const elbowFlexR = THREE.MathUtils.lerp(0.12, 0.25 + Math.max(0, armSwingR * 0.6), moveBlend);

    // Standing idle poses
    const idleArmL = Math.sin(idleTime * 0.8) * 0.03;
    const idleArmR = -Math.sin(idleTime * 0.8) * 0.03;

    // Blended standing poses
    const standThighRotXL = THREE.MathUtils.lerp(0, legSwingL, moveBlend);
    const standThighRotXR = THREE.MathUtils.lerp(0, legSwingR, moveBlend);
    const standKneeRotXL = THREE.MathUtils.lerp(0.02, kneeFlexL, moveBlend);
    const standKneeRotXR = THREE.MathUtils.lerp(0.02, kneeFlexR, moveBlend);
    const standAnkleRotXL = THREE.MathUtils.lerp(-0.02, -legSwingL * 0.3, moveBlend);
    const standAnkleRotXR = THREE.MathUtils.lerp(-0.02, -legSwingR * 0.3, moveBlend);

    const standArmRotXL = THREE.MathUtils.lerp(idleArmL, armSwingL, moveBlend);
    const standArmRotXR = THREE.MathUtils.lerp(idleArmR, armSwingR, moveBlend);

    // ------------------------------------------------------------------------
    // 2. SEATED 2-BONE INVERSE KINEMATICS & POSE SOLVING
    // ------------------------------------------------------------------------
    // Pelvis standing height: 13.5 -> Pelvis seated height: 7.2 (on chair seat)
    // Hip joint offset from pelvis: Y = -1.0
    // Thigh length L1 = 6.2, Shin length L2 = 5.8
    // Target ankle position when sitting: Ankle Y = 0.5 (above floor), Ankle Z = -5.8 (in front of hip)
    const sittingPelvisY = 7.2;
    const standingPelvisY = 13.5;

    const currentPelvisY = THREE.MathUtils.lerp(
      standingPelvisY + THREE.MathUtils.lerp(breathBob, walkPelvisBob, moveBlend),
      sittingPelvisY + breathBob * 0.4,
      sitBlend
    );

    // Solve 2-Bone IK for left and right legs
    const currentHipY = currentPelvisY - 1.0;
    const targetAnkleY = 0.5; // Flat on floor (sole sits at Y = 0.0)
    const targetAnkleZ = -5.8; // Extended forward in front of the chair

    const dy = targetAnkleY - currentHipY;
    const dz = targetAnkleZ;
    const legIK = AnimationSystem.solveLegIK(6.2, 5.8, dy, dz);

    // Left and right leg slight natural seat spread (abduction)
    const sitThighRotZ_L = -0.06;
    const sitThighRotZ_R = 0.06;
    const sitThighRotY_L = 0.04;
    const sitThighRotY_R = -0.04;

    // ------------------------------------------------------------------------
    // 3. APPLY ROTATIONS & POSITIONS TO ARTICULATED SKELETON
    // ------------------------------------------------------------------------

    // A. PELVIS & ROOT HIPS
    if (pelvis) {
      pelvis.position.y = currentPelvisY;
      pelvis.position.z = THREE.MathUtils.lerp(0, 0.4, sitBlend);
      pelvis.rotation.x = THREE.MathUtils.lerp(0, 0.03, sitBlend);
      pelvis.rotation.y = THREE.MathUtils.lerp(0, 0, sitBlend);
      pelvis.rotation.z = THREE.MathUtils.lerp(0, breathSway * 0.2, sitBlend);
    }

    // B. SPINE & CHEST (UPPER TORSO)
    if (spine) {
      spine.rotation.x = THREE.MathUtils.lerp(-walkLean * moveBlend, -0.04, sitBlend);
      spine.rotation.y = THREE.MathUtils.lerp(walkSpineTwist * moveBlend, 0, sitBlend);
      spine.rotation.z = THREE.MathUtils.lerp(0, breathSway * 0.3, sitBlend);
    }

    if (chest) {
      chest.rotation.x = THREE.MathUtils.lerp(walkLean * 0.3 * moveBlend, 0.02, sitBlend);
      chest.rotation.y = THREE.MathUtils.lerp(-walkSpineTwist * 0.5 * moveBlend, 0, sitBlend);
    }

    // C. HEAD & NECK
    if (neck) {
      neck.rotation.x = THREE.MathUtils.lerp(0, 0.02, sitBlend);
    }
    if (head) {
      head.rotation.x = THREE.MathUtils.lerp(walkLean * 0.4 * moveBlend, -0.02, sitBlend);
      head.rotation.y = THREE.MathUtils.lerp(0, 0, sitBlend);
    }

    // D. LOWER BODY: LEFT & RIGHT LEGS (THIGH → KNEE → SHIN → ANKLE → FOOT)
    if (leftThigh) {
      leftThigh.rotation.x = THREE.MathUtils.lerp(standThighRotXL, legIK.thighAngle, sitBlend);
      leftThigh.rotation.y = THREE.MathUtils.lerp(0, sitThighRotY_L, sitBlend);
      leftThigh.rotation.z = THREE.MathUtils.lerp(0, sitThighRotZ_L, sitBlend);
    }
    if (rightThigh) {
      rightThigh.rotation.x = THREE.MathUtils.lerp(standThighRotXR, legIK.thighAngle, sitBlend);
      rightThigh.rotation.y = THREE.MathUtils.lerp(0, sitThighRotY_R, sitBlend);
      rightThigh.rotation.z = THREE.MathUtils.lerp(0, sitThighRotZ_R, sitBlend);
    }

    if (leftKnee) {
      leftKnee.rotation.x = THREE.MathUtils.lerp(standKneeRotXL, legIK.kneeAngle, sitBlend);
      leftKnee.rotation.y = 0;
      leftKnee.rotation.z = 0;
    }
    if (rightKnee) {
      rightKnee.rotation.x = THREE.MathUtils.lerp(standKneeRotXR, legIK.kneeAngle, sitBlend);
      rightKnee.rotation.y = 0;
      rightKnee.rotation.z = 0;
    }

    if (leftAnkle) {
      leftAnkle.rotation.x = THREE.MathUtils.lerp(standAnkleRotXL, legIK.ankleAngle, sitBlend);
      leftAnkle.rotation.y = THREE.MathUtils.lerp(0, -sitThighRotY_L, sitBlend);
      leftAnkle.rotation.z = THREE.MathUtils.lerp(0, -sitThighRotZ_L, sitBlend);
    }
    if (rightAnkle) {
      rightAnkle.rotation.x = THREE.MathUtils.lerp(standAnkleRotXR, legIK.ankleAngle, sitBlend);
      rightAnkle.rotation.y = THREE.MathUtils.lerp(0, -sitThighRotY_R, sitBlend);
      rightAnkle.rotation.z = THREE.MathUtils.lerp(0, -sitThighRotZ_R, sitBlend);
    }

    // E. UPPER BODY: ARMS & HANDS (SHOULDER → UPPER ARM → ELBOW → FOREARM → WRIST → HAND)
    const sitShoulderRotX = -0.48;
    const sitElbowRotX = 0.92;
    const sitWristRotX = -0.22;

    if (leftShoulder) {
      leftShoulder.rotation.x = THREE.MathUtils.lerp(standArmRotXL, sitShoulderRotX, sitBlend);
      leftShoulder.rotation.y = THREE.MathUtils.lerp(0, 0.10, sitBlend);
      leftShoulder.rotation.z = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0, runFactor * -0.15, moveBlend),
        -0.12,
        sitBlend
      );
    }
    if (rightShoulder) {
      rightShoulder.rotation.x = THREE.MathUtils.lerp(standArmRotXR, sitShoulderRotX, sitBlend);
      rightShoulder.rotation.y = THREE.MathUtils.lerp(0, -0.10, sitBlend);
      rightShoulder.rotation.z = THREE.MathUtils.lerp(
        THREE.MathUtils.lerp(0, runFactor * 0.15, moveBlend),
        0.12,
        sitBlend
      );
    }

    if (leftElbow) {
      leftElbow.rotation.x = THREE.MathUtils.lerp(elbowFlexL, sitElbowRotX, sitBlend);
      leftElbow.rotation.y = THREE.MathUtils.lerp(0, 0.12, sitBlend);
      leftElbow.rotation.z = THREE.MathUtils.lerp(0, -0.05, sitBlend);
    }
    if (rightElbow) {
      rightElbow.rotation.x = THREE.MathUtils.lerp(elbowFlexR, sitElbowRotX, sitBlend);
      rightElbow.rotation.y = THREE.MathUtils.lerp(0, -0.12, sitBlend);
      rightElbow.rotation.z = THREE.MathUtils.lerp(0, 0.05, sitBlend);
    }

    if (leftWrist) {
      leftWrist.rotation.x = THREE.MathUtils.lerp(0, sitWristRotX, sitBlend);
      leftWrist.rotation.y = THREE.MathUtils.lerp(0, 0.15, sitBlend);
      leftWrist.rotation.z = THREE.MathUtils.lerp(0, 0.05, sitBlend);
    }
    if (rightWrist) {
      rightWrist.rotation.x = THREE.MathUtils.lerp(0, sitWristRotX, sitBlend);
      rightWrist.rotation.y = THREE.MathUtils.lerp(0, -0.15, sitBlend);
      rightWrist.rotation.z = THREE.MathUtils.lerp(0, -0.05, sitBlend);
    }
  }
}
