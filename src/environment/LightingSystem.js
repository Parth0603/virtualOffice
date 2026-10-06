/**
 * LightingSystem
 * Computes and smooth-interpolates sky colors, fog, ambient/directional lights,
 * office downlights, and emissive materials based on TimeState + WeatherState.
 */

import * as THREE from 'three';
import { materialPool } from '../utils/materialPool.js';

export class LightingSystem {
  constructor() {
    // Reusable THREE.Color instances for zero-allocation lerping
    this.targetSkyColor = new THREE.Color();
    this.currentSkyColor = new THREE.Color(0xf1f5f9);

    this.targetFogColor = new THREE.Color();
    this.currentFogColor = new THREE.Color(0xf1f5f9);

    this.targetAmbientColor = new THREE.Color();
    this.currentAmbientColor = new THREE.Color(0xf8fafc);

    this.targetDirColor = new THREE.Color();
    this.currentDirColor = new THREE.Color(0xffffff);

    this.targetHemiSkyColor = new THREE.Color();
    this.currentHemiSkyColor = new THREE.Color(0xffffff);

    this.targetHemiGroundColor = new THREE.Color();
    this.currentHemiGroundColor = new THREE.Color(0x94a3b8);

    // Intensities
    this.targetAmbientIntensity = 0.48;
    this.currentAmbientIntensity = 0.48;

    this.targetHemiIntensity = 0.52;
    this.currentHemiIntensity = 0.52;

    this.targetDirIntensity = 0.92;
    this.currentDirIntensity = 0.92;

    this.targetFillIntensity = 0.36;
    this.currentFillIntensity = 0.36;

    this.targetOfficeLightIntensity = 0.3;
    this.currentOfficeLightIntensity = 0.3;

    this.targetEmissiveIntensity = 0.1;
    this.currentEmissiveIntensity = 0.1;

    // Lightning Flash state (Storm only)
    this.lightningTimer = 0;
    this.lightningActive = false;
    this.lightningDuration = 0.12; // seconds
    this.lightningIntensity = 0.0;
    this.nextLightningInterval = 14 + Math.random() * 12; // 14-26s
  }

  /**
   * Evaluates targets from TimeState and WeatherState
   */
  evaluate(timeState, weatherState, delta = 0.016) {
    const { daylightFactor, dawnFactor, sunsetFactor, duskFactor } = timeState;
    const { skyDimFactor, rainIntensity, isStorm } = weatherState;

    // 1. Base Sky Color Palette blending
    // Daylight sky: #e0f2fe -> #f1f5f9
    // Dawn sky: #fed7aa (warm peach)
    // Sunset sky: #fb923c (golden amber) -> #b91c1c (deep amber)
    // Dusk sky: #312e81 (twilight indigo)
    // Night sky: #090d16 (deep slate night)
    const colDay = new THREE.Color(0xf1f5f9);
    const colDawn = new THREE.Color(0xfed7aa);
    const colSunset = new THREE.Color(0xf97316);
    const colDusk = new THREE.Color(0x1e1b4b);
    const colNight = new THREE.Color(0x090d16);

    // Weather overcast tints
    const colCloudy = new THREE.Color(0x94a3b8);
    const colRainSky = new THREE.Color(0x475569);
    const colStormSky = new THREE.Color(0x1e293b);

    // Blend base time sky
    const blendedSky = new THREE.Color();
    if (daylightFactor > 0.8) {
      blendedSky.copy(colDay);
    } else if (dawnFactor > 0.1) {
      blendedSky.copy(colNight).lerp(colDawn, dawnFactor * 0.8).lerp(colDay, daylightFactor);
    } else if (sunsetFactor > 0.1) {
      blendedSky.copy(colDay).lerp(colSunset, sunsetFactor);
    } else if (duskFactor > 0.1) {
      blendedSky.copy(colSunset).lerp(colDusk, duskFactor).lerp(colNight, 1 - daylightFactor);
    } else {
      blendedSky.copy(colNight);
    }

    // Blend weather into sky
    if (isStorm) {
      blendedSky.lerp(colStormSky, 0.75);
    } else if (rainIntensity > 0.1) {
      blendedSky.lerp(colRainSky, 0.6 * rainIntensity);
    } else if (skyDimFactor > 0.05) {
      blendedSky.lerp(colCloudy, skyDimFactor * 0.8);
    }

    this.targetSkyColor.copy(blendedSky);
    this.targetFogColor.copy(blendedSky);

    // 2. Ambient Light Color & Intensity
    // Day: #f8fafc @ 0.50 | Dawn: #ffedd5 @ 0.40 | Sunset: #fed7aa @ 0.38 | Night: #1e293b @ 0.16
    const ambDay = new THREE.Color(0xf8fafc);
    const ambDawn = new THREE.Color(0xffedd5);
    const ambSunset = new THREE.Color(0xfed7aa);
    const ambNight = new THREE.Color(0x1e293b);

    const baseAmbColor = new THREE.Color().copy(ambNight);
    if (daylightFactor > 0.7) {
      baseAmbColor.lerp(ambDay, daylightFactor);
    } else if (dawnFactor > 0.1) {
      baseAmbColor.lerp(ambDawn, dawnFactor).lerp(ambDay, daylightFactor);
    } else if (sunsetFactor > 0.1) {
      baseAmbColor.lerp(ambSunset, sunsetFactor);
    } else {
      baseAmbColor.lerp(ambDay, daylightFactor * 0.5);
    }
    this.targetAmbientColor.copy(baseAmbColor);

    const baseAmbIntensity = 0.16 + (daylightFactor * 0.32);
    const weatherAmbMod = 1.0 - (skyDimFactor * 0.35);
    this.targetAmbientIntensity = Math.max(0.12, baseAmbIntensity * weatherAmbMod);

    // 3. Hemisphere Light
    this.targetHemiSkyColor.copy(this.targetSkyColor);
    const hemiGroundDay = new THREE.Color(0x94a3b8);
    const hemiGroundNight = new THREE.Color(0x0f172a);
    this.targetHemiGroundColor.copy(hemiGroundNight).lerp(hemiGroundDay, daylightFactor);
    this.targetHemiIntensity = Math.max(0.14, (0.16 + (daylightFactor * 0.36)) * (1.0 - skyDimFactor * 0.3));

    // 4. Main Directional Light (Sun/Moon Proxy)
    // Day: #ffffff @ 0.95 | Dawn: #fde68a @ 0.60 | Sunset: #f97316 @ 0.55 | Night: #38bdf8 @ 0.14
    const dirDay = new THREE.Color(0xffffff);
    const dirDawn = new THREE.Color(0xfde68a);
    const dirSunset = new THREE.Color(0xf97316);
    const dirNight = new THREE.Color(0x38bdf8);

    const baseDirColor = new THREE.Color().copy(dirNight);
    if (daylightFactor > 0.7) {
      baseDirColor.lerp(dirDay, daylightFactor);
    } else if (dawnFactor > 0.1) {
      baseDirColor.lerp(dirDawn, dawnFactor).lerp(dirDay, daylightFactor);
    } else if (sunsetFactor > 0.1) {
      baseDirColor.lerp(dirSunset, sunsetFactor);
    } else {
      baseDirColor.lerp(dirDay, daylightFactor);
    }
    this.targetDirColor.copy(baseDirColor);

    const baseDirIntensity = 0.12 + (daylightFactor * 0.82);
    const weatherDirMod = 1.0 - (skyDimFactor * 0.65);
    this.targetDirIntensity = Math.max(0.08, baseDirIntensity * weatherDirMod);

    // 5. Fill Light
    this.targetFillIntensity = Math.max(0.06, (0.08 + (daylightFactor * 0.28)) * (1.0 - skyDimFactor * 0.4));

    // 6. Office Lights & Emissive Elements (Inverse of daylight + boosted in dark weather)
    // Day: ~0.35 | Sunset: ~0.70 | Night: ~1.0 | Storm: ~0.85
    const darkEnvironmentFactor = Math.max(1.0 - daylightFactor, skyDimFactor * 0.8);
    this.targetOfficeLightIntensity = 0.30 + (darkEnvironmentFactor * 0.70);
    this.targetEmissiveIntensity = 0.15 + (darkEnvironmentFactor * 0.85);

    // 7. Lightning Simulation (STORM only: subtle, brief, rare global light pulse)
    if (isStorm) {
      this.lightningTimer += delta;
      if (this.lightningTimer >= this.nextLightningInterval) {
        this.lightningActive = true;
        this.lightningTimer = 0;
        this.lightningDuration = 0.08 + Math.random() * 0.08; // 80-160ms
        this.nextLightningInterval = 12 + Math.random() * 16; // 12-28s between flashes
      }

      if (this.lightningActive) {
        this.lightningIntensity += delta * 15.0;
        if (this.lightningIntensity >= 1.0) {
          this.lightningIntensity = 1.0;
          this.lightningActive = false;
        }
      } else if (this.lightningIntensity > 0) {
        this.lightningIntensity -= delta * 8.0;
        if (this.lightningIntensity < 0) this.lightningIntensity = 0;
      }
    } else {
      this.lightningIntensity = 0;
      this.lightningActive = false;
      this.lightningTimer = 0;
    }

    // Apply Lightning Pulse contribution if active
    if (this.lightningIntensity > 0) {
      const flashBoost = this.lightningIntensity * 0.75;
      this.targetAmbientIntensity += flashBoost * 0.6;
      this.targetDirIntensity += flashBoost * 0.9;
      this.targetSkyColor.lerp(new THREE.Color(0xdbeafe), flashBoost * 0.5);
    }

    // 8. Smooth Lerping per frame (smooth continuous transitions at any delta)
    const lerpSpeed = Math.min(1.0, delta * 3.5);
    this.currentSkyColor.lerp(this.targetSkyColor, lerpSpeed);
    this.currentFogColor.lerp(this.targetFogColor, lerpSpeed);
    this.currentAmbientColor.lerp(this.targetAmbientColor, lerpSpeed);
    this.currentDirColor.lerp(this.targetDirColor, lerpSpeed);
    this.currentHemiSkyColor.lerp(this.targetHemiSkyColor, lerpSpeed);
    this.currentHemiGroundColor.lerp(this.targetHemiGroundColor, lerpSpeed);

    this.currentAmbientIntensity += (this.targetAmbientIntensity - this.currentAmbientIntensity) * lerpSpeed;
    this.currentHemiIntensity += (this.targetHemiIntensity - this.currentHemiIntensity) * lerpSpeed;
    this.currentDirIntensity += (this.targetDirIntensity - this.currentDirIntensity) * lerpSpeed;
    this.currentFillIntensity += (this.targetFillIntensity - this.currentFillIntensity) * lerpSpeed;
    this.currentOfficeLightIntensity += (this.targetOfficeLightIntensity - this.currentOfficeLightIntensity) * lerpSpeed;
    this.currentEmissiveIntensity += (this.targetEmissiveIntensity - this.currentEmissiveIntensity) * lerpSpeed;

    // 9. Update Shared Emissive Materials in real time
    if (materialPool.lampGlow) {
      materialPool.lampGlow.emissiveIntensity = 0.2 + (this.currentEmissiveIntensity * 0.8);
    }
    if (materialPool.receptionAccent) {
      materialPool.receptionAccent.emissiveIntensity = 0.3 + (this.currentEmissiveIntensity * 0.5);
    }
    if (materialPool.screenPresentation) {
      materialPool.screenPresentation.emissiveIntensity = 0.3 + (this.currentEmissiveIntensity * 0.4);
    }
    if (materialPool.unlockedBadge) {
      materialPool.unlockedBadge.emissiveIntensity = 0.4 + (this.currentEmissiveIntensity * 0.4);
    }
    if (materialPool.lockedBadge) {
      materialPool.lockedBadge.emissiveIntensity = 0.4 + (this.currentEmissiveIntensity * 0.4);
    }

    return {
      skyColor: this.currentSkyColor,
      fogColor: this.currentFogColor,
      ambientColor: this.currentAmbientColor,
      ambientIntensity: this.currentAmbientIntensity,
      hemiSkyColor: this.currentHemiSkyColor,
      hemiGroundColor: this.currentHemiGroundColor,
      hemiIntensity: this.currentHemiIntensity,
      dirColor: this.currentDirColor,
      dirIntensity: this.currentDirIntensity,
      fillIntensity: this.currentFillIntensity,
      officeLightIntensity: this.currentOfficeLightIntensity,
      emissiveIntensity: this.currentEmissiveIntensity,
      lightningIntensity: this.lightningIntensity
    };
  }
}

export const lightingSystem = new LightingSystem();
