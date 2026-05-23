/**
 * UI Render module — handles all DOM manipulation and rendering.
 * Separated from business logic to follow Single Responsibility Principle.
 * @module ui/render
 */

import { IWeather, IForecastDay, WeatherCondition } from '../models/Weather';
import { FavoriteLocation } from '../models/Location';
import { NotificationSubscription, NotificationCondition } from '../models/Notification';

/**
 * Returns a weather emoji based on the WeatherCondition enum value.
 * @param condition - The weather condition to get an icon for
 * @returns An emoji string representing the condition
 */
function getWeatherIcon(condition: WeatherCondition): string {
  switch (condition) {
    case WeatherCondition.Sunny: return '☀️';
    case WeatherCondition.Cloudy: return '☁️';
    case WeatherCondition.Rainy: return '🌧️';
    case WeatherCondition.Snowy: return '❄️';
    case WeatherCondition.Windy: return '💨';
    default: return '🌡️';
  }
}

/**
 * Renders the current weather data into the weather card element.
 * @param weather - The weather data to display
 */
export function renderWeather(weather: IWeather): void {
  const section = document.getElementById('weather-section');
  const card = document.getElementById('weather-card');

  if (!section || !card) return;

  section.classList.remove('hidden');

  const icon = getWeatherIcon(weather.condition);

  card.innerHTML = `
    <div class="weather-card-content">
      <div class="weather-main">
        <span class="weather-icon-large">${icon}</span>
        <div class="weather-temp-group">
          <span class="weather-temp">${weather.temperature}°C</span>
          <span class="weather-condition">${weather.condition}</span>
        </div>
      </div>
      <h3 class="weather-city">${weather.cityName}</h3>
      <div class="weather-details">
        <div class="weather-detail-item">
          <span class="detail-label">💧 Humidity</span>
          <span class="detail-value">${weather.humidity}%</span>
        </div>
        <div class="weather-detail-item">
          <span class="detail-label">🌬️ Wind</span>
          <span class="detail-value">${weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders the 5-day forecast cards.
 * @param forecast - An array of forecast day data to display
 */
export function renderForecast(forecast: IForecastDay[]): void {
  const section = document.getElementById('forecast-section');
  const container = document.getElementById('forecast-cards');

  if (!section || !container) return;

  section.classList.remove('hidden');

  container.innerHTML = forecast.map((day) => {
    const icon = getWeatherIcon(day.condition);
    const dateFormatted = new Date(day.date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    return `
      <div class="forecast-card glass-card">
        <span class="forecast-icon">${icon}</span>
        <span class="forecast-date">${dateFormatted}</span>
        <span class="forecast-temps">
          <span class="temp-max">${day.maxTemp}°</span>
          <span class="temp-min">${day.minTemp}°</span>
        </span>
        <span class="forecast-condition">${day.condition}</span>
      </div>
    `;
  }).join('');
}

/**
 * Renders the list of favorite locations.
 * @param favorites - Array of favorite locations to display
 * @param onView - Callback invoked when the "View" button is clicked
 * @param onRemove - Callback invoked when the "Remove" button is clicked
 */
export function renderFavorites(
  favorites: FavoriteLocation[],
  onView: (name: string) => void,
  onRemove: (id: string) => void
): void {
  const container = document.getElementById('favorites-list');
  if (!container) return;

  if (favorites.length === 0) {
    container.innerHTML = '<p class="empty-state">No favorites yet. Search a city and save it!</p>';
    return;
  }

  container.innerHTML = favorites.map((fav) => `
    <div class="favorite-item" data-id="${fav.id}">
      <div class="favorite-info">
        <span class="favorite-name">${fav.name}</span>
        <span class="favorite-country">${fav.country}</span>
      </div>
      <div class="favorite-actions">
        <button class="btn btn-sm btn-primary view-fav-btn" data-name="${fav.name}" type="button">👁️ View</button>
        <button class="btn btn-sm btn-danger remove-fav-btn" data-id="${fav.id}" type="button">✕ Remove</button>
      </div>
    </div>
  `).join('');

  // Attach event listeners
  container.querySelectorAll('.view-fav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = (btn as HTMLElement).dataset.name;
      if (name) onView(name);
    });
  });

  container.querySelectorAll('.remove-fav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id;
      if (id) onRemove(id);
    });
  });
}

/**
 * Updates the notification location dropdown with current favorites.
 * @param favorites - Array of favorite locations to populate the dropdown
 */
export function updateNotificationLocationDropdown(favorites: FavoriteLocation[]): void {
  const select = document.getElementById('notif-location') as HTMLSelectElement | null;
  if (!select) return;

  // Keep the default option
  select.innerHTML = '<option value="">— Select location —</option>';

  favorites.forEach((fav) => {
    const option = document.createElement('option');
    option.value = fav.name;
    option.textContent = `${fav.name}, ${fav.country}`;
    select.appendChild(option);
  });
}

/**
 * Renders the list of active notification subscriptions.
 * @param subscriptions - Array of subscriptions to display
 * @param onRemove - Callback invoked when the "Remove" button is clicked
 */
export function renderSubscriptions(
  subscriptions: NotificationSubscription[],
  onRemove: (id: string) => void
): void {
  const container = document.getElementById('subscriptions-list');
  if (!container) return;

  if (subscriptions.length === 0) {
    container.innerHTML = '<p class="empty-state">No active subscriptions.</p>';
    return;
  }

  container.innerHTML = `
    <h3 class="subscriptions-title">Active Subscriptions</h3>
    ${subscriptions.map((sub) => {
      let description = '';
      switch (sub.condition) {
        case NotificationCondition.TemperatureAbove:
          description = `Temp &gt; ${sub.threshold}°C`;
          break;
        case NotificationCondition.TemperatureBelow:
          description = `Temp &lt; ${sub.threshold}°C`;
          break;
        case NotificationCondition.WeatherCondition:
          description = `Condition: ${sub.weatherCondition}`;
          break;
      }
      return `
        <div class="subscription-item">
          <div class="subscription-info">
            <span class="subscription-location">📍 ${sub.locationName}</span>
            <span class="subscription-condition">${description}</span>
          </div>
          <button class="btn btn-sm btn-danger remove-sub-btn" data-id="${sub.id}" type="button">✕</button>
        </div>
      `;
    }).join('')}
  `;

  container.querySelectorAll('.remove-sub-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = (btn as HTMLElement).dataset.id;
      if (id) onRemove(id);
    });
  });
}

/**
 * Shows or hides the "Add to Favorites" button based on favorite status.
 * @param isFavorite - Whether the current city is already a favorite
 */
export function toggleAddFavoriteButton(isFavorite: boolean): void {
  const btn = document.getElementById('add-favorite-btn');
  if (!btn) return;

  if (isFavorite) {
    btn.classList.add('hidden');
  } else {
    btn.classList.remove('hidden');
  }
}

/**
 * Shows an inline error message for the search input.
 * @param message - The error message to display (empty string to clear)
 */
export function showSearchError(message: string): void {
  const errorEl = document.getElementById('search-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.toggle('visible', message.length > 0);
  }
}

/**
 * Shows an inline error message for the notification threshold input.
 * @param message - The error message to display (empty string to clear)
 */
export function showThresholdError(message: string): void {
  const errorEl = document.getElementById('threshold-error');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.toggle('visible', message.length > 0);
  }
}

/**
 * Displays a toast notification alert.
 * @param message - The message to display in the toast
 * @param duration - How long to show the toast in milliseconds (default 5000)
 */
export function showToast(message: string, duration = 5000): void {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('toast-visible');
  });

  setTimeout(() => {
    toast.classList.remove('toast-visible');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}

/**
 * Shows a loading spinner overlay on the weather section.
 */
export function showLoading(): void {
  const card = document.getElementById('weather-card');
  if (card) {
    card.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Fetching weather data…</p>
      </div>
    `;
  }
  const section = document.getElementById('weather-section');
  if (section) {
    section.classList.remove('hidden');
  }
}

/**
 * Hides the weather and forecast sections.
 */
export function hideWeatherSections(): void {
  const weatherSection = document.getElementById('weather-section');
  const forecastSection = document.getElementById('forecast-section');
  if (weatherSection) weatherSection.classList.add('hidden');
  if (forecastSection) forecastSection.classList.add('hidden');
}
