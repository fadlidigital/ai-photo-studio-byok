import { downloadImage, downloadAllImages } from '../utils/download';

interface ResultsGalleryProps {
  images: string[];
  isLoading: boolean;
  imageCount: number;
}

export default function ResultsGallery({ images, isLoading, imageCount }: ResultsGalleryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array(imageCount).fill(0).map((_, index) => (
          <div
            key={index}
            className="aspect-square bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600 font-medium">Generating {index + 1}...</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 font-medium">Generated images will appear here</p>
        <p className="text-sm text-gray-400 mt-1">Upload an image and add a prompt to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Download All Button */}
      <div className="flex justify-end">
        <button
          onClick={() => downloadAllImages(images)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download All ({images.length})
        </button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-square bg-white rounded-lg border-2 border-gray-200 overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              src={image}
              alt={`Generated ${index + 1}`}
              className="w-full h-full object-contain"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => window.open(image, '_blank')}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="View Full Size"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>

              <button
                onClick={() => downloadImage(image, `ai-photo-${Date.now()}-${index + 1}.png`)}
                className="p-3 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Download"
              >
                <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
            </div>

            {/* Image Number Badge */}
            <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
