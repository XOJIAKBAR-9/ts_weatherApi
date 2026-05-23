/**
 * NotificationService — manages weather notification subscriptions.
 * Uses StorageManager for localStorage persistence.
 * Decorated with @Service.
 * @module services/NotificationService
 */

import { IWeather } from '../models/Weather';
import {
  INotificationSubscription,
  NotificationSubscription,
  NotificationCondition
} from '../models/Notification';
import { StorageManager } from '../utils/storage';
import { Service } from '../utils/decorators';

/** localStorage key for storing notification subscriptions */
const NOTIFICATIONS_KEY = 'weather_app_notifications';

/**
 * Service class that manages weather notification subscriptions.
 * Users can subscribe to be alerted when weather conditions match their criteria.
 */
@Service
export class NotificationService {
  /** Storage manager instance for persisting subscriptions */
  private storage: StorageManager<NotificationSubscription>;

  /** Creates a new NotificationService instance */
  constructor() {
    this.storage = new StorageManager<NotificationSubscription>(NOTIFICATIONS_KEY);
  }

  /**
   * Subscribes to a new notification.
   * Creates a NotificationSubscription from the provided data and persists it.
   * @param sub - The subscription data to add
   */
  subscribe(sub: INotificationSubscription): void {
    const subscription = new NotificationSubscription(sub);
    this.storage.add(subscription);
  }

  /**
   * Unsubscribes from a notification by removing it by ID.
   * @param id - The unique identifier of the subscription to remove
   */
  unsubscribe(id: string): void {
    this.storage.remove((item: NotificationSubscription) => item.id === id);
  }

  /**
   * Retrieves all active notification subscriptions.
   * @returns An array of NotificationSubscription objects
   */
  getAll(): NotificationSubscription[] {
    return this.storage.getAll();
  }

  /**
   * Checks all subscriptions against current weather and returns alert messages.
   * Reconstructs NotificationSubscription instances from raw storage data to
   * ensure the matches() method is available.
   * @param weather - The current weather data to check against
   * @returns An array of alert message strings for matched subscriptions
   */
  checkNotifications(weather: IWeather): string[] {
    const alerts: string[] = [];
    const subscriptions = this.getAll();

    for (const rawSub of subscriptions) {
      // Reconstruct to get access to the matches() method
      const sub = new NotificationSubscription(rawSub);

      if (sub.matches(weather)) {
        let message = '';
        switch (sub.condition) {
          case NotificationCondition.TemperatureAbove:
            message = `⚠️ ${sub.locationName}: Temperature (${weather.temperature}°C) is above ${sub.threshold}°C!`;
            break;
          case NotificationCondition.TemperatureBelow:
            message = `🥶 ${sub.locationName}: Temperature (${weather.temperature}°C) is below ${sub.threshold}°C!`;
            break;
          case NotificationCondition.WeatherCondition:
            message = `🌦️ ${sub.locationName}: Weather condition is ${sub.weatherCondition}!`;
            break;
        }
        if (message) {
          alerts.push(message);
        }
      }
    }

    return alerts;
  }
}
