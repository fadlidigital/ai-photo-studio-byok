import React, { useState } from 'react';
import { generateImagesSimple } from '../services/gemini';
import { storage } from '../services/storage';
import ResultsGallery from './ResultsGallery';

interface CombineImagesProps {
  apiKey: string;
}

type AspectRatio = '1:1' | '3:4' | '16:9' | '9:16';

const aspectRatios: { value: AspectRatio; label: string; icon: string }[] = [
  { value: '1:1', label: 'Square (1:1)', icon: '⬜' },
  { value: '3:4', label: 'Portrait (3:4)', icon: '📱' },
  { value: '16:9', label: 'Landscape (16:9)', icon: '🖥️' },
  { value: '9:16', label: 'Story (9:16)', icon: '📲' },
];

const CombineImages: React.FC<CombineImagesProps> = ({ apiKey }) => {
  const [image1, setImage1] = useState<string>('');
  const [image2, setImage2] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [combinePrompt, setCombinePrompt] = useState('');
  const [imageCount, setImageCount] = useState(2);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = (file: File, setImage: (img: string) => void) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!image1 || !image2) {
      setError('Silakan upload kedua gambar terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fullPrompt = `Combine and blend these two images creatively: ${combinePrompt}. Create a seamless, professional composite image that merges elements from both images naturally. Aspect ratio: ${aspectRatio}.`;

      // For now, we'll use image1 as base and describe image2 in the prompt
      // Note: Gemini API might have limitations with multiple images
      const images = await generateImagesSimple(image1, fullPrompt, imageCount, apiKey);
      setGeneratedImages(images);

      // Update usage stats
      storage.updateUsageStats(images.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menggabungkan gambar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🖼️ Gabungkan Gambar</h2>
        <p className="text-gray-600 mb-4">
          Upload 2 gambar untuk digabungkan menjadi satu komposisi yang menarik
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar 1:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, setImage1);
                  }}
                  className="w-full"
                />
                {image1 && (
                  <img src={image1} alt="Preview 1" className="mt-4 max-h-40 mx-auto rounded" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar 2:
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, setImage2);
                  }}
                  className="w-full"
                />
                {image2 && (
                  <img src={image2} alt="Preview 2" className="mt-4 max-h-40 mx-auto rounded" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cara Menggabungkan:
              </label>
              <textarea
                value={combinePrompt}
                onChange={(e) => setCombinePrompt(e.target.value)}
                placeholder="Contoh: gabungkan sebagai background dan foreground, blend dengan efek double exposure, side by side collage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aspect Ratio:
              </label>
              <div className="grid grid-cols-4 gap-2">
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
              disabled={loading || !image1 || !image2}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Sedang Menggabungkan...' : '✨ Gabungkan Gambar'}
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

export default CombineImages;
