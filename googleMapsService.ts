import { Loader } from '@googlemaps/js-api-loader';
import { getAPIKeys } from './apiKeyManager';

let loader: Loader | null = null;

/**
 * Gets or creates a Google Maps loader with the current API key
 */
export function getGoogleMapsLoader(): Loader {
  const apiKeys = getAPIKeys();
  if (!apiKeys) {
    throw new Error("Google Maps API key is not available. Please configure your API keys.");
  }

  // If we don't have a loader or the API key has changed, create a new one
  if (!loader) {
    loader = new Loader({
      apiKey: apiKeys.googleMapsApiKey,
      version: "beta",
      libraries: ["places", "marker", "geocoding"],
    });
  }

  return loader;
}

/**
 * Resets the loader instance (useful when API keys change)
 */
export function resetGoogleMapsLoader(): void {
  loader = null;
}