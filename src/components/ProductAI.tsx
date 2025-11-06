import React, { useState } from 'react';
import { generateImagesSimple, generateFromText } from '../services/gemini';
import { storage } from '../services/storage';
import ImageUploader from './ImageUploader';
import ResultsGallery from './ResultsGallery';

interface ProductAIProps {
  apiKey: string;
}

type FeatureMode = 'create' | 'angle';
type AspectRatio = '1:1' | '3:4' | '16:9' | '9:16';

const productCategories = [
  { id: 'food', name: '🍽️ Makanan', prompt: 'delicious food photography, appetizing presentation, professional food styling, vibrant colors, top view or side angle' },
  { id: 'beverage', name: '🥤 Minuman', prompt: 'refreshing beverage photography, condensation droplets, professional drink styling, appealing presentation, clean background' },
  { id: 'snack', name: '🍪 Snack & Kue', prompt: 'appetizing snack photography, crispy texture visible, appealing arrangement, bakery product styling, warm lighting' },
  { id: 'furniture', name: '🪑 Furniture', prompt: 'modern furniture photography, clean lines, professional interior styling, elegant composition, neutral background' },
  { id: 'fashion', name: '👕 Fashion & Pakaian', prompt: 'fashion product photography, fabric texture visible, professional clothing styling, clean presentation, studio lighting' },
  { id: 'electronics', name: '📱 Elektronik', prompt: 'tech product photography, sleek modern design, professional gadget styling, reflective surfaces, minimalist background' },
  { id: 'craft', name: '🎨 Kerajinan Tangan', prompt: 'handmade craft photography, artisanal details visible, unique product styling, warm natural lighting, textured background' },
  { id: 'cosmetics', name: '💄 Kosmetik & Kecantikan', prompt: 'beauty product photography, elegant packaging, luxury styling, soft lighting, clean white background' },
  { id: 'accessories', name: '👜 Aksesoris', prompt: 'accessory product photography, detailed close-up, elegant presentation, professional styling, complementary background' },
  { id: 'home-decor', name: '🏠 Dekorasi Rumah', prompt: 'home decor photography, lifestyle context, cozy atmosphere, natural lighting, interior design styling' },
];

const angleOptions = [
  // Camera Angles
  { id: 'top-view', name: '📐 Top View (Atas)', prompt: 'top-down view, overhead shot, flat lay photography, organized layout, all elements visible' },
  { id: 'side-view', name: '↔️ Side View (Samping)', prompt: 'side angle view, profile shot, showing depth and dimension, professional angle, clear product shape' },
  { id: 'front-view', name: '⬆️ Front View (Depan)', prompt: 'straight front view, centered composition, symmetrical framing, eye-level perspective, clear product display' },
  { id: '45-degree', name: '📐 45° Angle', prompt: '45 degree angle view, three-quarter perspective, dynamic composition, professional product angle, depth visible' },
  { id: 'close-up', name: '🔍 Close-up Detail', prompt: 'macro close-up shot, detail focus, texture visible, intimate perspective, sharp details' },
  { id: 'lifestyle', name: '✨ Lifestyle Context', prompt: 'lifestyle setting, product in use, natural environment, contextual background, relatable scene' },
  // Fashion/Model Poses (untuk produk fashion)
  { id: 'standing', name: '🧍 Berdiri Tegap', prompt: 'standing pose, confident stance, full body shot, professional modeling pose' },
  { id: 'sitting', name: '🪑 Duduk Santai', prompt: 'sitting pose, relaxed posture, comfortable position, natural modeling' },
  { id: 'walking', name: '🚶 Berjalan', prompt: 'walking pose, dynamic movement, natural gait, action shot' },
  { id: 'portrait', name: '👤 Portrait Close-up', prompt: 'portrait pose, face focus, upper body shot, engaging expression' },
  { id: 'action', name: '⚡ Action Pose', prompt: 'dynamic action pose, movement captured, energetic, dramatic positioning' },
];

const aspectRatios: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: 'Square (1:1)', icon: '⬜' },
  { value: '3:4', label: 'Portrait (3:4)', icon: '📱' },
  { value: '16:9', label: 'Landscape (16:9)', icon: '🖥️' },
  { value: '9:16', label: 'Story (9:16)', icon: '📲' },
];

const ProductAI: React.FC<ProductAIProps> = ({ apiKey }) => {
  const [mode, setMode] = useState<FeatureMode>('create');
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(productCategories[0].id);
  const [selectedAngle, setSelectedAngle] = useState(angleOptions[0].id);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageCount, setImageCount] = useState(2);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (mode === 'angle' && !uploadedImage) {
      setError('Silakan upload foto produk terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let images: string[] = [];

      if (mode === 'create') {
        // Text-to-image generation (Buat Produk Baru)
        const category = productCategories.find(c => c.id === selectedCategory);
        const fullPrompt = `${category?.prompt}. ${customPrompt}. Create a professional product photography with high quality and realistic details. Commercial product shot.`;

        images = await generateFromText(
          { apiKey },
          fullPrompt,
          imageCount,
          aspectRatio
        );
      } else {
        // Image-to-image transformation (Ubah Angle)
        const angle = angleOptions.find(a => a.id === selectedAngle);
        const fullPrompt = `Transform this product image to: ${angle?.prompt}. ${customPrompt}. Keep the product recognizable, maintain product details and colors, only change the camera angle and composition. Professional product photography. Aspect ratio: ${aspectRatio}.`;

        images = await generateImagesSimple(
          uploadedImage!.preview,
          fullPrompt,
          imageCount,
          apiKey
        );
      }

      setGeneratedImages(images);

      // Update usage stats
      storage.updateUsageStats(images.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat generate foto produk');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛍️ Foto Produk AI</h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ✨ Buat Produk Baru
          </button>
          <button
            onClick={() => setMode('angle')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'angle'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📐 Ubah Angle
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {mode === 'angle' && (
              <ImageUploader onImageUpload={setUploadedImage} />
            )}

            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Kategori Produk:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {productCategories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'angle' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Angle/Sudut Pandang:
                </label>
                <select
                  value={selectedAngle}
                  onChange={(e) => setSelectedAngle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {angleOptions.map(angle => (
                    <option key={angle.id} value={angle.id}>{angle.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Tambahan (opsional):
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder={mode === 'create'
                  ? "Contoh: nasi goreng spesial, dengan telur mata sapi, di piring putih"
                  : "Contoh: background kayu natural, pencahayaan hangat"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspect Ratio:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {aspectRatios.map((ratio) => (
                  <button
                    key={ratio.value}
                    type="button"
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`py-2 px-3 rounded-lg border-2 transition-all text-sm font-medium ${
                      aspectRatio === ratio.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-lg mb-1">{ratio.icon}</div>
                    <div className="text-xs">{ratio.value}</div>
                  </button>
                ))}
              </div>
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
              disabled={loading || (mode === 'angle' && !uploadedImage)}
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

export default ProductAI;
