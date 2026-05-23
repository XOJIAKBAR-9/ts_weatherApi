/**
 * Application entry point — initializes the Weather App.
 * Wires up event listeners, coordinates services, and manages UI state.
 * @module index
 */

import './styles.css';
import { fetchCurrentWeather, fetchForecast } from './api/weatherApi';
import { Weather, IWeather } from './models/Weather';
import { ILocation } from './models/Location';
import { NotificationCondition, INotificationSubscription } from './models/Notification';
import { FavoritesService } from './services/FavoritesService';
import { NotificationService } from './services/NotificationService';
import {
  renderWeather,
  renderForecast,
  renderFavorites,
  updateNotificationLocationDropdown,
  renderSubscriptions,
  toggleAddFavoriteButton,
  showSearchError,
  showThresholdError,
  showToast,
  showLoading
} from './ui/render';

/** Current weather data for the last searched city */
let currentWeather: IWeather | null = null;

/** Service instances */
const favoritesService = new FavoritesService();
const notificationService = new NotificationService();

/**
 * Searches for weather data for the given city name.
 * Fetches both current weather and forecast, then renders results.
 * @param city - The city name to search
 */
async function searchCity(city: string): Promise<void> {
  showSearchError('');
  showLoading();

  try {
    const [weatherData, forecastData] = await Promise.all([
      fetchCurrentWeather(city),
      fetchForecast(city)
    ]);

    // Create Weather class instance with forecast data
    const weather = new Weather({
      ...weatherData,
      forecast: forecastData
    });

    currentWeather = weather;

    // Render results
    renderWeather(weather);
    renderForecast(forecastData);

    // Check if already a favorite
    const locationId = weather.cityName.toLowerCase().replace(/\s+/g, '-');
    toggleAddFavoriteButton(favoritesService.isFavorite(locationId));

    // Check notifications
    const alerts = notificationService.checkNotifications(weather);
    alerts.forEach((alert) => showToast(alert));

  } catch (error) {
    showSearchError(error instanceof Error ? error.message : 'An error occurred while fetching weather data.');
  }
}

/**
 * Refreshes the favorites list UI and notification location dropdown.
 */
function refreshFavorites(): void {
  const favorites = favoritesService.getAll();

  renderFavorites(
    favorites,
    (name: string) => {
      // View button: search for the city
      const input = document.getElementById('city-input') as HTMLInputElement;
      if (input) {
        input.value = name;
      }
      searchCity(name);
    },
    (id: string) => {
      // Remove button
      favoritesService.remove(id);
      refreshFavorites();

      // If the removed city is the currently displayed one, update the fav button
      if (currentWeather) {
        const currentId = currentWeather.cityName.toLowerCase().replace(/\s+/g, '-');
        toggleAddFavoriteButton(favoritesService.isFavorite(currentId));
      }
    }
  );

  updateNotificationLocationDropdown(favorites);
}

/**
 * Refreshes the subscriptions list UI.
 */
function refreshSubscriptions(): void {
  const subscriptions = notificationService.getAll();
  renderSubscriptions(subscriptions, (id: string) => {
    notificationService.unsubscribe(id);
    refreshSubscriptions();
  });
}

/**
 * Handles the notification condition dropdown change.
 * Shows/hides the threshold or weather condition input accordingly.
 */
function handleConditionChange(): void {
  const conditionSelect = document.getElementById('notif-condition') as HTMLSelectElement;
  const thresholdGroup = document.getElementById('threshold-group');
  const weatherCondGroup = document.getElementById('weather-condition-group');

  if (!conditionSelect || !thresholdGroup || !weatherCondGroup) return;

  const value = conditionSelect.value;

  if (value === 'TemperatureAbove' || value === 'TemperatureBelow') {
    thresholdGroup.classList.remove('hidden');
    weatherCondGroup.classList.add('hidden');
  } else if (value === 'WeatherCondition') {
    thresholdGroup.classList.add('hidden');
    weatherCondGroup.classList.remove('hidden');
  } else {
    thresholdGroup.classList.add('hidden');
    weatherCondGroup.classList.add('hidden');
  }
}

/**
 * Initializes the application — sets up event listeners and renders initial state.
 */
function init(): void {
  // Search button click
  const searchBtn = document.getElementById('search-btn');
  const cityInput = document.getElementById('city-input') as HTMLInputElement | null;

  if (searchBtn && cityInput) {
    searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (!city) {
        showSearchError('Please enter a city name.');
        return;
      }
      searchCity(city);
    });

    // Enter key support
    cityInput.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (!city) {
          showSearchError('Please enter a city name.');
          return;
        }
        searchCity(city);
      }
    });
  }

  // Add to favorites button
  const addFavBtn = document.getElementById('add-favorite-btn');
  if (addFavBtn) {
    addFavBtn.addEventListener('click', () => {
      if (!currentWeather) return;

      const location: ILocation = {
        id: currentWeather.cityName.toLowerCase().replace(/\s+/g, '-'),
        name: currentWeather.cityName,
        country: '', // Will be filled from API data if available
        lat: 0,
        lon: 0
      };

      favoritesService.add(location);
      toggleAddFavoriteButton(true);
      refreshFavorites();
      showToast(`⭐ ${currentWeather.cityName} added to favorites!`);
    });
  }

  // Notification condition dropdown change
  const conditionSelect = document.getElementById('notif-condition');
  if (conditionSelect) {
    conditionSelect.addEventListener('change', handleConditionChange);
  }

  // Notification form submit
  const notifForm = document.getElementById('notification-form') as HTMLFormElement | null;
  if (notifForm) {
    notifForm.addEventListener('submit', (e: Event) => {
      e.preventDefault();

      const locationSelect = document.getElementById('notif-location') as HTMLSelectElement;
      const condSelect = document.getElementById('notif-condition') as HTMLSelectElement;
      const thresholdInput = document.getElementById('notif-threshold') as HTMLInputElement;
      const weatherCondSelect = document.getElementById('notif-weather-cond') as HTMLSelectElement;

      const locationName = locationSelect.value;
      const conditionValue = condSelect.value;

      if (!locationName || !conditionValue) {
        showToast('Please select a location and condition.');
        return;
      }

      const subscription: INotificationSubscription = {
        id: `notif-${Date.now()}`,
        locationName,
        condition: conditionValue as NotificationCondition,
      };

      if (conditionValue === 'TemperatureAbove' || conditionValue === 'TemperatureBelow') {
        const thresholdValue = parseFloat(thresholdInput.value);
        if (isNaN(thresholdValue)) {
          showThresholdError('Please enter a valid number.');
          return;
        }
        showThresholdError('');
        subscription.threshold = thresholdValue;
      }

      if (conditionValue === 'WeatherCondition') {
        const weatherCond = weatherCondSelect.value;
        if (!weatherCond) {
          showToast('Please select a weather condition.');
          return;
        }
        subscription.weatherCondition = weatherCond;
      }

      notificationService.subscribe(subscription);
      refreshSubscriptions();
      showToast(`🔔 Subscription added for ${locationName}!`);

      // Reset form
      notifForm.reset();
      handleConditionChange();
    });
  }

  // Initial render
  refreshFavorites();
  refreshSubscriptions();
}

// Start the app when the DOM is ready
document.addEventListener('DOMContentLoaded', init);
