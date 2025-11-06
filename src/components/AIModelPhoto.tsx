import React, { useState } from 'react';
import { generateImagesSimple } from '../services/gemini';
import { storage } from '../services/storage';
import ImageUploader from './ImageUploader';
import ResultsGallery from './ResultsGallery';

interface AIModelPhotoProps {
  apiKey: string;
}

type FeatureMode = 'create' | 'pose';

const modelStyles = [
  { id: 'fashion', name: 'Fashion Model', prompt: 'professional fashion model, high fashion photography, vogue style, studio lighting' },
  { id: 'casual', name: 'Casual Model', prompt: 'casual lifestyle model, natural pose, outdoor photography, friendly smile' },
  { id: 'business', name: 'Business Professional', prompt: 'professional business model, corporate headshot, confident pose, office background' },
  { id: 'fitness', name: 'Fitness Model', prompt: 'athletic fitness model, sporty outfit, energetic pose, gym background' },
  { id: 'beauty', name: 'Beauty Model', prompt: 'beauty model, soft lighting, elegant makeup, close-up portrait' },
];

const poses = [
  { id: 'standing', name: 'Berdiri Tegap', prompt: 'standing pose, confident stance, full body shot' },
  { id: 'sitting', name: 'Duduk Santai', prompt: 'sitting pose, relaxed posture, comfortable position' },
  { id: 'walking', name: 'Berjalan', prompt: 'walking pose, dynamic movement, natural gait' },
  { id: 'portrait', name: 'Portrait Close-up', prompt: 'portrait pose, face focus, upper body shot' },
  { id: 'action', name: 'Action Pose', prompt: 'dynamic action pose, movement captured, energetic' },
];

const AIModelPhoto: React.FC<AIModelPhotoProps> = ({ apiKey }) => {
  const [mode, setMode] = useState<FeatureMode>('create');
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(modelStyles[0].id);
  const [selectedPose, setSelectedPose] = useState(poses[0].id);
  const [customPrompt, setCustomPrompt] = useState('');
  const [imageCount, setImageCount] = useState(2);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (mode === 'pose' && !uploadedImage) {
      setError('Silakan upload foto model terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let fullPrompt = '';

      if (mode === 'create') {
        const style = modelStyles.find(s => s.id === selectedStyle);
        fullPrompt = `${style?.prompt}. ${customPrompt}. Create a professional model photo with high quality and realistic details.`;
      } else {
        const pose = poses.find(p => p.id === selectedPose);
        fullPrompt = `Transform this person into: ${pose?.prompt}. ${customPrompt}. Keep the person's face and features recognizable, only change the pose and composition.`;
      }

      const images = await generateImagesSimple(uploadedImage?.preview || 'data:image/png;base64,', fullPrompt, imageCount, apiKey);
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👤 Foto Model AI</h2>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'create'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🎨 Buat Model Baru
          </button>
          <button
            onClick={() => setMode('pose')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
              mode === 'pose'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🤸 Ubah Pose
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {mode === 'pose' && (
              <ImageUploader onImageUpload={setUploadedImage} />
            )}

            {mode === 'create' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Style Model:
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {modelStyles.map(style => (
                    <option key={style.id} value={style.id}>{style.name}</option>
                  ))}
                </select>
              </div>
            )}

            {mode === 'pose' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Pose:
                </label>
                <select
                  value={selectedPose}
                  onChange={(e) => setSelectedPose(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {poses.map(pose => (
                    <option key={pose.id} value={pose.id}>{pose.name}</option>
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
                placeholder="Contoh: wanita asia, rambut panjang, pakai dress merah"
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
              disabled={loading || (mode === 'pose' && !uploadedImage)}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Sedang Generate...' : '✨ Generate Foto Model'}
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

export default AIModelPhoto;
