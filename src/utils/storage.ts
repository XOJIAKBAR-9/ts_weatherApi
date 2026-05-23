/**
 * Generic localStorage wrapper providing type-safe storage operations.
 * Uses generics to work with any serializable type.
 * @module utils/storage
 */

/**
 * Generic class for localStorage operations.
 * Provides CRUD-like operations for arrays of items stored in localStorage.
 * @typeParam T - The type of items to store
 */
export class StorageManager<T> {
  /** The localStorage key used for this storage instance */
  private key: string;

  /**
   * Creates a new StorageManager instance.
   * @param key - The localStorage key to use for storing data
   */
  constructor(key: string) {
    this.key = key;
  }

  /**
   * Retrieves all stored items from localStorage.
   * @returns An array of items, or an empty array if nothing is stored
   */
  getAll(): T[] {
    const raw = localStorage.getItem(this.key);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [];
    }
  }

  /**
   * Saves an array of items to localStorage, replacing any existing data.
   * @param items - The array of items to save
   */
  save(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  /**
   * Adds a single item to the stored array.
   * @param item - The item to add
   */
  add(item: T): void {
    const items = this.getAll();
    items.push(item);
    this.save(items);
  }

  /**
   * Removes items from storage that match the given predicate.
   * @param predicate - A function that returns true for items to remove
   */
  remove(predicate: (item: T) => boolean): void {
    const items = this.getAll().filter((item) => !predicate(item));
    this.save(items);
  }
}
