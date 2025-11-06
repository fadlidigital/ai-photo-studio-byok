import { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { validateApiKey } from '../services/gemini';

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string | null) => void;
}

export default function ApiKeyManager({ onApiKeyChange }: ApiKeyManagerProps) {
  const [apiKey, setApiKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    // Load saved API key on mount
    const savedKey = storage.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsValid(true);
      onApiKeyChange(savedKey);
    }
  }, [onApiKeyChange]);

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setIsValid(false);
      return;
    }

    setIsValidating(true);
    setIsValid(null);

    try {
      const valid = await validateApiKey(apiKey.trim());
      setIsValid(valid);

      if (valid) {
        storage.saveApiKey(apiKey.trim());
        onApiKeyChange(apiKey.trim());
      } else {
        onApiKeyChange(null);
      }
    } catch (error) {
      console.error('Validation error:', error);
      setIsValid(false);
      onApiKeyChange(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setIsValid(null);
    storage.clearApiKey();
    onApiKeyChange(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">Gemini API Key</h2>
          <p className="text-xs text-gray-500">Your key is stored locally & never sent to any server</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleValidate()}
              placeholder="Paste your Gemini API key here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              type="button"
            >
              {showKey ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          <button
            onClick={handleValidate}
            disabled={isValidating || !apiKey.trim()}
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isValidating ? 'Validating...' : 'Validate'}
          </button>
          {isValid && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {isValid === true && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">API Key is valid! Ready to generate images.</span>
          </div>
        )}

        {isValid === false && (
          <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Invalid API key. Please check and try again.</span>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Don't have an API key?</strong> Get one for free at{' '}
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold hover:text-blue-900"
          >
            Google AI Studio
          </a>
        </p>
      </div>
    </div>
  );
}
