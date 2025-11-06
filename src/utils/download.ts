/**
 * Download Utilities
 * Helper functions for downloading images
 */

/**
 * Download a single image
 */
export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download all images as individual files
 */
export function downloadAllImages(images: string[]): void {
  images.forEach((image, index) => {
    const timestamp = Date.now();
    const filename = `ai-photo-${timestamp}-${index + 1}.png`;

    // Add small delay between downloads to prevent browser blocking
    setTimeout(() => {
      downloadImage(image, filename);
    }, index * 100);
  });
}

/**
 * Convert base64 image to Blob
 */
export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
