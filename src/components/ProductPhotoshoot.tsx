import React, { useState } from 'react';
import { generateImagesSimple } from '../services/gemini';
import { storage } from '../services/storage';
import ImageUploader from './ImageUploader';
import ResultsGallery from './ResultsGallery';

interface ProductPhotoshootProps {
  apiKey: string;
}

const backgrounds = [
  { id: 'white', name: 'Background Putih Bersih', prompt: 'professional product photography on pure white background, studio lighting, high quality, sharp focus' },
  { id: 'wood', name: 'Meja Kayu Natural', prompt: 'product photography on natural wooden table, soft natural lighting, rustic aesthetic' },
  { id: 'marble', name: 'Marble Mewah', prompt: 'luxury product photography on white marble surface, elegant lighting, premium look' },
  { id: 'outdoor', name: 'Outdoor Natural', prompt: 'product photography in natural outdoor setting, beautiful bokeh background, professional' },
  { id: 'lifestyle', name: 'Lifestyle Scene', prompt: 'lifestyle product photography in modern home setting, natural lighting, instagram worthy' },
  { id: 'minimal', name: 'Minimalist Modern', prompt: 'minimalist product photography, clean modern aesthetic, pastel colors, soft shadows' },
];

const ProductPhotoshoot: React.FC<ProductPhotoshootProps> = ({ apiKey }) => {
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0].id);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [imageCount, setImageCount] = useState(2);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Silakan upload foto produk terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bg = backgrounds.find(b => b.id === selectedBackground);
      const fullPrompt = `${bg?.prompt}. ${additionalPrompt}. Keep the product exactly as it is, only change the background and lighting.`;

      const images = await generateImagesSimple(uploadedImage.preview, fullPrompt, imageCount, apiKey);
      setGeneratedImages(images);

      // Update usage stats
      storage.updateUsageStats(images.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat generate foto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📸 Photoshoot Produk</h2>
        <p className="text-gray-600 mb-4">
          Upload foto produk Anda dan pilih background profesional untuk foto produk yang menarik
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageUploader onImageUpload={setUploadedImage} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Background:
              </label>
              <select
                value={selectedBackground}
                onChange={(e) => setSelectedBackground(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {backgrounds.map(bg => (
                  <option key={bg.id} value={bg.id}>{bg.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Tambahan (opsional):
              </label>
              <textarea
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                placeholder="Contoh: tambahkan bunga di samping produk, pencahayaan hangat"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Variasi: {imageCount}
              </label>
              <input
                type="range"
                min="1"
                max="4"
                value={imageCount}
                onChange={(e) => setImageCount(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !uploadedImage}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Sedang Generate...' : '✨ Generate Foto Produk'}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div>
            <ResultsGallery images={generatedImages} isLoading={loading} imageCount={imageCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPhotoshoot;
