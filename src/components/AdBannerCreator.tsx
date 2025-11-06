import React, { useState } from 'react';
import { generateImagesSimple } from '../services/gemini';
import { storage } from '../services/storage';
import ImageUploader from './ImageUploader';
import ResultsGallery from './ResultsGallery';

interface AdBannerCreatorProps {
  apiKey: string;
}

const bannerSizes = [
  { id: 'instagram_square', name: 'Instagram Post (1:1)', prompt: 'square format 1:1 ratio, instagram post style' },
  { id: 'instagram_story', name: 'Instagram Story (9:16)', prompt: 'vertical format 9:16 ratio, instagram story style' },
  { id: 'facebook', name: 'Facebook Post (16:9)', prompt: 'horizontal format 16:9 ratio, facebook post style' },
  { id: 'banner_wide', name: 'Banner Wide (3:1)', prompt: 'wide banner format 3:1 ratio, web banner style' },
  { id: 'youtube', name: 'YouTube Thumbnail (16:9)', prompt: 'horizontal format 16:9 ratio, youtube thumbnail style, eye-catching' },
];

const adStyles = [
  { id: 'modern', name: 'Modern Minimalis', prompt: 'modern minimalist design, clean layout, lots of white space, elegant typography' },
  { id: 'bold', name: 'Bold & Colorful', prompt: 'bold colorful design, vibrant colors, energetic, eye-catching, dynamic composition' },
  { id: 'professional', name: 'Professional Corporate', prompt: 'professional corporate design, business style, trust-building, clean and formal' },
  { id: 'playful', name: 'Playful & Fun', prompt: 'playful fun design, bright colors, friendly vibe, casual and approachable' },
  { id: 'luxury', name: 'Luxury Premium', prompt: 'luxury premium design, elegant, sophisticated, gold accents, high-end feel' },
];

const AdBannerCreator: React.FC<AdBannerCreatorProps> = ({ apiKey }) => {
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [bannerSize, setBannerSize] = useState(bannerSizes[0].id);
  const [adStyle, setAdStyle] = useState(adStyles[0].id);
  const [productName, setProductName] = useState('');
  const [headline, setHeadline] = useState('');
  const [additionalText, setAdditionalText] = useState('');
  const [imageCount, setImageCount] = useState(2);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!headline) {
      setError('Silakan isi headline iklan terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const size = bannerSizes.find(s => s.id === bannerSize);
      const style = adStyles.find(s => s.id === adStyle);

      let fullPrompt = `Create an advertising banner with: ${size?.prompt}. ${style?.prompt}. `;
      fullPrompt += `Main headline text: "${headline}". `;

      if (productName) {
        fullPrompt += `Product/Brand name: "${productName}". `;
      }

      if (additionalText) {
        fullPrompt += `Additional text: "${additionalText}". `;
      }

      if (uploadedImage) {
        fullPrompt += `Include the uploaded product/image as the main visual element. `;
      }

      fullPrompt += `Professional advertising design, clear typography, balanced composition, marketing-ready banner.`;

      const baseImage = uploadedImage?.preview || 'data:image/png;base64,';
      const images = await generateImagesSimple(baseImage, fullPrompt, imageCount, apiKey);
      setGeneratedImages(images);

      // Update usage stats
      storage.updateUsageStats(images.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membuat banner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎨 Bikin Banner Iklan</h2>
        <p className="text-gray-600 mb-4">
          Buat banner iklan profesional untuk social media dan website Anda
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto Produk (opsional):
              </label>
              <ImageUploader onImageUpload={setUploadedImage} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ukuran Banner:
              </label>
              <select
                value={bannerSize}
                onChange={(e) => setBannerSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {bannerSizes.map(size => (
                  <option key={size.id} value={size.id}>{size.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style Desain:
              </label>
              <select
                value={adStyle}
                onChange={(e) => setAdStyle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {adStyles.map(style => (
                  <option key={style.id} value={style.id}>{style.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Produk/Brand (opsional):
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Contoh: Kopi Arabica Premium"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Headline Iklan: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Contoh: Diskon 50% Hari Ini!"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teks Tambahan (opsional):
              </label>
              <textarea
                value={additionalText}
                onChange={(e) => setAdditionalText(e.target.value)}
                placeholder="Contoh: Gratis ongkir seluruh Indonesia"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
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
              disabled={loading || !headline}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Sedang Membuat Banner...' : '✨ Buat Banner Iklan'}
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

export default AdBannerCreator;
