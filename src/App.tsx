import { useState, useEffect } from 'react';
import ApiKeyManager from './components/ApiKeyManager';
import ImageUploader from './components/ImageUploader';
import ResultsGallery from './components/ResultsGallery';
import UsageStats from './components/UsageStats';
import { generateImages } from './services/gemini';
import { storage } from './services/storage';

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [imageCount, setImageCount] = useState(4);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usageStats, setUsageStats] = useState(storage.getUsageStats());

  useEffect(() => {
    // Load stats on mount
    setUsageStats(storage.getUsageStats());
  }, []);

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please enter and validate your API key first');
      return;
    }

    if (!uploadedImage) {
      setError('Please upload an image first');
      return;
    }

    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const results = await generateImages(
        { apiKey },
        {
          imageBase64: uploadedImage.base64,
          mimeType: uploadedImage.mimeType,
          prompt: prompt,
          imageCount: imageCount,
        }
      );

      setGeneratedImages(results);

      // Update usage stats
      storage.updateUsageStats(results.length);
      setUsageStats(storage.getUsageStats());

    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate images. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = apiKey && uploadedImage && prompt.trim() && !isGenerating;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Photo Studio for UMKM
            </h1>
          </div>
          <p className="text-gray-600">
            Generate professional AI photos using your own Gemini API key • Free • No Backend Required
          </p>
        </div>

        {/* Top Section - API Key & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ApiKeyManager onApiKeyChange={setApiKey} />
          </div>
          <div>
            <UsageStats stats={usageStats} />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">1. Upload Image</h2>
              <ImageUploader onImageUpload={setUploadedImage} />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">2. Write Your Prompt</h2>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Example: Make this photo professional with studio lighting, enhance colors, remove background..."
                className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Images to Generate
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((count) => (
                    <button
                      key={count}
                      onClick={() => setImageCount(count)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        imageCount === count
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full mt-6 py-3 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg text-lg"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating {imageCount} Images...
                  </span>
                ) : (
                  `✨ Generate ${imageCount} ${imageCount === 1 ? 'Image' : 'Images'}`
                )}
              </button>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">3. Generated Images</h2>
              <ResultsGallery
                images={generatedImages}
                isLoading={isGenerating}
                imageCount={imageCount}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Built with ❤️ for UMKM • Your API key is stored locally and never sent to any server
          </p>
          <p className="mt-1">
            Powered by Google Gemini AI • No subscription required
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
