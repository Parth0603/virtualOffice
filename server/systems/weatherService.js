/**
 * Server-authoritative Weather Service
 * Periodically fetches real weather for Asia/Kolkata (lat: 22.5726, lon: 88.3639)
 * with robust caching and resilient fallbacks.
 */

const KOLKATA_COORDS = {
  lat: 22.5726,
  lon: 88.3639,
  timezone: 'Asia/Kolkata'
};

const DEFAULT_ENVIRONMENT = {
  timezone: 'Asia/Kolkata',
  weather: 'CLEAR',
  weatherIntensity: 0.0,
  cloudCover: 0.1,
  windSpeed: 8.0,
  windDirection: 180,
  lastUpdated: Date.now()
};

class WeatherService {
  constructor() {
    this.currentEnvironment = { ...DEFAULT_ENVIRONMENT };
    this.updateInterval = 10 * 60 * 1000; // 10 minutes
    this.timer = null;
    this.listeners = new Set();
  }

  start() {
    // Initial fetch
    this.fetchWeather();
    // Periodic refresh
    this.timer = setInterval(() => {
      this.fetchWeather();
    }, this.updateInterval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onUpdate(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getEnvironment() {
    return { ...this.currentEnvironment };
  }

  setEnvironment(overrideData) {
    this.currentEnvironment = {
      ...this.currentEnvironment,
      ...overrideData,
      lastUpdated: Date.now()
    };
    this.notifyListeners();
  }

  notifyListeners() {
    const env = this.getEnvironment();
    for (const listener of this.listeners) {
      try {
        listener(env);
      } catch (err) {
        console.error('[WeatherService] Error in listener callback:', err);
      }
    }
  }

  async fetchWeather() {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${KOLKATA_COORDS.lat}&longitude=${KOLKATA_COORDS.lon}&current=weather_code,cloud_cover,precipitation,rain,showers,wind_speed_10m,wind_direction_10m&timezone=Asia%2FKolkata`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Weather API returned status ${response.status}`);
      }

      const data = await response.json();
      const current = data.current;

      if (!current) {
        throw new Error('No current weather data in response');
      }

      const weatherCode = current.weather_code ?? 0;
      const cloudCover = (current.cloud_cover ?? 10) / 100; // normalized 0 to 1
      const precipitation = (current.precipitation ?? 0) + (current.rain ?? 0) + (current.showers ?? 0);
      const windSpeed = current.wind_speed_10m ?? 8.0;
      const windDirection = current.wind_direction_10m ?? 180;

      let weatherType = 'CLEAR';
      let weatherIntensity = 0.0;

      // Map WMO codes to CLEAR, CLOUDY, RAIN, STORM
      if (weatherCode >= 95 || (weatherCode >= 80 && precipitation > 12)) {
        weatherType = 'STORM';
        weatherIntensity = Math.min(1.0, 0.7 + (precipitation / 30));
      } else if (weatherCode >= 51 || precipitation > 0.2) {
        weatherType = 'RAIN';
        weatherIntensity = Math.min(0.9, 0.3 + (precipitation / 15));
      } else if (weatherCode >= 1 || cloudCover > 0.35) {
        weatherType = 'CLOUDY';
        weatherIntensity = cloudCover;
      } else {
        weatherType = 'CLEAR';
        weatherIntensity = 0.0;
      }

      const updatedEnv = {
        timezone: 'Asia/Kolkata',
        weather: weatherType,
        weatherIntensity: Number(weatherIntensity.toFixed(2)),
        cloudCover: Number(cloudCover.toFixed(2)),
        windSpeed: Number(windSpeed.toFixed(1)),
        windDirection: Math.round(windDirection),
        lastUpdated: Date.now()
      };

      this.currentEnvironment = updatedEnv;
      console.log(`[WeatherService] Updated Asia/Kolkata weather: ${weatherType} (Intensity: ${weatherIntensity.toFixed(2)}, Clouds: ${(cloudCover * 100).toFixed(0)}%, Wind: ${windSpeed} km/h)`);
      this.notifyListeners();
    } catch (err) {
      console.warn(`[WeatherService] Weather fetch failed, retaining last known state (${this.currentEnvironment.weather}):`, err.message);
      // Fallback: keep existing currentEnvironment without crashing
    }
  }
}

export const weatherService = new WeatherService();
