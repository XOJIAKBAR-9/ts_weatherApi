/**
 * Notification module — defines enums, interfaces, and classes for weather notification subscriptions.
 * @module models/Notification
 */

import { IWeather, WeatherCondition } from './Weather';

/** Enum representing the type of notification condition */
export enum NotificationCondition {
  TemperatureAbove = 'TemperatureAbove',
  TemperatureBelow = 'TemperatureBelow',
  WeatherCondition = 'WeatherCondition'
}

/** Interface representing a notification subscription */
export interface INotificationSubscription {
  id: string;
  locationName: string;
  condition: NotificationCondition;
  threshold?: number;
  weatherCondition?: string;
}

/**
 * NotificationSubscription class implementing INotificationSubscription.
 * Represents a user's subscription to weather alerts for a specific location and condition.
 */
export class NotificationSubscription implements INotificationSubscription {
  /** Unique identifier */
  id: string;
  /** Name of the location to monitor */
  locationName: string;
  /** Type of condition that triggers the notification */
  condition: NotificationCondition;
  /** Temperature threshold value (used with TemperatureAbove/Below) */
  threshold?: number;
  /** Weather condition to watch for (used with WeatherCondition type) */
  weatherCondition?: string;

  /**
   * Creates a new NotificationSubscription instance.
   * @param data - Subscription data conforming to INotificationSubscription
   */
  constructor(data: INotificationSubscription) {
    this.id = data.id;
    this.locationName = data.locationName;
    this.condition = data.condition;
    this.threshold = data.threshold;
    this.weatherCondition = data.weatherCondition;
  }

  /**
   * Checks whether the given weather data matches this subscription's condition.
   * @param weather - Current weather data to check against
   * @returns True if the weather matches the subscription condition
   */
  matches(weather: IWeather): boolean {
    // Only match if the location name matches (case-insensitive)
    if (weather.cityName.toLowerCase() !== this.locationName.toLowerCase()) {
      return false;
    }

    switch (this.condition) {
      case NotificationCondition.TemperatureAbove:
        return this.threshold !== undefined && weather.temperature > this.threshold;

      case NotificationCondition.TemperatureBelow:
        return this.threshold !== undefined && weather.temperature < this.threshold;

      case NotificationCondition.WeatherCondition:
        return this.weatherCondition !== undefined &&
          weather.condition === (this.weatherCondition as WeatherCondition);

      default:
        return false;
    }
  }
}
