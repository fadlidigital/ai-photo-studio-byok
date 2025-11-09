/**
 * Gemini API Service
 * Direct calls to Google's Gemini API (no backend/proxy needed!)
 */

export interface GeminiConfig {
  apiKey: string;
  model?: 'gemini-2.0-flash-exp' | 'gemini-2.5-flash' | 'gemini-2.5-flash-image';
}

export interface GenerateImageParams {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  imageCount?: number;
}

// Timeout wrapper for fetch with mobile-friendly timeout
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number = 60000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    return response;
  } catch (error: any) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - Koneksi internet terlalu lambat. Coba lagi atau gunakan WiFi yang lebih cepat.');
    }
    throw error;
  }
}

/**
 * Validate if API key is working
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Hello' }]
          }]
        })
      },
      10000 // 10 second timeout for validation
    );

    return response.ok;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
}

/**
 * Generate images from uploaded image + prompt
 * Uses Gemini 2.5 Flash Image model
 */
export async function generateImages(
  config: GeminiConfig,
  params: GenerateImageParams
): Promise<string[]> {
  const { apiKey, model = 'gemini-2.5-flash-image' } = config;
  const { imageBase64, mimeType, prompt, imageCount = 4 } = params;

  // Validate inputs
  if (!imageBase64 || imageBase64.trim() === '') {
    throw new Error('❌ Gambar tidak valid. Silakan upload gambar terlebih dahulu.');
  }

  if (!apiKey || apiKey.trim() === '') {
    throw new Error('❌ API Key tidak valid. Silakan set API Key di halaman Profile.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    // Generate multiple images with Promise.allSettled for partial success
    const promises = Array(imageCount).fill(0).map(async () => {
      try {
        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageBase64
                  }
                },
                {
                  text: `${prompt}. Generate a single complete image, not a grid or collage. High quality, professional result.`
                }
              ]
            }],
            generationConfig: {
              responseModalities: "image"
            }
          })
        }, 120000); // 2 minutes timeout for generation

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Gemini API error:', response.status, errorText);

          // Better error messages based on status code
          if (response.status === 400) {
            throw new Error('❌ Request tidak valid. Coba dengan gambar atau prompt yang berbeda.');
          } else if (response.status === 401 || response.status === 403) {
            throw new Error('❌ API Key tidak valid atau tidak memiliki akses. Periksa API Key Anda.');
          } else if (response.status === 429) {
            throw new Error('❌ Terlalu banyak request. Tunggu beberapa saat dan coba lagi.');
          } else if (response.status >= 500) {
            throw new Error('❌ Server Gemini sedang bermasalah. Coba lagi nanti.');
          }

          throw new Error(`Failed to generate image: ${response.statusText}`);
        }

        const result = await response.json();

        // Extract base64 image from response
        if (result.candidates && result.candidates[0]?.content?.parts) {
          for (const part of result.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              return `data:image/png;base64,${part.inlineData.data}`;
            }
          }
        }

        throw new Error('No image returned from API');
      } catch (error: any) {
        console.error('Single image generation error:', error);
        throw error;
      }
    });

    const results = await Promise.allSettled(promises);

    // Extract successful results
    const successfulImages = results
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map(result => result.value);

    // If no images succeeded, throw the first error
    if (successfulImages.length === 0) {
      const firstError = results.find(r => r.status === 'rejected') as PromiseRejectedResult;
      throw firstError?.reason || new Error('Semua generate gagal');
    }

    // Return successful images (even if some failed)
    return successfulImages;

  } catch (error: any) {
    console.error('Image generation error:', error);

    // Network errors
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error('❌ Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.');
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('❌ Gagal generate gambar. Coba lagi.');
  }
}

/**
 * Simplified wrapper for generating images (used by feature components)
 * Accepts base64 data URL directly
 */
export async function generateImagesSimple(
  imageDataUrl: string,
  prompt: string,
  imageCount: number,
  apiKey: string
): Promise<string[]> {
  // Validate imageDataUrl
  if (!imageDataUrl || !imageDataUrl.startsWith('data:')) {
    throw new Error('❌ Gambar tidak valid. Silakan upload gambar terlebih dahulu.');
  }

  // Extract base64 and mime type from data URL
  let imageBase64 = '';
  let mimeType = 'image/jpeg';

  const parts = imageDataUrl.split(',');
  if (parts.length !== 2) {
    throw new Error('❌ Format gambar tidak valid. Silakan upload ulang gambar Anda.');
  }

  imageBase64 = parts[1];

  // Validate base64 is not empty
  if (!imageBase64 || imageBase64.trim() === '') {
    throw new Error('❌ Gambar kosong. Silakan upload gambar yang valid.');
  }

  const mimeMatch = parts[0].match(/data:(.*?);/);
  if (mimeMatch) {
    mimeType = mimeMatch[1];
  }

  return generateImages(
    { apiKey },
    { imageBase64, mimeType, prompt, imageCount }
  );
}

/**
 * Generate images from text only (no input image)
 * Note: This uses Imagen model which may not be available yet
 */
export async function generateFromText(
  config: GeminiConfig,
  prompt: string,
  imageCount: number = 4,
  aspectRatio: string = '1:1'
): Promise<string[]> {
  const { apiKey } = config;

  // Validate inputs
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('❌ API Key tidak valid. Silakan set API Key di halaman Profile.');
  }

  if (!prompt || prompt.trim() === '') {
    throw new Error('❌ Prompt tidak boleh kosong. Isi deskripsi produk yang ingin dibuat.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`;

  try {
    const promises = Array(imageCount).fill(0).map(async () => {
      try {
        const response = await fetchWithTimeout(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            instances: [{
              prompt: `${prompt}. High quality, professional photography, single complete image.`,
            }],
            parameters: {
              sampleCount: 1,
              aspectRatio: aspectRatio,
            }
          })
        }, 120000); // 2 minutes timeout

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Imagen API error:', response.status, errorText);

          // Better error messages
          if (response.status === 400) {
            throw new Error('❌ Request tidak valid. Coba dengan prompt yang berbeda.');
          } else if (response.status === 401 || response.status === 403) {
            throw new Error('❌ API Key tidak memiliki akses ke Imagen 4.0. Gunakan fitur "Ubah Angle" dengan upload foto sebagai gantinya.');
          } else if (response.status === 404) {
            throw new Error('❌ Imagen 4.0 belum tersedia untuk API Key Anda. Gunakan fitur "Ubah Angle" dengan upload foto sebagai gantinya.');
          } else if (response.status === 429) {
            throw new Error('❌ Terlalu banyak request. Tunggu beberapa saat dan coba lagi.');
          } else if (response.status >= 500) {
            throw new Error('❌ Server Gemini sedang bermasalah. Coba lagi nanti.');
          }

          throw new Error(`Imagen API error: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
          return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
        }

        throw new Error('No image returned from Imagen API');
      } catch (error: any) {
        console.error('Single text-to-image error:', error);
        throw error;
      }
    });

    const results = await Promise.allSettled(promises);

    // Extract successful results
    const successfulImages = results
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map(result => result.value);

    // If no images succeeded, throw the first error
    if (successfulImages.length === 0) {
      const firstError = results.find(r => r.status === 'rejected') as PromiseRejectedResult;
      throw firstError?.reason || new Error('Semua generate gagal');
    }

    // Return successful images (even if some failed)
    return successfulImages;

  } catch (error: any) {
    console.error('Text-to-image generation error:', error);

    // Network errors
    if (error.message?.includes('fetch') || error.message?.includes('network')) {
      throw new Error('❌ Tidak ada koneksi internet. Periksa koneksi Anda dan coba lagi.');
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error('❌ Text-to-image generation gagal. Gunakan fitur "Ubah Angle" dengan upload foto sebagai gantinya.');
  }
}
