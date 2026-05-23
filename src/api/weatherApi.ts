/**
 * Weather API module — handles all communication with WeatherAPI.com API.
 * Uses async/await for all fetch calls.
 * @module api/weatherApi
 */

import { IWeather, IForecastDay, WeatherCondition } from '../models/Weather';

// ============================================================
// WeatherAPI API Key configuration
// ============================================================
const API_KEY = '20aab2a5443047208f993844262305';

/** Base URL for the WeatherAPI API */
const BASE_URL = 'https://api.weatherapi.com/v1';

/** Interface for the WeatherAPI current weather response */
interface IWeatherApiCurrentResponse {
  location: {
    name: string;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
    condition: {
      text: string;
    };
  };
}

/** Interface for a single forecast day in WeatherAPI's response */
interface IWeatherApiForecastDay {
  date: string;
  day: {
    mintemp_c: number;
    maxtemp_c: number;
    condition: {
      text: string;
    };
  };
}

/** Interface for the WeatherAPI 5-day forecast API response */
interface IWeatherApiForecastResponse {
  forecast: {
    forecastday: IWeatherApiForecastDay[];
  };
}

/**
 * Maps a WeatherAPI weather condition string to the internal WeatherCondition enum.
 * @param text - The weather string from the API (e.g. "Sunny", "Partly cloudy")
 * @returns The corresponding WeatherCondition enum value
 */
function mapCondition(text: string): WeatherCondition {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('sunny') || lowerText.includes('clear')) {
    return WeatherCondition.Sunny;
  }
  if (lowerText.includes('cloud') || lowerText.includes('overcast') || lowerText.includes('mist') || lowerText.includes('fog')) {
    return WeatherCondition.Cloudy;
  }
  if (lowerText.includes('rain') || lowerText.includes('drizzle') || lowerText.includes('shower')) {
    return WeatherCondition.Rainy;
  }
  if (lowerText.includes('snow') || lowerText.includes('ice') || lowerText.includes('blizzard') || lowerText.includes('sleet') || lowerText.includes('pellet')) {
    return WeatherCondition.Snowy;
  }
  if (lowerText.includes('wind') || lowerText.includes('storm') || lowerText.includes('thunder')) {
    return WeatherCondition.Windy;
  }
  return WeatherCondition.Unknown;
}

/**
 * Fetches current weather data for a given city from WeatherAPI.
 * @param city - The name of the city to look up
 * @returns A promise resolving to an IWeather object with current conditions
 * @throws Error if the fetch fails or the city is not found
 */
export async function fetchCurrentWeather(city: string): Promise<IWeather> {
  try {
    const url = `${BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`City not found or API error (status ${response.status})`);
    }

    const data: IWeatherApiCurrentResponse = await response.json();

    const weather: IWeather = {
      cityName: data.location.name,
      temperature: Math.round(data.current.temp_c),
      humidity: data.current.humidity,
      // Convert km/h to m/s
      windSpeed: Math.round((data.current.wind_kph * 1000) / 3600 * 10) / 10,
      condition: mapCondition(data.current.condition.text),
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
 * Fetches a 5-day forecast for a given city from WeatherAPI.
 * @param city - The name of the city to look up
 * @returns A promise resolving to an array of IForecastDay objects
 * @throws Error if the fetch fails or the city is not found
 */
export async function fetchForecast(city: string): Promise<IForecastDay[]> {
  try {
    const url = `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`City not found or API error (status ${response.status})`);
    }

    const data: IWeatherApiForecastResponse = await response.json();

    const forecastDays: IForecastDay[] = data.forecast.forecastday.map(day => ({
      date: day.date,
      minTemp: Math.round(day.day.mintemp_c),
      maxTemp: Math.round(day.day.maxtemp_c),
      condition: mapCondition(day.day.condition.text)
    }));

    // Return up to 5 days
    return forecastDays.slice(0, 5);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch forecast: ${error.message}`);
    }
    throw new Error('Failed to fetch forecast: Unknown error');
  }
}
