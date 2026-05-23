/**
 * Unit tests for the NotificationService.
 */

import { NotificationService } from '../src/services/NotificationService';
import { NotificationCondition, INotificationSubscription } from '../src/models/Notification';
import { IWeather, WeatherCondition } from '../src/models/Weather';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('NotificationService', () => {
  let service: NotificationService;

  const mockSubscription1: INotificationSubscription = {
    id: 'sub-1',
    locationName: 'London',
    condition: NotificationCondition.TemperatureAbove,
    threshold: 30
  };

  const mockSubscription2: INotificationSubscription = {
    id: 'sub-2',
    locationName: 'London',
    condition: NotificationCondition.TemperatureBelow,
    threshold: 5
  };

  const mockSubscription3: INotificationSubscription = {
    id: 'sub-3',
    locationName: 'London',
    condition: NotificationCondition.WeatherCondition,
    weatherCondition: 'Rainy'
  };

  const mockWeatherHot: IWeather = {
    cityName: 'London',
    temperature: 35,
    humidity: 40,
    windSpeed: 2,
    condition: WeatherCondition.Sunny,
    forecast: []
  };

  const mockWeatherCold: IWeather = {
    cityName: 'London',
    temperature: 2,
    humidity: 80,
    windSpeed: 8,
    condition: WeatherCondition.Snowy,
    forecast: []
  };

  const mockWeatherRainy: IWeather = {
    cityName: 'London',
    temperature: 15,
    humidity: 90,
    windSpeed: 5,
    condition: WeatherCondition.Rainy,
    forecast: []
  };

  const mockWeatherNormal: IWeather = {
    cityName: 'London',
    temperature: 20,
    humidity: 60,
    windSpeed: 4,
    condition: WeatherCondition.Sunny,
    forecast: []
  };

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    service = new NotificationService();
  });

  describe('subscribe()', () => {
    it('should add a subscription', () => {
      service.subscribe(mockSubscription1);
      const subs = service.getAll();
      expect(subs.length).toBe(1);
      expect(subs[0].id).toBe('sub-1');
      expect(subs[0].locationName).toBe('London');
      expect(subs[0].condition).toBe(NotificationCondition.TemperatureAbove);
      expect(subs[0].threshold).toBe(30);
    });

    it('should add multiple subscriptions', () => {
      service.subscribe(mockSubscription1);
      service.subscribe(mockSubscription2);
      service.subscribe(mockSubscription3);
      const subs = service.getAll();
      expect(subs.length).toBe(3);
    });
  });

  describe('unsubscribe()', () => {
    it('should remove a subscription by id', () => {
      service.subscribe(mockSubscription1);
      service.subscribe(mockSubscription2);
      service.unsubscribe('sub-1');
      const subs = service.getAll();
      expect(subs.length).toBe(1);
      expect(subs[0].id).toBe('sub-2');
    });

    it('should handle removing a non-existent subscription', () => {
      service.subscribe(mockSubscription1);
      service.unsubscribe('non-existent');
      const subs = service.getAll();
      expect(subs.length).toBe(1);
    });
  });

  describe('checkNotifications()', () => {
    it('should return alert when temperature is above threshold', () => {
      service.subscribe(mockSubscription1);
      const alerts = service.checkNotifications(mockWeatherHot);
      expect(alerts.length).toBe(1);
      expect(alerts[0]).toContain('above');
      expect(alerts[0]).toContain('30');
    });

    it('should return alert when temperature is below threshold', () => {
      service.subscribe(mockSubscription2);
      const alerts = service.checkNotifications(mockWeatherCold);
      expect(alerts.length).toBe(1);
      expect(alerts[0]).toContain('below');
      expect(alerts[0]).toContain('5');
    });

    it('should return alert when weather condition matches', () => {
      service.subscribe(mockSubscription3);
      const alerts = service.checkNotifications(mockWeatherRainy);
      expect(alerts.length).toBe(1);
      expect(alerts[0]).toContain('Rainy');
    });

    it('should return empty array when no conditions match', () => {
      service.subscribe(mockSubscription1); // temp above 30
      service.subscribe(mockSubscription2); // temp below 5
      service.subscribe(mockSubscription3); // rainy
      const alerts = service.checkNotifications(mockWeatherNormal); // 20°C, Sunny
      expect(alerts.length).toBe(0);
    });

    it('should return empty array when no subscriptions exist', () => {
      const alerts = service.checkNotifications(mockWeatherHot);
      expect(alerts).toEqual([]);
    });

    it('should not match when location name differs', () => {
      service.subscribe(mockSubscription1);
      const differentCity: IWeather = {
        ...mockWeatherHot,
        cityName: 'Paris'
      };
      const alerts = service.checkNotifications(differentCity);
      expect(alerts.length).toBe(0);
    });

    it('should return multiple alerts when multiple conditions match', () => {
      // Subscribe to temp above 30 and sunny condition
      service.subscribe(mockSubscription1);
      const sunnySub: INotificationSubscription = {
        id: 'sub-sunny',
        locationName: 'London',
        condition: NotificationCondition.WeatherCondition,
        weatherCondition: 'Sunny'
      };
      service.subscribe(sunnySub);
      const alerts = service.checkNotifications(mockWeatherHot); // 35°C, Sunny
      expect(alerts.length).toBe(2);
    });
  });

  describe('getAll()', () => {
    it('should return empty array when no subscriptions exist', () => {
      const subs = service.getAll();
      expect(subs).toEqual([]);
      expect(Array.isArray(subs)).toBe(true);
    });
  });
});
