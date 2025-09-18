/**
 * API Key Management utilities for handling localStorage operations
 * and providing fallback to environment variables
 */

export interface APIKeys {
  geminiApiKey: string;
  googleMapsApiKey: string;
}

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gemini_api_key',
  GOOGLE_MAPS_API_KEY: 'google_maps_api_key',
} as const;

/**
 * Retrieves API keys from localStorage or falls back to environment variables
 */
export function getAPIKeys(): APIKeys | null {
  // First, check localStorage
  const storedGeminiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
  const storedMapsKey = localStorage.getItem(STORAGE_KEYS.GOOGLE_MAPS_API_KEY);
  
  if (storedGeminiKey && storedMapsKey) {
    return {
      geminiApiKey: storedGeminiKey,
      googleMapsApiKey: storedMapsKey,
    };
  }
  
  // Fall back to environment variables (from .env files)
  const envGeminiKey = process.env.GEMINI_API_KEY;
  const envMapsKey = process.env.GOOGLE_MAPS_API_KEY;
  
  if (envGeminiKey && envMapsKey) {
    return {
      geminiApiKey: envGeminiKey,
      googleMapsApiKey: envMapsKey,
    };
  }
  
  return null;
}

/**
 * Stores API keys in localStorage
 */
export function storeAPIKeys(keys: APIKeys): void {
  localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, keys.geminiApiKey);
  localStorage.setItem(STORAGE_KEYS.GOOGLE_MAPS_API_KEY, keys.googleMapsApiKey);
}

/**
 * Clears stored API keys from localStorage
 */
export function clearAPIKeys(): void {
  localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
  localStorage.removeItem(STORAGE_KEYS.GOOGLE_MAPS_API_KEY);
}

/**
 * Checks if API keys are available (either from storage or environment)
 */
export function areAPIKeysAvailable(): boolean {
  const keys = getAPIKeys();
  return keys !== null;
}

/**
 * Basic validation to check if API keys have the expected format
 */
export function validateAPIKeys(keys: Partial<APIKeys>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!keys.geminiApiKey || keys.geminiApiKey.trim().length === 0) {
    errors.push('Gemini API key is required');
  } else if (!keys.geminiApiKey.startsWith('AI')) {
    errors.push('Gemini API key should start with "AI"');
  }
  
  if (!keys.googleMapsApiKey || keys.googleMapsApiKey.trim().length === 0) {
    errors.push('Google Maps API key is required');
  } else if (keys.googleMapsApiKey.length < 30) {
    errors.push('Google Maps API key appears to be too short');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}