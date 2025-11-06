import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

interface PromptGeneratorProps {
  apiKey: string;
}

const PromptGenerator: React.FC<PromptGeneratorProps> = ({ apiKey }) => {
  const [uploadedImage, setUploadedImage] = useState<{ base64: string; mimeType: string; preview: string } | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [promptStyle, setPromptStyle] = useState<'detailed' | 'simple' | 'keywords'>('detailed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeImage = async () => {
    if (!uploadedImage) {
      setError('Silakan upload gambar terlebih dahulu');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedPrompt('');

    try {
      // Use base64 content from uploaded image
      const base64Content = uploadedImage.base64;

      let analysisPrompt = '';
      if (promptStyle === 'detailed') {
        analysisPrompt = 'Describe this image in great detail as a prompt for AI image generation. Include: subject, pose, clothing, background, lighting, colors, mood, style, camera angle, and artistic elements. Write it as a comprehensive prompt.';
      } else if (promptStyle === 'simple') {
        analysisPrompt = 'Describe this image concisely in 1-2 sentences as a simple prompt for AI image generation.';
      } else {
        analysisPrompt = 'Analyze this image and provide comma-separated keywords that describe it: subject, colors, style, mood, composition elements. Format: keyword1, keyword2, keyword3, etc.';
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  text: analysisPrompt
                },
                {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: base64Content
                  }
                }
              ]
            }]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const prompt = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Tidak dapat menghasilkan prompt';

      setGeneratedPrompt(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menganalisis gambar');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    alert('Prompt berhasil disalin ke clipboard!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💡 Generate Prompt dari Foto</h2>
        <p className="text-gray-600 mb-4">
          Upload foto dan AI akan menganalisis untuk membuat prompt deskriptif
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ImageUploader onImageUpload={setUploadedImage} />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Style Prompt:
              </label>
              <select
                value={promptStyle}
                onChange={(e) => setPromptStyle(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="detailed">Detail Lengkap (Panjang)</option>
                <option value="simple">Sederhana (Pendek)</option>
                <option value="keywords">Keywords (Comma-separated)</option>
              </select>
            </div>

            <button
              onClick={analyzeImage}
              disabled={loading || !uploadedImage}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? 'Sedang Menganalisis...' : '🔍 Analisis & Generate Prompt'}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          <div>
            {generatedPrompt && (
              <div className="space-y-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">Generated Prompt:</h3>
                    <button
                      onClick={copyToClipboard}
                      className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      📋 Copy
                    </button>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{generatedPrompt}</p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Tip:</strong> Gunakan prompt ini untuk generate gambar di fitur AI lainnya atau di platform AI image generator seperti Midjourney, DALL-E, Stable Diffusion, dll.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGenerator;
