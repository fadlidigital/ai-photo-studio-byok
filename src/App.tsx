import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

interface AppProps {
  apiKey: string | null;
  onApiKeyChange: (key: string | null) => void;
}

const features: FeatureTab[] = [
  { id: 'photoshoot', name: 'Photoshoot Produk', icon: '📸', description: 'Background profesional untuk foto produk' },
  { id: 'model', name: 'Foto Produk AI', icon: '🛍️', description: 'Buat produk baru atau ubah angle' },
  { id: 'combine', name: 'Gabungkan Gambar', icon: '🖼️', description: 'Kombinasi 2 gambar jadi 1' },
  { id: 'edit', name: 'Edit Foto', icon: '✏️', description: 'Perbaiki dan enhance foto' },
  { id: 'prompt', name: 'Buat Prompt', icon: '💡', description: 'Generate prompt dari foto' },
  { id: 'banner', name: 'Banner Iklan', icon: '🎨', description: 'Buat banner iklan menarik' },
];

function App({ apiKey }: AppProps) {
  const navigate = useNavigate();
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
          <p className="text-yellow-800 text-lg mb-4">
            ⚠️ Silakan masukkan dan validasi API Key Gemini terlebih dahulu
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Pergi ke Halaman Profile
          </button>
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

        {/* Top Section - Quick Stats & Profile Link */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-3">
            <UsageStats stats={usageStats} />
          </div>
          <div>
            <button
              onClick={() => navigate('/profile')}
              className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg shadow-md p-6 hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div className="font-bold text-lg">Pengaturan</div>
                <div className="text-sm opacity-90">API Key & Profile</div>
              </div>
            </button>
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
