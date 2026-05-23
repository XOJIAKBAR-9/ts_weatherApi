/**
 * Unit tests for the FavoritesService.
 */

import { FavoritesService } from '../src/services/FavoritesService';
import { ILocation } from '../src/models/Location';

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

describe('FavoritesService', () => {
  let service: FavoritesService;

  const mockLocation1: ILocation = {
    id: 'london-uk',
    name: 'London',
    country: 'GB',
    lat: 51.5074,
    lon: -0.1278
  };

  const mockLocation2: ILocation = {
    id: 'paris-fr',
    name: 'Paris',
    country: 'FR',
    lat: 48.8566,
    lon: 2.3522
  };

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
    service = new FavoritesService();
  });

  describe('add()', () => {
    it('should add a location to favorites', () => {
      service.add(mockLocation1);
      const favorites = service.getAll();
      expect(favorites.length).toBe(1);
      expect(favorites[0].id).toBe('london-uk');
      expect(favorites[0].name).toBe('London');
      expect(favorites[0].country).toBe('GB');
    });

    it('should add multiple locations', () => {
      service.add(mockLocation1);
      service.add(mockLocation2);
      const favorites = service.getAll();
      expect(favorites.length).toBe(2);
    });

    it('should not add duplicate locations', () => {
      service.add(mockLocation1);
      service.add(mockLocation1);
      const favorites = service.getAll();
      expect(favorites.length).toBe(1);
    });
  });

  describe('remove()', () => {
    it('should remove a location by id', () => {
      service.add(mockLocation1);
      service.add(mockLocation2);
      service.remove('london-uk');
      const favorites = service.getAll();
      expect(favorites.length).toBe(1);
      expect(favorites[0].id).toBe('paris-fr');
    });

    it('should handle removing non-existent id', () => {
      service.add(mockLocation1);
      service.remove('non-existent');
      const favorites = service.getAll();
      expect(favorites.length).toBe(1);
    });
  });

  describe('isFavorite()', () => {
    it('should return true for a saved favorite', () => {
      service.add(mockLocation1);
      expect(service.isFavorite('london-uk')).toBe(true);
    });

    it('should return false for a non-favorite', () => {
      expect(service.isFavorite('london-uk')).toBe(false);
    });

    it('should return false after removing a favorite', () => {
      service.add(mockLocation1);
      service.remove('london-uk');
      expect(service.isFavorite('london-uk')).toBe(false);
    });
  });

  describe('getAll()', () => {
    it('should return an empty array when no favorites exist', () => {
      const favorites = service.getAll();
      expect(favorites).toEqual([]);
      expect(Array.isArray(favorites)).toBe(true);
    });

    it('should return all saved favorites', () => {
      service.add(mockLocation1);
      service.add(mockLocation2);
      const favorites = service.getAll();
      expect(favorites.length).toBe(2);
      expect(favorites[0].name).toBe('London');
      expect(favorites[1].name).toBe('Paris');
    });
  });
});
