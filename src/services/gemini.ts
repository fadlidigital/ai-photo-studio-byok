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

/**
 * Validate if API key is working
 */
export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch(
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
      }
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  try {
    // Generate multiple images in parallel
    const promises = Array(imageCount).fill(0).map(async () => {
      const response = await fetch(url, {
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
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API error:', errorText);
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
    });

    const results = await Promise.all(promises);
    return results;

  } catch (error) {
    console.error('Image generation error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to generate images');
  }
}

/**
 * Generate images from text only (no input image)
 * Note: This uses Imagen model which may not be available yet
 */
export async function generateFromText(
  config: GeminiConfig,
  prompt: string,
  imageCount: number = 4
): Promise<string[]> {
  const { apiKey } = config;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`;

  try {
    const promises = Array(imageCount).fill(0).map(async () => {
      const response = await fetch(url, {
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
            aspectRatio: "1:1",
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Imagen API error: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();

      if (result.predictions && result.predictions[0]?.bytesBase64Encoded) {
        return `data:image/png;base64,${result.predictions[0].bytesBase64Encoded}`;
      }

      throw new Error('No image returned from Imagen API');
    });

    const results = await Promise.all(promises);
    return results;

  } catch (error) {
    console.error('Text-to-image generation error:', error);
    throw new Error('Text-to-image generation is currently unavailable. Imagen 4.0 may not be publicly accessible yet.');
  }
}
