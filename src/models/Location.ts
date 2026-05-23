/**
 * Location module — defines interfaces and classes for favorite locations.
 * @module models/Location
 */

/** Interface representing a geographic location */
export interface ILocation {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

/**
 * FavoriteLocation class implementing ILocation.
 * Represents a location saved to the user's favorites list.
 */
export class FavoriteLocation implements ILocation {
  /** Unique identifier */
  id: string;
  /** City name */
  name: string;
  /** Country code */
  country: string;
  /** Latitude coordinate */
  lat: number;
  /** Longitude coordinate */
  lon: number;
  /** Timestamp when the location was added to favorites */
  addedAt: Date;

  /**
   * Creates a new FavoriteLocation instance.
   * @param data - Location data conforming to ILocation
   */
  constructor(data: ILocation) {
    this.id = data.id;
    this.name = data.name;
    this.country = data.country;
    this.lat = data.lat;
    this.lon = data.lon;
    this.addedAt = new Date();
  }
}
