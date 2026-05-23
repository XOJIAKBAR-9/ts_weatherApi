/**
 * Weather module — defines enums, interfaces, and classes for weather data.
 * @module models/Weather
 */

/** Enum representing possible weather conditions */
export enum WeatherCondition {
  Sunny = 'Sunny',
  Cloudy = 'Cloudy',
  Rainy = 'Rainy',
  Snowy = 'Snowy',
  Windy = 'Windy',
  Unknown = 'Unknown'
}

/** Type alias for temperature unit */
export type TemperatureUnit = 'metric' | 'imperial';

/** Interface for a single forecast day */
export interface IForecastDay {
  date: string;
  minTemp: number;
  maxTemp: number;
  condition: WeatherCondition;
}

/** Interface representing current weather data */
export interface IWeather {
  cityName: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: WeatherCondition;
  forecast: IForecastDay[];
}

/**
 * Weather class implementing the IWeather interface.
 * Encapsulates weather data for a city including current conditions and forecast.
 */
export class Weather implements IWeather {
  /** Name of the city */
  cityName: string;
  /** Current temperature in Celsius */
  temperature: number;
  /** Humidity percentage */
  humidity: number;
  /** Wind speed in m/s */
  windSpeed: number;
  /** Current weather condition */
  condition: WeatherCondition;
  /** Array of forecast days */
  forecast: IForecastDay[];

  /**
   * Creates a new Weather instance.
   * @param data - The weather data conforming to IWeather
   */
  constructor(data: IWeather) {
    this.cityName = data.cityName;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.windSpeed = data.windSpeed;
    this.condition = data.condition;
    this.forecast = data.forecast;
  }

  /**
   * Returns a human-readable summary of the current weather.
   * @returns A formatted string summarizing the weather
   */
  getSummary(): string {
    return `${this.cityName}: ${this.temperature}°C, ${this.condition}, Humidity: ${this.humidity}%, Wind: ${this.windSpeed} m/s`;
  }
}
