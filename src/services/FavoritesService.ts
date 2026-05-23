/**
 * FavoritesService — manages the user's favorite locations.
 * Uses StorageManager for localStorage persistence.
 * Decorated with @Service and uses @LogMethod on key methods.
 * @module services/FavoritesService
 */

import { ILocation, FavoriteLocation } from '../models/Location';
import { StorageManager } from '../utils/storage';
import { LogMethod, Service } from '../utils/decorators';

/** localStorage key for storing favorite locations */
const FAVORITES_KEY = 'weather_app_favorites';

/**
 * Service class that manages a list of favorite locations.
 * Provides methods to add, remove, and query favorite locations.
 */
@Service
export class FavoritesService {
  /** Storage manager instance for persisting favorites */
  private storage: StorageManager<FavoriteLocation>;

  /** Creates a new FavoritesService instance */
  constructor() {
    this.storage = new StorageManager<FavoriteLocation>(FAVORITES_KEY);
  }

  /**
   * Adds a location to the favorites list.
   * Creates a FavoriteLocation from the provided ILocation data.
   * @param location - The location data to add
   */
  @LogMethod
  add(location: ILocation): void {
    if (this.isFavorite(location.id)) {
      console.warn(`Location ${location.name} is already a favorite.`);
      return;
    }
    const favorite = new FavoriteLocation(location);
    this.storage.add(favorite);
  }

  /**
   * Removes a location from the favorites list by its ID.
   * @param id - The unique identifier of the location to remove
   */
  @LogMethod
  remove(id: string): void {
    this.storage.remove((item: FavoriteLocation) => item.id === id);
  }

  /**
   * Retrieves all favorite locations.
   * @returns An array of FavoriteLocation objects
   */
  getAll(): FavoriteLocation[] {
    return this.storage.getAll();
  }

  /**
   * Checks whether a location with the given ID is in the favorites.
   * @param id - The unique identifier to check
   * @returns True if the location is a favorite, false otherwise
   */
  isFavorite(id: string): boolean {
    return this.storage.getAll().some((item: FavoriteLocation) => item.id === id);
  }
}
