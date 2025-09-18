import React, { useState } from 'react';
import { validateApiKey, storeApiKeys, type ApiKeys } from './apiKeyService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onSubmit: (keys: ApiKeys) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onSubmit }) => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [errors, setErrors] = useState<{ gemini?: string; googleMaps?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    // Validate keys
    const newErrors: { gemini?: string; googleMaps?: string } = {};
    
    if (!validateApiKey(geminiApiKey, 'gemini')) {
      newErrors.gemini = 'Please enter a valid Gemini API key';
    }
    
    if (!validateApiKey(googleMapsApiKey, 'googleMaps')) {
      newErrors.googleMaps = 'Please enter a valid Google Maps API key';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const keys: ApiKeys = {
        geminiApiKey: geminiApiKey.trim(),
        googleMapsApiKey: googleMapsApiKey.trim()
      };
      
      // Store keys in localStorage
      storeApiKeys(keys);
      
      // Call parent callback
      onSubmit(keys);
    } catch (error) {
      setErrors({ 
        gemini: 'Failed to save API keys. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            API Keys Required
          </h2>
          <p className="text-gray-600 text-sm">
            Please provide your API keys to use this application. Your keys will be stored securely in your browser.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700 mb-1">
              Gemini API Key
            </label>
            <input
              id="gemini-key"
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.gemini ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your Gemini API key"
              disabled={isSubmitting}
            />
            {errors.gemini && (
              <p className="text-red-500 text-xs mt-1">{errors.gemini}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Get your key from{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>

          <div>
            <label htmlFor="maps-key" className="block text-sm font-medium text-gray-700 mb-1">
              Google Maps API Key
            </label>
            <input
              id="maps-key"
              type="password"
              value={googleMapsApiKey}
              onChange={(e) => setGoogleMapsApiKey(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                errors.googleMaps ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your Google Maps API key"
              disabled={isSubmitting}
            />
            {errors.googleMaps && (
              <p className="text-red-500 text-xs mt-1">{errors.googleMaps}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Get your key from{' '}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !geminiApiKey.trim() || !googleMapsApiKey.trim()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save API Keys'
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>
            Your API keys are stored locally in your browser and are not sent to any external servers except the respective API providers.
          </p>
        </div>
      </div>
    </div>
  );
};