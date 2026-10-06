/**
 * TimeSystem
 * Real-time time calculator for Asia/Kolkata (UTC+05:30)
 * Computes continuous smooth transitions across DAWN, DAY, SUNSET, DUSK, and NIGHT.
 */

// Smoothstep helper for continuous transitions without abrupt jumps
function smoothstep(min, max, value) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

export class TimeSystem {
  constructor() {
    this.timezone = 'Asia/Kolkata';
    this.debugHour = null; // When set (0-24), overrides real time for developer testing
  }

  setDebugHour(hour) {
    this.debugHour = (hour !== null && hour !== undefined) ? Number(hour) : null;
  }

  /**
   * Returns current time in Asia/Kolkata as decimal hours (0.000 to 23.999)
   */
  getKolkataDecimalHours() {
    if (this.debugHour !== null) {
      return (this.debugHour % 24 + 24) % 24;
    }

    const now = new Date();
    // UTC milliseconds + 5.5 hours for Asia/Kolkata
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kolkataMs = utcMs + (5.5 * 3600000);
    const kolkataDate = new Date(kolkataMs);

    const hours = kolkataDate.getHours();
    const minutes = kolkataDate.getMinutes();
    const seconds = kolkataDate.getSeconds();
    const millis = kolkataDate.getMilliseconds();

    return hours + (minutes / 60) + (seconds / 3600) + (millis / 3600000);
  }

  /**
   * Returns complete continuous TimeState
   */
  getTimeState() {
    const hours = this.getKolkataDecimalHours();

    // Determine conceptual phase and smooth daylight factor (0.0 = deep night, 1.0 = full daylight)
    let phase = 'NIGHT';
    let daylightFactor = 0.0;
    let dawnFactor = 0.0;
    let sunsetFactor = 0.0;
    let duskFactor = 0.0;

    // Time brackets (in 24h decimal):
    // Night: 20.5 -> 05.0
    // Dawn: 05.0 -> 07.0 (transition night -> day)
    // Day: 07.0 -> 17.5 (full day)
    // Sunset: 17.5 -> 19.0 (warm golden sunset)
    // Dusk: 19.0 -> 20.5 (twilight -> night)
    if (hours >= 5.0 && hours < 7.0) {
      phase = 'DAWN';
      daylightFactor = smoothstep(5.0, 7.0, hours);
      // Dawn peaks at 6.0
      dawnFactor = 1.0 - Math.abs((hours - 6.0) / 1.0);
      dawnFactor = Math.max(0, dawnFactor);
    } else if (hours >= 7.0 && hours < 17.5) {
      phase = 'DAY';
      daylightFactor = 1.0;
    } else if (hours >= 17.5 && hours < 19.0) {
      phase = 'SUNSET';
      daylightFactor = 1.0 - (smoothstep(17.5, 19.0, hours) * 0.7); // drops from 1.0 to 0.3
      // Sunset warmth peaks at 18.25
      sunsetFactor = 1.0 - Math.abs((hours - 18.25) / 0.75);
      sunsetFactor = Math.max(0, sunsetFactor);
    } else if (hours >= 19.0 && hours < 20.5) {
      phase = 'DUSK';
      daylightFactor = 0.3 * (1.0 - smoothstep(19.0, 20.5, hours)); // drops from 0.3 to 0.0
      duskFactor = 1.0 - Math.abs((hours - 19.75) / 0.75);
      duskFactor = Math.max(0, duskFactor);
    } else {
      phase = 'NIGHT';
      daylightFactor = 0.0;
    }

    // Format human-readable string
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = (h % 12 === 0 ? 12 : h % 12).toString().padStart(2, '0');
    const displayM = m.toString().padStart(2, '0');
    const displayS = s.toString().padStart(2, '0');
    const formattedTime = `${displayH}:${displayM}:${displayS} ${period} IST`;

    return {
      hours,
      phase,
      daylightFactor,
      nightFactor: 1.0 - daylightFactor,
      dawnFactor,
      sunsetFactor,
      duskFactor,
      formattedTime,
      timezone: this.timezone
    };
  }
}

export const timeSystem = new TimeSystem();
