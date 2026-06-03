# Weather App — TypeScript Final Project

A browser-based weather application built with **vanilla TypeScript** (no frameworks) using the [WeatherAPI.com API](https://www.weatherapi.com/). Search for cities, view current weather and 5-day forecasts, save favorite locations, and set up weather notification alerts.

## Node.js Version

- **Node.js v18.x** (LTS recommended)

## Features

- 🔍 Search for weather by city name
- 🌡️ View current temperature, humidity, wind speed, and conditions
- 📅 5-day weather forecast with daily min/max temperatures
- ⭐ Save and manage favorite locations (persisted in localStorage)
- 🔔 Set up weather notification subscriptions (temperature thresholds, weather conditions)
- 📱 Responsive design with modern glassmorphism UI

## TypeScript Concepts Used

- **Interfaces** — `IWeather`, `IForecastDay`, `ILocation`, `INotificationSubscription`
- **Classes** — `Weather`, `FavoriteLocation`, `NotificationSubscription`
- **Types** — `TemperatureUnit`, `WeatherCondition`
- **Modules** — separate `.ts` files with `import`/`export`
- **Generics** — `StorageManager<T>` for type-safe localStorage
- **Decorators** — `@LogMethod` (method), `@Service` (class)
- **Async/Await** — all API calls use `async`/`await` with `try`/`catch`
- **Enums** — `WeatherCondition`, `NotificationCondition`

## Installation

```bash
npm install
```

## API Key Setup

1. Go to [WeatherAPI.com](https://www.weatherapi.com/) and create a free account.
2. Navigate to **API Keys** in your account dashboard and generate a key.
3. Open `src/api/weatherApi.ts` and replace the API key with your actual API key:

```typescript
const API_KEY = '###';
```

## Running Locally

```bash
npm start
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

## Build for Production

```bash
npm run build
```

Output files will be generated in the `dist/` directory.

## Linting

```bash
npm run lint
```

## Running Tests

```bash
npm test
```

This runs all tests with coverage reporting.

## Viewing Coverage Report

After running tests, open the HTML coverage report:

```bash
open coverage/lcov-report/index.html
```

## Project Structure

```
├── src/
│   ├── index.ts              # Entry point — initializes app
│   ├── styles.css            # Application styles
│   ├── api/
│   │   └── weatherApi.ts     # API calls to OpenWeatherMap
│   ├── models/
│   │   ├── Weather.ts        # Weather interface + class + enums
│   │   ├── Location.ts       # Location class (for favorites)
│   │   └── Notification.ts   # NotificationSubscription class
│   ├── services/
│   │   ├── FavoritesService.ts   # Add/remove/get favorites
│   │   └── NotificationService.ts # Subscribe/unsubscribe logic
│   ├── utils/
│   │   ├── storage.ts        # Generic localStorage wrapper
│   │   └── decorators.ts     # Logging/validation decorators
│   └── ui/
│       └── render.ts         # All DOM manipulation functions
├── tests/
│   ├── Weather.test.ts
│   ├── FavoritesService.test.ts
│   └── NotificationService.test.ts
├── index.html
├── package.json
├── tsconfig.json
├── webpack.config.js
├── jest.config.js
├── .eslintrc.js
└── .gitignore
```

## License

ISC
