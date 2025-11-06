import React, { useState } from 'react';
import { generateImagesSimple } from '../services/gemini';
import { storage } from '../services/storage';
import ImageUploader from './ImageUploader';
import ResultsGallery from './ResultsGallery';

interface EditPhotoProps {
  apiKey: string;
}

type EditMode = 'enhance' | 'fix';

const enhanceOptions = [
  { id: 'quality', name: 'Tingkatkan Kualitas', prompt: 'enhance image quality, increase sharpness and clarity, improve details, professional photography quality' },
  { id: 'color', name: 'Perbaiki Warna', prompt: 'enhance colors, improve color balance, increase vibrance and saturation naturally, professional color grading' },
  { id: 'light', name: 'Perbaiki Pencahayaan', prompt: 'improve lighting, balance exposure, enhance highlights and shadows, professional lighting correction' },
  { id: 'portrait', name: 'Retouch Portrait', prompt: 'professional portrait retouching, smooth skin naturally, enhance facial features subtly, beauty enhancement' },
  { id: 'landscape', name: 'Enhance Landscape', prompt: 'landscape photography enhancement, dramatic sky, vivid colors, professional landscape edit' },
];

const fixOptions = [
  { id: 'blur', name: 'Perbaiki Blur/Kabur', prompt: 'fix blurry image, increase sharpness dramatically, restore details, deblur effect' },
  { id: 'noise', name: 'Hapus Noise/Grain', prompt: 'remove noise and grain, denoise image, clean up artifacts, smooth texture' },
  { id: 'dark', name: 'Perbaiki Foto Gelap', prompt: 'fix underexposed dark image, brighten naturally, recover shadow details, improve visibility' },
  { id: 'overexposed', name: 'Perbaiki Overexposed', prompt: 'fix overexposed bright image, recover highlights, balance exposure, restore blown-out areas' },
  { id: 'old', name: 'Restore Foto Lama', prompt: 'restore old photo, remove scratches and damage, colorize if black and white, vintage photo restoration' },
];

const EditPhoto: React.FC<EditPhotoProps> = ({ apiKey }) => {
  const [mode, setMode] = useState<EditMode>('enhance');
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [selectedOption, setSelectedOption] = useState(enhanceOptions[0].id);
  const [additionalPrompt, setAdditionalPrompt] = useState('');
  const [imageCount, setImageCount] = useState(2);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentOptions = mode === 'enhance' ? enhanceOptions : fixOptions;

  const handleGenerate = async () => {
    if (!uploadedImage) {
      setError('Silakan upload foto terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const option = currentOptions.find(o => o.id === selectedOption);
      const fullPrompt = `${option?.prompt}. ${additionalPrompt}. Keep the main subject and composition, only improve the technical quality and aesthetics.`;

      const images = await generateImagesSimple(uploadedImage.preview, fullPrompt, imageCount, apiKey);
      setGeneratedImages(images);

      // Update usage stats
      storage.updateUsageStats(images.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat edit foto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">✏️ Edit Foto</h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setMode('enhance');
              setSelectedOption(enhanceOptions[0].id);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'enhance'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ✨ Perbaiki Foto
          </button>
          <button
            onClick={() => {
              setMode('fix');
              setSelectedOption(fixOptions[0].id);
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'fix'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🔧 Repair Foto
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageUploader onImageUpload={setUploadedImage} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Jenis Edit:
              </label>
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currentOptions.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instruksi Tambahan (opsional):
              </label>
              <textarea
                value={additionalPrompt}
                onChange={(e) => setAdditionalPrompt(e.target.value)}
                placeholder="Contoh: buat lebih warm tone, tambahkan sedikit vignette"
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
              {loading ? 'Sedang Edit...' : '✨ Edit Foto'}
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

export default EditPhoto;
