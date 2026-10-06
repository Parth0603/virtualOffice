/**
 * WeatherSystem
 * Processes weather states (CLEAR, CLOUDY, RAIN, STORM)
 * and calculates visual weather parameters, particle intensities, and wind vectors.
 */

export class WeatherSystem {
  constructor() {
    this.debugWeather = null; // When set ({ weather, intensity, cloudCover, windSpeed, windDirection }), overrides server state
    this.serverWeather = {
      weather: 'CLEAR',
      weatherIntensity: 0.0,
      cloudCover: 0.1,
      windSpeed: 8.0,
      windDirection: 180
    };
  }

  setServerWeather(weatherData) {
    if (!weatherData) return;
    this.serverWeather = {
      weather: weatherData.weather || 'CLEAR',
      weatherIntensity: weatherData.weatherIntensity ?? 0.0,
      cloudCover: weatherData.cloudCover ?? 0.1,
      windSpeed: weatherData.windSpeed ?? 8.0,
      windDirection: weatherData.windDirection ?? 180
    };
  }

  setDebugWeather(weatherConfig) {
    this.debugWeather = weatherConfig; // null or object
  }

  getWeatherState() {
    const raw = this.debugWeather || this.serverWeather;

    const weatherType = (raw.weather || 'CLEAR').toUpperCase();
    let weatherIntensity = raw.weatherIntensity ?? 0.0;
    let cloudCover = raw.cloudCover ?? 0.1;
    let windSpeed = raw.windSpeed ?? 8.0;
    let windDirection = raw.windDirection ?? 180;

    // Derived parameters based on weather type
    let rainIntensity = 0.0;
    let skyDimFactor = 0.0;
    let isStorm = false;

    switch (weatherType) {
      case 'CLOUDY':
        cloudCover = Math.max(0.4, cloudCover);
        skyDimFactor = 0.15 + (cloudCover * 0.2);
        rainIntensity = 0.0;
        break;

      case 'RAIN':
        cloudCover = Math.max(0.7, cloudCover);
        skyDimFactor = 0.35 + (weatherIntensity * 0.25);
        rainIntensity = Math.max(0.35, weatherIntensity > 0 ? weatherIntensity : 0.6);
        break;

      case 'STORM':
        cloudCover = 1.0;
        skyDimFactor = 0.65;
        rainIntensity = Math.max(0.8, weatherIntensity > 0 ? weatherIntensity : 1.0);
        isStorm = true;
        windSpeed = Math.max(22.0, windSpeed);
        break;

      case 'CLEAR':
      default:
        cloudCover = Math.min(0.2, cloudCover);
        skyDimFactor = 0.0;
        rainIntensity = 0.0;
        break;
    }

    // Wind direction to radian vector
    const rad = (windDirection * Math.PI) / 180;
    const windStrength = Math.min(1.0, windSpeed / 40.0);
    const windVector = {
      x: Math.sin(rad) * windStrength,
      z: Math.cos(rad) * windStrength,
      speed: windSpeed,
      strength: windStrength
    };

    return {
      weather: weatherType,
      weatherIntensity,
      cloudCover,
      windSpeed,
      windDirection,
      rainIntensity,
      skyDimFactor,
      isStorm,
      windVector
    };
  }
}

export const weatherSystem = new WeatherSystem();
