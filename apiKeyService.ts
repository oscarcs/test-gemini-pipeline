// API Key management service for handling both environment variables and localStorage

export interface ApiKeys {
  geminiApiKey: string | null;
  googleMapsApiKey: string | null;
}

const STORAGE_KEYS = {
  GEMINI_API_KEY: 'gemini_api_key',
  GOOGLE_MAPS_API_KEY: 'google_maps_api_key'
} as const;

/**
 * Get API keys from environment variables (build-time)
 */
function getEnvApiKeys(): ApiKeys {
  return {
    geminiApiKey: process.env.GEMINI_API_KEY || null,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || null
  };
}

/**
 * Get API keys from localStorage (runtime)
 */
function getStoredApiKeys(): ApiKeys {
  try {
    return {
      geminiApiKey: localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY),
      googleMapsApiKey: localStorage.getItem(STORAGE_KEYS.GOOGLE_MAPS_API_KEY)
    };
  } catch (error) {
    console.warn('Failed to read API keys from localStorage:', error);
    return { geminiApiKey: null, googleMapsApiKey: null };
  }
}

/**
 * Store API keys in localStorage
 */
export function storeApiKeys(keys: ApiKeys): void {
  try {
    if (keys.geminiApiKey) {
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, keys.geminiApiKey);
    }
    if (keys.googleMapsApiKey) {
      localStorage.setItem(STORAGE_KEYS.GOOGLE_MAPS_API_KEY, keys.googleMapsApiKey);
    }
  } catch (error) {
    console.error('Failed to store API keys in localStorage:', error);
    throw new Error('Unable to store API keys locally. Please check if localStorage is available.');
  }
}

/**
 * Get API keys with fallback priority: environment variables > localStorage
 */
export function getApiKeys(): ApiKeys {
  const envKeys = getEnvApiKeys();
  const storedKeys = getStoredApiKeys();
  
  return {
    geminiApiKey: envKeys.geminiApiKey || storedKeys.geminiApiKey,
    googleMapsApiKey: envKeys.googleMapsApiKey || storedKeys.googleMapsApiKey
  };
}

/**
 * Check if all required API keys are available
 */
export function areApiKeysAvailable(): boolean {
  const keys = getApiKeys();
  return !!(keys.geminiApiKey && keys.googleMapsApiKey);
}

/**
 * Validate API key format (basic validation)
 */
export function validateApiKey(key: string, type: 'gemini' | 'googleMaps'): boolean {
  if (!key || typeof key !== 'string' || key.trim().length === 0) {
    return false;
  }
  
  // Basic format validation
  if (type === 'gemini') {
    // Gemini API keys typically start with specific patterns
    return key.length > 10 && /^[A-Za-z0-9_-]+$/.test(key);
  } else if (type === 'googleMaps') {
    // Google Maps API keys are typically 39 characters
    return key.length > 10 && /^[A-Za-z0-9_-]+$/.test(key);
  }
  
  return true;
}

/**
 * Clear stored API keys from localStorage
 */
export function clearStoredApiKeys(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    localStorage.removeItem(STORAGE_KEYS.GOOGLE_MAPS_API_KEY);
  } catch (error) {
    console.warn('Failed to clear stored API keys:', error);
  }
}