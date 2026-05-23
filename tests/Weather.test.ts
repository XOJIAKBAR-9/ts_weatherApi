/**
 * Unit tests for the Weather model.
 */

import { Weather, WeatherCondition, IWeather, IForecastDay } from '../src/models/Weather';

describe('WeatherCondition enum', () => {
  it('should have correct enum values', () => {
    expect(WeatherCondition.Sunny).toBe('Sunny');
    expect(WeatherCondition.Cloudy).toBe('Cloudy');
    expect(WeatherCondition.Rainy).toBe('Rainy');
    expect(WeatherCondition.Snowy).toBe('Snowy');
    expect(WeatherCondition.Windy).toBe('Windy');
    expect(WeatherCondition.Unknown).toBe('Unknown');
  });

  it('should have exactly 6 values', () => {
    const values = Object.values(WeatherCondition);
    expect(values.length).toBe(6);
  });
});

describe('Weather class', () => {
  const mockForecast: IForecastDay[] = [
    { date: '2026-05-24', minTemp: 18, maxTemp: 25, condition: WeatherCondition.Sunny },
    { date: '2026-05-25', minTemp: 15, maxTemp: 22, condition: WeatherCondition.Cloudy }
  ];

  const mockWeatherData: IWeather = {
    cityName: 'London',
    temperature: 20,
    humidity: 65,
    windSpeed: 5.5,
    condition: WeatherCondition.Cloudy,
    forecast: mockForecast
  };

  let weather: Weather;

  beforeEach(() => {
    weather = new Weather(mockWeatherData);
  });

  it('should set all properties correctly from constructor', () => {
    expect(weather.cityName).toBe('London');
    expect(weather.temperature).toBe(20);
    expect(weather.humidity).toBe(65);
    expect(weather.windSpeed).toBe(5.5);
    expect(weather.condition).toBe(WeatherCondition.Cloudy);
    expect(weather.forecast).toEqual(mockForecast);
    expect(weather.forecast.length).toBe(2);
  });

  it('should return correct summary string from getSummary()', () => {
    const summary = weather.getSummary();
    expect(summary).toBe('London: 20°C, Cloudy, Humidity: 65%, Wind: 5.5 m/s');
  });

  it('should return correct summary for different conditions', () => {
    const sunnyWeather = new Weather({
      cityName: 'Miami',
      temperature: 32,
      humidity: 80,
      windSpeed: 3.2,
      condition: WeatherCondition.Sunny,
      forecast: []
    });
    expect(sunnyWeather.getSummary()).toBe('Miami: 32°C, Sunny, Humidity: 80%, Wind: 3.2 m/s');
  });

  it('should store forecast data correctly', () => {
    expect(weather.forecast[0].date).toBe('2026-05-24');
    expect(weather.forecast[0].minTemp).toBe(18);
    expect(weather.forecast[0].maxTemp).toBe(25);
    expect(weather.forecast[0].condition).toBe(WeatherCondition.Sunny);
  });

  it('should handle empty forecast array', () => {
    const noForecast = new Weather({
      ...mockWeatherData,
      forecast: []
    });
    expect(noForecast.forecast).toEqual([]);
    expect(noForecast.forecast.length).toBe(0);
  });
});
