import React, { useState } from 'react';
import { APIKeys, validateAPIKeys } from './apiKeyManager';

interface APIKeyModalProps {
  isOpen: boolean;
  onSave: (keys: APIKeys) => void;
  onCancel?: () => void;
}

export const APIKeyModal: React.FC<APIKeyModalProps> = ({ isOpen, onSave, onCancel }) => {
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const handleSave = async () => {
    setIsValidating(true);
    setErrors([]);

    const keys = {
      geminiApiKey: geminiApiKey.trim(),
      googleMapsApiKey: googleMapsApiKey.trim(),
    };

    const validation = validateAPIKeys(keys);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      setIsValidating(false);
      return;
    }

    try {
      onSave(keys);
      // Reset form
      setGeminiApiKey('');
      setGoogleMapsApiKey('');
      setErrors([]);
    } catch (error) {
      setErrors(['Failed to save API keys. Please try again.']);
    } finally {
      setIsValidating(false);
    }
  };

  const handleCancel = () => {
    setGeminiApiKey('');
    setGoogleMapsApiKey('');
    setErrors([]);
    if (onCancel) {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🔑 API Keys Required</h2>
            <p className="text-gray-600">
              To use this application, you need to provide your own API keys. 
              These will be stored securely in your browser for future use.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="gemini-key" className="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key
              </label>
              <input
                id="gemini-key"
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                placeholder="Enter your Gemini API key (starts with AI...)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={isValidating}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your key from{' '}
                <a 
                  href="https://makersuite.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div>
              <label htmlFor="maps-key" className="block text-sm font-medium text-gray-700 mb-2">
                Google Maps API Key
              </label>
              <input
                id="maps-key"
                type="password"
                value={googleMapsApiKey}
                onChange={(e) => setGoogleMapsApiKey(e.target.value)}
                placeholder="Enter your Google Maps API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                disabled={isValidating}
              />
              <p className="text-xs text-gray-500 mt-1">
                Get your key from{' '}
                <a 
                  href="https://console.cloud.google.com/apis/credentials" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 underline"
                >
                  Google Cloud Console
                </a>
              </p>
            </div>
          </div>

          {errors.length > 0 && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Privacy:</strong> Your API keys are stored only in your browser's local storage 
                  and are never sent to any server other than Google's official APIs.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            {onCancel && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={isValidating}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition disabled:opacity-50"
              >
                Cancel
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={isValidating || !geminiApiKey.trim() || !googleMapsApiKey.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:opacity-50 flex items-center justify-center"
            >
              {isValidating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Keys'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};