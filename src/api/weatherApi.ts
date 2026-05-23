/**
 * Weather API module — handles all communication with OpenWeatherMap API.
 * Uses async/await for all fetch calls.
 * @module api/weatherApi
 */

import { IWeather, IForecastDay, WeatherCondition } from '../models/Weather';

// ============================================================
// OpenWeatherMap API Key configuration
// ============================================================
const API_KEY = 'ea7a8aef7c96b3aa75dddb6f9c080216';

/** Base URL for the OpenWeatherMap API */
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

/** Interface for the main weather data in OpenWeatherMap's current weather response */
interface IOpenWeatherMain {
  temp: number;
  humidity: number;
}

/** Interface for wind data in OpenWeatherMap's response */
interface IOpenWeatherWind {
  speed: number;
}

/** Interface for weather description in OpenWeatherMap's response */
interface IOpenWeatherWeather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

/** Interface for coordinate data */
interface IOpenWeatherCoord {
  lon: number;
  lat: number;
}

/** Interface for system data in OpenWeatherMap's response */
interface IOpenWeatherSys {
  country: string;
}

/** Interface for the OpenWeatherMap current weather API response */
interface IOpenWeatherResponse {
  name: string;
  main: IOpenWeatherMain;
  wind: IOpenWeatherWind;
  weather: IOpenWeatherWeather[];
  coord: IOpenWeatherCoord;
  sys: IOpenWeatherSys;
}

/** Interface for a single forecast item in OpenWeatherMap's forecast response */
interface IForecastItem {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: IOpenWeatherWeather[];
}

/** Interface for the OpenWeatherMap 5-day forecast API response */
interface IForecastResponse {
  list: IForecastItem[];
}

/**
 * Maps an OpenWeatherMap weather condition string to the internal WeatherCondition enum.
 * @param main - The "main" weather string from the API (e.g. "Clear", "Clouds")
 * @returns The corresponding WeatherCondition enum value
 */
function mapCondition(main: string): WeatherCondition {
  switch (main.toLowerCase()) {
    case 'clear':
      return WeatherCondition.Sunny;
    case 'clouds':
      return WeatherCondition.Cloudy;
    case 'rain':
    case 'drizzle':
    case 'thunderstorm':
      return WeatherCondition.Rainy;
    case 'snow':
      return WeatherCondition.Snowy;
    case 'wind':
    case 'squall':
    case 'tornado':
      return WeatherCondition.Windy;
    default:
      return WeatherCondition.Unknown;
  }
}

/**
 * Fetches current weather data for a given city from OpenWeatherMap.
 * @param city - The name of the city to look up
 * @returns A promise resolving to an IWeather object with current conditions
 * @throws Error if the fetch fails or the city is not found
 */
export async function fetchCurrentWeather(city: string): Promise<IWeather> {
  try {
    const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`City not found or API error (status ${response.status})`);
    }

    const data: IOpenWeatherResponse = await response.json();

    const weather: IWeather = {
      cityName: data.name,
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      condition: data.weather.length > 0 ? mapCondition(data.weather[0].main) : WeatherCondition.Unknown,
      forecast: []
    };

    return weather;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch weather: ${error.message}`);
    }
    throw new Error('Failed to fetch weather: Unknown error');
  }
}

/**
 * Fetches a 5-day forecast for a given city from OpenWeatherMap.
 * Groups the 3-hour interval data into daily forecasts.
 * @param city - The name of the city to look up
 * @returns A promise resolving to an array of IForecastDay objects
 * @throws Error if the fetch fails or the city is not found
 */
export async function fetchForecast(city: string): Promise<IForecastDay[]> {
  try {
    const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`City not found or API error (status ${response.status})`);
    }

    const data: IForecastResponse = await response.json();

    // Group forecast items by date and aggregate min/max temps
    const dailyMap = new Map<string, { minTemp: number; maxTemp: number; condition: string }>();

    for (const item of data.list) {
      const date = item.dt_txt.split(' ')[0]; // Extract YYYY-MM-DD

      if (!dailyMap.has(date)) {
        dailyMap.set(date, {
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          condition: item.weather.length > 0 ? item.weather[0].main : 'Unknown'
        });
      } else {
        const existing = dailyMap.get(date);
        if (existing) {
          existing.minTemp = Math.min(existing.minTemp, item.main.temp_min);
          existing.maxTemp = Math.max(existing.maxTemp, item.main.temp_max);
        }
      }
    }

    const forecastDays: IForecastDay[] = [];
    dailyMap.forEach((value, date) => {
      forecastDays.push({
        date,
        minTemp: Math.round(value.minTemp),
        maxTemp: Math.round(value.maxTemp),
        condition: mapCondition(value.condition)
      });
    });

    // Return up to 5 days
    return forecastDays.slice(0, 5);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
    throw new Error('Failed to fetch forecast: Unknown error');
  }
}
