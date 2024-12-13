import { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useImageUpload } from '@/hooks/useImageUpload';

interface MultiImageUploadProps {
  onImagesUploaded: (urls: string[]) => void;
  className?: string;
  existingImages?: string[];
  onImageRemoved?: (url: string) => void;
}

export function MultiImageUpload({
  onImagesUploaded,
  className = '',
  existingImages = [],
  onImageRemoved
}: MultiImageUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(existingImages);
  const {
    isUploading,
    uploadProgress,
    error,
    setError,
    uploadImage,
    deleteImage
  } = useImageUpload();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    try {
      const uploadPromises = files.map(file => uploadImage(file));
      const urls = await Promise.all(uploadPromises);
      
      setPreviewUrls(prev => [...prev, ...urls]);
      onImagesUploaded(urls);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload images';
      setError(message);
    }
  };

  const handleRemoveImage = async (urlToRemove: string) => {
    try {
      await deleteImage(urlToRemove);
      setPreviewUrls(prev => prev.filter(url => url !== urlToRemove));
      onImageRemoved?.(urlToRemove);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        <div className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-lg
          ${previewUrls.length ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-white'}
          hover:border-blue-400 hover:bg-blue-50
          transition-all duration-200
        `}>
          <input
            type="file"
            className="sr-only"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={isUploading}
          />
          
          <div className="p-8 text-center">
            <div className="mb-4">
              <ImageIcon className={`
                mx-auto h-12 w-12
                ${previewUrls.length ? 'text-blue-500' : 'text-gray-400'}
                group-hover:text-blue-500
                transition-colors duration-200
              `} />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                {previewUrls.length ? 'Add more images' : 'Upload images'}
              </p>
              <p className="text-xs text-gray-500">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG up to 5MB each
              </p>
            </div>
          </div>
        </div>
      </label>

      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      {isUploading && (
        <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Uploading...</span>
            <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {previewUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative group rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => handleRemoveImage(url)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                title="Remove image"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}