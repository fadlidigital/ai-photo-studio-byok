import { useState, useEffect } from 'react';
import ApiKeyManager from './components/ApiKeyManager';
import UsageStats from './components/UsageStats';
import UserProfile from './components/UserProfile';
import ProductPhotoshoot from './components/ProductPhotoshoot';
import ProductAI from './components/ProductAI';
import CombineImages from './components/CombineImages';
import EditPhoto from './components/EditPhoto';
import PromptGenerator from './components/PromptGenerator';
import AdBannerCreator from './components/AdBannerCreator';
import { storage } from './services/storage';

type Feature = 'photoshoot' | 'model' | 'combine' | 'edit' | 'prompt' | 'banner';

interface FeatureTab {
  id: Feature;
  name: string;
  icon: string;
  description: string;
}

const features: FeatureTab[] = [
  { id: 'photoshoot', name: 'Photoshoot Produk', icon: '📸', description: 'Background profesional untuk foto produk' },
  { id: 'model', name: 'Foto Produk AI', icon: '🛍️', description: 'Buat produk baru atau ubah angle' },
  { id: 'combine', name: 'Gabungkan Gambar', icon: '🖼️', description: 'Kombinasi 2 gambar jadi 1' },
  { id: 'edit', name: 'Edit Foto', icon: '✏️', description: 'Perbaiki dan enhance foto' },
  { id: 'prompt', name: 'Buat Prompt', icon: '💡', description: 'Generate prompt dari foto' },
  { id: 'banner', name: 'Banner Iklan', icon: '🎨', description: 'Buat banner iklan menarik' },
];

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [activeFeature, setActiveFeature] = useState<Feature>('photoshoot');
  const [usageStats, setUsageStats] = useState(storage.getUsageStats());

  useEffect(() => {
    // Load stats on mount
    setUsageStats(storage.getUsageStats());

    // Update stats every time a generation completes
    const interval = setInterval(() => {
      setUsageStats(storage.getUsageStats());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const renderFeatureContent = () => {
    if (!apiKey) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
          <p className="text-yellow-800 text-lg">
            ⚠️ Silakan masukkan dan validasi API Key Gemini terlebih dahulu di bagian atas
          </p>
        </div>
      );
    }

    switch (activeFeature) {
      case 'photoshoot':
        return <ProductPhotoshoot apiKey={apiKey} />;
      case 'model':
        return <ProductAI apiKey={apiKey} />;
      case 'combine':
        return <CombineImages apiKey={apiKey} />;
      case 'edit':
        return <EditPhoto apiKey={apiKey} />;
      case 'prompt':
        return <PromptGenerator apiKey={apiKey} />;
      case 'banner':
        return <AdBannerCreator apiKey={apiKey} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Profile */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Foto Estetik
                </h1>
                <p className="text-sm text-gray-600 hidden md:block">
                  Studio Foto AI Lengkap untuk UMKM
                </p>
              </div>
            </div>
            <UserProfile />
          </div>
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

        {/* Feature Navigation */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeFeature === feature.id
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50'
                }`}
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <div className="font-semibold text-gray-900 text-sm mb-1">{feature.name}</div>
                <div className="text-xs text-gray-500">{feature.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content - Feature Components */}
        <div>
          {renderFeatureContent()}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            AI Foto Estetik • Dibuat untuk UMKM Indonesia
          </p>
          <p className="mt-1">
            API key disimpan lokal di browser Anda • Powered by Google Gemini AI
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
